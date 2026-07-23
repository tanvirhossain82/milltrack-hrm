import type { ReactNode } from 'react';
import { PageHeader, Card, Badge, Avatar, EmptyState, StatCard, Table, formatCurrency } from '@/components/ui';
import { useStore } from '@/store/useStore';
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

type Column = { key: string; label: string; render?: (row: any) => ReactNode; align?: 'left' | 'right' };

type Props = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  stats: { label: string; value: string | number; color?: string }[];
  columns: Column[];
  data: any[];
  empName?: (id: string) => string;
  emptyMessage: string;
};

export function GenericModulePage({ title, subtitle, icon: Icon, stats, columns, data, emptyMessage }: Props) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      {stats.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} icon={Icon as any} color={s.color ?? 'indigo'} />
          ))}
        </div>
      )}
      {data.length === 0 ? (
        <Card><EmptyState message={emptyMessage} /></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table headers={columns.map((c) => c.label)}>
            {data.map((row, i) => (
              <tr key={row.id ?? i} className="hover:bg-slate-50/60">
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3 ${col.align === 'right' ? 'text-right' : 'text-left'} text-slate-600`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </div>
  );
}

export function useEmpName() {
  const { employees } = useStore();
  return (id: string) => employees.find((e) => e.id === id)?.name ?? 'Unknown';
}
