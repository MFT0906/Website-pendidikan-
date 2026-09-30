import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import {
  BookOpen,
  ClipboardList,
  Trophy,
  Clock,
  Calendar,
  ChevronRight,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Props {
  userId: string;
}

export default async function MahasiswaDashboard({ userId }: Props) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          mataKuliah: {
            include: {
              dosen: true,
              jadwal: true,
              materi: true,
            },
          },
        },
      },
      quizAttempts: {
        include: { quiz: { include: { mataKuliah: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      submissions: {
        include: { tugas: { include: { mataKuliah: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) return null;

  const totalMK = user.enrollments.length;
  const totalMateri = user.enrollments.reduce(
    (acc, e) => acc + e.mataKuliah.materi.length,
    0
  );
  const materiSelesai = user.enrollments.reduce(
    (acc, e) => acc + e.mataKuliah.materi.filter((m) => m.selesai).length,
    0
  );
  const avgNilai =
    user.quizAttempts.length > 0
      ? Math.round(
          user.quizAttempts.reduce((acc, a) => acc + a.nilai, 0) /
            user.quizAttempts.length
        )
      : 0;

  const hariMap: Record<string, string> = {
    SENIN: "Senin",
    SELASA: "Selasa",
    RABU: "Rabu",
    KAMIS: "Kamis",
    JUMAT: "Jumat",
    SABTU: "Sabtu",
  };

  const hariIni = new Date()
    .toLocaleDateString("id-ID", { weekday: "long" })
    .toUpperCase();

  const jadwalHariIni = user.enrollments
    .flatMap((e) =>
      e.mataKuliah.jadwal
        .filter((j) => j.hari === hariIni)
        .map((j) => ({
          ...j,
          mataKuliah: e.mataKuliah,
        }))
    )
    .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));

  return (
    <>
      <Header
        title={`Ringkasan Belajar • ${user.name.split(" ")[0]}`}
        subtitle="Pantau mata kuliah, jadwal perkuliahan, dan tugas semester ini"
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Hero Tile (Apple product-tile-light on parchment canvas) */}
        <div className="p-6 sm:p-8 rounded-[18px] bg-white border border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[12px] font-semibold text-[#0066cc] uppercase tracking-wider">
              Portal Akademik Mahasiswa
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight leading-tight mt-1.5">
              Selamat datang kembali, {user.name.split(" ")[0]}.
            </h2>
            <p className="text-[15px] text-[#7a7a7a] mt-2 leading-relaxed">
              Anda terdaftar pada {totalMK} mata kuliah semester ini. Terus pantau jadwal dan kerjakan tugas sebelum tenggat waktu.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/mata-kuliah"
              className="px-5 py-2.5 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-medium rounded-full btn-press flex items-center gap-1.5 shadow-2xs"
            >
              Lihat Mata Kuliah
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid (store-utility-card style from DESIGN.md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Mata Kuliah Aktif"
            value={totalMK}
            icon={<BookOpen className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Semester aktif ini"
            trend={`${totalMK} MK Terdaftar`}
          />
          <StatCard
            title="Tugas Terkumpul"
            value={user.submissions.length}
            icon={<ClipboardList className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Total penyerahan tugas"
          />
          <StatCard
            title="Rata-rata Nilai"
            value={avgNilai}
            icon={<Trophy className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Dari evaluasi quiz"
            trend={avgNilai >= 80 ? "Sangat Baik" : "Baik"}
          />
          <StatCard
            title="Progres Materi"
            value={`${totalMateri > 0 ? Math.round((materiSelesai / totalMateri) * 100) : 0}%`}
            icon={<CheckCircle2 className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle={`${materiSelesai} dari ${totalMateri} materi selesai`}
          />
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jadwal Hari Ini */}
          <div className="lg:col-span-1 bg-white rounded-[18px] border border-[#e0e0e0] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#7a7a7a]" />
                  Jadwal Hari Ini
                </h3>
                <span className="text-[12px] font-medium text-[#7a7a7a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                  {hariMap[hariIni] || hariIni}
                </span>
              </div>

              {jadwalHariIni.length === 0 ? (
                <div className="text-center py-12 text-[#7a7a7a]">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#1d1d1f]" />
                  <p className="text-[14px]">Tidak ada perkuliahan hari ini</p>
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
                        {j.ruangan}
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
                Lihat semua mata kuliah
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mata Kuliah Grid */}
          <div className="lg:col-span-2 bg-white rounded-[18px] border border-[#e0e0e0] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-4">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7a7a7a]" />
                Mata Kuliah Semester Ini
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
              {user.enrollments.slice(0, 4).map((e) => {
                const progress =
                  e.mataKuliah.materi.length > 0
                    ? Math.round(
                        (e.mataKuliah.materi.filter((m) => m.selesai).length /
                          e.mataKuliah.materi.length) *
                          100
                      )
                    : 0;
                return (
                  <Link
                    key={e.id}
                    href={`/dashboard/mata-kuliah/${e.mataKuliah.id}`}
                    className="p-4 rounded-[14px] border border-[#e0e0e0] bg-[#f5f5f7] hover:border-[#1d1d1f]/30 transition-all btn-press block group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[12px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#e0e0e0] text-[#7a7a7a]">
                        {e.mataKuliah.kode}
                      </span>
                      <span className="text-[12px] text-[#7a7a7a]">
                        {e.mataKuliah.sks} SKS
                      </span>
                    </div>

                    <h4 className="text-[15px] font-semibold text-[#1d1d1f] mt-2.5 group-hover:text-[#0066cc] transition-colors truncate">
                      {e.mataKuliah.nama}
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] truncate mt-0.5">
                      {e.mataKuliah.dosen.name}
                    </p>

                    <div className="mt-3.5">
                      <div className="flex justify-between text-[11px] text-[#7a7a7a] mb-1">
                        <span>Progres</span>
                        <span className="font-semibold text-[#1d1d1f]">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0066cc] rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Aktivitas Terkini (Apple hairline divider list) */}
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7a7a7a]" />
            Aktivitas Akademik Terkini
          </h3>

          <div className="divide-y divide-[#f0f0f0]">
            {user.quizAttempts.map((a) => (
              <div
                key={a.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#0066cc]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-[#1d1d1f] truncate">
                      {a.quiz.judul}
                    </p>
                    <p className="text-[12px] text-[#7a7a7a] truncate">
                      {a.quiz.mataKuliah.nama} • {new Date(a.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[15px] font-semibold text-[#0066cc]">
                    {a.nilai}
                  </span>
                  <span className="text-[11px] text-[#7a7a7a] ml-1">/ 100</span>
                </div>
              </div>
            ))}

            {user.submissions.map((s) => (
              <div
                key={s.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4 h-4 text-[#0066cc]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-[#1d1d1f] truncate">
                      {s.tugas.judul}
                    </p>
                    <p className="text-[12px] text-[#7a7a7a] truncate">
                      {s.tugas.mataKuliah.nama} • {new Date(s.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {s.nilai !== null ? (
                    <span className="text-[14px] font-semibold text-[#0066cc]">
                      Nilai: {s.nilai}
                    </span>
                  ) : (
                    <span className="text-[12px] font-medium text-[#7a7a7a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                      Menunggu Penilaian
                    </span>
                  )}
                </div>
              </div>
            ))}

            {user.quizAttempts.length === 0 && user.submissions.length === 0 && (
              <p className="text-center text-[#7a7a7a] text-[14px] py-8">
                Belum ada aktivitas baru tercatat.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
