"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useDashboard } from "./DashboardShell";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  const { toggleMobileMenu } = useDashboard();

  return (
    <header className="sticky top-0 z-30 h-[52px] bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-[#e0e0e0] px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-1.5 -ml-1 text-[#1d1d1f] hover:bg-[#e8e8ed] rounded-full transition-colors btn-press shrink-0"
          aria-label="Buka navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-[19px] sm:text-[21px] font-semibold text-[#1d1d1f] tracking-tight leading-none truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-[#7a7a7a] truncate mt-0.5 hidden sm:block font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {action}

        {/* Search Input (matching search-input spec from DESIGN.md: pill-shaped, hairline border, 44px) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a7a]" />
          <input
            type="text"
            placeholder="Cari..."
            className="pl-9 pr-12 py-1.5 bg-white border border-[#e0e0e0] rounded-full text-[14px] text-[#1d1d1f] placeholder-[#7a7a7a] focus:outline-hidden focus:ring-2 focus:ring-[#0071e3] w-56 lg:w-64 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[#7a7a7a] bg-[#f5f5f7] border border-[#e0e0e0] px-1.5 py-0.2 rounded-full">
            ⌘K
          </span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-[#1d1d1f] hover:bg-[#e8e8ed] rounded-full transition-colors btn-press"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0066cc] rounded-full ring-2 ring-[#f5f5f7]" />
        </button>
      </div>
    </header>
  );
}
