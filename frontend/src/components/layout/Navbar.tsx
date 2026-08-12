import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/useAuth';
import { useTheme } from '@/store/useTheme';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-gray-900 dark:text-gray-100">URL Shortener</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </span>
              <span className="hidden sm:inline">{user?.name}</span>
            </button>
          }
        >
          <DropdownItem onSelect={() => navigate('/profile')}>
            <UserIcon className="h-4 w-4" /> Profile
          </DropdownItem>
          <DropdownItem onSelect={() => navigate('/settings')}>
            <SettingsIcon className="h-4 w-4" /> Settings
          </DropdownItem>
          <DropdownItem onSelect={handleLogout} destructive>
            <LogOut className="h-4 w-4" /> Logout
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
