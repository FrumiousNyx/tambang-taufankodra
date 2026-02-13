import type { VercelRequest, VercelResponse } from '@vercel/node';
// Use global fetch available in modern Node runtimes
// Optional Redis for server-side rate limiting
let Redis: any;
let redisClient: any;
const REDIS_URL = process.env.REDIS_URL || '';
if (REDIS_URL) {
  try {
    // Lazy require to avoid adding mandatory dependency when not used in dev
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Redis = require('ioredis');
    redisClient = new Redis(REDIS_URL);
  } catch (e) {
    console.warn('ioredis not available or failed to init', e);
  }
}

// Simple server-side contact endpoint with in-memory rate limiting and optional reCAPTCHA.
// Production: replace in-memory limiter with Redis or other shared store.

type Submission = {
  name: string;
  company: string;
  email: string;
  phone: string;
  project_type?: string;
  project_value?: string;
  location?: string;
  message: string;
  request_proposal?: boolean;
  hp_field?: string;
};

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 5;

async function isAllowed(key: string) {
  // If Redis configured, use atomic INCR with expiry
  if (redisClient) {
    const redisKey = `rl:${key}`;
    const count = await redisClient.incr(redisKey);
    if (count === 1) {
      await redisClient.pexpire(redisKey, WINDOW_MS);
    }
    return count <= MAX_PER_WINDOW;
  }

  // Fallback to in-memory (single instance only)
  if (!(global as any).__submissions) (global as any).__submissions = new Map();
  const submissions: Map<string, number[]> = (global as any).__submissions;
  const now = Date.now();
  const arr = submissions.get(key) || [];
  const recent = arr.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return false;
  recent.push(now);
  submissions.set(key, recent);
  return true;
}

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // Not configured -> skip
  if (!token) return false;

  try {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    return data.success === true && data.score && data.score >= 0.3;
  } catch (e) {
    console.error('reCAPTCHA verification failed', e);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const payload = req.body as Submission;
  if (!payload || !payload.email || !payload.message) return res.status(400).json({ error: 'Invalid payload' });

  // Honeypot
  if (payload.hp_field && payload.hp_field.trim() !== '') {
    return res.status(200).json({ status: 'ok' });
  }

  // Rate limiting by IP or email
  const key = req.headers['x-forwarded-for']?.toString() || payload.email || req.socket.remoteAddress || 'anonymous';
  if (!isAllowed(key)) return res.status(429).json({ error: 'Too many requests' });

  // reCAPTCHA
  const token = (req.headers['x-recaptcha-token'] as string) || (req.body && (req.body as any).recaptchaToken);
  const recaptchaOk = await verifyRecaptcha(token);
  if (!recaptchaOk) return res.status(400).json({ error: 'reCAPTCHA failed' });

  try {
    // Forward to Supabase Insert via REST API using SERVICE_KEY (recommended to set VERCEL_SUPABASE_SERVICE_ROLE)
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          apikey: SUPABASE_SERVICE_KEY,
          Prefer: 'return=representation'
        },
        body: JSON.stringify([{ 
          email: payload.email,
          phone: payload.phone,
          project_type: payload.project_type,
          project_value: payload.project_value,
          location: payload.location,
          message: `Pengirim: ${payload.name}\nInstansi: ${payload.company}\n\nPesan: ${payload.message}`,
          request_proposal: payload.request_proposal || false
        }])
      });

      if (!dbRes.ok) {
        const errText = await dbRes.text();
        console.error('Supabase insert failed', errText);
        return res.status(502).json({ error: 'Failed to store submission' });
      }
    } else {
      console.warn('SUPABASE_SERVICE_KEY not configured; skipping DB insert.');
    }

    // Optionally send notification to external webhook
    const NOTIFY_URL = process.env.CONTACT_NOTIFY_URL;
    if (NOTIFY_URL) {
      try {
        await fetch(NOTIFY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'contact_submission', payload })
        });
      } catch (e) {
        console.error('Failed to notify external service', e);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (e) {
    console.error('Contact handler error', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
