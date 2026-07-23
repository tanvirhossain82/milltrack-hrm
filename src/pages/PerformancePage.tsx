import { useState } from 'react';
import { Plus, X, Star, Trash2, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar, Modal, FormField, EmptyState, StatCard } from '@/components/ui';
import type { PerformanceReview } from '@/types';

const ratingLabels = ['Poor', 'Below Avg', 'Average', 'Good', 'Excellent'];

export default function PerformancePage() {
  const { employees, performanceReviews, addPerformance } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeId: '', period: new Date().toISOString().slice(0, 7), kpiScore: '80', rating: '3', goals: '', comments: '' });

  const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? 'Unknown';
  const avgKpi = performanceReviews.length > 0 ? Math.round(performanceReviews.reduce((s, p) => s + p.kpiScore, 0) / performanceReviews.length) : 0;

  return (
    <div>
      <PageHeader title="Employee Performance Evolution (KPI)" subtitle="Track and evaluate employee performance metrics" action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="h-4 w-4" /> New Review</button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Reviews" value={performanceReviews.length} icon={TrendingUp} color="indigo" />
        <StatCard label="Avg KPI Score" value={avgKpi} icon={TrendingUp} color="sky" />
        <StatCard label="Top Performers" value={performanceReviews.filter((r) => r.kpiScore >= 90).length} icon={Star} color="emerald" />
        <StatCard label="Needs Attention" value={performanceReviews.filter((r) => r.kpiScore < 70).length} icon={TrendingUp} color="amber" />
      </div>

      {performanceReviews.length === 0 ? <Card><EmptyState message="No performance reviews yet." /></Card> : (
        <div className="grid md:grid-cols-2 gap-4">
          {performanceReviews.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={empName(r.employeeId)} size="sm" />
                  <div><p className="text-slate-700 text-sm font-medium">{empName(r.employeeId)}</p><p className="text-slate-400 text-xs">Period: {r.period}</p></div>
                </div>
                <Badge color={r.kpiScore >= 90 ? 'emerald' : r.kpiScore >= 75 ? 'indigo' : r.kpiScore >= 60 ? 'amber' : 'rose'}>{r.kpiScore}/100</Badge>
              </div>
              <div className="mb-3"><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${r.kpiScore >= 90 ? 'bg-emerald-500' : r.kpiScore >= 75 ? 'bg-indigo-500' : r.kpiScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${r.kpiScore}%` }} /></div></div>
              <div className="flex items-center gap-1 mb-3">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}<span className="ml-1.5 text-xs text-slate-500">{ratingLabels[r.rating - 1]}</span></div>
              {r.goals && <p className="text-xs text-slate-500 mb-1"><span className="font-medium text-slate-600">Goals:</span> {r.goals}</p>}
              {r.comments && <p className="text-xs text-slate-500"><span className="font-medium text-slate-600">Comments:</span> {r.comments}</p>}
              <p className="text-xs text-slate-400 mt-2">Reviewer: {r.reviewer}</p>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="New Performance Review" onClose={() => setShowModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); addPerformance({ id: `pr${Date.now()}`, employeeId: form.employeeId, period: form.period, kpiScore: Number(form.kpiScore), rating: Number(form.rating), goals: form.goals, comments: form.comments, reviewer: 'Admin User' }); setShowModal(false); setForm({ employeeId: '', period: new Date().toISOString().slice(0, 7), kpiScore: '80', rating: '3', goals: '', comments: '' }); }} className="space-y-4">
            <FormField label="Employee"><select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="input"><option value="">Select...</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></FormField>
            <FormField label="Review Period"><input required type="month" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="input" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="KPI Score (0-100)"><input type="number" min="0" max="100" value={form.kpiScore} onChange={(e) => setForm({ ...form, kpiScore: e.target.value })} className="input" /></FormField>
              <FormField label="Rating (1-5)"><select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input">{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} - {ratingLabels[n - 1]}</option>)}</select></FormField>
            </div>
            <FormField label="Goals"><textarea value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} className="input min-h-[60px] resize-y" /></FormField>
            <FormField label="Comments"><textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} className="input min-h-[60px] resize-y" /></FormField>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
