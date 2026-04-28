import { createClient } from '@supabase/supabase-js'

// ── Replace these with your Supabase project values ──────────────────────────
// 1. Go to https://supabase.com → New project
// 2. Settings → API → copy Project URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Database types ────────────────────────────────────────────────────────────
export interface Guest {
  id: string
  name: string
  slug: string           // URL-safe version of name e.g. "john-doe"
  phone?: string
  created_at: string
}

export interface RSVP {
  id: string
  guest_id: string
  attending: boolean
  guest_count: number
  responded_at: string
  guest?: Guest
}

// ── SQL to run in Supabase SQL Editor ────────────────────────────────────────
/*
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER DEFAULT 1,
  responded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow public read/write for this app
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_guests" ON guests FOR SELECT USING (true);
CREATE POLICY "public_insert_guests" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_rsvps" ON rsvps FOR SELECT USING (true);
CREATE POLICY "public_insert_rsvps" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_rsvps" ON rsvps FOR UPDATE USING (true);
CREATE POLICY "public_delete_rsvps" ON rsvps FOR DELETE USING (true);
*/
