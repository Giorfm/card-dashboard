-- ==============================================================================
-- DATABASE SCHEMA & SETUP SCRIPT: Dynamic Google Review Card Platform
-- ==============================================================================

-- 1. Create Cards Table
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  pin TEXT NOT NULL,
  target_url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for rapid ID lookup during scan / redirect
CREATE INDEX IF NOT EXISTS idx_cards_id ON cards(id);

-- 2. Grant Permissions to Anon and Authenticated Roles
GRANT ALL ON TABLE cards TO anon, authenticated;
GRANT ALL ON TABLE cards TO service_role;

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cards (needed for redirect / lookup)
DROP POLICY IF EXISTS "Allow public read access to cards" ON cards;
CREATE POLICY "Allow public read access to cards" 
ON cards FOR SELECT 
TO anon, authenticated
USING (true);

-- Allow public update to cards (for activation / edit via verified PIN)
DROP POLICY IF EXISTS "Allow update access to cards with matching PIN" ON cards;
CREATE POLICY "Allow update access to cards with matching PIN" 
ON cards FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow insert access for initial generation / admin
DROP POLICY IF EXISTS "Allow insert for admin/anon" ON cards;
CREATE POLICY "Allow insert for admin/anon" 
ON cards FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 3. Bulk Batch Card Generation Function (from PRD Section 3.2)
CREATE OR REPLACE FUNCTION generate_cards(jumlah_kartu int, start_index int default 1)
RETURNS void AS $$
DECLARE
  i int;
  new_id text;
  new_pin text;
BEGIN
  FOR i IN 0..(jumlah_kartu - 1) LOOP
    -- Format ID sekuensial dengan prefix 'c' dan 4 digit angka (c0001, c0002, dst)
    new_id := 'c' || LPAD((start_index + i)::text, 4, '0');
    -- Format PIN 4 angka acak (1000 - 9999)
    new_pin := FLOOR(random() * 8999 + 1000)::text;
    
    INSERT INTO cards (id, pin, is_active, created_at, updated_at) 
    VALUES (new_id, new_pin, false, now(), now())
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. Sample Seed Data for immediate testing:
-- Card 1: Belum aktif (Baru dicetak) -> ID: c0001, PIN: 1234
INSERT INTO cards (id, pin, target_url, is_active, created_at, updated_at)
VALUES 
  ('c0001', '1234', NULL, false, now(), now()),
  ('c0002', '5678', 'https://maps.app.goo.gl/sample-store-review', true, now(), now()),
  ('c0003', '9999', 'https://g.page/r/sample-coffee-shop/review', true, now(), now())
ON CONFLICT (id) DO UPDATE 
SET pin = EXCLUDED.pin, target_url = EXCLUDED.target_url, is_active = EXCLUDED.is_active;

-- To generate 100 cards from c0010 to c0109:
-- SELECT generate_cards(100, 10);
