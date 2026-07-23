import { useState } from 'react';
import { Plus, Trash2, Mail, Phone, Pencil } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar, Modal, FormField, EmptyState } from '@/components/ui';
import EmployeeOnboardingForm from '@/components/EmployeeOnboardingForm';
import type { Employee } from '@/types';

const statusColors: Record<string, string> = { active: 'emerald', 'on-leave': 'amber', inactive: 'slate' };

export default function EmployeesPage() {
  const { employees, deleteEmployee, updateEmployee, searchQuery } = useStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', department: '', position: '', salary: '', joinDate: new Date().toISOString().slice(0, 10),
  });

  const filtered = employees.filter((e) =>
    !searchQuery ||
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      updateEmployee(editId, { ...form, salary: Number(form.salary) });
    }
    setForm({ name: '', email: '', phone: '', department: '', position: '', salary: '', joinDate: new Date().toISOString().slice(0, 10) });
    setEditId(null);
    setShowOnboarding(false);
  }

  function startEdit(emp: Employee) {
    setEditId(emp.id);
    setForm({ name: emp.name, email: emp.email, phone: emp.phone, department: emp.department, position: emp.position, salary: String(emp.salary), joinDate: emp.joinDate });
    setShowOnboarding(true);
  }

  return (
    <div>
      <PageHeader
        title="Employee Directory"
        subtitle={`${employees.length} employees across all branches`}
        action={<button onClick={() => { setEditId(null); setShowOnboarding(true); }} className="btn-primary"><Plus className="h-4 w-4" /> Add Employee</button>}
      />

      {filtered.length === 0 ? (
        <Card><EmptyState message="No employees found." /></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <Card key={emp.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={emp.name} size="lg" />
                  <div>
                    <p className="text-slate-800 font-semibold text-sm">{emp.name}</p>
                    <p className="text-slate-400 text-xs">{emp.position}</p>
                  </div>
                </div>
                <Badge color={statusColors[emp.status]}>{emp.status}</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {emp.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {emp.phone}</p>
                <p>Department: <span className="text-slate-600 font-medium">{emp.department}</span></p>
                <p>Salary: <span className="text-slate-600 font-medium">{emp.salary.toLocaleString()} tk/yr</span></p>
                <p>Leave Balance: <span className="text-slate-600 font-medium">{emp.leaveBalance} days</span></p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(emp)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium hover:bg-slate-100">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => deleteEmployee(emp.id)} className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showOnboarding && editId && (
        <Modal title="Edit Employee" onClose={() => { setEditId(null); setShowOnboarding(false); }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Jane Doe" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="jane@company.com" /></FormField>
              <FormField label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="01XXXXXXXXX" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Department"><input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input" placeholder="Engineering" /></FormField>
              <FormField label="Position"><input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input" placeholder="Developer" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Annual Salary (tk)"><input required type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="input" placeholder="75000" /></FormField>
              <FormField label="Join Date"><input required type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} className="input" /></FormField>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => { setEditId(null); setShowOnboarding(false); }} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="btn-primary">Update</button>
            </div>
          </form>
        </Modal>
      )}

      {showOnboarding && !editId && (
        <EmployeeOnboardingForm onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
