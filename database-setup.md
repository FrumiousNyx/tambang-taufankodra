# Complete Database Setup for PT Semen Nusantara

## Required Tables

### 1. leads Table
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  perusahaan TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type TEXT,
  pesan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view leads" ON leads
  FOR SELECT USING (true);
```

### 2. site_settings Table
```sql
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  credit_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default credit text
INSERT INTO site_settings (key, credit_text) 
VALUES ('footer_credit', 'Created by Taufan Kodra 2026');
```

### 3. products Table
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

### 4. projects Table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');
```

## Environment Variables

Add these to your `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Field Mappings

### Contact Form → leads Table
- `formData.name` → `nama_lengkap`
- `formData.company` → `perusahaan`
- `formData.email` → `email`
- `formData.phone` → `phone`
- `formData.projectType` → `project_type`
- `formData.message` → `pesan`

### Products Table Structure
- `name`, `name_en` - Product names in Indonesian/English
- `features`, `features_en` - Feature arrays
- `specs`, `specs_en` - JSON objects for technical specifications
- `color` - Tailwind gradient classes

### Projects Table Structure
- `title`, `title_en` - Project titles
- `client`, `client_en` - Client names
- `location`, `location_en` - Project locations
- `highlights`, `highlights_en` - Key achievement arrays

## Sample Data (Optional)

You can insert sample data to test the application:

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
  2023,
  '24 bulan',
  '24 months',
  ARRAY['PCC', 'OPC'],
  ARRAY['Proyek infrastruktur strategis nasional'],
  ARRAY['National strategic infrastructure project']
);
```

## Features Implemented

✅ **Ultra-Clean UI**
- Inter font with letter-spacing: -0.05em
- font-black for all headings
- py-24/py-32 padding on all sections

✅ **Dynamic Content**
- Footer credit from site_settings table
- Products catalog from Supabase
- Projects catalog from Supabase
- Loading and no-data states

✅ **Live Forms**
- Contact form → leads table
- Success toast notifications
- Error handling

✅ **Hydration Safe**
- Fixed use-mobile hook
- Consistent server/client rendering
