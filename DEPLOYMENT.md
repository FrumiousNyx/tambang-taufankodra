# Deployment Guide

## Local Development with Docker

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Git

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/FrumiousNyx/tambang-taufankodra.git
cd tambang-taufankodra
```

2. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

3. Set required environment variables:
```env
# Frontend
VITE_GA_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_SENTRY_DSN=

# Backend
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
RECAPTCHA_SECRET=your_recaptcha_secret
REDIS_URL=redis://redis:6379
ADMIN_API_KEY=optional_legacy_key

# Error handling
ERROR_SERVICE_URL=
ERROR_API_KEY=
CONTACT_NOTIFY_URL=
```

4. Start services:
```bash
docker-compose up -d
```

5. Install dependencies and run dev server:
```bash
npm ci
npm run dev
```

App runs at `http://localhost:5173`

### Docker Compose Services
- **app**: Next.js/Vite dev server
- **redis**: In-memory data store for rate limiting
- **postgres**: Optional local database (comment out in compose if using Supabase)

## Production Deployment (Vercel)

### 1. Connect Repository
- Push code to GitHub
- Import repo in Vercel dashboard
- Vercel auto-detects Vite config

### 2. Environment Variables
Set in Vercel Project Settings:
```
VITE_GA_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=...
RECAPTCHA_SECRET=...
REDIS_URL=redis://your-redis-host:6379 (or use Vercel KV)
VITE_SENTRY_DSN=...
```

### 3. Database (Supabase)
- Create Supabase project
- Run migrations:
```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  project_value TEXT,
  location TEXT,
  message TEXT NOT NULL,
  request_proposal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource TEXT,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET
);
```

### 4. Rate Limiting (Redis)
Use managed service:
- **Vercel KV** (Redis-compatible, auto-scales)
- **Redis Cloud** (free tier available)
- **Upstash** (serverless Redis)

Set `REDIS_URL` to service connection string.

### 5. Monitoring (Sentry)
- Create Sentry project
- Get DSN and set `VITE_SENTRY_DSN`
- Platform automatically sends errors

### 6. Deploy
```bash
git push origin main
```
Vercel auto-deploys on push to `main` branch.

## Security Checklist

- [ ] Enable HTTPS (Vercel default)
- [ ] Set CSP headers (done in `vercel.json`)
- [ ] Configure CORS for API endpoints
- [ ] Protect admin routes with JWT (done in `api/admin/submissions.ts`)
- [ ] Use strong Supabase service key (rotate regularly)
- [ ] Enable WAF/DDoS (Vercel Shield)
- [ ] Set up alerts in Sentry
- [ ] Backup database (Supabase handles this)

## Scaling

### Horizontal
- Vercel scales automatically; no action needed

### Vertical
- Increase Redis memory for high traffic rate limiting
- Upgrade Supabase plan for larger DB/connections

## Monitoring & Logs

- **Uptime**: Vercel dashboard
- **Errors**: Sentry dashboard
- **Performance**: Vercel Analytics + Lighthouse

## Support
For issues, contact: support@semen-nusantara.com
For emergency: ops@semen-nusantara.com
