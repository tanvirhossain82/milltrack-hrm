import { useState } from 'react';
import { Plus, X, Award, AlertTriangle, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar, Modal, FormField, EmptyState, StatCard } from '@/components/ui';

export default function AwardsPage() {
  const { employees, awardsDiscipline, addAwardDiscipline } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeId: '', type: 'award' as 'award' | 'discipline', title: '', description: '', date: new Date().toISOString().slice(0, 10) });

  const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? 'Unknown';
  const awards = awardsDiscipline.filter((r) => r.type === 'award');
  const disciplines = awardsDiscipline.filter((r) => r.type === 'discipline');

  return (
    <div>
      <PageHeader title="Award & Discipline" subtitle="Recognize achievements and track disciplinary actions" action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add Record</button>} />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Awards" value={awards.length} icon={Award} color="amber" />
        <StatCard label="Disciplinary Actions" value={disciplines.length} icon={AlertTriangle} color="rose" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" /> Awards ({awards.length})</h3>
          {awards.length === 0 ? <Card><EmptyState message="No awards recorded." /></Card> : (
            <div className="space-y-3">{awards.map((r) => (
              <Card key={r.id} className="p-4"><div className="flex items-start gap-3"><div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0"><Award className="h-4 w-4 text-amber-500" /></div><div><p className="text-slate-800 text-sm font-medium">{r.title}</p><p className="text-slate-400 text-xs">{empName(r.employeeId)} · {r.date}</p>{r.description && <p className="text-slate-500 text-sm mt-1">{r.description}</p>}</div></div></Card>
            ))}</div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-rose-500" /> Disciplinary ({disciplines.length})</h3>
          {disciplines.length === 0 ? <Card><EmptyState message="No disciplinary actions." /></Card> : (
            <div className="space-y-3">{disciplines.map((r) => (
              <Card key={r.id} className="p-4"><div className="flex items-start gap-3"><div className="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0"><AlertTriangle className="h-4 w-4 text-rose-500" /></div><div><p className="text-slate-800 text-sm font-medium">{r.title}</p><p className="text-slate-400 text-xs">{empName(r.employeeId)} · {r.date}</p>{r.description && <p className="text-slate-500 text-sm mt-1">{r.description}</p>}</div></div></Card>
            ))}</div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="Add Award / Discipline" onClose={() => setShowModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); addAwardDiscipline({ id: `ad${Date.now()}`, employeeId: form.employeeId, type: form.type, title: form.title, description: form.description, date: form.date }); setShowModal(false); setForm({ employeeId: '', type: 'award', title: '', description: '', date: new Date().toISOString().slice(0, 10) }); }} className="space-y-4">
            <FormField label="Employee"><select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input"><option value="">Select...</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></FormField>
            <FormField label="Type"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setForm({ ...form, type: 'award' })} className={`px-3 py-2 rounded-lg text-sm font-medium border ${form.type === 'award' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-slate-200 text-slate-500'}`}>Award</button><button type="button" onClick={() => setForm({ ...form, type: 'discipline' })} className={`px-3 py-2 rounded-lg text-sm font-medium border ${form.type === 'discipline' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'border-slate-200 text-slate-500'}`}>Discipline</button></div></FormField>
            <FormField label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></FormField>
            <FormField label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input min-h-[70px] resize-y" /></FormField>
            <FormField label="Date"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" /></FormField>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
