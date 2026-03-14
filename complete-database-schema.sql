-- Complete Database Schema for PT Semen Nusantara Enterprise
-- Run this SQL in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  tagline TEXT,
  tagline_en TEXT,
  description TEXT,
  description_en TEXT,
  features TEXT[],
  features_en TEXT[],
  applications TEXT[],
  applications_en TEXT[],
  specs JSONB,
  specs_en JSONB,
  color TEXT DEFAULT 'from-slate-600 to-slate-800',
  image_url TEXT,
  datasheet_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  client TEXT NOT NULL,
  client_en TEXT NOT NULL,
  location TEXT NOT NULL,
  location_en TEXT NOT NULL,
  volume TEXT NOT NULL,
  scope TEXT NOT NULL,
  scope_en TEXT NOT NULL,
  year INTEGER NOT NULL,
  duration TEXT NOT NULL,
  duration_en TEXT NOT NULL,
  products TEXT[],
  highlights TEXT[],
  highlights_en TEXT[],
  image_url TEXT,
  gallery TEXT[],
  status TEXT DEFAULT 'completed' CHECK (status IN ('ongoing', 'completed', 'planned')),
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SUSTAINABILITY_REPORTS TABLE
CREATE TABLE IF NOT EXISTS sustainability_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('environmental', 'social', 'governance', 'carbon', 'water', 'waste')),
  description TEXT,
  description_en TEXT,
  file_url TEXT,
  file_size TEXT,
  metrics JSONB,
  published_date DATE NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CSR_ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS csr_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('education', 'healthcare', 'economic', 'environment', 'infrastructure')),
  description TEXT,
  description_en TEXT,
  location TEXT NOT NULL,
  beneficiaries_count INTEGER DEFAULT 0,
  investment_amount TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('planning', 'ongoing', 'completed', 'suspended')),
  image_url TEXT,
  gallery TEXT[],
  impact_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INVESTOR_DOCS TABLE
CREATE TABLE IF NOT EXISTS investor_docs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('annual_report', 'financial_statement', 'prospectus', 'presentation', 'governance_report')),
  year INTEGER NOT NULL,
  quarter TEXT CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  file_format TEXT DEFAULT 'PDF',
  published_date DATE NOT NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. LEADS TABLE (Enhanced)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  perusahaan TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type TEXT,
  project_value TEXT,
  location TEXT,
  pesan TEXT,
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'referral', 'direct', 'email', 'chatbot')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  assigned_to UUID,
  notes TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SITE_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  credit_text TEXT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. NEWS TABLE
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_en TEXT NOT NULL,
  excerpt TEXT,
  excerpt_en TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'corporate', 'sustainability', 'investment', 'product')),
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE csr_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Products RLS Policies
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- Projects RLS Policies
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- Sustainability Reports RLS Policies
CREATE POLICY "Anyone can view published sustainability reports" ON sustainability_reports
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage sustainability reports" ON sustainability_reports
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- CSR Activities RLS Policies
CREATE POLICY "Anyone can view CSR activities" ON csr_activities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage CSR activities" ON csr_activities
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- Investor Docs RLS Policies
CREATE POLICY "Anyone can view published investor documents" ON investor_docs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage investor documents" ON investor_docs
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- Leads RLS Policies
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON leads
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

CREATE POLICY "Admins can manage leads" ON leads
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- Site Settings RLS Policies
CREATE POLICY "Anyone can view site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site_settings" ON site_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- News RLS Policies
CREATE POLICY "Anyone can view published news" ON news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage news" ON news
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND email = 'admin@semennusantara.co.id'
    )
  );

-- FUNCTIONS AND TRIGGERS

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sustainability_reports_updated_at BEFORE UPDATE ON sustainability_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_csr_activities_updated_at BEFORE UPDATE ON csr_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_docs_updated_at BEFORE UPDATE ON investor_docs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SAMPLE DATA INSERTION

-- Insert default site settings
INSERT INTO site_settings (key, credit_text, value) VALUES 
  ('footer_credit', 'Created by Taufan Kodra 2026', 'PT Semen Nusantara'),
  ('company_name', 'PT Semen Nusantara', 'Leading cement manufacturer in Indonesia'),
  ('company_description', 'Mitra Strategis Infrastruktur Nasional', 'Strategic Partner for National Infrastructure')
ON CONFLICT (key) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  slug, name, name_en, tagline, tagline_en, description, description_en,
  features, features_en, applications, applications_en,
  specs, specs_en, color
) VALUES 
  (
    'portland-composite-cement',
    'Portland Composite Cement',
    'Portland Composite Cement',
    'Semen Serbaguna Berkualitas Tinggi',
    'High-Quality Versatile Cement',
    'Semen serbaguna untuk konstruksi umum dengan kekuatan optimal dan ramah lingkungan.',
    'Versatile cement for general construction with optimal strength and eco-friendly properties.',
    ARRAY['Kekuatan Tinggi', 'Anti Retak', 'Eco-Friendly'],
    ARRAY['High Strength', 'Crack Resistant', 'Eco-Friendly'],
    ARRAY['Rumah Tinggal', 'Gedung Bertingkat', 'Jalan Raya'],
    ARRAY['Residential', 'High-rise Buildings', 'Roads'],
    '{"Kuat Tekan 28 Hari": "≥ 42.5 MPa", "Waktu Ikat Awal": "≥ 45 menit"}'::jsonb,
    '{"28-Day Compressive Strength": "≥ 42.5 MPa", "Initial Setting Time": "≥ 45 minutes"}'::jsonb,
    'from-slate-600 to-slate-800'
  ),
  (
    'ordinary-portland-cement',
    'Ordinary Portland Cement',
    'Ordinary Portland Cement',
    'Standar Industri Konstruksi',
    'Industry Standard for Construction',
    'Standar industri untuk proyek infrastruktur berskala besar dengan performa tinggi.',
    'Industry standard for large-scale infrastructure projects with high performance.',
    ARRAY['SNI Certified', 'High Performance', 'Durable'],
    ARRAY['SNI Certified', 'High Performance', 'Durable'],
    ARRAY['Infrastruktur', 'Konstruksi Berat', 'Pra-cetak'],
    ARRAY['Infrastructure', 'Heavy Construction', 'Precast'],
    '{"Kuat Tekan 28 Hari": "≥ 52.5 MPa", "Kehalusan": "≥ 300 m²/kg"}'::jsonb,
    '{"28-Day Compressive Strength": "≥ 52.5 MPa", "Fineness": "≥ 300 m²/kg"}'::jsonb,
    'from-zinc-600 to-zinc-800'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (
  slug, title, title_en, client, client_en, location, location_en,
  volume, scope, scope_en, year, duration, duration_en,
  products, highlights, highlights_en
) VALUES 
  (
    'tol-trans-jawa',
    'Jalan Tol Trans Jawa',
    'Trans Java Toll Road',
    'Kementerian PUPR',
    'Ministry of Public Works',
    'Jawa Tengah - Jawa Timur',
    'Central Java - East Java',
    '850,000 Ton',
    'Konstruksi jalan tol sepanjang 300 km menghubungkan Semarang-Surabaya.',
    '300 km toll road construction connecting Semarang-Surabaya.',
    2024,
    '24 bulan',
    '24 months',
    ARRAY['PCC', 'OPC'],
    ARRAY['Proyek infrastruktur strategis nasional', 'Kolaborasi dengan kontraktor BUMN'],
    ARRAY['National strategic infrastructure project', 'Collaboration with state-owned contractors']
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample CSR activities
INSERT INTO csr_activities (
  title, title_en, slug, category, description, description_en,
  location, beneficiaries_count, investment_amount,
  start_date, end_date, status, impact_metrics
) VALUES 
  (
    'Semen Nusantara Mengajar',
    'Semen Nusantara Teaches',
    'semen-nusantara-mengajar',
    'education',
    'Program pengabdian guru profesional ke daerah terpencil dengan fokus pada STEM.',
    'Professional teacher dedication program to remote areas focusing on STEM.',
    'Papua, NTT, Maluku',
    2500,
    'Rp 5 Miliar',
    '2024-01-01',
    '2024-12-31',
    'ongoing',
    '{"schools": 50, "teachers": 100, "students": 2400}'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample sustainability report
INSERT INTO sustainability_reports (
  title, title_en, slug, year, category, description, description_en,
  published_date, status, metrics
) VALUES 
  (
    'Laporan Keberlanjutan 2024',
    'Sustainability Report 2024',
    'laporan-keberlanjutan-2024',
    'environmental',
    'Laporan tahunan komprehensif tentang inisiatif keberlanjutan perusahaan.',
    'Comprehensive annual report on company sustainability initiatives.',
    '2024-12-31',
    'published',
    '{"carbon_reduction": "30%", "water_efficiency": "95%", "waste_recycling": "85%"}'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample investor document
INSERT INTO investor_docs (
  type, year, title, title_en, description, description_en,
  file_url, file_size, published_date, status
) VALUES 
  (
    'annual_report',
    2024,
    'Laporan Tahunan 2024',
    'Annual Report 2024',
    'Laporan tahunan dengan fokus pada transformasi digital dan keberlanjutan.',
    'Annual report with focus on digital transformation and sustainability.',
    'https://example.com/annual-report-2024.pdf',
    '12.5 MB',
    '2024-04-15',
    'published'
  );

-- Success message
SELECT 'Database schema created successfully!' as status;
