"use client";

import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-slate-600">
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
          <div className="bg-brand-100 text-brand-700 rounded-full w-8 h-8 flex items-center justify-center">
            <UserIcon size={16} />
          </div>
          <span className="font-medium">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
