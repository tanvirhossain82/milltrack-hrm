import { useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeft } from 'lucide-react';
import { navGroups, type NavItem } from '@/lib/nav';

type Props = {
  current: string;
  onNavigate: (key: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export default function Sidebar({ current, onNavigate, collapsed, onToggleCollapse }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  function toggle(category: string) {
    if (collapsed) return;
    setOpenGroups((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  return (
    <aside className={`hidden md:flex ${collapsed ? 'w-16' : 'w-64'} shrink-0 flex-col bg-slate-900 border-r border-slate-800 h-screen sticky top-0 transition-all duration-200`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 h-16 border-b border-slate-800 shrink-0`}>
        {collapsed ? (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">HR</span>
          </div>
        ) : (
          <>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Smart HRM</p>
              <p className="text-slate-400 text-xs">Payroll System</p>
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-3 sidebar-scroll">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.category] ?? true;
          return (
            <div key={group.category}>
              {!collapsed && (
                <button
                  onClick={() => toggle(group.category)}
                  className="w-full flex items-center justify-between px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
                >
                  {group.category}
                  <ChevronDown className={`h-3 w-3 transition-transform ${!isOpen ? '-rotate-90' : ''}`} />
                </button>
              )}
              {collapsed && <div className="h-px bg-slate-800 my-2 mx-1" />}
              {isOpen && (
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavButton key={item.key} item={item} active={current === item.key} onNavigate={onNavigate} collapsed={collapsed} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 shrink-0 p-2">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" /> <span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}

function NavButton({ item, active, onNavigate, collapsed }: { item: NavItem; active: boolean; onNavigate: (k: string) => void; collapsed: boolean }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onNavigate(item.key)}
      title={collapsed ? item.label : undefined}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
      {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
    </button>
  );
}
