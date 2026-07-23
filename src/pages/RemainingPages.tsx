import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GenericModulePage, useEmpName } from '@/components/GenericModulePage';
import { Badge, Avatar, PageHeader, Card, EmptyState, StatCard, Table, Modal, FormField } from '@/components/ui';
import { Settings, FileText, Newspaper, ArrowUpCircle, CalendarClock, Clock, Timer, Gift, Briefcase, Wallet, Banknote, Percent, CheckCircle2, PartyPopper, Factory, PiggyBank, Landmark, BarChart3, PieChart, Smartphone, Plus, Pencil, Trash2 } from 'lucide-react';

export function HRSetupPage() {
  const { branches, employees } = useStore();
  return (
    <GenericModulePage title="HR Setup" subtitle="Configure organizational structure and HR policies" icon={Settings}
      stats={[{ label: 'Branches', value: branches.length }, { label: 'Departments', value: new Set(employees.map((e) => e.department)).size }, { label: 'Total Employees', value: employees.length }, { label: 'Roles Defined', value: 4 }]}
      columns={[
        { key: 'name', label: 'Branch Name' },
        { key: 'location', label: 'Location' },
        { key: 'employeeCount', label: 'Employees', align: 'right' as const },
      ]}
      data={branches} emptyMessage="No branches configured." />
  );
}

export function LettersPage() {
  const { letters } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Letter Management" subtitle="Generate and manage employment letters" icon={FileText}
      stats={[{ label: 'Total Letters', value: letters.length }, { label: 'Issued', value: letters.filter((l) => l.status === 'issued').length, color: 'emerald' }, { label: 'Drafts', value: letters.filter((l) => l.status === 'draft').length, color: 'amber' }]}
      columns={[
        { key: 'type', label: 'Type', render: (r: any) => <Badge color="indigo">{r.type}</Badge> },
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status', render: (r: any) => <Badge color={r.status === 'issued' ? 'emerald' : 'amber'}>{r.status}</Badge> },
      ]}
      data={letters} emptyMessage="No letters generated." />
  );
}

export function NewsPage() {
  const { newsEvents } = useStore();
  return (
    <GenericModulePage title="News & Events" subtitle="Company announcements and upcoming events" icon={Newspaper}
      stats={[{ label: 'News Items', value: newsEvents.filter((n) => n.type === 'news').length }, { label: 'Events', value: newsEvents.filter((n) => n.type === 'event').length, color: 'sky' }]}
      columns={[
        { key: 'title', label: 'Title', render: (r: any) => <span className="text-slate-700 font-medium">{r.title}</span> },
        { key: 'type', label: 'Type', render: (r: any) => <Badge color={r.type === 'news' ? 'indigo' : 'sky'}>{r.type}</Badge> },
        { key: 'date', label: 'Date' },
        { key: 'description', label: 'Description', render: (r: any) => <span className="text-xs text-slate-500 truncate block max-w-[300px]">{r.description}</span> },
      ]}
      data={newsEvents} emptyMessage="No news or events." />
  );
}

export function PromotionPage() {
  const { promotionRecords, employees, addPromotion, updatePromotion, deletePromotion } = useStore();
  const empName = useEmpName();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    employeeId: '', type: 'promotion' as 'promotion' | 'upgrade' | 'migration',
    fromPosition: '', toPosition: '', fromDepartment: '', toDepartment: '', date: new Date().toISOString().slice(0, 10),
  });
  const [search, setSearch] = useState('');

  const typeColors: Record<string, string> = { promotion: 'emerald', upgrade: 'indigo', migration: 'sky' };

  const filtered = promotionRecords.filter((r) => {
    if (!search) return true;
    const name = empName(r.employeeId).toLowerCase();
    return name.includes(search.toLowerCase()) || r.type.includes(search.toLowerCase());
  });

  function openAdd() {
    setEditId(null);
    setForm({ employeeId: '', type: 'promotion', fromPosition: '', toPosition: '', fromDepartment: '', toDepartment: '', date: new Date().toISOString().slice(0, 10) });
    setShowForm(true);
  }

  function openEdit(r: typeof promotionRecords[0]) {
    setEditId(r.id);
    setForm({ employeeId: r.employeeId, type: r.type, fromPosition: r.fromPosition, toPosition: r.toPosition, fromDepartment: r.fromDepartment, toDepartment: r.toDepartment, date: r.date });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId || !form.fromPosition || !form.toPosition || !form.date) return;
    if (editId) {
      updatePromotion(editId, form);
    } else {
      addPromotion({ id: `pm${Date.now()}`, ...form });
    }
    setForm({ employeeId: '', type: 'promotion', fromPosition: '', toPosition: '', fromDepartment: '', toDepartment: '', date: new Date().toISOString().slice(0, 10) });
    setEditId(null);
    setShowForm(false);
  }

  return (
    <div>
      <PageHeader title="Promotion & Migration System" subtitle="Track employee promotions, upgrades, and department migrations"
        action={<button onClick={openAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add Record</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Promotions" value={promotionRecords.filter((p) => p.type === 'promotion').length} icon={ArrowUpCircle} color="emerald" />
        <StatCard label="Upgrades" value={promotionRecords.filter((p) => p.type === 'upgrade').length} icon={ArrowUpCircle} color="indigo" />
        <StatCard label="Migrations" value={promotionRecords.filter((p) => p.type === 'migration').length} icon={ArrowUpCircle} color="sky" />
        <StatCard label="Total Records" value={promotionRecords.length} icon={ArrowUpCircle} color="amber" />
      </div>

      <Card className="p-4 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by employee or type..." className="input" />
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState message="No promotion or migration records." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table headers={['Employee', 'Type', 'From', 'To', 'Date', 'Actions']}>
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3 text-slate-700 font-medium">{empName(r.employeeId)}</td>
                <td className="px-5 py-3"><Badge color={typeColors[r.type]}>{r.type}</Badge></td>
                <td className="px-5 py-3 text-slate-600">{r.fromPosition}{r.fromDepartment && r.fromDepartment !== r.toDepartment ? ` (${r.fromDepartment})` : ''}</td>
                <td className="px-5 py-3 text-slate-600">{r.toPosition}{r.toDepartment && r.fromDepartment !== r.toDepartment ? ` (${r.toDepartment})` : ''}</td>
                <td className="px-5 py-3 text-slate-600">{r.date}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(r)} className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-500">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deletePromotion(r.id)} className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {showForm && (
        <Modal title={editId ? 'Edit Promotion / Migration Record' : 'Add Promotion / Migration Record'} onClose={() => { setShowForm(false); setEditId(null); }} size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Employee Name">
              <select value={form.employeeId} onChange={(e) => {
                const emp = employees.find((x) => x.id === e.target.value);
                setForm({ ...form, employeeId: e.target.value, fromPosition: emp?.position ?? '', fromDepartment: emp?.department ?? '' });
              }} className={`input ${form.employeeId ? 'text-slate-800' : 'text-slate-400'}`}>
                <option value="">Select Employee</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.position}</option>)}
              </select>
            </FormField>
            <FormField label="Type">
              <div className="grid grid-cols-3 gap-2">
                {(['promotion', 'upgrade', 'migration'] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border capitalize transition-all ${form.type === t ? `bg-${typeColors[t]}-50 border-${typeColors[t]}-200 text-${typeColors[t]}-700` : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="From (Position)"><input required value={form.fromPosition} onChange={(e) => setForm({ ...form, fromPosition: e.target.value })} className="input" placeholder="e.g. Junior Officer" /></FormField>
              <FormField label="To (Position)"><input required value={form.toPosition} onChange={(e) => setForm({ ...form, toPosition: e.target.value })} className="input" placeholder="e.g. Senior Officer" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="From Department"><input value={form.fromDepartment} onChange={(e) => setForm({ ...form, fromDepartment: e.target.value })} className="input" placeholder="e.g. Production" /></FormField>
              <FormField label="To Department"><input value={form.toDepartment} onChange={(e) => setForm({ ...form, toDepartment: e.target.value })} className="input" placeholder="e.g. Quality" /></FormField>
            </div>
            <FormField label="Date Entry"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" /></FormField>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function SchedulePage() {
  const { shiftSchedules } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Schedule / Shifting Management" subtitle="Manage employee shift schedules" icon={CalendarClock}
      stats={[{ label: 'Morning Shift', value: shiftSchedules.filter((s) => s.shift === 'Morning').length, color: 'amber' }, { label: 'Evening Shift', value: shiftSchedules.filter((s) => s.shift === 'Evening').length, color: 'sky' }, { label: 'Night Shift', value: shiftSchedules.filter((s) => s.shift === 'Night').length, color: 'violet' }, { label: 'Flexible', value: shiftSchedules.filter((s) => s.shift === 'Flexible').length, color: 'emerald' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'shift', label: 'Shift', render: (r: any) => <Badge color="indigo">{r.shift}</Badge> },
        { key: 'time', label: 'Time', render: (r: any) => `${r.startTime} - ${r.endTime}` },
        { key: 'days', label: 'Days' },
      ]}
      data={shiftSchedules} emptyMessage="No shift schedules defined." />
  );
}

export function ShortLeavePage() {
  const { shortLeaves } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Short Leave Management" subtitle="Track and approve short leave requests" icon={Clock}
      stats={[{ label: 'Pending', value: shortLeaves.filter((s) => s.status === 'pending').length, color: 'amber' }, { label: 'Approved', value: shortLeaves.filter((s) => s.status === 'approved').length, color: 'emerald' }, { label: 'Rejected', value: shortLeaves.filter((s) => s.status === 'rejected').length, color: 'rose' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time', render: (r: any) => `${r.fromTime} - ${r.toTime}` },
        { key: 'reason', label: 'Reason' },
        { key: 'status', label: 'Status', render: (r: any) => <Badge color={r.status === 'approved' ? 'emerald' : r.status === 'pending' ? 'amber' : 'rose'}>{r.status}</Badge> },
      ]}
      data={shortLeaves} emptyMessage="No short leave requests." />
  );
}

export function LateManagementPage() {
  const { attendance } = useStore();
  const empName = useEmpName();
  const lateRecords = attendance.filter((a) => a.status === 'late');
  return (
    <GenericModulePage title="Late Management" subtitle="Monitor late arrivals and enforce punctuality rules" icon={Timer}
      stats={[{ label: 'Late Today', value: lateRecords.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length, color: 'amber' }, { label: 'Total Late Records', value: lateRecords.length, color: 'rose' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'date', label: 'Date' },
        { key: 'checkIn', label: 'Check In' },
        { key: 'status', label: 'Status', render: (r: any) => <Badge color="amber">Late</Badge> },
      ]}
      data={lateRecords} emptyMessage="No late arrivals recorded." />
  );
}

export function OTHolidayPage() {
  const { attendance } = useStore();
  const empName = useEmpName();
  const otRecords = attendance.filter((a) => a.overtimeHours > 0);
  return (
    <GenericModulePage title="OT & Holiday Allowance" subtitle="Track overtime hours and holiday allowances" icon={Gift}
      stats={[{ label: 'Total OT Hours', value: otRecords.reduce((s, a) => s + a.overtimeHours, 0), color: 'indigo' }, { label: 'Employees with OT', value: otRecords.length, color: 'emerald' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'date', label: 'Date' },
        { key: 'overtimeHours', label: 'OT Hours', align: 'right' as const, render: (r: any) => `${r.overtimeHours}h` },
        { key: 'pay', label: 'OT Pay', align: 'right' as const, render: (r: any) => `${(r.overtimeHours * 25).toFixed(0)} tk` },
      ]}
      data={otRecords} emptyMessage="No overtime records." />
  );
}

export function DailyWorkPage() {
  const { dailyWorkReports } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Employee Daily Work Report" subtitle="Review daily work submissions from employees" icon={Briefcase}
      stats={[{ label: 'Submitted', value: dailyWorkReports.filter((r) => r.status === 'submitted').length, color: 'amber' }, { label: 'Reviewed', value: dailyWorkReports.filter((r) => r.status === 'reviewed').length, color: 'sky' }, { label: 'Approved', value: dailyWorkReports.filter((r) => r.status === 'approved').length, color: 'emerald' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'date', label: 'Date' },
        { key: 'tasks', label: 'Tasks', render: (r: any) => <span className="text-xs text-slate-500 truncate block max-w-[250px]">{r.tasks}</span> },
        { key: 'hours', label: 'Hours', align: 'right' as const, render: (r: any) => `${r.hours}h` },
        { key: 'status', label: 'Status', render: (r: any) => <Badge color={r.status === 'approved' ? 'emerald' : r.status === 'reviewed' ? 'sky' : 'amber'}>{r.status}</Badge> },
      ]}
      data={dailyWorkReports} emptyMessage="No work reports submitted." />
  );
}

export function SalaryManagementPage() {
  const { employees } = useStore();
  return (
    <GenericModulePage title="Salary Management" subtitle="Manage employee salary structures" icon={Wallet}
      stats={[{ label: 'Total Monthly', value: `${Math.round(employees.reduce((s, e) => s + e.salary, 0) / 12).toLocaleString()} tk`, color: 'indigo' }, { label: 'Avg Salary', value: `${Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length / 12).toLocaleString()} tk`, color: 'sky' }, { label: 'Highest', value: `${Math.round(Math.max(...employees.map((e) => e.salary)) / 12).toLocaleString()} tk`, color: 'emerald' }]}
      columns={[
        { key: 'name', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{r.name}</span> },
        { key: 'department', label: 'Department' },
        { key: 'position', label: 'Position' },
        { key: 'salary', label: 'Annual', align: 'right' as const, render: (r: any) => `${r.salary.toLocaleString()} tk` },
        { key: 'monthly', label: 'Monthly', align: 'right' as const, render: (r: any) => `${Math.round(r.salary / 12).toLocaleString()} tk` },
      ]}
      data={employees} emptyMessage="No employees." />
  );
}

export function LoansPage() {
  const { loanRecords } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="HR Loans Management" subtitle="Track employee loans and repayment schedules" icon={Banknote}
      stats={[{ label: 'Active Loans', value: loanRecords.filter((l) => l.status === 'active').length, color: 'amber' }, { label: 'Pending', value: loanRecords.filter((l) => l.status === 'pending').length, color: 'sky' }, { label: 'Cleared', value: loanRecords.filter((l) => l.status === 'cleared').length, color: 'emerald' }, { label: 'Outstanding', value: `${loanRecords.reduce((s, l) => s + l.remaining, 0).toLocaleString()} tk`, color: 'rose' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'amount', label: 'Amount', align: 'right' as const, render: (r: any) => `${r.amount.toLocaleString()} tk` },
        { key: 'reason', label: 'Reason' },
        { key: 'monthlyDeduction', label: 'Monthly Ded', align: 'right' as const, render: (r: any) => `${r.monthlyDeduction} tk` },
        { key: 'remaining', label: 'Remaining', align: 'right' as const, render: (r: any) => `${r.remaining.toLocaleString()} tk` },
        { key: 'status', label: 'Status', render: (r: any) => <Badge color={r.status === 'active' ? 'amber' : r.status === 'cleared' ? 'emerald' : 'sky'}>{r.status}</Badge> },
      ]}
      data={loanRecords} emptyMessage="No loan records." />
  );
}

export function IncrementPage() {
  const { incrementRecords } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Increment Management" subtitle="Track salary increments and adjustments" icon={Percent}
      stats={[{ label: 'Total Increments', value: incrementRecords.length }, { label: 'Avg Increase', value: `${(incrementRecords.reduce((s, i) => s + i.percentage, 0) / incrementRecords.length).toFixed(1)}%`, color: 'emerald' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'date', label: 'Date' },
        { key: 'oldSalary', label: 'Old Salary', align: 'right' as const, render: (r: any) => `${r.oldSalary.toLocaleString()} tk` },
        { key: 'newSalary', label: 'New Salary', align: 'right' as const, render: (r: any) => `${r.newSalary.toLocaleString()} tk` },
        { key: 'percentage', label: 'Increase', align: 'right' as const, render: (r: any) => <Badge color="emerald">+{r.percentage.toFixed(1)}%</Badge> },
        { key: 'reason', label: 'Reason' },
      ]}
      data={incrementRecords} emptyMessage="No increment records." />
  );
}

export function AttendanceBonusPage() {
  const { employees } = useStore();
  const perfectAttendance = employees.filter((e) => e.status === 'active');
  return (
    <GenericModulePage title="Attendance Bonus" subtitle="Track attendance-based bonus eligibility" icon={CheckCircle2}
      stats={[{ label: 'Eligible', value: perfectAttendance.length, color: 'emerald' }, { label: 'Bonus Rate', value: '100 tk/mo', color: 'indigo' }]}
      columns={[
        { key: 'name', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{r.name}</span> },
        { key: 'department', label: 'Department' },
        { key: 'status', label: 'Status', render: (r: any) => <Badge color={r.status === 'active' ? 'emerald' : 'amber'}>{r.status}</Badge> },
        { key: 'bonus', label: 'Monthly Bonus', align: 'right' as const, render: () => <Badge color="emerald">100 tk</Badge> },
      ]}
      data={perfectAttendance} emptyMessage="No eligible employees." />
  );
}

export function FestivalBonusPage() {
  const { employees } = useStore();
  return (
    <GenericModulePage title="Festival Bonus" subtitle="Manage festival bonus disbursements" icon={PartyPopper}
      stats={[{ label: 'Total Employees', value: employees.length }, { label: 'Budget', value: `${(employees.length * 500).toLocaleString()} tk`, color: 'indigo' }]}
      columns={[
        { key: 'name', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{r.name}</span> },
        { key: 'department', label: 'Department' },
        { key: 'salary', label: 'Base Salary', align: 'right' as const, render: (r: any) => `${r.salary.toLocaleString()} tk` },
        { key: 'bonus', label: 'Festival Bonus', align: 'right' as const, render: () => <Badge color="indigo">500 tk</Badge> },
      ]}
      data={employees} emptyMessage="No employees." />
  );
}

export function ProductionSalaryPage() {
  const { productionSalaries } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Production Salary Management" subtitle="Piece-rate based salary calculations" icon={Factory}
      stats={[{ label: 'Total Pieces', value: productionSalaries.reduce((s, p) => s + p.pieces, 0), color: 'indigo' }, { label: 'Total Paid', value: `${productionSalaries.reduce((s, p) => s + p.total, 0).toLocaleString()} tk`, color: 'emerald' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'period', label: 'Period' },
        { key: 'pieces', label: 'Pieces', align: 'right' as const },
        { key: 'ratePerPiece', label: 'Rate/Piece', align: 'right' as const, render: (r: any) => `${r.ratePerPiece} tk` },
        { key: 'total', label: 'Total', align: 'right' as const, render: (r: any) => `${r.total.toLocaleString()} tk` },
      ]}
      data={productionSalaries} emptyMessage="No production salary records." />
  );
}

export function BenefitsPage() {
  const { benefitsDeductions } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Employee Benefit & Deduction Management" subtitle="Track benefits and deductions per employee" icon={PiggyBank}
      stats={[{ label: 'Benefits', value: benefitsDeductions.filter((b) => b.type === 'benefit').length, color: 'emerald' }, { label: 'Deductions', value: benefitsDeductions.filter((b) => b.type === 'deduction').length, color: 'rose' }]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'type', label: 'Type', render: (r: any) => <Badge color={r.type === 'benefit' ? 'emerald' : 'rose'}>{r.type}</Badge> },
        { key: 'name', label: 'Name' },
        { key: 'amount', label: 'Amount', align: 'right' as const, render: (r: any) => `${r.amount} tk` },
        { key: 'frequency', label: 'Frequency' },
      ]}
      data={benefitsDeductions} emptyMessage="No benefits or deductions configured." />
  );
}

export function ProvidentFundPage() {
  const { employees, payrollRecords } = useStore();
  const pfData = employees.map((e) => {
    const pf = payrollRecords.filter((p) => p.employeeId === e.id).reduce((s, p) => s + p.pfContribution, 0);
    const gf = payrollRecords.filter((p) => p.employeeId === e.id).reduce((s, p) => s + p.gfContribution, 0);
    return { id: e.id, name: e.name, department: e.department, pf, gf, total: pf + gf };
  });
  return (
    <GenericModulePage title="Provident Fund & GF (Gratuity Fund)" subtitle="Track PF and GF contributions" icon={Landmark}
      stats={[{ label: 'Total PF', value: `${pfData.reduce((s, p) => s + p.pf, 0).toLocaleString()} tk`, color: 'indigo' }, { label: 'Total GF', value: `${pfData.reduce((s, p) => s + p.gf, 0).toLocaleString()} tk`, color: 'sky' }, { label: 'Combined', value: `${pfData.reduce((s, p) => s + p.total, 0).toLocaleString()} tk`, color: 'emerald' }]}
      columns={[
        { key: 'name', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{r.name}</span> },
        { key: 'department', label: 'Department' },
        { key: 'pf', label: 'PF Contribution', align: 'right' as const, render: (r: any) => `${r.pf.toLocaleString()} tk` },
        { key: 'gf', label: 'GF Contribution', align: 'right' as const, render: (r: any) => `${r.gf.toLocaleString()} tk` },
        { key: 'total', label: 'Total', align: 'right' as const, render: (r: any) => <Badge color="indigo">{r.total.toLocaleString()} tk</Badge> },
      ]}
      data={pfData} emptyMessage="No PF/GF records." />
  );
}

export function EmploymentReportPage() {
  const { employees, attendance, leaveRequests, performanceReviews, trainingPrograms, awardsDiscipline } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const deptDist = Object.entries(employees.reduce((acc, e) => { acc[e.department] = (acc[e.department] ?? 0) + 1; return acc; }, {} as Record<string, number>)).map(([department, count]) => ({ id: department, department, count }));
  return (
    <GenericModulePage title="Employment Report" subtitle="Comprehensive employment analytics" icon={BarChart3}
      stats={[
        { label: 'Total Employees', value: employees.length },
        { label: 'Present Today', value: attendance.filter((a) => a.date === today && a.status !== 'absent').length, color: 'emerald' },
        { label: 'Pending Leaves', value: leaveRequests.filter((l) => l.status === 'pending').length, color: 'amber' },
        { label: 'Avg KPI', value: Math.round(performanceReviews.reduce((s, p) => s + p.kpiScore, 0) / performanceReviews.length || 0), color: 'sky' },
      ]}
      columns={[
        { key: 'department', label: 'Department' },
        { key: 'count', label: 'Headcount', align: 'right' as const },
      ]}
      data={deptDist} emptyMessage="No data available." />
  );
}

export function HRReportPage() {
  const { employees, leaveRequests, performanceReviews, trainingPrograms, jobPostings, candidates } = useStore();
  return (
    <GenericModulePage title="HR Report" subtitle="HR operations summary and metrics" icon={PieChart}
      stats={[
        { label: 'Open Positions', value: jobPostings.filter((j) => j.status === 'open').length, color: 'indigo' },
        { label: 'Candidates', value: candidates.length, color: 'sky' },
        { label: 'Training Programs', value: trainingPrograms.length, color: 'violet' },
        { label: 'Leave Approvals', value: leaveRequests.filter((l) => l.status === 'pending').length, color: 'amber' },
      ]}
      columns={[
        { key: 'name', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{r.name}</span> },
        { key: 'department', label: 'Department' },
        { key: 'leaveBalance', label: 'Leave Balance', align: 'right' as const, render: (r: any) => `${r.leaveBalance} days` },
        { key: 'role', label: 'Role', render: (r: any) => <Badge color="indigo">{r.role}</Badge> },
      ]}
      data={employees} emptyMessage="No data." />
  );
}

export function SalaryReportPage() {
  const { payrollRecords } = useStore();
  const empName = useEmpName();
  return (
    <GenericModulePage title="Salary Report" subtitle="Payroll disbursement summary and breakdown" icon={BarChart3}
      stats={[
        { label: 'Total Net Pay', value: `${payrollRecords.reduce((s, p) => s + p.netPay, 0).toLocaleString()} tk`, color: 'indigo' },
        { label: 'Total Basic', value: `${payrollRecords.reduce((s, p) => s + p.basicPay, 0).toLocaleString()} tk`, color: 'sky' },
        { label: 'Total Deductions', value: `${payrollRecords.reduce((s, p) => s + p.pfContribution + p.gfContribution + p.taxDeduction + p.loanDeduction, 0).toLocaleString()} tk`, color: 'rose' },
        { label: 'Total Bonus', value: `${payrollRecords.reduce((s, p) => s + p.festivalBonus + p.attendanceBonus, 0).toLocaleString()} tk`, color: 'emerald' },
      ]}
      columns={[
        { key: 'employee', label: 'Employee', render: (r: any) => <span className="text-slate-700 font-medium">{empName(r.employeeId)}</span> },
        { key: 'period', label: 'Period' },
        { key: 'basicPay', label: 'Basic', align: 'right' as const, render: (r: any) => `${r.basicPay.toLocaleString()} tk` },
        { key: 'netPay', label: 'Net Pay', align: 'right' as const, render: (r: any) => `${r.netPay.toLocaleString()} tk` },
        { key: 'status', label: 'Status', render: (r: any) => <Badge color={r.status === 'paid' ? 'emerald' : 'amber'}>{r.status}</Badge> },
      ]}
      data={payrollRecords} emptyMessage="No payroll data." />
  );
}

export function MobileAppPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">HRM Mobile App</h1>
        <p className="text-slate-500 text-sm mt-0.5">PWA configuration and mobile app preview</p>
      </div>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="w-64 h-[500px] rounded-[2.5rem] bg-slate-900 border-4 border-slate-800 p-4 shadow-2xl">
            <div className="w-24 h-5 bg-slate-800 rounded-full mx-auto mb-4" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white text-sm font-semibold px-2"><div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center"><span className="text-xs font-bold">HR</span></div>Smart HRM</div>
              <div className="bg-slate-800 rounded-xl p-3 space-y-2">
                {['Dashboard', 'My Attendance', 'Apply Leave', 'Salary Slips', 'Work Report'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-300 text-xs py-1.5 px-2 rounded-lg hover:bg-slate-700"><div className="h-2 w-2 rounded-full bg-indigo-500" />{item}</div>
                ))}
              </div>
              <div className="bg-slate-800 rounded-xl p-3"><p className="text-slate-400 text-[10px] mb-1">Today's Status</p><div className="flex items-center justify-between"><span className="text-emerald-400 text-xs font-medium">Present</span><span className="text-slate-500 text-[10px]">08:45 AM</span></div></div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-slate-700">PWA Enabled</p>
          <p className="text-xs text-slate-400 mt-1">Installable on iOS & Android · Offline support · Push notifications</p>
        </div>
      </div>
    </div>
  );
}
