import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Database,
  ArrowRight,
  Server,
  Layers,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface Props {
  userId: string;
}

export default async function AdminDashboard({ userId }: Props) {
  const admin = await prisma.user.findUnique({
    where: { id: userId },
  });

  const [
    totalMahasiswa,
    totalDosen,
    totalMataKuliah,
    totalTugas,
    totalQuiz,
    allMataKuliah,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MAHASISWA" } }),
    prisma.user.count({ where: { role: "DOSEN" } }),
    prisma.mataKuliah.count(),
    prisma.tugas.count(),
    prisma.quiz.count(),
    prisma.mataKuliah.findMany({
      take: 4,
      include: {
        dosen: true,
        enrollments: true,
        jadwal: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        nim: true,
        nip: true,
      },
    }),
  ]);

  return (
    <>
      <Header
        title="Pusat Kendali Administrator"
        subtitle="Monitoring kesehatan sistem, kurikulum, dan akun civitas akademika"
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Dark Tile Hero (matching product-tile-dark from DESIGN.md: surface-tile-1 #272729) */}
        <div className="p-6 sm:p-8 rounded-[18px] bg-[#272729] text-white border border-[#333333] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[12px] font-semibold text-[#2997ff] uppercase tracking-wider">
              Pusat Administrasi & Kendali
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight leading-tight mt-1.5">
              LearnMate Campus Controller
            </h2>
            <p className="text-[15px] text-[#cccccc] mt-2 leading-relaxed">
              Selamat bertugas, {admin?.name || "Administrator"}. Seluruh modul database SQLite lokal, autentikasi NextAuth, dan rute aplikasi beroperasi normal.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/mata-kuliah"
              className="px-5 py-2.5 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-medium rounded-full btn-press flex items-center gap-1.5 shadow-2xs"
            >
              Kelola Mata Kuliah
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid (store-utility-card style from DESIGN.md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Mahasiswa"
            value={totalMahasiswa}
            icon={<GraduationCap className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Mahasiswa terdaftar"
            trend="+ Aktif"
          />
          <StatCard
            title="Dosen & Peneliti"
            value={totalDosen}
            icon={<Users className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Tenaga pendidik"
          />
          <StatCard
            title="Mata Kuliah"
            value={totalMataKuliah}
            icon={<BookOpen className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Kurikulum aktif"
          />
          <StatCard
            title="Tugas & Kuis"
            value={totalTugas + totalQuiz}
            icon={<ClipboardList className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle={`${totalTugas} tugas • ${totalQuiz} kuis`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Engine & Quick Navigation */}
          <div className="space-y-6 lg:col-span-1">
            {/* System Status Card */}
            <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#7a7a7a]" />
                Status Infrastruktur
              </h3>
              <div className="space-y-3 text-[14px]">
                <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]">
                  <span className="text-[#1d1d1f] flex items-center gap-2 font-normal">
                    <Database className="w-4 h-4 text-[#0066cc]" />
                    Database
                  </span>
                  <span className="text-[12px] font-semibold text-[#1d1d1f] bg-white px-2 py-0.5 rounded-full border border-[#e0e0e0]">
                    SQLite Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]">
                  <span className="text-[#1d1d1f] flex items-center gap-2 font-normal">
                    <ShieldCheck className="w-4 h-4 text-[#0066cc]" />
                    Autentikasi
                  </span>
                  <span className="text-[12px] font-semibold text-[#1d1d1f] bg-white px-2 py-0.5 rounded-full border border-[#e0e0e0]">
                    NextAuth v5 (JWT)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]">
                  <span className="text-[#1d1d1f] flex items-center gap-2 font-normal">
                    <CheckCircle2 className="w-4 h-4 text-[#0066cc]" />
                    Server Runtime
                  </span>
                  <span className="text-[12px] font-medium text-[#0066cc] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse" />
                    200 OK
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Card */}
            <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-3">
                Aksi Cepat
              </h3>
              <div className="space-y-1.5">
                <Link
                  href="/dashboard/mata-kuliah"
                  className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#f5f5f7] text-[#1d1d1f] text-[14px] btn-press transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#7a7a7a]" />
                    Daftar Mata Kuliah
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#7a7a7a]" />
                </Link>
                <Link
                  href="/dashboard/mahasiswa"
                  className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#f5f5f7] text-[#1d1d1f] text-[14px] btn-press transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#7a7a7a]" />
                    Daftar Civitas Akademika
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#7a7a7a]" />
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-between p-2.5 rounded-[12px] hover:bg-[#f5f5f7] text-[#1d1d1f] text-[14px] btn-press transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-[#7a7a7a]" />
                    Pengaturan Akun & Sistem
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#7a7a7a]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mata Kuliah & Users List */}
          <div className="space-y-6 lg:col-span-2">
            {/* Courses Overview */}
            <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#7a7a7a]" />
                  Kurikulum Mata Kuliah
                </h3>
                <Link
                  href="/dashboard/mata-kuliah"
                  className="text-[13px] text-[#0066cc] hover:underline font-normal btn-press flex items-center gap-0.5"
                >
                  Lihat Semua ({totalMataKuliah})
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {allMataKuliah.map((mk) => (
                  <div
                    key={mk.id}
                    className="p-3.5 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#1d1d1f] truncate">
                          {mk.nama}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#e0e0e0] text-[#7a7a7a]">
                          {mk.kode}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#7a7a7a] mt-0.5 truncate">
                        Dosen: {mk.dosen.name} • {mk.sks} SKS • Semester {mk.semester}
                      </p>
                    </div>
                    <span className="text-[12px] font-medium text-[#1d1d1f] bg-white px-2.5 py-0.5 rounded-full border border-[#e0e0e0] shrink-0">
                      {mk.enrollments.length} Mahasiswa
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7a7a7a]" />
                Pengguna Terdaftar Terkini
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[#f0f0f0] text-[#7a7a7a] font-normal text-left">
                      <th className="pb-2.5">Nama</th>
                      <th className="pb-2.5">Email</th>
                      <th className="pb-2.5">Peran</th>
                      <th className="pb-2.5 text-right">Identitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {recentUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#f5f5f7]/60">
                        <td className="py-3 font-semibold text-[#1d1d1f]">{u.name}</td>
                        <td className="py-3 text-[#7a7a7a] font-mono text-[12px]">{u.email}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-[12px] text-[#7a7a7a]">
                          {u.nim ? `NIM: ${u.nim}` : u.nip ? `NIP: ${u.nip}` : "Sistem"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
