import { create } from 'zustand'

export type PromotionType = 'promotion' | 'upgradation' | 'migration'

export interface PromotionRecord {
  id: string
  employeeName: string
  type: PromotionType
  fromPosition: string
  toPosition: string
  fromDepartment: string
  toDepartment: string
  date: string // ISO date string (YYYY-MM-DD)
}

interface PromotionStore {
  records: PromotionRecord[]
  addRecord: (r: PromotionRecord) => void
  updateRecord: (id: string, patch: Partial<PromotionRecord>) => void
  deleteRecord: (id: string) => void
}

const seedData: PromotionRecord[] = [
  { id: 'pm1', employeeName: 'Rahim Uddin', type: 'promotion', fromPosition: 'Junior Officer', toPosition: 'Senior Officer', fromDepartment: 'Production', toDepartment: 'Production', date: '2024-01-15' },
  { id: 'pm2', employeeName: 'Karim Ahmed', type: 'upgradation', fromPosition: 'Assistant Manager', toPosition: 'Deputy Manager', fromDepartment: 'Finance', toDepartment: 'Finance', date: '2023-06-20' },
  { id: 'pm3', employeeName: 'Fatima Begum', type: 'migration', fromPosition: 'Officer', toPosition: 'Officer', fromDepartment: 'HR', toDepartment: 'Quality', date: '2024-03-10' },
  { id: 'pm4', employeeName: 'Jamal Hossain', type: 'promotion', fromPosition: 'Senior Officer', toPosition: 'Assistant Manager', fromDepartment: 'Sales', toDepartment: 'Sales', date: '2022-11-05' },
  { id: 'pm5', employeeName: 'Nusrat Jahan', type: 'upgradation', fromPosition: 'Junior Officer', toPosition: 'Mid-Level Officer', fromDepartment: 'IT', toDepartment: 'IT', date: '2024-09-01' },
  { id: 'pm6', employeeName: 'Abdul Karim', type: 'migration', fromPosition: 'Manager', toPosition: 'Manager', fromDepartment: 'Production', toDepartment: 'Logistics', date: '2023-02-28' },
]

export const useStore = create<PromotionStore>((set) => ({
  records: seedData,
  addRecord: (r) => set((s) => ({ records: [r, ...s.records] })),
  updateRecord: (id, patch) =>
    set((s) => ({ records: s.records.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
  deleteRecord: (id) => set((s) => ({ records: s.records.filter((r) => r.id !== id) })),
}))
