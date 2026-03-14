import { NextRequest } from 'next/server';
import IORedis from 'ioredis';

let redisClient: any;

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

const REDIS_URL = process.env.REDIS_URL || '';
if (REDIS_URL) {
  try {
    redisClient = new IORedis(REDIS_URL);
  } catch {
    redisClient = undefined;
  }
}

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
  recaptchaToken?: string;
};

async function isAllowed(key: string) {
  if (redisClient) {
    const redisKey = `rl:${key}`;
    const count = await redisClient.incr(redisKey);
    if (count === 1) await redisClient.pexpire(redisKey, WINDOW_MS);
    return count <= MAX_PER_WINDOW;
  }

  const g = globalThis as any;
  if (!g.__submissions) g.__submissions = new Map();
  const submissions: Map<string, number[]> = g.__submissions;

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
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
    });
    const data = await res.json();
    return data.success === true && data.score && data.score >= 0.3;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let payload: Submission | null = null;
  try {
    payload = (await req.json()) as Submission;
  } catch (error) {
    console.error('Contact API - JSON parse error:', error);
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!payload || !payload.email || !payload.message) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (payload.hp_field && payload.hp_field.trim() !== '') {
    return Response.json({ status: 'ok' }, { status: 200 });
  }

  const xff = req.headers.get('x-forwarded-for') || '';
  const ip = xff.split(',')[0]?.trim();
  const key = ip || payload.email || 'anonymous';
  
  try {
    const allowed = await isAllowed(key);
    if (!allowed) return Response.json({ error: 'Too many requests' }, { status: 429 });
  } catch (error) {
    console.error('Contact API - Rate limit error:', error);
    // Continue without rate limiting if Redis fails
  }

  const token =
    req.headers.get('x-recaptcha-token') ||
    payload.recaptchaToken ||
    undefined;
  
  try {
    const recaptchaOk = await verifyRecaptcha(token);
    if (!recaptchaOk) return Response.json({ error: 'reCAPTCHA failed' }, { status: 400 });
  } catch (error) {
    console.error('Contact API - reCAPTCHA error:', error);
    return Response.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
  }

  try {
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
        body: JSON.stringify([
          {
            email: payload.email,
            phone: payload.phone,
            project_type: payload.project_type,
            project_value: payload.project_value,
            location: payload.location,
            message: `Pengirim: ${payload.name}\nInstansi: ${payload.company}\n\nPesan: ${payload.message}`,
            request_proposal: payload.request_proposal || false
          }
        ])
      });

      if (!dbRes.ok) {
        console.error('Contact API - Database error:', dbRes.status, dbRes.statusText);
        return Response.json({ error: 'Failed to store submission' }, { status: 502 });
      }
    }
  } catch (error) {
    console.error('Contact API - Database connection error:', error);
    return Response.json({ error: 'Database connection failed' }, { status: 503 });
  }

  const NOTIFY_URL = process.env.CONTACT_NOTIFY_URL;
  if (NOTIFY_URL) {
    try {
      await fetch(NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact_submission', payload })
      });
    } catch {
      // Ignore notification errors
    }
  }

  return Response.json({ status: 'ok' }, { status: 200 });
}
