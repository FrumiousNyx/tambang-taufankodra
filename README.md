# PT Semen Nusantara — Corporate Website (Next.js)

Website korporat multilingual berbasis Next.js App Router dengan i18n path (`/:lng/...`), CMS publik, dan admin submissions.

## Fitur
- Halaman publik: Beranda, Produk, Proyek, Keberlanjutan, Investor, Tentang, Kontak
- i18n: Bahasa `id/en/zh` via prefix URL
- Admin: kelola submissions + export CSV
- Integrasi Supabase (aman saat env kosong dengan mock)
- Observability siap: Analytics, Sentry (opsional)

## Teknologi
- Next.js 14 App Router, React 18
- TypeScript, Tailwind CSS, shadcn/ui
- i18next + react-i18next
- Supabase (opsional)

## Cara Jalankan
### Prasyarat
- Node.js 18+, npm
- Git

### Instalasi
```bash
npm install
```

### Development
```bash
# Jalankan dev server
npm run dev
# Default local: http://localhost:3000 (di sini sering pakai 3001/3002)
```

### Production
```bash
# Build
npm run build
# Start server
npm run start
# Local: http://localhost:3000
```

## Environment Variables
File: [.env.local](file:///c:/Users/sidik/Videos/tambang-taufankodra-main/.env.local)
```env
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_I18N_DEBUG=false
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# VITE_SENTRY_DSN=...
# VITE_GA_ID=...
```
- Rahasia jangan di-commit; gunakan dashboard penyedia (Vercel/Supabase).

## Struktur Kode
```
src/
├── app/                # App Router, layout global, route handlers (API)
│   ├── [lng]/          # Boundary bahasa + halaman multilingual
│   └── api/            # Next.js Route Handlers
├── components/         # UI (home, layout, ui)
├── contexts/           # Language, Auth
├── lib/                # util, supabase, i18nRoutes, imageCdn
├── pages/              # Halaman client (dipakai melalui App Router)
└── i18n/               # config i18next
```

## i18n
- Konfigurasi: [i18n/config.ts](file:///c:/Users/sidik/Videos/tambang-taufankodra-main/src/i18n/config.ts)
- Berkas terjemahan: `public/locales/{id|en|zh}.json`
- Sinkronisasi bahasa di client: [LocaleBoundary.tsx](file:///c:/Users/sidik/Videos/tambang-taufankodra-main/src/app/%5Blng%5D/LocaleBoundary.tsx)

## Font & Styling
- Font: Inter, Playfair Display via next/font
  - [app/layout.tsx](file:///c:/Users/sidik/Videos/tambang-taufankodra-main/src/app/layout.tsx)
  - [tailwind.config.ts](file:///c:/Users/sidik/Videos/tambang-taufankodra-main/tailwind.config.ts)
- Tailwind directives: [src/index.css](file:///c:/Users/sidik/Videos/tambang-taufankodra-main/src/index.css)

## API
- Admin submissions: [route.ts](file:///c:/Users/sidik/Videos/tambang-taufankodra-main/src/app/api/admin/submissions/route.ts)
- Contact: `src/app/api/contact/route.ts` (jika ada)
- Pastikan environment Supabase diset saat production.

## Perintah Penting
- `npm run dev` — jalankan dev server
- `npm run build` — build produksi
- `npm run start` — start server produksi
- `npm run lint` — linting
- `npm run typecheck` — cek tipe
- `npm run test` — unit/e2e (jika diaktifkan)

## Observability (Opsional, Rekomendasi)
### Google Analytics (GA4)
- Set `VITE_GA_ID` di `.env.local`
- Inisialisasi di utils analytics

### Sentry
- Set `VITE_SENTRY_DSN`
- Aktifkan init di client dan server
- Produksi: unggah source maps untuk error stack yang akurat

## Keamanan
- Jangan commit secrets
- Tambahkan middleware untuk proteksi route admin
- Pertimbangkan CSP, HSTS, dan headers keamanan saat produksi

## Deployment
- Vercel: import repo, set env, deploy
- Netlify/Docker: sesuaikan dengan kebutuhan

## Troubleshooting
- Port bentrok: jalankan `npm run dev -- -p 3001`
- i18n missingKey di dev: set `NEXT_PUBLIC_I18N_DEBUG=false`
- Hydration mismatch: komponen i18n sensitif dirender client-only (sudah ditangani di layout)
```env
VITE_GA_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
RECAPTCHA_SECRET=your_recaptcha_secret
```

### **Custom Domain**
To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

For detailed deployment instructions, security checklist, and troubleshooting, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🏗️ Tech Stack

### **Frontend**
- **React 18** - Modern React dengan hooks dan concurrent features
- **TypeScript** - Type safety dan better developer experience
- **Vite** - Fast build tool dengan HMR
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library

### **Backend & Database**
- **Supabase** - PostgreSQL + Auth + Storage + Edge Functions
- **JWT** - Stateless authentication
- **Redis** - Rate limiting dan caching (optional)

### **Deployment & Monitoring**
- **Vercel** - Recommended hosting platform
- **Sentry** - Error tracking dan performance monitoring
- **Google Analytics 4** - Web analytics
- **GitHub Actions** - CI/CD pipeline

### **Development Tools**
- **ESLint** - Code linting dan quality checks
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing (temporarily disabled)

## 📞 Support & Contact

### **Technical Support**
- **Documentation**: Lihat folder `/docs` untuk panduan lengkap
- **Issues**: Report bugs via GitHub Issues
- **Email**: support@semen-nusantara.com

### **Business Inquiries**
- **Sales**: sales@semen-nusantara.com
- **Partnership**: partnership@semen-nusantara.com
- **Investor Relations**: investor@semen-nusantara.com

---

## 📄 License

© 2024 PT Semen Nusantara. All rights reserved.

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
