import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  joining_date: string;
  created_at?: string;
};

export type AttendanceStatus = 'present' | 'absent' | 'late';

export type Attendance = {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: AttendanceStatus;
  created_at?: string;
};

export type LeaveType = 'casual' | 'sick' | 'earned' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
  id: string;
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LeaveStatus;
  created_at?: string;
};

export type PayrollStatus = 'generated' | 'paid';

export type Payroll = {
  id: string;
  employee_id: string;
  pay_period: string;
  basic_salary: number;
  bonus: number;
  deductions: number;
  status: PayrollStatus;
  created_at?: string;
};

export type EmployeeWithRelations = Employee & {
  attendance?: Attendance[];
  leave_requests?: LeaveRequest[];
};

export type JobStatus = 'open' | 'closed';
export type JobPosting = {
  id: string;
  title: string;
  department: string;
  description: string | null;
  status: JobStatus;
  created_at?: string;
};

export type CandidateStatus = 'applied' | 'interviewed' | 'hired' | 'rejected';
export type Candidate = {
  id: string;
  job_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: CandidateStatus;
  applied_at: string;
  created_at?: string;
};

export type PerformanceReview = {
  id: string;
  employee_id: string;
  review_period: string;
  kpi_score: number;
  goals: string | null;
  comments: string | null;
  rating: number;
  created_at?: string;
};

export type AwardDiscipline = {
  id: string;
  employee_id: string;
  type: 'award' | 'discipline';
  title: string;
  description: string | null;
  date: string;
  created_at?: string;
};

export type TrainingStatus = 'scheduled' | 'ongoing' | 'completed';
export type TrainingProgram = {
  id: string;
  title: string;
  description: string | null;
  trainer: string | null;
  start_date: string;
  end_date: string;
  status: TrainingStatus;
  created_at?: string;
};
