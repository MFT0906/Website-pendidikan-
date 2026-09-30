"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, Sparkles } from "lucide-react";

interface QuickAccount {
  name: string;
  email: string;
  roleLabel: string;
}

const QUICK_ACCOUNTS: QuickAccount[] = [
  {
    name: "Budi Santoso",
    email: "budi@student.learnmate.ac.id",
    roleLabel: "Mahasiswa",
  },
  {
    name: "Dr. Ahmad Fauzi",
    email: "dr.ahmad@learnmate.ac.id",
    roleLabel: "Dosen",
  },
  {
    name: "Admin Campus",
    email: "admin@learnmate.ac.id",
    roleLabel: "Administrator",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        setError("Email atau sandi tidak sesuai.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (accEmail: string) => {
    setEmail(accEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-[420px]">
        {/* Apple Product Graphic Hero */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-[24px] flex items-center justify-center shadow-apple-product mb-8 border border-[#e0e0e0]">
            <GraduationCap className="w-12 h-12 text-[#0066cc]" />
          </div>
          <h1 className="text-[40px] font-semibold tracking-0 leading-[1.1]">
            LearnMate Campus.
          </h1>
          <p className="text-[28px] font-normal tracking-[0.196px] mt-2 text-[#7a7a7a]">
            Portal akademik masa depan.
          </p>
        </div>

        <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-[14px] text-[#ff3b30] text-center font-medium">
                {error}
              </p>
            )}

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Kampus"
                className="w-full h-[44px] px-5 bg-white border border-[#e0e0e0] rounded-full text-[17px] focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all placeholder-[#7a7a7a]"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                className="w-full h-[44px] px-5 bg-white border border-[#e0e0e0] rounded-full text-[17px] focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] transition-all placeholder-[#7a7a7a]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] bg-[#0066cc] text-white rounded-full text-[17px] font-normal btn-press transition-colors disabled:opacity-50"
            >
              {loading ? "Menyambungkan..." : "Masuk"}
            </button>
          </form>
        </div>

        {/* Developer Quick Links */}
        <div className="mt-8 pt-8 border-t border-[#e0e0e0] text-center">
          <div className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#7a7a7a] tracking-tight mb-4">
            <Sparkles className="w-4 h-4" />
            Quick Login (Developer)
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {QUICK_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc.email)}
                className="px-4 py-2 bg-[#e8e8ed] text-[#1d1d1f] rounded-full text-[14px] font-normal tracking-[-0.224px] btn-press transition-colors hover:bg-[#d2d2d7]"
              >
                {acc.name} <span className="text-[#7a7a7a]">({acc.roleLabel})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
