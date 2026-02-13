import type { VercelRequest, VercelResponse } from '@vercel/node';
// Use global fetch

// Admin endpoint to list contact submissions and export CSV.
// Require Authorization Bearer token (JWT from Supabase) with admin role.

async function verifyAdminToken(token: string, supabaseUrl: string, supabaseServiceKey: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { decodeJwt } = require('jose');
    const decoded = decodeJwt(token);
    const userId = decoded.sub;
    if (!userId) return null;

    // fetch profile to check role
    const profileUrl = new URL(`${supabaseUrl}/rest/v1/profiles`);
    profileUrl.searchParams.set('select', 'role');
    profileUrl.searchParams.set('id', `eq.${userId}`);

    const profRes = await fetch(profileUrl.toString(), {
      headers: { apikey: supabaseServiceKey, Authorization: `Bearer ${supabaseServiceKey}` }
    });
    if (!profRes.ok) return null;
    const prof = await profRes.json();
    if (!prof || prof.length === 0 || prof[0].role !== 'admin') return null;
    return userId;
  } catch (e) {
    console.error('Auth verification failed', e);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  // Require Authorization Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = await verifyAdminToken(token, SUPABASE_URL, SUPABASE_SERVICE_KEY);
  if (!userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = Number(req.query.limit || 100);
  const exportCsv = req.query.export === '1' || req.query.export === 'true';

  // pagination params
  const perPage = 100; // fetch page size from Supabase per request
  const offset = Number(req.query.offset || 0);

  try {
    // If export requested, stream results in pages to avoid large mem usage
    if (exportCsv) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="submissions.csv"`);

      // Write header row by fetching first page to determine keys
      const firstUrl = new URL(`${SUPABASE_URL}/rest/v1/contact_submissions`);
      firstUrl.searchParams.set('select', '*');
      firstUrl.searchParams.set('order', 'created_at.desc');
      firstUrl.searchParams.set('limit', String(Math.min(perPage, limit - offset)));
      firstUrl.searchParams.set('offset', String(offset));

      const firstRes = await fetch(firstUrl.toString(), {
        headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }
      });
      if (!firstRes.ok) throw new Error('Failed to fetch');
      const firstData = await firstRes.json();
      if (!firstData || firstData.length === 0) {
        return res.status(200).send('');
      }

      const keys = Object.keys(firstData[0]);
      res.write(keys.join(',') + '\n');

      // helper to write rows
      const writeRows = (rows: any[]) => {
        for (const row of rows) {
          const line = keys.map((k) => `"${String(row[k] ?? '')}"`).join(',');
          res.write(line + '\n');
        }
      };

      writeRows(firstData);

      let written = firstData.length;
      let pageOffset = offset + firstData.length;

      while (written < limit) {
        const toFetch = Math.min(perPage, limit - written);
        if (toFetch <= 0) break;

        const pageUrl = new URL(`${SUPABASE_URL}/rest/v1/contact_submissions`);
        pageUrl.searchParams.set('select', '*');
        pageUrl.searchParams.set('order', 'created_at.desc');
        pageUrl.searchParams.set('limit', String(toFetch));
        pageUrl.searchParams.set('offset', String(pageOffset));

        const pageRes = await fetch(pageUrl.toString(), {
          headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }
        });
        if (!pageRes.ok) break;
        const pageData = await pageRes.json();
        if (!pageData || pageData.length === 0) break;

        writeRows(pageData);
        written += pageData.length;
        pageOffset += pageData.length;

        // allow event loop to breathe
        await new Promise((r) => setTimeout(r, 5));
      }

      res.end();
      return;
    }

    // Non-export: fetch with offset/limit
    const url = new URL(`${SUPABASE_URL}/rest/v1/contact_submissions`);
    url.searchParams.set('select', '*');
    url.searchParams.set('order', 'created_at.desc');
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));

    const r = await fetch(url.toString(), {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!r.ok) {
      const t = await r.text();
      console.error('Supabase list failed', t);
      return res.status(502).json({ error: 'Failed to fetch submissions' });
    }

    const data = await r.json();
    return res.status(200).json({ data });
  } catch (e) {
    console.error('admin submissions error', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
