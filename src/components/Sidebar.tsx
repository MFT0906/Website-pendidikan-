"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Users,
  ShieldCheck,
  X,
  Database,
} from "lucide-react";

interface SidebarProps {
  role: "MAHASISWA" | "DOSEN" | "ADMIN";
  userName: string;
  userEmail: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const mahasiswaMenu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mata-kuliah", label: "Mata Kuliah", icon: BookOpen },
  { href: "/dashboard/tugas", label: "Tugas", icon: ClipboardList },
  { href: "/dashboard/quiz", label: "Quiz & Evaluasi", icon: FileText },
  { href: "/dashboard/nilai", label: "Nilai", icon: BarChart3 },
];

const dosenMenu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mata-kuliah", label: "Mata Kuliah", icon: BookOpen },
  { href: "/dashboard/mahasiswa", label: "Mahasiswa", icon: Users },
  { href: "/dashboard/tugas", label: "Tugas & Penilaian", icon: ClipboardList },
  { href: "/dashboard/quiz", label: "Quiz & Evaluasi", icon: FileText },
];

const adminMenu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mata-kuliah", label: "Mata Kuliah", icon: BookOpen },
  { href: "/dashboard/mahasiswa", label: "Civitas Mahasiswa", icon: Users },
  { href: "/dashboard/tugas", label: "Semua Tugas", icon: ClipboardList },
  { href: "/dashboard/quiz", label: "Bank Quiz", icon: FileText },
];

export default function Sidebar({
  role,
  userName,
  userEmail,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const menu =
    role === "ADMIN"
      ? adminMenu
      : role === "DOSEN"
      ? dosenMenu
      : mahasiswaMenu;

  const roleLabel =
    role === "ADMIN"
      ? "Administrator"
      : role === "DOSEN"
      ? "Dosen & Peneliti"
      : "Mahasiswa";

  const sidebarContent = (
    <aside className="w-64 bg-[#f5f5f7] min-h-screen flex flex-col border-r border-[#e0e0e0] select-none text-[#1d1d1f]">
      {/* Brand Header */}
      <div className="h-[52px] px-5 border-b border-[#e0e0e0] flex items-center justify-between bg-[#f5f5f7]">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white shrink-0 group-hover:bg-[#0066cc] transition-colors btn-press">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight leading-none">
              LearnMate
            </span>
            <span className="text-[10px] font-semibold text-[#7a7a7a] tracking-widest uppercase">
              CAMPUS
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-[#7a7a7a] hover:text-[#1d1d1f] rounded-full hover:bg-[#e8e8ed] transition-colors btn-press"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Capsule */}
      <div className="p-4 mx-3 my-3 rounded-[18px] bg-white border border-[#e0e0e0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#1d1d1f] truncate leading-tight">
              {userName}
            </p>
            <p className="text-[12px] text-[#7a7a7a] truncate mt-0.5 font-normal">
              {userEmail}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#f0f0f0] flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]">
            {roleLabel}
          </span>
          <span className="text-[11px] text-[#7a7a7a] font-mono">SQLite</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="text-[11px] font-semibold text-[#7a7a7a] uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        {menu.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const ItemIcon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[14px] font-normal tracking-[-0.224px] btn-press transition-all ${
                isActive
                  ? "bg-[#0066cc] text-white font-medium shadow-2xs"
                  : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
              }`}
            >
              <ItemIcon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-white" : "text-[#7a7a7a]"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-3 border-t border-[#e0e0e0] space-y-1 bg-[#f5f5f7]">
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-3.5 py-2 rounded-full text-[14px] btn-press transition-all ${
            pathname === "/dashboard/settings"
              ? "bg-[#0066cc] text-white font-medium"
              : "text-[#1d1d1f] hover:bg-[#e8e8ed]"
          }`}
        >
          <Settings className="w-4 h-4 text-[#7a7a7a]" />
          <span>Pengaturan</span>
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-full text-[14px] text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#e8e8ed] btn-press transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen z-40">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
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
