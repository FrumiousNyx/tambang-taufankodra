import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple serverless endpoint to accept error reports from the frontend.
// In production, set ERROR_SERVICE_URL and ERROR_API_KEY in environment variables
// to forward errors to an external service. Without those, the function logs to console.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const expectedKey = process.env.ERROR_API_KEY;

  // If an API key is configured, require it
  if (expectedKey && apiKey !== expectedKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const payload = req.body;

  // Basic validation
  if (!payload || !payload.message) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  try {
    // If an external error service is configured, forward the payload
    const forwardUrl = process.env.ERROR_SERVICE_URL;
    if (forwardUrl) {
      await fetch(forwardUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      // Otherwise store/log for the hosting platform's logs
      console.error('Captured error payload:', JSON.stringify(payload));
    }

    res.status(200).json({ status: 'ok' });
  } catch (e: any) {
    console.error('Failed to forward error:', e);
    res.status(500).json({ error: 'Failed to process error' });
  }
}
