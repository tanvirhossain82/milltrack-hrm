import { useState, useRef, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, ArrowUpCircle, ChevronDown, Check, X } from 'lucide-react'
import { useStore, type PromotionRecord, type PromotionType } from '../store/useStore'
import { Card, Table, Badge, Modal, FormField, EmptyState, StatCard } from '../components/ui'

const typeColors: Record<PromotionType, string> = {
  promotion: 'emerald',
  upgradation: 'indigo',
  migration: 'sky',
}

const allTypes: (PromotionType | 'all')[] = ['all', 'promotion', 'upgradation', 'migration']

export function PromotionPage() {
  const { records, addRecord, updateRecord, deleteRecord } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<PromotionType | 'all'>('all')
  const [typeMenuOpen, setTypeMenuOpen] = useState(false)

  const [form, setForm] = useState({
    employeeName: '',
    type: 'promotion' as PromotionType,
    fromPosition: '',
    toPosition: '',
    fromDepartment: '',
    toDepartment: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const typeMenuRef = useRef<HTMLDivElement>(null)

  // Extract unique years from records
  const years = Array.from(new Set(records.map((r) => r.date.slice(0, 4)))).sort((a, b) => b.localeCompare(a))

  // Close popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setTypeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = records.filter((r) => {
    // Year filter
    if (yearFilter !== 'all' && r.date.slice(0, 4) !== yearFilter) return false
    // Type filter
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    // Text search
    if (search) {
      const q = search.toLowerCase()
      if (
        !r.employeeName.toLowerCase().includes(q) &&
        !r.fromPosition.toLowerCase().includes(q) &&
        !r.toPosition.toLowerCase().includes(q) &&
        !r.fromDepartment.toLowerCase().includes(q) &&
        !r.toDepartment.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  function openAdd() {
    setEditId(null)
    setForm({
      employeeName: '', type: 'promotion', fromPosition: '', toPosition: '',
      fromDepartment: '', toDepartment: '', date: new Date().toISOString().slice(0, 10),
    })
    setShowForm(true)
  }

  function openEdit(r: PromotionRecord) {
    setEditId(r.id)
    setForm({
      employeeName: r.employeeName, type: r.type, fromPosition: r.fromPosition,
      toPosition: r.toPosition, fromDepartment: r.fromDepartment, toDepartment: r.toDepartment, date: r.date,
    })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.employeeName || !form.fromPosition || !form.toPosition || !form.date) return
    if (editId) {
      updateRecord(editId, form)
    } else {
      addRecord({ id: `pm${Date.now()}`, ...form })
    }
    setShowForm(false)
    setEditId(null)
  }

  const typeLabel = typeFilter === 'all' ? 'All Types' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Promotion &amp; Migration System</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track employee promotions, upgradations, and department migrations</p>
            </div>
            <button onClick={openAdd} className="btn-primary">
              <Plus className="h-4 w-4" /> Add Record
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Promotions" value={records.filter((r) => r.type === 'promotion').length} color="emerald" />
          <StatCard label="Upgradations" value={records.filter((r) => r.type === 'upgradation').length} color="indigo" />
          <StatCard label="Migrations" value={records.filter((r) => r.type === 'migration').length} color="sky" />
          <StatCard label="Total Records" value={records.length} color="amber" />
        </div>

        {/* Search & Filters */}
        <Card className="p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Text search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by employee, position, or department..."
                className="input pl-10"
              />
            </div>

            {/* Year filter dropdown */}
            <div className="relative sm:w-44">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="input appearance-none pr-10 cursor-pointer"
              >
                <option value="all">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Type filter popup menu */}
            <div className="relative sm:w-48" ref={typeMenuRef}>
              <button
                onClick={() => setTypeMenuOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ArrowUpCircle className="h-4 w-4 text-slate-400" />
                  {typeLabel}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${typeMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {typeMenuOpen && (
                <div className="absolute right-0 mt-1 w-full bg-white rounded-lg border border-slate-200 shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {allTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTypeFilter(t); setTypeMenuOpen(false) }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {t !== 'all' && <span className={`h-2 w-2 rounded-full ${t === 'promotion' ? 'bg-emerald-400' : t === 'upgradation' ? 'bg-indigo-400' : 'bg-sky-400'}`} />}
                        {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </span>
                      {typeFilter === t && <Check className="h-4 w-4 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {(yearFilter !== 'all' || typeFilter !== 'all' || search) && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">Active filters:</span>
              {yearFilter !== 'all' && (
                <button onClick={() => setYearFilter('all')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors">
                  Year: {yearFilter} <X className="h-3 w-3" />
                </button>
              )}
              {typeFilter !== 'all' && (
                <button onClick={() => setTypeFilter('all')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition-colors">
                  Type: {typeLabel} <X className="h-3 w-3" />
                </button>
              )}
              {search && (
                <button onClick={() => setSearch('')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                  "{search}" <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Table */}
        {filtered.length === 0 ? (
          <Card><EmptyState message="No promotion or migration records found." /></Card>
        ) : (
          <Card className="overflow-hidden">
            <Table headers={['Employee', 'Type', 'From', 'To', 'Date', 'Actions']}>
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 text-slate-700 font-medium">{r.employeeName}</td>
                  <td className="px-5 py-3"><Badge color={typeColors[r.type]}>{r.type}</Badge></td>
                  <td className="px-5 py-3 text-slate-600">
                    {r.fromPosition}
                    {r.fromDepartment && r.fromDepartment !== r.toDepartment && (
                      <span className="text-slate-400 text-xs block">{r.fromDepartment}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {r.toPosition}
                    {r.toDepartment && r.fromDepartment !== r.toDepartment && (
                      <span className="text-slate-400 text-xs block">{r.toDepartment}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(r)} className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteRecord(r.id)} className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <Modal title={editId ? 'Edit Record' : 'Add Record'} onClose={() => { setShowForm(false); setEditId(null) }} size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Employee Name">
              <input required value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} className="input" placeholder="e.g. Rahim Uddin" />
            </FormField>
            <FormField label="Type">
              <div className="grid grid-cols-3 gap-2">
                {(['promotion', 'upgradation', 'migration'] as const).map((t) => (
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
            <FormField label="Date"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" /></FormField>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
