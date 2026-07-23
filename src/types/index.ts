export type ID = string;

export type Role = 'Admin' | 'HR Manager' | 'Line Manager' | 'Employee';

export type Employee = {
  id: ID;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'on-leave' | 'inactive';
  avatar: string;
  role: Role;
  branch: string;
  leaveBalance: number;
};

export type Attendance = {
  id: ID;
  employeeId: ID;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'half-day';
  overtimeHours: number;
};

export type LeaveRequest = {
  id: ID;
  employeeId: ID;
  type: 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
};

export type ShortLeave = {
  id: ID;
  employeeId: ID;
  date: string;
  fromTime: string;
  toTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type PayrollRecord = {
  id: ID;
  employeeId: ID;
  period: string;
  basicPay: number;
  overtime: number;
  festivalBonus: number;
  attendanceBonus: number;
  loanDeduction: number;
  pfContribution: number;
  gfContribution: number;
  taxDeduction: number;
  netPay: number;
  status: 'generated' | 'paid';
};

export type LoanRecord = {
  id: ID;
  employeeId: ID;
  amount: number;
  reason: string;
  monthlyDeduction: number;
  remaining: number;
  status: 'active' | 'cleared' | 'pending';
  date: string;
};

export type IncrementRecord = {
  id: ID;
  employeeId: ID;
  date: string;
  oldSalary: number;
  newSalary: number;
  percentage: number;
  reason: string;
};

export type PerformanceReview = {
  id: ID;
  employeeId: ID;
  period: string;
  kpiScore: number;
  rating: number;
  goals: string;
  comments: string;
  reviewer: string;
};

export type AwardDiscipline = {
  id: ID;
  employeeId: ID;
  type: 'award' | 'discipline';
  title: string;
  description: string;
  date: string;
};

export type TrainingProgram = {
  id: ID;
  title: string;
  description: string;
  trainer: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  participants: number;
};

export type JobPosting = {
  id: ID;
  title: string;
  department: string;
  description: string;
  status: 'open' | 'closed';
  openings: number;
  postedDate: string;
};

export type Candidate = {
  id: ID;
  jobId: ID;
  name: string;
  email: string;
  phone: string;
  status: 'applied' | 'interviewed' | 'hired' | 'rejected';
  appliedDate: string;
};

export type PromotionRecord = {
  id: ID;
  employeeId: ID;
  date: string;
  fromPosition: string;
  toPosition: string;
  fromDepartment: string;
  toDepartment: string;
  type: 'promotion' | 'upgrade' | 'migration';
};

export type ShiftSchedule = {
  id: ID;
  employeeId: ID;
  shift: 'Morning' | 'Evening' | 'Night' | 'Flexible';
  startTime: string;
  endTime: string;
  days: string;
};

export type DailyWorkReport = {
  id: ID;
  employeeId: ID;
  date: string;
  tasks: string;
  hours: number;
  status: 'submitted' | 'reviewed' | 'approved';
};

export type Notification = {
  id: ID;
  type: 'leave' | 'payroll' | 'attendance' | 'system' | 'training';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export type Branch = {
  id: ID;
  name: string;
  location: string;
  employeeCount: number;
};

export type BenefitDeduction = {
  id: ID;
  employeeId: ID;
  type: 'benefit' | 'deduction';
  name: string;
  amount: number;
  frequency: 'monthly' | 'annual' | 'one-time';
};

export type ProductionSalary = {
  id: ID;
  employeeId: ID;
  period: string;
  pieces: number;
  ratePerPiece: number;
  total: number;
};

export type Letter = {
  id: ID;
  employeeId: ID;
  type: 'Offer' | 'Experience' | 'Relieving' | 'Salary Certificate' | 'Show Cause';
  content: string;
  date: string;
  status: 'draft' | 'issued';
};

export type NewsEvent = {
  id: ID;
  title: string;
  type: 'news' | 'event';
  date: string;
  description: string;
};
