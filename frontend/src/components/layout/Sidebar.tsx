import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Link2, PlusCircle, User, Settings, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/urls', label: 'My URLs', icon: Link2 },
  { to: '/urls/new', label: 'Create URL', icon: PlusCircle },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'z-40 w-64 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-lg shadow-glass transition-transform duration-200',
          'fixed inset-y-4 left-4 md:static md:inset-auto md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] md:translate-x-0'
        )}
      >
        <div className="mb-3 flex items-center justify-between md:hidden">
          <span className="font-semibold text-gray-100">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-xl p-1.5 text-slate-400 transition-all duration-200 hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to !== '/urls'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-glow'
                    : 'text-slate-300 hover:bg-white/5'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
