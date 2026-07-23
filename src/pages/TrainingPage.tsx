import { useState } from 'react';
import { Plus, X, GraduationCap, Calendar, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Modal, FormField, EmptyState, StatCard } from '@/components/ui';
import type { TrainingProgram } from '@/types';

type TrainingStatus = 'scheduled' | 'ongoing' | 'completed';

const statusColors: Record<TrainingStatus, string> = { scheduled: 'sky', ongoing: 'amber', completed: 'emerald' };

export default function TrainingPage() {
  const { trainingPrograms, addTraining, updateTrainingStatus } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', trainer: '', startDate: '', endDate: '', status: 'scheduled' as TrainingStatus });

  return (
    <div>
      <PageHeader title="Training Management" subtitle="Schedule and track employee training programs" action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="h-4 w-4" /> New Program</button>} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Scheduled" value={trainingPrograms.filter((t) => t.status === 'scheduled').length} icon={GraduationCap} color="sky" />
        <StatCard label="Ongoing" value={trainingPrograms.filter((t) => t.status === 'ongoing').length} icon={GraduationCap} color="amber" />
        <StatCard label="Completed" value={trainingPrograms.filter((t) => t.status === 'completed').length} icon={GraduationCap} color="emerald" />
      </div>

      {trainingPrograms.length === 0 ? <Card><EmptyState message="No training programs yet." /></Card> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingPrograms.map((p) => (
            <Card key={p.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center"><GraduationCap className="h-5 w-5 text-indigo-600" /></div>
                <select value={p.status} onChange={(e) => updateTrainingStatus(p.id, e.target.value as TrainingStatus)} className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border-0 cursor-pointer bg-${statusColors[p.status]}-50 text-${statusColors[p.status]}-600`}>
                  <option value="scheduled">Scheduled</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option>
                </select>
              </div>
              <p className="text-slate-800 text-sm font-medium mb-1">{p.title}</p>
              {p.description && <p className="text-slate-500 text-sm mb-3">{p.description}</p>}
              <div className="mt-auto space-y-1 text-xs text-slate-500">
                {p.trainer && <p><span className="text-slate-400">Trainer:</span> {p.trainer}</p>}
                <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {p.startDate} → {p.endDate}</p>
                <p><span className="text-slate-400">Participants:</span> {p.participants}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="New Training Program" onClose={() => setShowModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); addTraining({ id: `t${Date.now()}`, title: form.title, description: form.description, trainer: form.trainer, startDate: form.startDate, endDate: form.endDate, status: form.status, participants: 0 }); setShowModal(false); setForm({ title: '', description: '', trainer: '', startDate: '', endDate: '', status: 'scheduled' }); }} className="space-y-4">
            <FormField label="Title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></FormField>
            <FormField label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input min-h-[70px] resize-y" /></FormField>
            <FormField label="Trainer"><input value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })} className="input" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start Date"><input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input" /></FormField>
              <FormField label="End Date"><input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input" /></FormField>
            </div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
