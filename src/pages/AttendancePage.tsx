import { useState } from 'react';
import { LogIn, LogOut, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar, StatCard } from '@/components/ui';

const statusColors: Record<string, string> = { present: 'emerald', late: 'amber', absent: 'rose', 'half-day': 'sky' };

export default function AttendancePage() {
  const { employees, attendance, checkIn, checkOut } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance.filter((a) => a.date === today);
  const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? 'Unknown';

  const present = todayRecords.filter((a) => a.status === 'present').length;
  const late = todayRecords.filter((a) => a.status === 'late').length;
  const absent = employees.length - todayRecords.filter((a) => a.status !== 'absent').length;
  const totalOT = todayRecords.reduce((s, a) => s + a.overtimeHours, 0);

  return (
    <div>
      <PageHeader title="Attendance Management" subtitle="Check-in/check-out tracking and attendance monitoring" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Present" value={present} icon={CheckCircle2} color="emerald" />
        <StatCard label="Late" value={late} icon={Clock} color="amber" />
        <StatCard label="Absent" value={absent} icon={Clock} color="rose" />
        <StatCard label="Total OT Hours" value={totalOT} icon={Clock} color="indigo" />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Today's Attendance - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left font-medium px-5 py-3">Employee</th>
                <th className="text-left font-medium px-5 py-3">Check In</th>
                <th className="text-left font-medium px-5 py-3">Check Out</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-left font-medium px-5 py-3">OT Hours</th>
                <th className="text-right font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => {
                const rec = todayRecords.find((a) => a.employeeId === emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.name} size="sm" />
                        <span className="text-slate-700 font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{rec?.checkIn || '—'}</td>
                    <td className="px-5 py-3 text-slate-600">{rec?.checkOut || '—'}</td>
                    <td className="px-5 py-3">
                      {rec ? <Badge color={statusColors[rec.status]}>{rec.status}</Badge> : <Badge color="slate">not checked in</Badge>}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{rec?.overtimeHours ? `${rec.overtimeHours}h` : '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => checkIn(emp.id)}
                          disabled={!!rec?.checkIn}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <LogIn className="h-3.5 w-3.5" /> Check In
                        </button>
                        <button
                          onClick={() => checkOut(emp.id)}
                          disabled={!rec?.checkIn || !!rec?.checkOut}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Check Out
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
