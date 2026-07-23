import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navGroups, type NavItem } from '@/lib/nav';

type Props = {
  current: string;
  onNavigate: (key: string) => void;
};

export default function MobileNav({ current, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  function navigate(key: string) {
    onNavigate(key);
    setOpen(false);
  }

  function toggleGroup(cat: string) {
    setOpenGroups((p) => ({ ...p, [cat]: !p[cat] }));
  }

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">HR</span>
          </div>
          <span className="text-white font-semibold text-sm">Smart HRM</span>
        </div>
        <button onClick={() => setOpen(true)} className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-72 max-w-[80vw] bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-800 shrink-0">
              <span className="text-white font-semibold text-sm">Navigation</span>
              <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-3 sidebar-scroll">
              {navGroups.map((group) => {
                const isOpen = openGroups[group.category] ?? true;
                return (
                  <div key={group.category}>
                    <button onClick={() => toggleGroup(group.category)} className="w-full flex items-center justify-between px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {group.category}
                      <ChevronDown className={`h-3 w-3 transition-transform ${!isOpen ? '-rotate-90' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <MobileNavButton key={item.key} item={item} active={current === item.key} onNavigate={navigate} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavButton({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate: (k: string) => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onNavigate(item.key)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
      <span className="truncate flex-1 text-left">{item.label}</span>
    </button>
  );
}
