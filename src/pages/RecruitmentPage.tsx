import { useState } from 'react';
import { Plus, X, Briefcase, Users, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Modal, FormField, EmptyState, StatCard } from '@/components/ui';
import type { JobPosting, Candidate } from '@/types';

type CandidateStatus = 'applied' | 'interviewed' | 'hired' | 'rejected';

const statusColors: Record<string, string> = { open: 'emerald', closed: 'slate', applied: 'sky', interviewed: 'amber', hired: 'emerald', rejected: 'rose' };

export default function RecruitmentPage() {
  const { jobPostings, candidates, addJobPosting, addCandidate, updateCandidateStatus, searchQuery } = useStore();
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandModal, setShowCandModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', department: '', description: '', openings: '1' });
  const [candForm, setCandForm] = useState({ jobId: '', name: '', email: '', phone: '' });

  const filteredJobs = jobPostings.filter((j) => !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <PageHeader title="Recruitment Management" subtitle="Manage job postings and track candidates" action={
        <div className="flex gap-2">
          <button onClick={() => setShowCandModal(true)} className="btn-secondary"><Users className="h-4 w-4" /> Add Candidate</button>
          <button onClick={() => setShowJobModal(true)} className="btn-primary"><Plus className="h-4 w-4" /> New Posting</button>
        </div>
      } />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Open Positions" value={jobPostings.filter((j) => j.status === 'open').length} icon={Briefcase} color="indigo" />
        <StatCard label="Total Candidates" value={candidates.length} icon={Users} color="sky" />
        <StatCard label="Hired" value={candidates.filter((c) => c.status === 'hired').length} icon={Users} color="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Job Postings</h3>
          {filteredJobs.length === 0 ? <Card><EmptyState message="No job postings." /></Card> : (
            <div className="space-y-3">
              {filteredJobs.map((j) => (
                <Card key={j.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center"><Briefcase className="h-4 w-4 text-indigo-600" /></div>
                      <div><p className="text-slate-800 text-sm font-medium">{j.title}</p><p className="text-slate-400 text-xs">{j.department} · {j.openings} opening(s)</p></div>
                    </div>
                    <Badge color={statusColors[j.status]}>{j.status}</Badge>
                  </div>
                  <p className="text-slate-500 text-sm mb-2">{j.description}</p>
                  <p className="text-xs text-slate-400">{candidates.filter((c) => c.jobId === j.id).length} candidates</p>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Candidates</h3>
          {candidates.length === 0 ? <Card><EmptyState message="No candidates." /></Card> : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <th className="text-left font-medium px-4 py-3">Name</th>
                    <th className="text-left font-medium px-4 py-3">Position</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidates.map((c) => {
                      const job = jobPostings.find((j) => j.id === c.jobId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3"><p className="text-slate-700 font-medium">{c.name}</p><p className="text-slate-400 text-xs">{c.email}</p></td>
                          <td className="px-4 py-3 text-slate-600">{job?.title ?? '—'}</td>
                          <td className="px-4 py-3">
                            <select value={c.status} onChange={(e) => updateCandidateStatus(c.id, e.target.value as CandidateStatus)} className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border-0 cursor-pointer ${statusColors[c.status]}`}>
                              <option value="applied">Applied</option><option value="interviewed">Interviewed</option><option value="hired">Hired</option><option value="rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>

      {showJobModal && (
        <Modal title="New Job Posting" onClose={() => setShowJobModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); addJobPosting({ id: `j${Date.now()}`, title: jobForm.title, department: jobForm.department, description: jobForm.description, status: 'open', openings: Number(jobForm.openings), postedDate: new Date().toISOString().slice(0, 10) }); setShowJobModal(false); setJobForm({ title: '', department: '', description: '', openings: '1' }); }} className="space-y-4">
            <FormField label="Job Title"><input required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="input" /></FormField>
            <FormField label="Department"><input required value={jobForm.department} onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })} className="input" /></FormField>
            <FormField label="Description"><textarea value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} className="input min-h-[80px] resize-y" /></FormField>
            <FormField label="Openings"><input type="number" value={jobForm.openings} onChange={(e) => setJobForm({ ...jobForm, openings: e.target.value })} className="input" /></FormField>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowJobModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="btn-primary">Create</button></div>
          </form>
        </Modal>
      )}

      {showCandModal && (
        <Modal title="Add Candidate" onClose={() => setShowCandModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); addCandidate({ id: `c${Date.now()}`, jobId: candForm.jobId, name: candForm.name, email: candForm.email, phone: candForm.phone, status: 'applied', appliedDate: new Date().toISOString().slice(0, 10) }); setShowCandModal(false); setCandForm({ jobId: '', name: '', email: '', phone: '' }); }} className="space-y-4">
            <FormField label="Job Posting"><select required value={candForm.jobId} onChange={(e) => setCandForm({ ...candForm, jobId: e.target.value })} className="input"><option value="">Select...</option>{jobPostings.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}</select></FormField>
            <FormField label="Name"><input required value={candForm.name} onChange={(e) => setCandForm({ ...candForm, name: e.target.value })} className="input" /></FormField>
            <FormField label="Email"><input type="email" value={candForm.email} onChange={(e) => setCandForm({ ...candForm, email: e.target.value })} className="input" /></FormField>
            <FormField label="Phone"><input value={candForm.phone} onChange={(e) => setCandForm({ ...candForm, phone: e.target.value })} className="input" /></FormField>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowCandModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="btn-primary">Add</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
