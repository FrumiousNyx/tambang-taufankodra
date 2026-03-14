# Supabase Setup for PT Semen Nusantara

## Leads Table Structure

Create the following table in your Supabase project:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts
CREATE POLICY "Users can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (for admin purposes)
CREATE POLICY "Users can view leads" ON leads
  FOR SELECT USING (true);
```

## Environment Variables

Add these to your `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Form Fields Mapping

The contact form submits the following fields to the `leads` table:

- `name` → Full Name (required)
- `company` → Company Name (required)  
- `email` → Email Address (required)
- `phone` → Phone Number (required)
- `project_type` → Project Type (optional)
- `message` → Message (optional)
- `created_at` → Timestamp (auto-generated)
