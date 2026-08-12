import { Outlet } from "react-router-dom";
import { Link2 } from "lucide-react";
import { AmbientBackground } from "@/components/layout/AmbientBackground";

export function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-bg-base px-4 py-12">
      <AmbientBackground />
      <div className="mb-8 flex items-center gap-2 text-xl font-semibold text-slate-100">
        <Link2 className="h-6 w-6 text-accent-start" />
        ShortenURL
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
