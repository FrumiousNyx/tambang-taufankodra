-- Create CMS Content table
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('hero', 'about', 'product', 'project', 'news', 'testimonial', 'contact')),
  title JSONB NOT NULL DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT
);

-- Create CMS Pages table
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL DEFAULT '{}',
  description JSONB NOT NULL DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT
);

-- Create CMS Media table
CREATE TABLE IF NOT EXISTS cms_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document')),
  size BIGINT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cms_content_type ON cms_content(type);
CREATE INDEX IF NOT EXISTS idx_cms_content_published ON cms_content(published);
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_published ON cms_pages(published);
CREATE INDEX IF NOT EXISTS idx_cms_media_type ON cms_media(type);
CREATE INDEX IF NOT EXISTS idx_cms_media_created_at ON cms_media(created_at);

-- Create storage bucket for CMS media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-media', 'cms-media', true) 
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;

-- Create policies for CMS content
CREATE POLICY "Anyone can view published content" ON cms_content
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage content" ON cms_content
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for CMS pages
CREATE POLICY "Anyone can view published pages" ON cms_pages
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can manage pages" ON cms_pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for CMS media
CREATE POLICY "Anyone can view media" ON cms_media
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage media" ON cms_media
  FOR ALL USING (auth.role() = 'authenticated');

-- Set up storage policies
CREATE POLICY "Anyone can view media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-media');

CREATE POLICY "Authenticated users can upload media files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media files" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-media' AND auth.role() = 'authenticated');

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO cms_content (type, title, content, metadata, created_by) VALUES
  (
    'hero',
    '{"id": "Selamat Datang di PT Semen Nusantara", "en": "Welcome to PT Semen Nusantara", "zh": "欢迎来到PT Semen Nusantara"}',
    '{"id": "Mitra terpercaya untuk kebutuhan semen berkualitas tinggi di Indonesia", "en": "Trusted partner for high-quality cement needs in Indonesia", "zh": "印度尼西亚高质量水泥需求的可靠合作伙伴"}',
    '{"published": true, "featured": true, "order": 1}',
    'admin'
  ),
  (
    'about',
    '{"id": "Tentang Kami", "en": "About Us", "zh": "关于我们"}',
    '{"id": "PT Semen Nusantara adalah produsen semen terkemuka di Indonesia dengan komitmen terhadap kualitas dan keberlanjutan.", "en": "PT Semen Nusantara is a leading cement manufacturer in Indonesia with commitment to quality and sustainability.", "zh": "PT Semen Nusantara是印度尼西亚领先的水泥制造商，致力于质量和可持续发展。"}',
    '{"published": true, "order": 2}',
    'admin'
  );

INSERT INTO cms_pages (slug, title, description, content, metadata, created_by) VALUES
  (
    'kebijakan-privasi',
    '{"id": "Kebijakan Privasi", "en": "Privacy Policy", "zh": "隐私政策"}',
    '{"id": "Kebijakan privasi kami", "en": "Our privacy policy", "zh": "我们的隐私政策"}',
    '{"id": "Kami menjaga privasi data Anda dengan serius...", "en": "We take your data privacy seriously...", "zh": "我们认真对待您的数据隐私..."}',
    '{"published": true, "seo_title": {"id": "Kebijakan Privasi - PT Semen Nusantara"}, "seo_description": {"id": "Kebijakan privasi lengkap PT Semen Nusantara"}}',
    'admin'
  );
