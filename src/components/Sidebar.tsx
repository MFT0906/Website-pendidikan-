"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CheckSquare,
  BarChart,
  Settings,
  LogOut,
  GraduationCap,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  role?: "MAHASISWA" | "DOSEN" | "ADMIN" | string;
  userName?: string;
  userEmail?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  role: propRole,
  userName: propUserName,
  userEmail: propUserEmail,
  isOpen = false,
  onClose,
}: SidebarProps = {}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = propRole || (session?.user as any)?.role || "MAHASISWA";
  const userName = propUserName || session?.user?.name || "User";
  const userEmail = propUserEmail || session?.user?.email || "";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Mata Kuliah", href: "/dashboard/mata-kuliah" },
    { icon: FileText, label: "Tugas", href: "/dashboard/tugas" },
    { icon: CheckSquare, label: "Quiz & Evaluasi", href: "/dashboard/quiz" },
    { icon: BarChart, label: "Nilai", href: "/dashboard/nilai" },
  ];

  if (role === "DOSEN") {
    menuItems.splice(2, 0, {
      icon: Users,
      label: "Mahasiswa",
      href: "/dashboard/mahasiswa",
    });
  }

  const sidebarContent = (
    <aside className="w-64 bg-[#f5f5f7] border-r border-[#e0e0e0] flex flex-col h-full overflow-hidden text-[#1d1d1f]">
      {/* Logo Area */}
      <div className="h-[52px] flex items-center justify-between px-5 border-b border-[#e0e0e0]">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-7 h-7 bg-[#0066cc] rounded-[8px] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[17px] tracking-[-0.374px]">
            LearnMate
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 text-[#1d1d1f] hover:bg-[#e8e8ed] rounded-full btn-press"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="p-5 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[#1d1d1f] font-semibold text-[14px]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-[14px] font-semibold tracking-[-0.224px] truncate">
              {userName}
            </p>
            <p className="text-[12px] text-[#7a7a7a] truncate font-normal">
              {userEmail}
            </p>
          </div>
        </div>
        <div className="mt-[12px] inline-block px-[10px] py-[3px] bg-white text-[#1d1d1f] text-[11px] font-medium tracking-wide rounded-full border border-[#e0e0e0]">
          {role}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-[#7a7a7a] uppercase tracking-wide mb-[10px]">
          Menu Utama
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-[9px] rounded-full text-[14px] font-normal tracking-[-0.224px] btn-press transition-colors ${
                isActive
                  ? "bg-[#0066cc] text-white font-medium"
                  : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-[#7a7a7a]"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#e0e0e0] space-y-1 bg-[#f5f5f7]">
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-[9px] rounded-full text-[14px] font-normal tracking-[-0.224px] btn-press transition-colors ${
            pathname === "/dashboard/settings"
              ? "bg-[#0066cc] text-white font-medium"
              : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
          }`}
        >
          <Settings className={`w-[18px] h-[18px] ${pathname === "/dashboard/settings" ? "text-white" : "text-[#7a7a7a]"}`} />
          Pengaturan
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-[9px] rounded-full text-[14px] font-normal tracking-[-0.224px] text-[#1d1d1f] hover:bg-[#e8e8ed] btn-press transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] text-[#7a7a7a]" />
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:block fixed left-0 top-0 h-screen z-40">
        {sidebarContent}
      </div>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={onClose}
          className="absolute inset-0 bg-[#000000]/40 backdrop-blur-sm transition-opacity"
        />

        <div
          className={`relative z-10 w-64 h-full transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
