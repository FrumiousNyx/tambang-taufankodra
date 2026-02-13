# PT Semen Nusantara - Corporate Website

![CI](https://github.com/FrumiousNyx/tambang-taufankodra/actions/workflows/ci.yml/badge.svg)

## 🏢 Tentang Perusahaan

PT Semen Nusantara adalah perusahaan semen terkemuka di Indonesia yang berfokus pada produksi semen berkualitas tinggi untuk proyek konstruksi dan infrastruktur. Website ini berfungsi sebagai portal informasi korporat dan platform komunikasi dengan stakeholders.

## 🌐 Fitur Website

### **Public Pages**
- **Beranda** - Overview perusahaan dan produk unggulan
- **Tentang Kami** - Sejarah, visi, misi, dan profil perusahaan
- **Produk** - Katalog lengkap produk semen dan spesifikasi
- **Proyek** - Showcase proyek-proyek yang telah dikerjakan
- **Berkelanjutan** - Program CSR dan keberlanjutan lingkungan
- **Hubungan Investor** - Informasi untuk investor dan pemegang saham
- **Kontak** - Formulir kontak dan informasi kantor

### **Admin Dashboard**
- **Authentication** - Login dengan JWT dan role-based access control
- **Submissions Management** - Kelola semua kiriman form kontak
- **Export Data** - Export submissions ke CSV dengan streaming
- **Audit Log** - Tracking aktivitas admin untuk compliance
- **Analytics** - Dashboard monitoring dan laporan

## 🚀 Cara Operasional Website

### **1. Setup Awal**

#### **Prerequisites**
- Node.js 18+ dan npm
- Git untuk version control
- Editor code (VS Code recommended)

#### **Installation**
```bash
# Clone repository
git clone https://github.com/FrumiousNyx/tambang-taufankodra.git
cd tambang-taufankodra

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

#### **Environment Configuration**
```env
# Frontend Configuration
VITE_GA_ID=G-XXXXXXXXXX
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_IMAGE_CDN=local
VITE_SENTRY_DSN=your_sentry_dsn

# Backend Configuration
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
RECAPTCHA_SECRET=your_recaptcha_secret

# Optional Services
ERROR_SERVICE_URL=https://your-service.com/errors
ERROR_API_KEY=your_error_service_key
```

### **2. Development Mode**

#### **Start Development Server**
```bash
# Start development server with hot reload
npm run dev

# Server akan berjalan di http://localhost:5173
```

#### **Development Features**
- **Hot Module Replacement** - Perubahan code langsung terlihat
- **TypeScript Checking** - Validasi tipe data real-time
- **ESLint Integration** - Code quality checking
- **Auto-formatting** - Prettier untuk consistent formatting

### **3. Production Deployment**

#### **Build for Production**
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

#### **Deployment Options**
- **Vercel** - Recommended untuk React apps
- **Netlify** - Alternative dengan CI/CD built-in
- **Docker** - Containerized deployment
- **Static Hosting** - GitHub Pages, S3, etc.

### **4. Admin Operations**

#### **Access Admin Dashboard**
1. Buka `/admin` di browser
2. Login dengan credentials:
   - Email: admin@semen-nusantara.com
   - Password: (dapatkan dari environment variables)
3. Dashboard akan menampilkan:
   - Total submissions
   - Recent activities
   - Quick actions

#### **Manage Contact Submissions**
1. Navigate ke **Submissions** tab
2. **Features available**:
   - View all contact form submissions
   - Filter by date, status, or keyword
   - Mark as read/unread
   - Export to CSV (streaming untuk large datasets)
   - Delete spam submissions

#### **Audit Log Monitoring**
1. Navigate ke **Audit** tab
2. **Tracking includes**:
   - Login attempts
   - Data exports
   - Configuration changes
   - Failed operations

### **5. Content Management**

#### **Static Content Updates**
- **Hero Section** - Edit di `src/components/home/HeroSection.tsx`
- **Product Catalog** - Update di `src/pages/Products.tsx`
- **Project Showcase** - Modify di `src/pages/Projects.tsx`
- **Company Info** - Edit di `src/pages/About.tsx`

#### **Image Management**
- **Local Images** - Place di `public/images/`
- **CDN Integration** - Configure di `src/lib/imageCdn.ts`
- **Optimization** - Automatic dengan lazy loading

### **6. Monitoring & Maintenance**

#### **Error Monitoring**
```bash
# Check Sentry dashboard untuk error tracking
# Access: https://sentry.io/your-organization
```

#### **Performance Monitoring**
```bash
# Check Google Analytics untuk traffic
# Access: https://analytics.google.com
```

#### **Regular Maintenance**
- **Weekly**: Check error logs dan update dependencies
- **Monthly**: Review performance metrics dan optimize
- **Quarterly**: Security audit dan compliance check

### **7. Troubleshooting**

#### **Common Issues**
```bash
# Build failed
npm run build:dev  # Development build untuk debugging

# Type errors
npm run lint -- --fix  # Auto-fix linting issues

# Dependency conflicts
rm -rf node_modules package-lock.json
npm install  # Fresh install
```

#### **Performance Issues**
- Check image sizes dan optimize
- Review bundle size di `dist/` folder
- Monitor Core Web Vitals
- Enable caching headers

## 📱 Mobile Operations

### **Responsive Design**
- **Mobile-first** approach dengan Tailwind CSS
- **Touch gestures** untuk navigation
- **Optimized images** untuk mobile networks
- **Progressive Web App** ready (PWA features)

### **Mobile Testing**
```bash
# Test dengan device simulation
npm run dev
# Buka browser dev tools dan switch ke mobile view
```

## 🔒 Security Operations

### **Daily Security Checks**
- Monitor reCAPTCHA analytics
- Review rate limiting logs
- Check failed login attempts
- Validate security headers

### **Security Headers**
```
Strict-Transport-Security: max-age=63072000
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

## 📊 Analytics & Reporting

### **Google Analytics 4**
- **Page Views** - Track visitor behavior
- **Conversion Events** - Contact form submissions
- **User Demographics** - Geographic and device data
- **Real-time Monitoring** - Live visitor tracking

### **Custom Analytics**
- **Form Submission Rate** - Contact form performance
- **Admin Activity** - Dashboard usage metrics
- **Error Rates** - Technical performance monitoring

## 🔄 Backup & Recovery

### **Data Backup**
- **Database**: Supabase automatic backup
- **Code**: Git version control
- **Media**: CDN backup strategy
- **Config**: Environment variables backup

### **Recovery Procedures**
1. **Code Recovery**: Git checkout ke stable commit
2. **Data Recovery**: Supabase point-in-time recovery
3. **Media Recovery**: CDN restore from backup
4. **Config Recovery**: Environment variables restore

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Complete deployment guide (local Docker, Vercel production, security checklist, RTO/RPO)
- **[ADMIN_TUTORIAL.md](ADMIN_TUTORIAL.md)** — Admin portal quick-start, features, troubleshooting, best practices
- **[ONBOARDING.md](ONBOARDING.md)** — Customer onboarding guide (5 phases: setup, config, operations, monitoring, advanced)
- **[SLA.md](SLA.md)** — Service Level Agreement template (99.5% uptime, 3 support tiers, disaster recovery)
- **[OPTIMIZATION_SUMMARY.md](OPTIMIZATION_SUMMARY.md)** — Performance & security improvements summary

## 🛠️ Development Guide

### **Local Development**
```bash
# Clone repository
git clone https://github.com/FrumiousNyx/tambang-taufankodra.git
cd tambang-taufankodra

# Install dependencies
npm i

# Start development server with auto-reloading and an instant preview.
npm run dev
```

### **Code Structure**
```
src/
├── components/          # Reusable UI components
│   ├── home/          # Homepage specific components
│   ├── layout/        # Header, Footer, Navigation
│   └── ui/           # shadcn/ui components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── lib/              # Utility functions
├── contexts/          # React contexts
└── types/            # TypeScript type definitions
```

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

## 🌐 Deployment

### **Production Deployment**
```bash
# Build optimized production bundle
npm run build

# Deploy to Vercel (recommended)
vercel --prod

# Or deploy to other platforms
# Netlify, GitHub Pages, AWS S3, etc.
```

### **Environment Setup**
Create a `.env` file with your production variables:
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
