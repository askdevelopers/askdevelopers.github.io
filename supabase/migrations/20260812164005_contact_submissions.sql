/*
# Create contact_submissions table (single-tenant, no auth)

1. New Tables
- `contact_submissions`
  - `id` (uuid, primary key)
  - `full_name` (text, not null) — submitter's name
  - `email` (text, not null) — submitter's email
  - `phone` (text) — phone number
  - `service_needed` (text) — selected service category
  - `budget_range` (text) — selected budget bucket
  - `project_details` (text) — free-text project description
  - `status` (text, default 'new') — internal tracking (new/contacted/closed)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `contact_submissions`.
- Public INSERT only (TO anon, authenticated) so the website form can write.
- No SELECT/UPDATE/DELETE for anon — submissions are private to the project owner.
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  service_needed text,
  budget_range text,
  project_details text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_contact_submissions"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);
