import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-bg-base/80 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex h-10 max-w-3xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-accent-start" />
          <span className="font-semibold text-slate-100">ShortenURL</span>
        </Link>

        <Dropdown
          trigger={
            <button
              className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:bg-white/[0.08] hover:shadow-glowSm"
              aria-label="Account menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-start/20 text-accent-start">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </span>
              <span className="hidden sm:inline">{user?.name}</span>
            </button>
          }
        >
          <DropdownItem onSelect={() => navigate("/profile")}>
            <UserIcon className="h-4 w-4" /> Profile
          </DropdownItem>
          <DropdownItem onSelect={() => navigate("/settings")}>
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
