import {
  Users, CalendarCheck, CalendarOff, Wallet, TrendingUp, Award, GraduationCap,
  ArrowUpRight, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { dashboardCharts } from '@/data/mockData';
import { PageHeader, Card, StatCard, Avatar, Badge } from '@/components/ui';
import { formatCurrency } from '@/components/ui';

export default function DashboardPage() {
  const { employees, attendance, leaveRequests, payrollRecords, performanceReviews, trainingPrograms, awardsDiscipline } = useStore();

  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendance.filter((a) => a.date === today);
  const present = todayAttendance.filter((a) => a.status === 'present').length;
  const late = todayAttendance.filter((a) => a.status === 'late').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending').length;
  const totalPayroll = payrollRecords.reduce((s, p) => s + p.netPay, 0);
  const topPerformers = [...performanceReviews].sort((a, b) => b.kpiScore - a.kpiScore).slice(0, 5);
  const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? 'Unknown';

  return (
    <div>
      <PageHeader title="Business Intelligence Dashboard" subtitle="Real-time HR & payroll analytics overview" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Employees" value={employees.length} icon={Users} color="indigo" />
        <StatCard label="Present Today" value={present} icon={CalendarCheck} color="emerald" />
        <StatCard label="Late Today" value={late} icon={Clock} color="amber" />
        <StatCard label="Pending Leaves" value={pendingLeaves} icon={CalendarOff} color="rose" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Monthly Payroll" value={formatCurrency(totalPayroll)} icon={Wallet} color="indigo" />
        <StatCard label="Avg KPI Score" value={Math.round(performanceReviews.reduce((s, p) => s + p.kpiScore, 0) / performanceReviews.length || 0)} icon={TrendingUp} color="sky" />
        <StatCard label="Total Awards" value={awardsDiscipline.filter((a) => a.type === 'award').length} icon={Award} color="amber" />
        <StatCard label="Active Training" value={trainingPrograms.filter((t) => t.status === 'ongoing' || t.status === 'scheduled').length} icon={GraduationCap} color="violet" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dashboardCharts.attendanceTrend}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} fill="url(#presentGrad)" />
              <Area type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} fill="url(#lateGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Payroll Summary</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dashboardCharts.payrollSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k tk`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dashboardCharts.departmentDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {dashboardCharts.departmentDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">KPI Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`text-xs font-bold ${i === 0 ? 'text-amber-500' : 'text-slate-400'}`}>#{i + 1}</span>
                <Avatar name={empName(p.employeeId)} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{empName(p.employeeId)}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full ${p.kpiScore >= 90 ? 'bg-emerald-500' : p.kpiScore >= 75 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${p.kpiScore}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700">{p.kpiScore}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Pending Leave Approvals</h3>
          <div className="space-y-3">
            {leaveRequests.filter((l) => l.status === 'pending').map((l) => (
              <div key={l.id} className="flex items-center gap-3 pb-3 border-b border-slate-50 last:border-0">
                <Avatar name={empName(l.employeeId)} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{empName(l.employeeId)}</p>
                  <p className="text-xs text-slate-400">{l.type} · {l.days} day(s)</p>
                </div>
                <Badge color="amber">Pending</Badge>
              </div>
            ))}
            {leaveRequests.filter((l) => l.status === 'pending').length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No pending approvals</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
