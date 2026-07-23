/*
# Create payroll table (single-tenant, no auth)

1. New Tables
- `payroll`: id, employee_id (FK), pay_period (text, e.g. "2026-07"), basic_salary (numeric), bonus (numeric), deductions (numeric), status (generated/paid), created_at
- Net salary is computed client-side as basic_salary + bonus - deductions.

2. Security
- Enable RLS on `payroll`.
- Allow anon + authenticated full CRUD because the data is intentionally shared/public (no sign-in screen).

3. Notes
- Unique constraint on (employee_id, pay_period) so each employee has one slip per pay period.
- Cascade delete so removing an employee cleans up their payroll records.
*/

CREATE TABLE IF NOT EXISTS payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  pay_period text NOT NULL,
  basic_salary numeric(12, 2) NOT NULL DEFAULT 0,
  bonus numeric(12, 2) NOT NULL DEFAULT 0,
  deductions numeric(12, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'generated' CHECK (status IN ('generated','paid')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (employee_id, pay_period)
);

CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_period ON payroll(pay_period);

ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_payroll" ON payroll;
CREATE POLICY "anon_select_payroll" ON payroll FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_payroll" ON payroll;
CREATE POLICY "anon_insert_payroll" ON payroll FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_payroll" ON payroll;
CREATE POLICY "anon_update_payroll" ON payroll FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_payroll" ON payroll;
CREATE POLICY "anon_delete_payroll" ON payroll FOR DELETE
  TO anon, authenticated USING (true);
