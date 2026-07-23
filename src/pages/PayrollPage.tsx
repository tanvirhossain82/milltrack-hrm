import { useState } from 'react';
import { Plus, X, Printer, Wallet, Trash2, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar, Modal, FormField, EmptyState, StatCard, formatCurrency } from '@/components/ui';
import type { PayrollRecord } from '@/types';

export default function PayrollPage() {
  const { employees, payrollRecords, addPayroll, updatePayrollStatus, loanRecords } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [slip, setSlip] = useState<PayrollRecord | null>(null);
  const [form, setForm] = useState({ employeeId: '', period: new Date().toISOString().slice(0, 7), basicPay: '', overtime: '0', festivalBonus: '0', attendanceBonus: '100' });

  const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? 'Unknown';
  const empDept = (id: string) => employees.find((e) => e.id === id)?.department ?? '—';
  const empPos = (id: string) => employees.find((e) => e.id === id)?.position ?? '—';

  const totalPayroll = payrollRecords.reduce((s, p) => s + p.netPay, 0);
  const paidCount = payrollRecords.filter((p) => p.status === 'paid').length;
  const pendingCount = payrollRecords.filter((p) => p.status === 'generated').length;

  function calcNet(p: typeof form): number {
    const basic = Number(p.basicPay) || 0;
    const ot = Number(p.overtime) || 0;
    const fest = Number(p.festivalBonus) || 0;
    const att = Number(p.attendanceBonus) || 0;
    const emp = employees.find((e) => e.id === p.employeeId);
    const loanDed = loanRecords.filter((l) => l.employeeId === p.employeeId && l.status === 'active').reduce((s, l) => s + l.monthlyDeduction, 0);
    const pf = Math.round(basic * 0.12);
    const gf = Math.round(basic * 0.05);
    const tax = Math.round(basic * 0.2);
    return basic + ot + fest + att - loanDed - pf - gf - tax;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId || !form.basicPay) return;
    const basic = Number(form.basicPay);
    const emp = employees.find((e) => e.id === form.employeeId);
    const loanDed = loanRecords.filter((l) => l.employeeId === form.employeeId && l.status === 'active').reduce((s, l) => s + l.monthlyDeduction, 0);
    const rec: PayrollRecord = {
      id: `p${Date.now()}`,
      employeeId: form.employeeId,
      period: form.period,
      basicPay: basic,
      overtime: Number(form.overtime) || 0,
      festivalBonus: Number(form.festivalBonus) || 0,
      attendanceBonus: Number(form.attendanceBonus) || 0,
      loanDeduction: loanDed,
      pfContribution: Math.round(basic * 0.12),
      gfContribution: Math.round(basic * 0.05),
      taxDeduction: Math.round(basic * 0.2),
      netPay: calcNet(form),
      status: 'generated',
    };
    addPayroll(rec);
    setForm({ employeeId: '', period: new Date().toISOString().slice(0, 7), basicPay: '', overtime: '0', festivalBonus: '0', attendanceBonus: '100' });
    setShowModal(false);
  }

  return (
    <div>
      <PageHeader
        title="Payroll / Salary Disbursement"
        subtitle="Automated salary slip generator with all deductions"
        action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="h-4 w-4" /> Generate Slip</button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Payroll" value={formatCurrency(totalPayroll)} icon={Wallet} color="indigo" />
        <StatCard label="Paid" value={paidCount} icon={CheckCircle2} color="emerald" />
        <StatCard label="Pending" value={pendingCount} icon={Wallet} color="amber" />
      </div>

      {payrollRecords.length === 0 ? (
        <Card><EmptyState message="No payroll records generated yet." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium px-5 py-3">Employee</th>
                  <th className="text-left font-medium px-5 py-3">Period</th>
                  <th className="text-right font-medium px-5 py-3">Basic</th>
                  <th className="text-right font-medium px-5 py-3">OT</th>
                  <th className="text-right font-medium px-5 py-3">Bonuses</th>
                  <th className="text-right font-medium px-5 py-3">Deductions</th>
                  <th className="text-right font-medium px-5 py-3">Net Pay</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollRecords.map((p) => {
                  const totalDed = p.loanDeduction + p.pfContribution + p.gfContribution + p.taxDeduction;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={empName(p.employeeId)} size="sm" />
                          <span className="text-slate-700 font-medium">{empName(p.employeeId)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{p.period}</td>
                      <td className="px-5 py-3 text-right text-slate-600">{formatCurrency(p.basicPay)}</td>
                      <td className="px-5 py-3 text-right text-slate-600">{formatCurrency(p.overtime)}</td>
                      <td className="px-5 py-3 text-right text-emerald-600">{formatCurrency(p.festivalBonus + p.attendanceBonus)}</td>
                      <td className="px-5 py-3 text-right text-rose-600">-{formatCurrency(totalDed)}</td>
                      <td className="px-5 py-3 text-right text-slate-800 font-semibold">{formatCurrency(p.netPay)}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => updatePayrollStatus(p.id, p.status === 'paid' ? 'generated' : 'paid')} className="cursor-pointer">
                          <Badge color={p.status === 'paid' ? 'emerald' : 'amber'}>{p.status}</Badge>
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSlip(p)} className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><Printer className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showModal && (
        <Modal title="Generate Salary Slip" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Employee">
              <select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input">
                <option value="">Select employee...</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </FormField>
            <FormField label="Pay Period"><input required type="month" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="input" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Basic Pay (tk)"><input required type="number" value={form.basicPay} onChange={(e) => setForm({ ...form, basicPay: e.target.value })} className="input" placeholder="5000" /></FormField>
              <FormField label="Overtime (tk)"><input type="number" value={form.overtime} onChange={(e) => setForm({ ...form, overtime: e.target.value })} className="input" /></FormField>
              <FormField label="Festival Bonus (tk)"><input type="number" value={form.festivalBonus} onChange={(e) => setForm({ ...form, festivalBonus: e.target.value })} className="input" /></FormField>
              <FormField label="Attendance Bonus (tk)"><input type="number" value={form.attendanceBonus} onChange={(e) => setForm({ ...form, attendanceBonus: e.target.value })} className="input" /></FormField>
            </div>
            {form.employeeId && (
              <div className="rounded-lg bg-slate-50 p-3 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">PF (12%):</span><span className="text-slate-600">-{formatCurrency(Math.round((Number(form.basicPay) || 0) * 0.12))}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GF (5%):</span><span className="text-slate-600">-{formatCurrency(Math.round((Number(form.basicPay) || 0) * 0.05))}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Tax (20%):</span><span className="text-slate-600">-{formatCurrency(Math.round((Number(form.basicPay) || 0) * 0.2))}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Loan Deduction:</span><span className="text-slate-600">-{formatCurrency(loanRecords.filter((l) => l.employeeId === form.employeeId && l.status === 'active').reduce((s, l) => s + l.monthlyDeduction, 0))}</span></div>
                <div className="flex justify-between pt-1 border-t border-slate-200"><span className="font-semibold text-slate-700">Net Pay:</span><span className="font-semibold text-slate-800">{formatCurrency(calcNet(form))}</span></div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="btn-primary">Generate</button>
            </div>
          </form>
        </Modal>
      )}

      {slip && (
        <Modal title="Salary Slip" onClose={() => setSlip(null)} size="lg">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center"><Wallet className="h-5 w-5 text-white" /></div>
                <div><p className="text-sm font-semibold text-slate-800">Salary Slip - {slip.period}</p><p className="text-xs text-slate-400">Generated on {new Date().toLocaleDateString()}</p></div>
              </div>
              <Badge color={slip.status === 'paid' ? 'emerald' : 'amber'}>{slip.status}</Badge>
            </div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <Avatar name={empName(slip.employeeId)} size="lg" />
              <div><p className="text-sm font-semibold text-slate-800">{empName(slip.employeeId)}</p><p className="text-xs text-slate-400">{empPos(slip.employeeId)} · {empDept(slip.employeeId)}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Earnings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Basic Pay</span><span className="text-slate-700">{formatCurrency(slip.basicPay)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Overtime</span><span className="text-slate-700">{formatCurrency(slip.overtime)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Festival Bonus</span><span className="text-emerald-600">{formatCurrency(slip.festivalBonus)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Attendance Bonus</span><span className="text-emerald-600">{formatCurrency(slip.attendanceBonus)}</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Deductions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">PF Contribution</span><span className="text-rose-600">-{formatCurrency(slip.pfContribution)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">GF Contribution</span><span className="text-rose-600">-{formatCurrency(slip.gfContribution)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Tax</span><span className="text-rose-600">-{formatCurrency(slip.taxDeduction)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Loan Deduction</span><span className="text-rose-600">-{formatCurrency(slip.loanDeduction)}</span></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-700">Net Pay</span>
              <span className="text-lg font-bold text-slate-800">{formatCurrency(slip.netPay)}</span>
            </div>
            <button onClick={() => window.print()} className="btn-primary w-full"><Printer className="h-4 w-4" /> Print Salary Slip</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
