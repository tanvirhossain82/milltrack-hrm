import { useState } from 'react';
import { Plus, X, Check, XCircle, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar, Modal, FormField, EmptyState, StatCard } from '@/components/ui';
import type { LeaveRequest } from '@/types';

const statusColors: Record<string, string> = { pending: 'amber', approved: 'emerald', rejected: 'rose' };
const typeColors: Record<string, string> = { Annual: 'indigo', Sick: 'rose', Casual: 'sky', Maternity: 'violet', Unpaid: 'slate' };

export default function LeavePage() {
  const { employees, leaveRequests, addLeave, updateLeaveStatus, searchQuery } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeId: '', type: 'Annual' as LeaveRequest['type'], startDate: '', endDate: '', reason: '' });

  const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? 'Unknown';
  const filtered = leaveRequests.filter((l) => !searchQuery || empName(l.employeeId).toLowerCase().includes(searchQuery.toLowerCase()));

  const pending = leaveRequests.filter((l) => l.status === 'pending').length;
  const approved = leaveRequests.filter((l) => l.status === 'approved').length;
  const rejected = leaveRequests.filter((l) => l.status === 'rejected').length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId || !form.startDate || !form.endDate) return;
    const days = Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1;
    const newLeave: LeaveRequest = {
      id: `l${Date.now()}`,
      employeeId: form.employeeId,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().slice(0, 10),
    };
    addLeave(newLeave);
    setForm({ employeeId: '', type: 'Annual', startDate: '', endDate: '', reason: '' });
    setShowModal(false);
  }

  return (
    <div>
      <PageHeader
        title="Leave Management"
        subtitle="Apply, track, and approve employee leave requests"
        action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="h-4 w-4" /> Apply Leave</button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending" value={pending} icon={Clock} color="amber" />
        <StatCard label="Approved" value={approved} icon={Check} color="emerald" />
        <StatCard label="Rejected" value={rejected} icon={XCircle} color="rose" />
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState message="No leave requests found." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium px-5 py-3">Employee</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-left font-medium px-5 py-3">Duration</th>
                  <th className="text-left font-medium px-5 py-3">Days</th>
                  <th className="text-left font-medium px-5 py-3">Reason</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={empName(l.employeeId)} size="sm" />
                        <span className="text-slate-700 font-medium">{empName(l.employeeId)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge color={typeColors[l.type]}>{l.type}</Badge></td>
                    <td className="px-5 py-3 text-slate-600 text-xs">{l.startDate} → {l.endDate}</td>
                    <td className="px-5 py-3 text-slate-600">{l.days}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs max-w-[200px] truncate">{l.reason}</td>
                    <td className="px-5 py-3"><Badge color={statusColors[l.status]}>{l.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {l.status === 'pending' && (
                          <>
                            <button onClick={() => updateLeaveStatus(l.id, 'approved')} className="h-8 w-8 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-50" title="Approve"><Check className="h-4 w-4" /></button>
                            <button onClick={() => updateLeaveStatus(l.id, 'rejected')} className="h-8 w-8 flex items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50" title="Reject"><XCircle className="h-4 w-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showModal && (
        <Modal title="Apply for Leave" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Employee">
              <select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input">
                <option value="">Select employee...</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </FormField>
            <FormField label="Leave Type">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LeaveRequest['type'] })} className="input">
                <option>Annual</option><option>Sick</option><option>Casual</option><option>Maternity</option><option>Unpaid</option>
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start Date"><input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input" /></FormField>
              <FormField label="End Date"><input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input" /></FormField>
            </div>
            <FormField label="Reason"><textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="input min-h-[70px] resize-y" placeholder="Reason for leave..." /></FormField>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="btn-primary">Submit</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
