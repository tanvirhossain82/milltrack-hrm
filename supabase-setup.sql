-- Supabase SQL Editor-এ পুরো ফাইলটা কপি-পেস্ট করে "Run" চাপুন।
-- এতে একটা টেবিল তৈরি হবে যেখানে পুরো HRM সফটওয়্যারের সব ডেটা
-- (employees, departments, holidays, shifts, bonus, gazette, users, salary sheets)
-- key-value আকারে শেয়ার্ডভাবে জমা থাকবে।

create table if not exists hrm_kv (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table hrm_kv enable row level security;

-- ডেমো/ছোট টিমের জন্য সহজ পলিসি: anon key দিয়ে সবাই পড়তে ও লিখতে পারবে।
-- (নিচে README-এ এটা আরও কঠোর করার পরামর্শ আছে যদি ইন্টারনেটে পাবলিক থাকে)
drop policy if exists "public read" on hrm_kv;
drop policy if exists "public insert" on hrm_kv;
drop policy if exists "public update" on hrm_kv;

create policy "public read" on hrm_kv for select using (true);
create policy "public insert" on hrm_kv for insert with check (true);
create policy "public update" on hrm_kv for update using (true) with check (true);
