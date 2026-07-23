import type {
  Employee, Attendance, LeaveRequest, ShortLeave, PayrollRecord, LoanRecord,
  IncrementRecord, PerformanceReview, AwardDiscipline, TrainingProgram,
  JobPosting, Candidate, PromotionRecord, ShiftSchedule, DailyWorkReport,
  Notification, Branch, BenefitDeduction, ProductionSalary, Letter, NewsEvent,
} from '@/types';

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString().slice(0, 10);
const daysAhead = (n: number) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

export const branches: Branch[] = [
  { id: 'b1', name: 'Head Office - NYC', location: 'New York, USA', employeeCount: 45 },
  { id: 'b2', name: 'West Coast - SF', location: 'San Francisco, USA', employeeCount: 28 },
  { id: 'b3', name: 'Europe - London', location: 'London, UK', employeeCount: 17 },
  { id: 'b4', name: 'Asia Pacific - Singapore', location: 'Singapore', employeeCount: 22 },
];

export const employees: Employee[] = [
  { id: 'e1', name: 'Sarah Johnson', email: 'sarah.j@company.com', phone: '+1 202 555 0100', department: 'Engineering', position: 'Senior Software Engineer', joinDate: '2021-03-15', salary: 95000, status: 'active', avatar: 'SJ', role: 'Admin', branch: 'b1', leaveBalance: 18 },
  { id: 'e2', name: 'Michael Chen', email: 'michael.c@company.com', phone: '+1 202 555 0101', department: 'Engineering', position: 'Frontend Developer', joinDate: '2022-07-01', salary: 72000, status: 'active', avatar: 'MC', role: 'Employee', branch: 'b1', leaveBalance: 21 },
  { id: 'e3', name: 'Emily Davis', email: 'emily.d@company.com', phone: '+1 202 555 0102', department: 'Human Resources', position: 'HR Manager', joinDate: '2020-01-20', salary: 88000, status: 'active', avatar: 'ED', role: 'HR Manager', branch: 'b1', leaveBalance: 25 },
  { id: 'e4', name: 'James Wilson', email: 'james.w@company.com', phone: '+1 202 555 0103', department: 'Sales', position: 'Sales Representative', joinDate: '2023-02-10', salary: 55000, status: 'active', avatar: 'JW', role: 'Employee', branch: 'b2', leaveBalance: 15 },
  { id: 'e5', name: 'Jessica Brown', email: 'jessica.b@company.com', phone: '+1 202 555 0104', department: 'Marketing', position: 'Marketing Lead', joinDate: '2021-11-05', salary: 78000, status: 'on-leave', avatar: 'JB', role: 'Line Manager', branch: 'b2', leaveBalance: 8 },
  { id: 'e6', name: 'David Martinez', email: 'david.m@company.com', phone: '+1 202 555 0105', department: 'Engineering', position: 'DevOps Engineer', joinDate: '2022-04-18', salary: 82000, status: 'active', avatar: 'DM', role: 'Line Manager', branch: 'b1', leaveBalance: 20 },
  { id: 'e7', name: 'Lisa Anderson', email: 'lisa.a@company.com', phone: '+1 202 555 0106', department: 'Finance', position: 'Financial Analyst', joinDate: '2020-09-12', salary: 70000, status: 'active', avatar: 'LA', role: 'Employee', branch: 'b3', leaveBalance: 22 },
  { id: 'e8', name: 'Robert Taylor', email: 'robert.t@company.com', phone: '+1 202 555 0107', department: 'Sales', position: 'Sales Manager', joinDate: '2019-06-01', salary: 92000, status: 'active', avatar: 'RT', role: 'Line Manager', branch: 'b3', leaveBalance: 24 },
  { id: 'e9', name: 'Jennifer Garcia', email: 'jennifer.g@company.com', phone: '+1 202 555 0108', department: 'Engineering', position: 'Backend Developer', joinDate: '2023-01-15', salary: 68000, status: 'active', avatar: 'JG', role: 'Employee', branch: 'b4', leaveBalance: 19 },
  { id: 'e10', name: 'Christopher Lee', email: 'chris.l@company.com', phone: '+1 202 555 0109', department: 'Production', position: 'Production Supervisor', joinDate: '2021-08-20', salary: 60000, status: 'active', avatar: 'CL', role: 'Line Manager', branch: 'b4', leaveBalance: 16 },
  { id: 'e11', name: 'Amanda White', email: 'amanda.w@company.com', phone: '+1 202 555 0110', department: 'Human Resources', position: 'HR Specialist', joinDate: '2022-10-03', salary: 52000, status: 'active', avatar: 'AW', role: 'Employee', branch: 'b1', leaveBalance: 23 },
  { id: 'e12', name: 'Daniel Thomas', email: 'daniel.t@company.com', phone: '+1 202 555 0111', department: 'Engineering', position: 'QA Engineer', joinDate: '2023-05-22', salary: 58000, status: 'active', avatar: 'DT', role: 'Employee', branch: 'b2', leaveBalance: 17 },
];

export const attendance: Attendance[] = [
  { id: 'a1', employeeId: 'e1', date: todayStr, checkIn: '08:45', checkOut: '17:30', status: 'present', overtimeHours: 0.5 },
  { id: 'a2', employeeId: 'e2', date: todayStr, checkIn: '09:15', checkOut: '17:00', status: 'late', overtimeHours: 0 },
  { id: 'a3', employeeId: 'e3', date: todayStr, checkIn: '08:30', checkOut: '17:15', status: 'present', overtimeHours: 0.25 },
  { id: 'a4', employeeId: 'e4', date: todayStr, checkIn: '08:50', checkOut: '17:00', status: 'present', overtimeHours: 0 },
  { id: 'a5', employeeId: 'e6', date: todayStr, checkIn: '09:20', checkOut: '18:00', status: 'late', overtimeHours: 1 },
  { id: 'a6', employeeId: 'e7', date: todayStr, checkIn: '08:40', checkOut: '17:30', status: 'present', overtimeHours: 0.5 },
  { id: 'a7', employeeId: 'e8', date: todayStr, checkIn: '', checkOut: '', status: 'absent', overtimeHours: 0 },
  { id: 'a8', employeeId: 'e9', date: todayStr, checkIn: '08:55', checkOut: '17:00', status: 'present', overtimeHours: 0 },
  { id: 'a9', employeeId: 'e10', date: todayStr, checkIn: '08:35', checkOut: '17:45', status: 'present', overtimeHours: 0.75 },
  { id: 'a10', employeeId: 'e11', date: todayStr, checkIn: '09:10', checkOut: '17:00', status: 'late', overtimeHours: 0 },
  { id: 'a11', employeeId: 'e12', date: todayStr, checkIn: '08:45', checkOut: '17:30', status: 'present', overtimeHours: 0.5 },
  { id: 'a12', employeeId: 'e1', date: daysAgo(1), checkIn: '08:50', checkOut: '17:30', status: 'present', overtimeHours: 0.5 },
  { id: 'a13', employeeId: 'e2', date: daysAgo(1), checkIn: '08:45', checkOut: '17:00', status: 'present', overtimeHours: 0 },
  { id: 'a14', employeeId: 'e3', date: daysAgo(1), checkIn: '09:05', checkOut: '17:15', status: 'late', overtimeHours: 0.25 },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'l1', employeeId: 'e5', type: 'Annual', startDate: daysAhead(2), endDate: daysAhead(6), days: 5, reason: 'Family vacation', status: 'pending', appliedDate: daysAgo(3) },
  { id: 'l2', employeeId: 'e4', type: 'Sick', startDate: daysAgo(1), endDate: todayStr, days: 2, reason: 'Flu recovery', status: 'pending', appliedDate: daysAgo(2) },
  { id: 'l3', employeeId: 'e2', type: 'Casual', startDate: daysAgo(5), endDate: daysAgo(5), days: 1, reason: 'Personal errand', status: 'approved', appliedDate: daysAgo(7) },
  { id: 'l4', employeeId: 'e9', type: 'Annual', startDate: daysAhead(10), endDate: daysAhead(14), days: 5, reason: 'Annual trip', status: 'approved', appliedDate: daysAgo(10) },
  { id: 'l5', employeeId: 'e12', type: 'Sick', startDate: daysAgo(3), endDate: daysAgo(3), days: 1, reason: 'Medical appointment', status: 'rejected', appliedDate: daysAgo(5) },
  { id: 'l6', employeeId: 'e7', type: 'Casual', startDate: daysAhead(1), endDate: daysAhead(1), days: 1, reason: 'Bank work', status: 'pending', appliedDate: daysAgo(1) },
];

export const shortLeaves: ShortLeave[] = [
  { id: 'sl1', employeeId: 'e2', date: todayStr, fromTime: '14:00', toTime: '16:00', reason: 'Doctor appointment', status: 'pending' },
  { id: 'sl2', employeeId: 'e6', date: daysAgo(1), fromTime: '11:00', toTime: '12:30', reason: 'Personal work', status: 'approved' },
  { id: 'sl3', employeeId: 'e11', date: todayStr, fromTime: '15:00', toTime: '16:00', reason: 'School pickup', status: 'pending' },
];

export const payrollRecords: PayrollRecord[] = [
  { id: 'p1', employeeId: 'e1', period: '2026-07', basicPay: 7916, overtime: 200, festivalBonus: 0, attendanceBonus: 100, loanDeduction: 0, pfContribution: 950, gfContribution: 400, taxDeduction: 1583, netPay: 5283, status: 'generated' },
  { id: 'p2', employeeId: 'e2', period: '2026-07', basicPay: 6000, overtime: 0, festivalBonus: 0, attendanceBonus: 100, loanDeduction: 200, pfContribution: 720, gfContribution: 300, taxDeduction: 900, netPay: 3980, status: 'generated' },
  { id: 'p3', employeeId: 'e3', period: '2026-07', basicPay: 7333, overtime: 100, festivalBonus: 0, attendanceBonus: 100, loanDeduction: 0, pfContribution: 880, gfContribution: 350, taxDeduction: 1466, netPay: 4837, status: 'paid' },
  { id: 'p4', employeeId: 'e4', period: '2026-07', basicPay: 4583, overtime: 0, festivalBonus: 0, attendanceBonus: 50, loanDeduction: 150, pfContribution: 550, gfContribution: 200, taxDeduction: 687, netPay: 3046, status: 'generated' },
  { id: 'p5', employeeId: 'e6', period: '2026-07', basicPay: 6833, overtime: 400, festivalBonus: 0, attendanceBonus: 100, loanDeduction: 0, pfContribution: 820, gfContribution: 350, taxDeduction: 1366, netPay: 4797, status: 'paid' },
];

export const loanRecords: LoanRecord[] = [
  { id: 'ln1', employeeId: 'e2', amount: 5000, reason: 'Home renovation', monthlyDeduction: 200, remaining: 3200, status: 'active', date: '2025-01-15' },
  { id: 'ln2', employeeId: 'e4', amount: 3000, reason: 'Medical emergency', monthlyDeduction: 150, remaining: 1800, status: 'active', date: '2025-03-10' },
  { id: 'ln3', employeeId: 'e9', amount: 2000, reason: 'Education', monthlyDeduction: 100, remaining: 0, status: 'cleared', date: '2024-06-01' },
  { id: 'ln4', employeeId: 'e12', amount: 4000, reason: 'Vehicle purchase', monthlyDeduction: 200, remaining: 4000, status: 'pending', date: daysAgo(5) },
];

export const incrementRecords: IncrementRecord[] = [
  { id: 'inc1', employeeId: 'e1', date: '2026-01-01', oldSalary: 88000, newSalary: 95000, percentage: 7.95, reason: 'Annual performance review' },
  { id: 'inc2', employeeId: 'e6', date: '2026-01-01', oldSalary: 75000, newSalary: 82000, percentage: 9.33, reason: 'Promotion-based increment' },
  { id: 'inc3', employeeId: 'e3', date: '2025-07-01', oldSalary: 82000, newSalary: 88000, percentage: 7.31, reason: 'Annual performance review' },
  { id: 'inc4', employeeId: 'e9', date: '2026-04-01', oldSalary: 62000, newSalary: 68000, percentage: 9.68, reason: 'Completion of probation' },
];

export const performanceReviews: PerformanceReview[] = [
  { id: 'pr1', employeeId: 'e1', period: '2026-Q2', kpiScore: 92, rating: 5, goals: 'Lead platform migration', comments: 'Exceeded all expectations', reviewer: 'Emily Davis' },
  { id: 'pr2', employeeId: 'e2', period: '2026-Q2', kpiScore: 78, rating: 4, goals: 'Improve frontend test coverage', comments: 'Good progress, room for growth', reviewer: 'Sarah Johnson' },
  { id: 'pr3', employeeId: 'e3', period: '2026-Q2', kpiScore: 88, rating: 5, goals: 'Streamline recruitment pipeline', comments: 'Excellent HR process improvements', reviewer: 'Sarah Johnson' },
  { id: 'pr4', employeeId: 'e4', period: '2026-Q2', kpiScore: 65, rating: 3, goals: 'Increase sales by 15%', comments: 'Met baseline targets', reviewer: 'Robert Taylor' },
  { id: 'pr5', employeeId: 'e6', period: '2026-Q2', kpiScore: 85, rating: 4, goals: 'Reduce deployment time by 30%', comments: 'Strong technical contribution', reviewer: 'Sarah Johnson' },
  { id: 'pr6', employeeId: 'e9', period: '2026-Q2', kpiScore: 72, rating: 3, goals: 'Complete API documentation', comments: 'On track, needs more initiative', reviewer: 'Sarah Johnson' },
];

export const awardsDiscipline: AwardDiscipline[] = [
  { id: 'ad1', employeeId: 'e1', type: 'award', title: 'Employee of the Quarter', description: 'Outstanding leadership in platform migration', date: '2026-06-15' },
  { id: 'ad2', employeeId: 'e3', type: 'award', title: 'Best HR Initiative', description: 'Implemented paperless onboarding', date: '2026-05-20' },
  { id: 'ad3', employeeId: 'e4', type: 'discipline', title: 'Late Arrival Warning', description: 'Repeated late arrivals in June', date: '2026-06-28' },
  { id: 'ad4', employeeId: 'e6', type: 'award', title: 'Innovation Award', description: 'Automated CI/CD pipeline', date: '2026-04-10' },
];

export const trainingPrograms: TrainingProgram[] = [
  { id: 't1', title: 'Leadership Excellence Program', description: 'Develop core leadership and management skills', trainer: 'Dr. Amanda Frost', startDate: daysAhead(7), endDate: daysAhead(14), status: 'scheduled', participants: 8 },
  { id: 't2', title: 'Advanced React & TypeScript', description: 'Deep dive into modern React patterns', trainer: 'Sarah Johnson', startDate: daysAgo(2), endDate: daysAhead(5), status: 'ongoing', participants: 6 },
  { id: 't3', title: 'Sales Mastery Workshop', description: 'Advanced negotiation and closing techniques', trainer: 'Robert Taylor', startDate: daysAgo(20), endDate: daysAgo(15), status: 'completed', participants: 12 },
];

export const jobPostings: JobPosting[] = [
  { id: 'j1', title: 'Senior Backend Engineer', department: 'Engineering', description: 'Design and build scalable microservices using Node.js and PostgreSQL', status: 'open', openings: 2, postedDate: daysAgo(10) },
  { id: 'j2', title: 'UX Designer', department: 'Marketing', description: 'Create beautiful and intuitive user experiences for our products', status: 'open', openings: 1, postedDate: daysAgo(5) },
  { id: 'j3', title: 'Sales Representative', department: 'Sales', description: 'Drive revenue growth in the West Coast territory', status: 'open', openings: 3, postedDate: daysAgo(8) },
  { id: 'j4', title: 'Junior Accountant', department: 'Finance', description: 'Support financial operations and reporting', status: 'closed', openings: 1, postedDate: daysAgo(30) },
];

export const candidates: Candidate[] = [
  { id: 'c1', jobId: 'j1', name: 'Alex Morgan', email: 'alex.m@email.com', phone: '+1 555 0101', status: 'interviewed', appliedDate: daysAgo(8) },
  { id: 'c2', jobId: 'j1', name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+1 555 0102', status: 'applied', appliedDate: daysAgo(3) },
  { id: 'c3', jobId: 'j2', name: 'Tom Wilson', email: 'tom.w@email.com', phone: '+1 555 0103', status: 'hired', appliedDate: daysAgo(12) },
  { id: 'c4', jobId: 'j3', name: 'Nina Patel', email: 'nina.p@email.com', phone: '+1 555 0104', status: 'interviewed', appliedDate: daysAgo(6) },
  { id: 'c5', jobId: 'j3', name: 'Carlos Ruiz', email: 'carlos.r@email.com', phone: '+1 555 0105', status: 'rejected', appliedDate: daysAgo(9) },
];

export const promotionRecords: PromotionRecord[] = [
  { id: 'pm1', employeeId: 'e1', date: '2026-01-01', fromPosition: 'Software Engineer', toPosition: 'Senior Software Engineer', fromDepartment: 'Engineering', toDepartment: 'Engineering', type: 'promotion' },
  { id: 'pm2', employeeId: 'e6', date: '2026-01-01', fromPosition: 'Backend Developer', toPosition: 'DevOps Engineer', fromDepartment: 'Engineering', toDepartment: 'Engineering', type: 'migration' },
  { id: 'pm3', employeeId: 'e8', date: '2025-06-01', fromPosition: 'Sales Representative', toPosition: 'Sales Manager', fromDepartment: 'Sales', toDepartment: 'Sales', type: 'promotion' },
];

export const shiftSchedules: ShiftSchedule[] = [
  { id: 'sh1', employeeId: 'e1', shift: 'Morning', startTime: '08:00', endTime: '17:00', days: 'Mon-Fri' },
  { id: 'sh2', employeeId: 'e2', shift: 'Morning', startTime: '09:00', endTime: '18:00', days: 'Mon-Fri' },
  { id: 'sh3', employeeId: 'e4', shift: 'Evening', startTime: '14:00', endTime: '23:00', days: 'Mon-Sat' },
  { id: 'sh4', employeeId: 'e10', shift: 'Night', startTime: '22:00', endTime: '06:00', days: 'Sun-Thu' },
  { id: 'sh5', employeeId: 'e9', shift: 'Flexible', startTime: '08:00', endTime: '17:00', days: 'Mon-Fri' },
];

export const dailyWorkReports: DailyWorkReport[] = [
  { id: 'dw1', employeeId: 'e1', date: todayStr, tasks: 'Completed API refactoring, reviewed 3 PRs, fixed production bug #2341', hours: 8.5, status: 'submitted' },
  { id: 'dw2', employeeId: 'e2', date: todayStr, tasks: 'Built dashboard widget components, wrote unit tests', hours: 8, status: 'reviewed' },
  { id: 'dw3', employeeId: 'e6', date: todayStr, tasks: 'Deployed v2.3 to staging, configured monitoring alerts', hours: 9, status: 'approved' },
  { id: 'dw4', employeeId: 'e9', date: daysAgo(1), tasks: 'Documented REST API endpoints, fixed login bug', hours: 8, status: 'approved' },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'leave', title: 'Leave Approval Needed', message: 'Jessica Brown requested 5 days annual leave', time: '2 min ago', read: false },
  { id: 'n2', type: 'payroll', title: 'Payroll Generated', message: 'July 2026 payroll for 12 employees has been generated', time: '1 hour ago', read: false },
  { id: 'n3', type: 'attendance', title: 'Late Check-in Alert', message: '3 employees checked in late today', time: '3 hours ago', read: false },
  { id: 'n4', type: 'training', title: 'Training Starting Soon', message: 'Leadership Excellence Program starts in 7 days', time: '5 hours ago', read: true },
  { id: 'n5', type: 'system', title: 'System Update', message: 'HRM System v2.4 deployed successfully', time: '1 day ago', read: true },
];

export const benefitsDeductions: BenefitDeduction[] = [
  { id: 'bd1', employeeId: 'e1', type: 'benefit', name: 'Health Insurance', amount: 500, frequency: 'monthly' },
  { id: 'bd2', employeeId: 'e1', type: 'deduction', name: 'PF Contribution', amount: 950, frequency: 'monthly' },
  { id: 'bd3', employeeId: 'e2', type: 'benefit', name: 'Health Insurance', amount: 400, frequency: 'monthly' },
  { id: 'bd4', employeeId: 'e2', type: 'deduction', name: 'Loan Repayment', amount: 200, frequency: 'monthly' },
  { id: 'bd5', employeeId: 'e3', type: 'benefit', name: 'Transport Allowance', amount: 300, frequency: 'monthly' },
];

export const productionSalaries: ProductionSalary[] = [
  { id: 'ps1', employeeId: 'e10', period: '2026-07', pieces: 850, ratePerPiece: 2.5, total: 2125 },
  { id: 'ps2', employeeId: 'e10', period: '2026-06', pieces: 920, ratePerPiece: 2.5, total: 2300 },
  { id: 'ps3', employeeId: 'e4', period: '2026-07', pieces: 320, ratePerPiece: 3.0, total: 960 },
];

export const letters: Letter[] = [
  { id: 'lt1', employeeId: 'e1', type: 'Experience', content: 'This is to certify that Sarah Johnson has been employed with us since March 15, 2021...', date: daysAgo(5), status: 'issued' },
  { id: 'lt2', employeeId: 'e9', type: 'Offer', content: 'We are pleased to offer you the position of Backend Developer...', date: '2023-01-10', status: 'issued' },
  { id: 'lt3', employeeId: 'e4', type: 'Show Cause', content: 'You are required to explain your repeated late arrivals...', date: daysAgo(2), status: 'draft' },
];

export const newsEvents: NewsEvent[] = [
  { id: 'ne1', title: 'Annual Company Picnic', type: 'event', date: daysAhead(15), description: 'Join us for our annual company picnic at Riverside Park. Family and friends welcome!' },
  { id: 'ne2', title: 'New Health Insurance Provider', type: 'news', date: daysAgo(3), description: 'We have switched to BlueCross BlueShield for better coverage. New cards will be distributed next week.' },
  { id: 'ne3', title: 'Q3 All-Hands Meeting', type: 'event', date: daysAhead(7), description: 'Quarterly all-hands meeting covering company performance and roadmap. Virtual and in-person options.' },
  { id: 'ne4', title: 'Promotion Announcements', type: 'news', date: daysAgo(10), description: 'Congratulations to Sarah Johnson and David Martinez on their well-deserved promotions!' },
];

export const dashboardCharts = {
  attendanceTrend: [
    { day: 'Mon', present: 10, late: 2, absent: 0 },
    { day: 'Tue', present: 11, late: 1, absent: 0 },
    { day: 'Wed', present: 9, late: 3, absent: 0 },
    { day: 'Thu', present: 10, late: 1, absent: 1 },
    { day: 'Fri', present: 8, late: 2, absent: 2 },
    { day: 'Sat', present: 6, late: 0, absent: 6 },
    { day: 'Sun', present: 0, late: 0, absent: 12 },
  ],
  payrollSummary: [
    { month: 'Feb', amount: 78000 },
    { month: 'Mar', amount: 82000 },
    { month: 'Apr', amount: 84000 },
    { month: 'May', amount: 86000 },
    { month: 'Jun', amount: 89000 },
    { month: 'Jul', amount: 92000 },
  ],
  departmentDist: [
    { name: 'Engineering', value: 5, color: '#6366f1' },
    { name: 'HR', value: 2, color: '#10b981' },
    { name: 'Sales', value: 2, color: '#f59e0b' },
    { name: 'Marketing', value: 1, color: '#ef4444' },
    { name: 'Finance', value: 1, color: '#0ea5e9' },
    { name: 'Production', value: 1, color: '#8b5cf6' },
  ],
  kpiPerformers: [
    { name: 'Sarah J.', score: 92 },
    { name: 'Emily D.', score: 88 },
    { name: 'David M.', score: 85 },
    { name: 'Michael C.', score: 78 },
    { name: 'Jennifer G.', score: 72 },
  ],
};
