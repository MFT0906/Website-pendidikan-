import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import {
  BookOpen,
  Users,
  ClipboardList,
  Clock,
  Calendar,
  ChevronRight,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Props {
  userId: string;
}

export default async function DosenDashboard({ userId }: Props) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      mataKuliahDosen: {
        include: {
          enrollments: true,
          jadwal: true,
          tugas: {
            include: {
              submissions: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const totalMK = user.mataKuliahDosen.length;
  const totalMahasiswa = new Set(
    user.mataKuliahDosen.flatMap((mk) => mk.enrollments.map((e) => e.userId))
  ).size;
  const totalTugas = user.mataKuliahDosen.reduce(
    (acc, mk) => acc + mk.tugas.length,
    0
  );
  const tugasBelumDinilai = user.mataKuliahDosen.reduce(
    (acc, mk) =>
      acc +
      mk.tugas.reduce(
        (a, t) => a + t.submissions.filter((s) => s.nilai === null).length,
        0
      ),
    0
  );

  const hariIni = new Date()
    .toLocaleDateString("id-ID", { weekday: "long" })
    .toUpperCase();

  const jadwalHariIni = user.mataKuliahDosen
    .flatMap((mk) =>
      mk.jadwal
        .filter((j) => j.hari === hariIni)
        .map((j) => ({ ...j, mataKuliah: mk }))
    )
    .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));

  return (
    <>
      <Header
        title={`Portal Dosen • ${user.name.split(" ")[0]}`}
        subtitle="Manajemen perkuliahan, penugasan, dan evaluasi mahasiswa"
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Hero Tile (Apple product-tile-light style) */}
        <div className="p-6 sm:p-8 rounded-[18px] bg-white border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[12px] font-semibold text-[#0066cc] uppercase tracking-wider">
              Ruang Dosen & Peneliti
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight leading-tight mt-1.5">
              Selamat bertugas, {user.name}.
            </h2>
            <p className="text-[15px] text-[#7a7a7a] mt-2 leading-relaxed">
              Anda mengampu {totalMK} mata kuliah aktif semester ini. Terdapat {tugasBelumDinilai} tugas mahasiswa yang menunggu evaluasi Anda.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/tugas"
              className="px-5 py-2.5 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-medium rounded-full btn-press flex items-center gap-1.5 shadow-2xs"
            >
              Evaluasi Tugas
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Mata Kuliah Diampu"
            value={totalMK}
            icon={<BookOpen className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Semester aktif ini"
            trend={`${totalMK} Kelas`}
          />
          <StatCard
            title="Mahasiswa Bimbingan"
            value={totalMahasiswa}
            icon={<Users className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Total seluruh kelas"
          />
          <StatCard
            title="Penugasan Diberikan"
            value={totalTugas}
            icon={<ClipboardList className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Tugas aktif"
          />
          <StatCard
            title="Menunggu Penilaian"
            value={tugasBelumDinilai}
            icon={<AlertCircle className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Submission mahasiswa"
            trend={tugasBelumDinilai > 0 ? "Perlu Diperiksa" : "Semua Tuntas"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jadwal Hari Ini */}
          <div className="lg:col-span-1 bg-white rounded-[18px] border border-[#e0e0e0] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#7a7a7a]" />
                  Jadwal Mengajar Hari Ini
                </h3>
                <span className="text-[12px] font-medium text-[#7a7a7a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                  {hariIni}
                </span>
              </div>

              {jadwalHariIni.length === 0 ? (
                <div className="text-center py-12 text-[#7a7a7a]">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#1d1d1f]" />
                  <p className="text-[14px]">Tidak ada agenda mengajar hari ini</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jadwalHariIni.map((j) => (
                    <div
                      key={j.id}
                      className="p-3.5 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0] transition-colors"
                    >
                      <p className="text-[15px] font-semibold text-[#1d1d1f]">
                        {j.mataKuliah.nama}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-[#7a7a7a]">
                        <Clock className="w-3.5 h-3.5 text-[#7a7a7a]" />
                        <span>
                          {j.jamMulai} – {j.jamSelesai}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#7a7a7a] mt-0.5 font-normal">
                        {j.ruangan} • {j.mataKuliah.enrollments.length} mahasiswa
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#f0f0f0]">
              <Link
                href="/dashboard/mata-kuliah"
                className="text-[14px] text-[#0066cc] hover:underline flex items-center gap-1 font-normal btn-press"
              >
                Semua mata kuliah diampu
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mata Kuliah Diampu */}
          <div className="lg:col-span-2 bg-white rounded-[18px] border border-[#e0e0e0] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-4">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7a7a7a]" />
                Mata Kuliah Diampu
              </h3>
              <Link
                href="/dashboard/mata-kuliah"
                className="text-[13px] text-[#0066cc] hover:underline font-normal btn-press flex items-center gap-0.5"
              >
                Lihat Semua ({totalMK})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {user.mataKuliahDosen.map((mk) => (
                <Link
                  key={mk.id}
                  href={`/dashboard/mata-kuliah/${mk.id}`}
                  className="p-4 rounded-[14px] border border-[#e0e0e0] bg-[#f5f5f7] hover:border-[#1d1d1f]/30 transition-all btn-press block group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#e0e0e0] text-[#7a7a7a]">
                      {mk.kode}
                    </span>
                    <span className="text-[12px] text-[#7a7a7a]">
                      {mk.sks} SKS
                    </span>
                  </div>

                  <h4 className="text-[15px] font-semibold text-[#1d1d1f] mt-2.5 group-hover:text-[#0066cc] transition-colors truncate">
                    {mk.nama}
                  </h4>
                  <p className="text-[12px] text-[#7a7a7a] truncate mt-0.5">
                    Semester {mk.semester} • {mk.enrollments.length} Mahasiswa
                  </p>

                  <div className="mt-3.5 pt-2.5 border-t border-[#e0e0e0] flex justify-between items-center text-[12px] text-[#7a7a7a]">
                    <span>{mk.tugas.length} Tugas diberikan</span>
                    <span className="text-[#0066cc] font-medium group-hover:underline">Buka Kelas</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
