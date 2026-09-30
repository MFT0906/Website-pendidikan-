"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  User,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  Copy,
  BookOpen,
  Award,
} from "lucide-react";

interface QuickAccount {
  name: string;
  email: string;
  role: "mahasiswa" | "dosen" | "admin";
  roleLabel: string;
  info: string;
  icon: typeof GraduationCap;
}

const QUICK_ACCOUNTS: QuickAccount[] = [
  {
    name: "Budi Santoso",
    email: "budi@student.learnmate.ac.id",
    role: "mahasiswa",
    roleLabel: "Mahasiswa",
    info: "NIM: 2024001001",
    icon: GraduationCap,
  },
  {
    name: "Dr. Ahmad Fauzi, M.Kom",
    email: "dr.ahmad@learnmate.ac.id",
    role: "dosen",
    roleLabel: "Dosen",
    info: "NIP: 198501012010011001",
    icon: User,
  },
  {
    name: "Administrator Kampus",
    email: "admin@learnmate.ac.id",
    role: "admin",
    roleLabel: "Admin",
    info: "Akses Utama",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [role, setRole] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const router = useRouter();

  const handleQuickLogin = async (accEmail: string, accPass: string = "password123", accRole?: string) => {
    setError("");
    setLoadingAccount(accEmail);
    setEmail(accEmail);
    setPassword(accPass);
    if (accRole === "dosen") {
      setRole("dosen");
    } else if (accRole === "mahasiswa") {
      setRole("mahasiswa");
    }

    try {
      const result = await signIn("credentials", {
        email: accEmail,
        password: accPass,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau kata sandi tidak cocok.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan saat memproses login.");
    } finally {
      setLoadingAccount(null);
    }
  };

  const handleFillOnly = (accEmail: string, accPass: string = "password123", accRole?: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    if (accRole === "dosen") {
      setRole("dosen");
    } else if (accRole === "mahasiswa") {
      setRole("mahasiswa");
    }
    setError("");
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText("password123");
    setCopiedText("password123");
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau kata sandi salah. Silakan coba lagi.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Left Side - Museum Gallery Hero Tile (matching product-tile-dark / light from DESIGN.md) */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#e0e0e0] relative overflow-hidden">
        <div>
          {/* Top Brand Logo */}
          <div className="flex items-center gap-2 mb-12 sm:mb-16">
            <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-[19px] font-semibold tracking-tight text-[#1d1d1f]">
              LearnMate
            </span>
            <span className="text-[10px] font-semibold text-[#7a7a7a] tracking-widest uppercase">
              CAMPUS
            </span>
          </div>

          {/* Hero Headlines (SF Pro Display 600, negative letter-spacing) */}
          <div className="max-w-lg">
            <p className="text-[#0066cc] font-semibold text-xs tracking-wider uppercase mb-3">
              Portal Akademik Terpadu
            </p>
            <h1 className="text-[36px] sm:text-[48px] lg:text-[54px] font-semibold text-[#1d1d1f] leading-[1.08] tracking-[-0.02em] mb-5">
              Ruang Belajar Masa Depan.
            </h1>
            <p className="text-[17px] text-[#7a7a7a] leading-[1.47] tracking-[-0.374px]">
              Dirancang dengan presisi untuk mendukung perkuliahan terstruktur, kurikulum digital, dan kolaborasi civitas academica dalam satu antarmuka yang tenang.
            </p>
          </div>

          {/* Signature Product Showcase with Apple Product Drop-Shadow */}
          <div className="mt-10 sm:mt-12 p-6 rounded-[18px] bg-[#f5f5f7] border border-[#e0e0e0] shadow-apple-product max-w-md">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0] text-xs">
              <span className="font-semibold text-[#1d1d1f] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0066cc]" />
                Semester Berjalan
              </span>
              <span className="text-[#0066cc] font-medium bg-white px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                2024/2025
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-[#1d1d1f]">Struktur Data</span>
                <span className="text-xs text-[#7a7a7a]">IF2101 • 3 SKS</span>
              </div>
              <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                <div className="h-full bg-[#0066cc] rounded-full w-3/4" />
              </div>
              <div className="flex justify-between text-[11px] text-[#7a7a7a] pt-1">
                <span>Evaluasi Quiz 1 & Tugas</span>
                <span className="text-[#0066cc] font-semibold">75% Tuntas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom System Status */}
        <div className="mt-8 pt-6 border-t border-[#f0f0f0] flex items-center justify-between text-[12px] text-[#7a7a7a]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse" />
            Sistem Aktif • Database SQLite
          </span>
          <span className="font-mono">v4.8.2</span>
        </div>
      </div>

      {/* Right Side - Form & Quick Access (Canvas Parchment #f5f5f7) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="mb-6">
            <h2 className="text-[28px] font-semibold text-[#1d1d1f] tracking-[-0.015em]">
              Masuk ke Akun Anda
            </h2>
            <p className="text-[15px] text-[#7a7a7a] mt-1">
              Gunakan email kampus atau pilih akun cepat pengembang di bawah.
            </p>
          </div>

          {/* Quick Development Shortcut Card (Apple store-utility-card style) */}
          <div className="mb-6 p-5 bg-white rounded-[18px] border border-[#e0e0e0]">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0066cc] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-[#0066cc]" />
                Akses Cepat Pengembang
              </div>
              <span className="text-[11px] text-[#7a7a7a] bg-[#f5f5f7] px-2 py-0.5 rounded-full border border-[#e0e0e0]">
                1-Click Login
              </span>
            </div>

            <div className="space-y-2">
              {QUICK_ACCOUNTS.map((acc) => {
                const IconComponent = acc.icon;
                const isThisLoading = loadingAccount === acc.email;

                return (
                  <div
                    key={acc.email}
                    className="flex items-center justify-between gap-2 p-2.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-[12px] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center shrink-0">
                        <IconComponent className="w-3.5 h-3.5 text-[#1d1d1f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#1d1d1f] truncate leading-tight">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-[#7a7a7a] truncate">
                          {acc.roleLabel} • {acc.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleFillOnly(acc.email, "password123", acc.role)}
                        disabled={loading || !!loadingAccount}
                        className="px-2.5 py-1 text-[11px] font-normal text-[#1d1d1f] hover:bg-white rounded-full border border-[#e0e0e0] btn-press"
                      >
                        Isi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(acc.email, "password123", acc.role)}
                        disabled={loading || !!loadingAccount}
                        className="px-3 py-1 text-[11px] font-medium text-white bg-[#0066cc] hover:bg-[#0071e3] rounded-full btn-press flex items-center gap-1 disabled:opacity-60"
                      >
                        {isThisLoading ? "Masuk..." : "Masuk"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#f0f0f0] flex items-center justify-between text-[12px] text-[#7a7a7a]">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#7a7a7a]" />
                Password semua akun: <code className="font-mono text-[#1d1d1f] font-semibold">password123</code>
              </span>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="text-[12px] font-normal text-[#0066cc] hover:underline flex items-center gap-1 btn-press"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Salin
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Role Segmented Pill Control */}
          <div className="flex p-1 bg-[#e0e0e0]/60 rounded-full mb-6">
            <button
              type="button"
              onClick={() => setRole("mahasiswa")}
              className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all btn-press ${
                role === "mahasiswa"
                  ? "bg-white text-[#1d1d1f] shadow-2xs"
                  : "text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => setRole("dosen")}
              className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all btn-press ${
                role === "dosen"
                  ? "bg-white text-[#1d1d1f] shadow-2xs"
                  : "text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              Dosen & Peneliti
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-xs leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">
                Email Kampus
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#7a7a7a]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "mahasiswa" ? "budi@student.learnmate.ac.id" : "dr.ahmad@learnmate.ac.id"}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-[#e0e0e0] rounded-full text-[15px] text-[#1d1d1f] placeholder-[#7a7a7a] focus:ring-2 focus:ring-[#0071e3] focus:outline-hidden transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#7a7a7a]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="block w-full pl-10 pr-11 py-2.5 bg-white border border-[#e0e0e0] rounded-full text-[15px] text-[#1d1d1f] placeholder-[#7a7a7a] focus:ring-2 focus:ring-[#0071e3] focus:outline-hidden transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7a7a7a] hover:text-[#1d1d1f] btn-press"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#7a7a7a]">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#e0e0e0] text-[#0066cc] focus:ring-[#0071e3]"
                />
                <span>Ingat saya</span>
              </label>
              <span className="text-[#0066cc] hover:underline cursor-pointer">
                Lupa kata sandi?
              </span>
            </div>

            {/* button-primary (Action Blue #0066cc, rounded-pill, 11px 22px) */}
            <button
              type="submit"
              disabled={loading || !!loadingAccount}
              className="w-full py-3 bg-[#0066cc] hover:bg-[#0071e3] text-white font-normal text-[17px] rounded-full transition-all duration-150 flex items-center justify-center gap-2 btn-press disabled:opacity-60 shadow-2xs mt-3 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk ke Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Fine-print */}
          <div className="mt-8 text-center text-[12px] text-[#7a7a7a]">
            LearnMate Campus • Ditenagai oleh Next.js & SQLite Prisma ORM
          </div>
        </div>
      </div>
    </div>
  );
}
