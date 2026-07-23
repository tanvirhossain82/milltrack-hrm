/*
# Create HRM module tables (single-tenant, no auth)

1. New Tables
- `job_postings`: id, title, department, description, status (open/closed), created_at
- `candidates`: id, job_id (FK), name, email, phone, status (applied/interviewed/hired/rejected), applied_at, created_at
- `performance_reviews`: id, employee_id (FK), review_period, kpi_score (0-100), goals, comments, rating (1-5), created_at
- `awards_discipline`: id, employee_id (FK), type (award/discipline), title, description, date, created_at
- `training_programs`: id, title, description, trainer, start_date, end_date, status (scheduled/ongoing/completed), created_at

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated full CRUD (no sign-in screen, data is intentionally shared).

3. Notes
- Cascade deletes from employees and job_postings to their child records.
- All numeric scores constrained to valid ranges.
*/

CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied','interviewed','hired','rejected')),
  applied_at date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  review_period text NOT NULL,
  kpi_score integer NOT NULL DEFAULT 0 CHECK (kpi_score >= 0 AND kpi_score <= 100),
  goals text,
  comments text,
  rating integer NOT NULL DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS awards_discipline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('award','discipline')),
  title text NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  trainer text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','ongoing','completed')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidates_job ON candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_perf_employee ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_awards_employee ON awards_discipline(employee_id);

-- RLS for job_postings
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_jobs" ON job_postings;
CREATE POLICY "anon_select_jobs" ON job_postings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_jobs" ON job_postings;
CREATE POLICY "anon_insert_jobs" ON job_postings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_jobs" ON job_postings;
CREATE POLICY "anon_update_jobs" ON job_postings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_jobs" ON job_postings;
CREATE POLICY "anon_delete_jobs" ON job_postings FOR DELETE TO anon, authenticated USING (true);

-- RLS for candidates
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_candidates" ON candidates;
CREATE POLICY "anon_select_candidates" ON candidates FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_candidates" ON candidates;
CREATE POLICY "anon_insert_candidates" ON candidates FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_candidates" ON candidates;
CREATE POLICY "anon_update_candidates" ON candidates FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_candidates" ON candidates;
CREATE POLICY "anon_delete_candidates" ON candidates FOR DELETE TO anon, authenticated USING (true);

-- RLS for performance_reviews
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_perf" ON performance_reviews;
CREATE POLICY "anon_select_perf" ON performance_reviews FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_perf" ON performance_reviews;
CREATE POLICY "anon_insert_perf" ON performance_reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_perf" ON performance_reviews;
CREATE POLICY "anon_update_perf" ON performance_reviews FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_perf" ON performance_reviews;
CREATE POLICY "anon_delete_perf" ON performance_reviews FOR DELETE TO anon, authenticated USING (true);

-- RLS for awards_discipline
ALTER TABLE awards_discipline ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_awards" ON awards_discipline;
CREATE POLICY "anon_select_awards" ON awards_discipline FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_awards" ON awards_discipline;
CREATE POLICY "anon_insert_awards" ON awards_discipline FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_awards" ON awards_discipline;
CREATE POLICY "anon_update_awards" ON awards_discipline FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_awards" ON awards_discipline;
CREATE POLICY "anon_delete_awards" ON awards_discipline FOR DELETE TO anon, authenticated USING (true);

-- RLS for training_programs
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_training" ON training_programs;
CREATE POLICY "anon_select_training" ON training_programs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_training" ON training_programs;
CREATE POLICY "anon_insert_training" ON training_programs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_training" ON training_programs;
CREATE POLICY "anon_update_training" ON training_programs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_training" ON training_programs;
CREATE POLICY "anon_delete_training" ON training_programs FOR DELETE TO anon, authenticated USING (true);
