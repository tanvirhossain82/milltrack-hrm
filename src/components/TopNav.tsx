import { useState } from 'react';
import { Search, Bell, ChevronDown, Building2, UserCircle, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Role } from '@/types';

const roles: Role[] = ['Admin', 'HR Manager', 'Line Manager', 'Employee'];

export default function TopNav() {
  const { branches, currentBranch, setBranch, notifications, markAllRead, markNotificationRead, currentRole, setRole, searchQuery, setSearch } = useStore();
  const [showBranch, setShowBranch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeBranch = branches.find((b) => b.id === currentBranch);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center gap-3">
      {/* Branch Selector */}
      <div className="relative">
        <button
          onClick={() => { setShowBranch(!showBranch); setShowNotif(false); setShowProfile(false); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 border border-slate-200 text-sm"
        >
          <Building2 className="h-4 w-4 text-indigo-600" />
          <span className="hidden sm:inline font-medium text-slate-700">{activeBranch?.name ?? 'Select Branch'}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
        {showBranch && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 animate-fade-in z-50">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => { setBranch(b.id); setShowBranch(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 ${currentBranch === b.id ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}
              >
                <div>
                  <p>{b.name}</p>
                  <p className="text-xs text-slate-400">{b.location}</p>
                </div>
                {currentBranch === b.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees, modules..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotif(!showNotif); setShowBranch(false); setShowProfile(false); }}
          className="relative h-10 w-10 rounded-lg flex items-center justify-center hover:bg-slate-50 border border-slate-200"
        >
          <Bell className="h-4 w-4 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {showNotif && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-xl shadow-lg border border-slate-200 animate-fade-in z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-700">Notifications</span>
              <button onClick={markAllRead} className="text-xs text-indigo-600 font-medium hover:underline">Mark all read</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 ${!n.read ? 'bg-indigo-50/30' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Switcher */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(!showProfile); setShowBranch(false); setShowNotif(false); }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-semibold text-xs">AD</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-700 leading-tight">Admin User</p>
            <p className="text-xs text-slate-400">{currentRole}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
        {showProfile && (
          <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 animate-fade-in z-50">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs text-slate-400 font-medium">Switch Role</p>
            </div>
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setShowProfile(false); }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 ${currentRole === r ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}
              >
                <span className="flex items-center gap-2"><UserCircle className="h-4 w-4" /> {r}</span>
                {currentRole === r && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
