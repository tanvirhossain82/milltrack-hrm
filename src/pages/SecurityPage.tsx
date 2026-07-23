import { ShieldCheck, Lock, Users, Eye, UserCog } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PageHeader, Card, Badge, Avatar } from '@/components/ui';
import type { Role } from '@/types';

const rolePermissions: Record<Role, { modules: string[]; description: string; icon: typeof Lock; color: string }> = {
  Admin: { modules: ['All 32 Modules', 'User Management', 'System Settings', 'Role Assignment', 'Branch Configuration'], description: 'Full system access with all administrative privileges', icon: ShieldCheck, color: 'indigo' },
  'HR Manager': { modules: ['Employee Management', 'Recruitment', 'Payroll', 'Leave Approval', 'Performance Reviews', 'Training', 'Reports'], description: 'HR operations and employee lifecycle management', icon: UserCog, color: 'emerald' },
  'Line Manager': { modules: ['Team Attendance', 'Leave Approval', 'Work Reports', 'Performance Review', 'Shift Management'], description: 'Team-level management and approvals', icon: Users, color: 'amber' },
  Employee: { modules: ['Self-Service Portal', 'Leave Application', 'Salary Slips', 'Work Report Submission', 'Profile Update'], description: 'Personal HR tasks and information access', icon: Eye, color: 'sky' },
};

export default function SecurityPage() {
  const { employees, currentRole, setRole } = useStore();

  return (
    <div>
      <PageHeader title="Security Module (RBAC)" subtitle="Role-Based Access Control and permission management" />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Current Active Role</h3>
              <p className="text-xs text-slate-400">Click a role below to switch context</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">{currentRole}</p>
              <p className="text-sm text-slate-500">{rolePermissions[currentRole].description}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">System Security Status</h3>
          <div className="space-y-3">
            {[
              { label: 'RLS Policies', status: 'Active', color: 'emerald' },
              { label: 'Data Encryption', status: 'AES-256', color: 'emerald' },
              { label: 'Session Management', status: 'JWT', color: 'emerald' },
              { label: 'Audit Logging', status: 'Enabled', color: 'emerald' },
              { label: 'Two-Factor Auth', status: 'Optional', color: 'amber' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{s.label}</span>
                <Badge color={s.color}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mb-3">Role Definitions</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {(Object.keys(rolePermissions) as Role[]).map((role) => {
          const perm = rolePermissions[role];
          const Icon = perm.icon;
          const isActive = currentRole === role;
          return (
            <Card key={role} className={`p-5 cursor-pointer transition-all ${isActive ? 'ring-2 ring-indigo-400' : 'hover:border-slate-300'}`} >
              <div onClick={() => setRole(role)} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${perm.color}-50`}>
                    <Icon className={`h-5 w-5 text-${perm.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{role}</p>
                    {isActive && <Badge color="indigo">Active</Badge>}
                  </div>
                </div>
                <p className="text-xs text-slate-500">{perm.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {perm.modules.map((m) => (
                    <span key={m} className="text-[10px] px-2 py-1 rounded-md bg-slate-100 text-slate-600">{m}</span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mb-3">User Role Assignments</h3>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left font-medium px-5 py-3">Employee</th>
                <th className="text-left font-medium px-5 py-3">Department</th>
                <th className="text-left font-medium px-5 py-3">Assigned Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.name} size="sm" />
                      <div>
                        <p className="text-slate-700 font-medium">{e.name}</p>
                        <p className="text-slate-400 text-xs">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{e.department}</td>
                  <td className="px-5 py-3">
                    <Badge color={e.role === 'Admin' ? 'indigo' : e.role === 'HR Manager' ? 'emerald' : e.role === 'Line Manager' ? 'amber' : 'sky'}>
                      {e.role}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
