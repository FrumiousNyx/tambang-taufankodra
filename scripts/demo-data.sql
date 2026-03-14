-- Demo Data Setup for PT Semen Nusantara Platform
-- Run these queries in Supabase SQL Editor to populate sample data

-- 1. Create demo admin user profile
-- First, create a test user in Auth tab, then copy the UUID and use here
INSERT INTO profiles (id, role, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin',
  NOW()
) ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Insert sample contact submissions (various project types)
INSERT INTO contact_submissions (email, phone, project_type, project_value, location, message, request_proposal, created_at)
VALUES
  ('pt.maju.jaya@gmail.com', '+62 812 3456 789', 'infrastructure', '5-10M', 'Jakarta, DKI', 'PT Maju Jaya tertarik dengan produk semen nusantara untuk proyek jembatan di sekitar Jakarta. Mohon informasi detail dan penawaran harga khusus.', true, NOW() - INTERVAL '5 days'),
  ('contact@konstruksi-sejahtera.co.id', '+62 21 5555 1234', 'residential', '1-5M', 'Surabaya, Jawa Timur', 'Kami sedang mengerjakan komplek perumahan green building. Butuh semen berkualitas tinggi dengan sertifikasi SNI. Kirimkan penawaran ASAP.', true, NOW() - INTERVAL '4 days'),
  ('info@bangunan-modern.com', '+62 821 9999 8888', 'commercial', '5-10M', 'Bandung, Jawa Barat', 'Proyek pusat perbelanjaan baru memerlukan supply semen dalam jumlah besar. Apakah tersedia sistem pembayaran bertahap?', false, NOW() - INTERVAL '3 days'),
  ('engineering@industri-cemasan.co.id', '+62 271 123 4567', 'industrial', '>10M', 'Semarang, Jawa Tengah', 'PT Industri Cemasan mengundang kepada pihak semen nusantara untuk tender penawaran semen khusus industri dengan spesifikasi khusus. Silakan hubungi tim procurement kami.', true, NOW() - INTERVAL '2 days'),
  ('pm@pembangunan-jaya.co.id', '+62 341 222 3333', 'infrastructure', '5-10M', 'Malang, Jawa Timur', 'Sedang mencari supplier semen terpercaya untuk proyek pembangunan jalan tol. Butuh garansi kualitas dan pengiriman rutin setiap bulan.', true, NOW() - INTERVAL '1 day'),
  ('sales@developer-sejahtera.com', '+62 62 111 2222', 'residential', '<1M', 'Medan, Sumatera Utara', 'Halo, saya tertarik dengan produk semen. Bisa minta sample dan harga grosir?', false, NOW() - INTERVAL '6 hours'),
  ('inquiry@konstruksi-nusantara.com', '+62 815 777 8888', 'commercial', '1-5M', 'Palembang, Sumatera Selatan', 'Proyek mall baru butuh 500 ton semen per bulan untuk 6 bulan ke depan. Apakah ada sistem pre-order dengan harga khusus?', true, NOW() - INTERVAL '2 hours');

-- 3. Insert sample audit logs
INSERT INTO admin_audit_log (user_id, action, resource, details, timestamp, ip_address)
VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'login', 'auth', '{"method":"email"}', NOW() - INTERVAL '1 day', '203.162.145.123'::inet),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'view_submissions', 'contact_submissions', '{"limit":100,"offset":0}', NOW() - INTERVAL '1 day', '203.162.145.123'::inet),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'export_csv', 'contact_submissions', '{"format":"csv","limit":1000}', NOW() - INTERVAL '12 hours', '203.162.145.123'::inet),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'logout', 'auth', '{}', NOW() - INTERVAL '12 hours', '203.162.145.123'::inet);

-- Verify data
SELECT COUNT(*) as total_submissions FROM contact_submissions;
SELECT COUNT(*) as total_profiles FROM profiles WHERE role='admin';
SELECT COUNT(*) as total_audit_logs FROM admin_audit_log;
