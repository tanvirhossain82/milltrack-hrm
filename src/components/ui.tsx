import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white rounded-2xl border border-slate-200/80 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  )
}

export function Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      color === 'emerald' && 'bg-emerald-50 text-emerald-700',
      color === 'indigo' && 'bg-indigo-50 text-indigo-700',
      color === 'sky' && 'bg-sky-50 text-sky-700',
      color === 'amber' && 'bg-amber-50 text-amber-700',
    )}>
      {children}
    </span>
  )
}

export function Modal({ title, onClose, children, size = 'md' }: { title: string; onClose: () => void; children: ReactNode; size?: 'md' | 'lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={clsx('bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto', size === 'lg' ? 'max-w-2xl' : 'max-w-md')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <p className="text-sm">{message}</p>
    </div>
  )
}

export function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={clsx('h-10 w-10 rounded-xl flex items-center justify-center',
          color === 'emerald' && 'bg-emerald-50 text-emerald-500',
          color === 'indigo' && 'bg-indigo-50 text-indigo-500',
          color === 'sky' && 'bg-sky-50 text-sky-500',
          color === 'amber' && 'bg-amber-50 text-amber-500',
        )}>
          <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent" />
        </div>
      </div>
    </Card>
  )
}
