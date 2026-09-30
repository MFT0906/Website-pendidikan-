import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { User, Mail, Shield, GraduationCap, Database } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;
  const role = (user as any).role;

  return (
    <>
      <Header
        title="Pengaturan Akun"
        subtitle="Profil pengguna dan konfigurasi sistem LearnMate Campus"
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-6">
            Informasi Profil
          </h3>

          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xl font-semibold shrink-0">
              {(user.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h4 className="text-[19px] font-semibold text-[#1d1d1f] tracking-tight">
                {user.name}
              </h4>
              <p className="text-[14px] text-[#7a7a7a] font-mono mt-0.5">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]">
                  <Shield className="w-3 h-3 text-[#0066cc]" />
                  {role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a7a]" />
                <input
                  type="text"
                  defaultValue={user.name || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-[14px] text-[#1d1d1f] focus:outline-hidden"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-2">
                Email Terdaftar
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a7a]" />
                <input
                  type="email"
                  defaultValue={user.email || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-[14px] text-[#1d1d1f] focus:outline-hidden"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-2">
                Hak Akses (Role)
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a7a]" />
                <input
                  type="text"
                  defaultValue={role}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full text-[14px] text-[#1d1d1f] focus:outline-hidden"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Database & Environment Card */}
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0066cc]" />
            Konfigurasi Sistem
          </h3>

          <div className="space-y-3 text-[14px]">
            <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]">
              <span className="text-[#1d1d1f]">Database Driver</span>
              <span className="font-mono text-[12px] font-semibold text-[#1d1d1f] bg-white px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                SQLite (file:./dev.db)
              </span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]">
              <span className="text-[#1d1d1f]">Desain Sistem</span>
              <span className="font-mono text-[12px] font-semibold text-[#0066cc] bg-white px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                Apple Design Specification (DESIGN.md)
              </span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]">
              <span className="text-[#1d1d1f]">Versi Platform</span>
              <span className="font-mono text-[12px] text-[#7a7a7a]">v4.8.2-apple</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
