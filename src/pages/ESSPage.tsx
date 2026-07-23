import { useState } from 'react';
import { UserCircle, FileText, CalendarClock, Briefcase, Download, Plus, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar, Modal, FormField, StatCard, formatCurrency } from '@/components/ui';
import type { DailyWorkReport } from '@/types';

export default function ESSPage() {
  const { employees, payrollRecords, shiftSchedules, dailyWorkReports, leaveRequests, addLeave, addWorkReport } = useStore();
  const [selectedEmp, setSelectedEmp] = useState(employees[0]?.id ?? '');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Annual', startDate: '', endDate: '', reason: '' });
  const [reportForm, setReportForm] = useState({ tasks: '', hours: '8' });

  const emp = employees.find((e) => e.id === selectedEmp);
  if (!emp) return null;

  const myPayroll = payrollRecords.filter((p) => p.employeeId === selectedEmp);
  const myShift = shiftSchedules.find((s) => s.employeeId === selectedEmp);
  const myReports = dailyWorkReports.filter((r) => r.employeeId === selectedEmp);
  const myLeaves = leaveRequests.filter((l) => l.employeeId === selectedEmp);

  return (
    <div>
      <PageHeader title="Employee Self-Service (ESS)" subtitle="Personal HR portal for leaves, payslips, shifts, and work reports" />

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={emp.name} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-slate-800">{emp.name}</p>
            <p className="text-sm text-slate-500">{emp.position} · {emp.department}</p>
          </div>
          <select value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)} className="input max-w-xs">
            {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Leave Balance" value={`${emp.leaveBalance} days`} icon={CalendarClock} color="indigo" />
        <StatCard label="Monthly Salary" value={formatCurrency(Math.round(emp.salary / 12))} icon={FileText} color="emerald" />
        <StatCard label="My Shift" value={myShift?.shift ?? 'Not assigned'} icon={CalendarClock} color="amber" />
        <StatCard label="Reports Filed" value={myReports.length} icon={Briefcase} color="sky" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Salary Slips */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">My Salary Slips</h3>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          {myPayroll.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No salary slips available</p>
          ) : (
            <div className="space-y-3">
              {myPayroll.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{p.period}</p>
                    <p className="text-xs text-slate-400">Net: {formatCurrency(p.netPay)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={p.status === 'paid' ? 'emerald' : 'amber'}>{p.status}</Badge>
                    <button onClick={() => window.print()} className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><Download className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* My Leave Requests */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">My Leave Requests</h3>
            <button onClick={() => setShowLeaveModal(true)} className="btn-primary text-xs px-3 py-1.5"><Plus className="h-3.5 w-3.5" /> Request</button>
          </div>
          {myLeaves.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No leave requests</p>
          ) : (
            <div className="space-y-3">
              {myLeaves.map((l) => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{l.type} · {l.days} day(s)</p>
                    <p className="text-xs text-slate-400">{l.startDate} → {l.endDate}</p>
                  </div>
                  <Badge color={l.status === 'approved' ? 'emerald' : l.status === 'pending' ? 'amber' : 'rose'}>{l.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* My Shift Schedule */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">My Shift Schedule</h3>
            <CalendarClock className="h-4 w-4 text-slate-400" />
          </div>
          {myShift ? (
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3 mb-3">
                <Badge color="indigo">{myShift.shift}</Badge>
                <span className="text-sm text-slate-600">{myShift.days}</span>
              </div>
              <p className="text-sm text-slate-600">{myShift.startTime} - {myShift.endTime}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No shift assigned</p>
          )}
        </Card>

        {/* My Work Reports */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">My Work Reports</h3>
            <button onClick={() => setShowReportModal(true)} className="btn-primary text-xs px-3 py-1.5"><Plus className="h-3.5 w-3.5" /> Submit</button>
          </div>
          {myReports.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No work reports submitted</p>
          ) : (
            <div className="space-y-3">
              {myReports.map((r) => (
                <div key={r.id} className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-700">{r.date}</p>
                    <Badge color={r.status === 'approved' ? 'emerald' : r.status === 'reviewed' ? 'sky' : 'amber'}>{r.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{r.tasks}</p>
                  <p className="text-xs text-slate-400 mt-1">{r.hours}h</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {showLeaveModal && (
        <Modal title="Request Leave" onClose={() => setShowLeaveModal(false)}>
          <form onSubmit={(e) => {
            e.preventDefault();
            const days = Math.ceil((new Date(leaveForm.endDate).getTime() - new Date(leaveForm.startDate).getTime()) / 86400000) + 1;
            addLeave({ id: `l${Date.now()}`, employeeId: selectedEmp, type: leaveForm.type as any, startDate: leaveForm.startDate, endDate: leaveForm.endDate, days, reason: leaveForm.reason, status: 'pending', appliedDate: new Date().toISOString().slice(0, 10) });
            setShowLeaveModal(false);
            setLeaveForm({ type: 'Annual', startDate: '', endDate: '', reason: '' });
          }} className="space-y-4">
            <FormField label="Leave Type"><select value={leaveForm.type} onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })} className="input"><option>Annual</option><option>Sick</option><option>Casual</option><option>Unpaid</option></select></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start Date"><input required type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} className="input" /></FormField>
              <FormField label="End Date"><input required type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} className="input" /></FormField>
            </div>
            <FormField label="Reason"><textarea required value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} className="input min-h-[70px] resize-y" /></FormField>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowLeaveModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="btn-primary">Submit</button></div>
          </form>
        </Modal>
      )}

      {showReportModal && (
        <Modal title="Submit Work Report" onClose={() => setShowReportModal(false)}>
          <form onSubmit={(e) => {
            e.preventDefault();
            const report: DailyWorkReport = { id: `dw${Date.now()}`, employeeId: selectedEmp, date: new Date().toISOString().slice(0, 10), tasks: reportForm.tasks, hours: Number(reportForm.hours), status: 'submitted' };
            addWorkReport(report);
            setShowReportModal(false);
            setReportForm({ tasks: '', hours: '8' });
          }} className="space-y-4">
            <FormField label="Tasks Completed"><textarea required value={reportForm.tasks} onChange={(e) => setReportForm({ ...reportForm, tasks: e.target.value })} className="input min-h-[100px] resize-y" placeholder="Describe tasks completed today..." /></FormField>
            <FormField label="Hours Worked"><input required type="number" value={reportForm.hours} onChange={(e) => setReportForm({ ...reportForm, hours: e.target.value })} className="input" /></FormField>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowReportModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="btn-primary">Submit</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
