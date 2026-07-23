import {
  LayoutDashboard, ShieldCheck, Settings, FileText, Newspaper,
  UserPlus, Users, ArrowUpCircle, Award, UserCircle,
  ClipboardCheck, CalendarClock, Clock, Timer, Gift, Briefcase,
  Wallet, CreditCard, Banknote, Percent, CheckCircle2, PartyPopper, Factory, PiggyBank,
  CalendarOff, TrendingUp, GraduationCap, Landmark,
  BarChart3, PieChart, Smartphone,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type NavItem = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  short: string;
};

export type NavGroup = {
  category: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    category: 'Executive & Core',
    items: [
      { key: 'dashboard', label: 'BI Dashboard', icon: LayoutDashboard, short: 'Dashboard' },
      { key: 'security', label: 'Security Module (RBAC)', icon: ShieldCheck, short: 'Security' },
      { key: 'hr-setup', label: 'HR Setup', icon: Settings, short: 'HR Setup' },
      { key: 'letters', label: 'Letter Management', icon: FileText, short: 'Letters' },
      { key: 'news', label: 'News & Events', icon: Newspaper, short: 'News' },
    ],
  },
  {
    category: 'Employee Lifecycle',
    items: [
      { key: 'recruitment', label: 'Recruitment Management', icon: UserPlus, short: 'Recruitment' },
      { key: 'employees', label: 'Employee Directory', icon: Users, short: 'Directory' },
      { key: 'promotion', label: 'Promotion & Migration', icon: ArrowUpCircle, short: 'Promotion' },
      { key: 'awards', label: 'Award & Discipline', icon: Award, short: 'Awards' },
      { key: 'ess', label: 'Employee Self-service', icon: UserCircle, short: 'ESS' },
    ],
  },
  {
    category: 'Time & Attendance',
    items: [
      { key: 'attendance', label: 'Attendance Management', icon: ClipboardCheck, short: 'Attendance' },
      { key: 'schedule', label: 'Schedule / Shifting', icon: CalendarClock, short: 'Schedule' },
      { key: 'short-leave', label: 'Short Leave Management', icon: Clock, short: 'Short Leave' },
      { key: 'late', label: 'Late Management', icon: Timer, short: 'Late Mgmt' },
      { key: 'ot-holiday', label: 'OT & Holiday Allowance', icon: Gift, short: 'OT & Holiday' },
      { key: 'daily-work', label: 'Daily Work Report', icon: Briefcase, short: 'Work Report' },
    ],
  },
  {
    category: 'Payroll & Loans',
    items: [
      { key: 'salary', label: 'Salary Management', icon: Wallet, short: 'Salary' },
      { key: 'payroll', label: 'Payroll Disbursement', icon: CreditCard, short: 'Payroll' },
      { key: 'loans', label: 'HR Loans Management', icon: Banknote, short: 'Loans' },
      { key: 'increment', label: 'Increment Management', icon: Percent, short: 'Increment' },
      { key: 'attendance-bonus', label: 'Attendance Bonus', icon: CheckCircle2, short: 'Att. Bonus' },
      { key: 'festival-bonus', label: 'Festival Bonus', icon: PartyPopper, short: 'Festival Bonus' },
      { key: 'production-salary', label: 'Production Salary', icon: Factory, short: 'Production' },
      { key: 'benefits', label: 'Benefits & Deductions', icon: PiggyBank, short: 'Benefits' },
    ],
  },
  {
    category: 'Benefits & Evaluation',
    items: [
      { key: 'leave', label: 'Leave Management', icon: CalendarOff, short: 'Leave' },
      { key: 'performance', label: 'Performance (KPI)', icon: TrendingUp, short: 'KPI' },
      { key: 'training', label: 'Training Management', icon: GraduationCap, short: 'Training' },
      { key: 'provident-fund', label: 'Provident Fund & GF', icon: Landmark, short: 'PF & GF' },
    ],
  },
  {
    category: 'Reports & Mobile',
    items: [
      { key: 'employment-report', label: 'Employment Report', icon: BarChart3, short: 'Emp. Report' },
      { key: 'hr-report', label: 'HR Report', icon: PieChart, short: 'HR Report' },
      { key: 'salary-report', label: 'Salary Report', icon: BarChart3, short: 'Salary Report' },
      { key: 'mobile-app', label: 'HRM Mobile App', icon: Smartphone, short: 'Mobile App' },
    ],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);

export function findNavItem(key: string): NavItem | undefined {
  return allNavItems.find((i) => i.key === key);
}
