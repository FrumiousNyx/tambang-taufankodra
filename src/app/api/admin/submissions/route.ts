import { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

async function verifyAdminToken(token: string, supabaseUrl: string, supabaseServiceKey: string) {
  try {
    const decoded = decodeJwt(token);
    const userId = decoded.sub;
    if (!userId) return null;

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
  } catch {
    return null;
  }
}

function toCsvValue(v: unknown) {
  const s = String(v ?? '');
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET(req: NextRequest) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  const userId = await verifyAdminToken(token, SUPABASE_URL, SUPABASE_SERVICE_KEY);
  if (!userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const url = new URL(req.url);
  const limit = Math.max(0, Math.min(5000, Number(url.searchParams.get('limit') || 100)));
  const offset = Math.max(0, Number(url.searchParams.get('offset') || 0));
  const exportCsv = url.searchParams.get('export') === '1' || url.searchParams.get('export') === 'true';

  const perPage = 100;

  const fetchPage = async (pageOffset: number, pageLimit: number) => {
    const u = new URL(`${SUPABASE_URL}/rest/v1/contact_submissions`);
    u.searchParams.set('select', '*');
    u.searchParams.set('order', 'created_at.desc');
    u.searchParams.set('limit', String(pageLimit));
    u.searchParams.set('offset', String(pageOffset));

    const r = await fetch(u.toString(), {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    if (!r.ok) return { ok: false as const, data: [] as any[] };
    const data = await r.json();
    return { ok: true as const, data: Array.isArray(data) ? data : [] };
  };

  if (exportCsv) {
    const first = await fetchPage(offset, Math.min(perPage, limit));
    if (!first.ok) return Response.json({ error: 'Failed to fetch submissions' }, { status: 502 });
    if (first.data.length === 0) {
      return new Response('', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="submissions.csv"'
        }
      });
    }

    const keys = Object.keys(first.data[0]);
    const lines: string[] = [];
    lines.push(keys.join(','));
    first.data.forEach((row: any) => {
      lines.push(keys.map((k) => toCsvValue(row[k])).join(','));
    });

    let written = first.data.length;
    let pageOffset = offset + first.data.length;
    while (written < limit) {
      const toFetch = Math.min(perPage, limit - written);
      if (toFetch <= 0) break;
      const page = await fetchPage(pageOffset, toFetch);
      if (!page.ok || page.data.length === 0) break;
      page.data.forEach((row: any) => {
        lines.push(keys.map((k) => toCsvValue(row[k])).join(','));
      });
      written += page.data.length;
      pageOffset += page.data.length;
    }

    const csv = lines.join('\n') + '\n';
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="submissions.csv"'
      }
    });
  }

  const result = await fetchPage(offset, limit);
  if (!result.ok) {
    return Response.json({ error: 'Failed to fetch submissions' }, { status: 502 });
  }

  return Response.json({ data: result.data }, { status: 200 });
}
