# Enterprise Database Setup for PT Semen Nusantara

## Complete Database Schema for Global Cement Industry Standards

### 1. Authentication & Users

```sql
-- Enable auth extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- Supabase automatically handles user authentication
-- Additional user profiles can be stored in:
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'admin', -- admin, editor, viewer
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Core Business Tables

#### Products Table
```sql
CREATE TABLE products (
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
  status TEXT DEFAULT 'active', -- active, inactive, discontinued
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### Projects Table
```sql
CREATE TABLE projects (
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
  gallery TEXT[], -- Array of image URLs
  status TEXT DEFAULT 'completed', -- ongoing, completed, planned
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### News Table
```sql
CREATE TABLE news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_en TEXT NOT NULL,
  excerpt TEXT,
  excerpt_en TEXT,
  category TEXT DEFAULT 'general', -- general, corporate, sustainability, investment, product
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  status TEXT DEFAULT 'published', -- draft, published, archived
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news" ON news
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage news" ON news
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 3. Corporate Governance Tables

#### Site Settings Table
```sql
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  credit_text TEXT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site_settings" ON site_settings
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert default settings
INSERT INTO site_settings (key, credit_text) VALUES 
  ('footer_credit', 'Created by Taufan Kodra 2026'),
  ('company_name', 'PT Semen Nusantara'),
  ('company_description', 'Leading cement manufacturer in Indonesia');
```

#### Investor Relations Table
```sql
CREATE TABLE investor_relations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL, -- annual_report, financial_statement, prospectus, presentation
  year INTEGER NOT NULL,
  quarter TEXT, -- Q1, Q2, Q3, Q4 (for quarterly reports)
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  file_format TEXT DEFAULT 'PDF',
  published_date DATE NOT NULL,
  status TEXT DEFAULT 'published',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE investor_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published investor documents" ON investor_relations
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage investor relations" ON investor_relations
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 4. Customer Relationship Tables

#### Leads Table (Enhanced)
```sql
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  perusahaan TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type TEXT,
  project_value TEXT,
  location TEXT,
  pesan TEXT,
  source TEXT DEFAULT 'website', -- website, referral, direct, email
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, closed
  assigned_to UUID REFERENCES user_profiles(id),
  notes TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON leads
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage leads" ON leads
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 5. Storage Buckets Setup

```sql
-- Create storage buckets for file management
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('products', 'products', true),
  ('projects', 'projects', true),
  ('news', 'news', true),
  ('documents', 'documents', true),
  ('investor-relations', 'investor-relations', true);

-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage product images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Similar policies for other buckets...
```

### 6. Functions and Triggers

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slugs
CREATE OR REPLACE FUNCTION generate_slug(table_name TEXT, title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  original_slug TEXT;
  counter INTEGER := 1;
BEGIN
  original_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  original_slug := regexp_replace(original_slug, '\s+', '-', 'g');
  slug := original_slug;
  
  -- Check if slug exists and make it unique
  WHILE EXISTS (SELECT 1 FROM information_schema.tables 
                WHERE table_name = table_name AND 
                EXISTS (SELECT 1 FROM unnest(string_to_array(
                  (SELECT column_name FROM information_schema.columns 
                   WHERE table_name = table_name AND column_name = 'slug'), ','
                )) AS col WHERE col = 'slug') AND
                slug = (SELECT slug FROM table_name WHERE slug = slug LIMIT 1))
  LOOP
    slug := original_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql;
```

### 7. Sample Data for Testing

```sql
-- Sample Product
INSERT INTO products (
  slug, name, name_en, tagline, tagline_en, description, description_en,
  features, features_en, applications, applications_en,
  specs, specs_en, color
) VALUES (
  'portland-composite-cement',
  'Portland Composite Cement',
  'Portland Composite Cement',
  'Semen Serbaguna Berkualitas Tinggi',
  'High-Quality Versatile Cement',
  'Semen serbaguna untuk konstruksi umum dengan kekuatan optimal dan ramah lingkungan.',
  'Versatile cement for general construction with optimal strength and eco-friendly properties.',
  ARRAY['Kekuatan Tinggi', 'Anti Retak', 'Eco-Friendly'],
  ARRAY['High Strength', 'Crack Resistant', 'Eco-Friendly'],
  ARRAY['Rumah Tinggal', 'Gedung Bertingkat'],
  ARRAY['Residential', 'High-rise Buildings'],
  '{"Kuat Tekan 28 Hari": "≥ 42.5 MPa"}'::jsonb,
  '{"28-Day Compressive Strength": "≥ 42.5 MPa"}'::jsonb,
  'from-slate-600 to-slate-800'
);

-- Sample Project
INSERT INTO projects (
  slug, title, title_en, client, client_en, location, location_en,
  volume, scope, scope_en, year, duration, duration_en,
  products, highlights, highlights_en
) VALUES (
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
  ARRAY['Proyek infrastruktur strategis nasional'],
  ARRAY['National strategic infrastructure project']
);

-- Sample News
INSERT INTO news (
  title, title_en, slug, content, content_en, excerpt, excerpt_en,
  category, author, status
) VALUES (
  'PT Semen Nusantara Raih Penghargaan Green Industry',
  'PT Semen Nusantara Wins Green Industry Award',
  'pt-semen-nusantara-raih-penghargaan-green-industry',
  'PT Semen Nusantara berhasil meraih penghargaan Green Industry Award 2024 berkat komitmen...',
  'PT Semen Nusantara successfully received the Green Industry Award 2024 for its commitment...',
  'Penghargaan tertinggi untuk industri semen berkelanjutan di Indonesia.',
  'Highest award for sustainable cement industry in Indonesia.',
  'corporate',
  'Corporate Communications',
  'published'
);
```

### 8. Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Features Implemented

✅ **Enterprise Authentication**
- Supabase Auth integration
- Role-based access control
- Protected routes

✅ **Content Management System**
- Full CRUD for Products, Projects, News
- Image upload via Supabase Storage
- Multi-language support (ID/EN)
- Status management (draft/published)

✅ **Corporate Pages**
- Sustainability (ESG, Green Industry)
- Investor Relations (GCG, Reports)
- CSR (Community Empowerment)

✅ **Lead Management**
- Enhanced lead tracking
- Status management
- Assignment system

✅ **Professional Features**
- Auto-generated slugs
- Timestamp tracking
- File management
- Search and filtering

This database structure supports enterprise-level operations with scalability, security, and comprehensive content management capabilities.
