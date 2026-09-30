import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { BookOpen, Users, Clock, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function DosenDashboard({ userId }: { userId: string }) {
  const mataKuliah = await prisma.mataKuliah.findMany({
    where: { dosenId: userId },
    include: {
      enrollments: true,
      jadwal: true,
      tugas: {
        include: {
          submissions: true,
        },
      },
    },
  });

  const totalMahasiswa = mataKuliah.reduce((acc, mk) => acc + mk.enrollments.length, 0);
  const totalTugas = mataKuliah.reduce((acc, mk) => acc + mk.tugas.length, 0);
  const tugasPerluDinilai = mataKuliah.reduce(
    (acc, mk) =>
      acc +
      mk.tugas.reduce(
        (tAcc, t) => tAcc + t.submissions.filter((s) => s.nilai === null).length,
        0
      ),
    0
  );

  const hariIni = new Date().toLocaleDateString("id-ID", { weekday: "long" }).toUpperCase();
  const jadwalHariIni = mataKuliah
    .flatMap((mk) => mk.jadwal.map((j) => ({ ...j, mk })))
    .filter((j) => j.hari === hariIni)
    .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));

  return (
    <>
      <Header
        title="Dashboard Dosen"
        subtitle="Ringkasan aktivitas mengajar Anda"
      />

      <div className="p-4 sm:p-8 max-w-[1440px] mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Mata Kuliah Diampu"
            value={mataKuliah.length}
            icon={<BookOpen className="w-5 h-5" />}
            subtitle="Semester Aktif"
          />
          <StatCard
            title="Total Mahasiswa"
            value={totalMahasiswa}
            icon={<Users className="w-5 h-5" />}
            subtitle="Dari seluruh kelas"
          />
          <StatCard
            title="Jadwal Hari Ini"
            value={jadwalHariIni.length}
            icon={<Clock className="w-5 h-5" />}
            subtitle="Sesi perkuliahan"
          />
          <StatCard
            title="Perlu Dinilai"
            value={tugasPerluDinilai}
            icon={<FileText className="w-5 h-5" />}
            subtitle="Tugas mahasiswa"
            trend={tugasPerluDinilai > 0 ? "Perlu Aksi" : undefined}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jadwal Mengajar */}
          <div className="lg:col-span-2 store-utility-card flex flex-col">
            <div className="pb-4 border-b border-[#f0f0f0] mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">Jadwal Mengajar Hari Ini</h2>
              <span className="text-[12px] font-medium text-[#7a7a7a] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                {hariIni}
              </span>
            </div>
            
            <div className="flex-1">
              {jadwalHariIni.length > 0 ? (
                <div className="space-y-3">
                  {jadwalHariIni.map((jadwal) => (
                    <div
                      key={jadwal.id}
                      className="flex items-center gap-4 p-4 rounded-[12px] border border-[#e0e0e0] bg-[#f5f5f7]"
                    >
                      <div className="w-[60px] text-center shrink-0">
                        <div className="text-[14px] font-semibold text-[#1d1d1f]">{jadwal.jamMulai}</div>
                        <div className="text-[12px] text-[#7a7a7a] mt-0.5">{jadwal.jamSelesai}</div>
                      </div>
                      <div className="w-px h-10 bg-[#e0e0e0]"></div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-[#1d1d1f]">{jadwal.mk.nama}</h3>
                        <p className="text-[13px] text-[#7a7a7a] mt-0.5">Ruang {jadwal.ruangan} • {jadwal.mk.enrollments.length} Mahasiswa</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#7a7a7a]">
                  <Clock className="w-8 h-8 mx-auto mb-3 opacity-30 text-[#1d1d1f]" />
                  <p className="text-[14px]">Tidak ada jadwal mengajar hari ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* Mata Kuliah List */}
          <div className="store-utility-card flex flex-col">
            <div className="pb-4 border-b border-[#f0f0f0] mb-4 flex justify-between items-center">
              <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">Kelas Anda</h2>
              <Link href="/dashboard/mata-kuliah" className="text-[13px] text-[#0066cc] hover:underline font-normal btn-press flex items-center gap-0.5">
                Lihat Semua
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3 flex-1">
              {mataKuliah.slice(0, 5).map((mk) => (
                <Link
                  key={mk.id}
                  href={`/dashboard/mata-kuliah/${mk.id}`}
                  className="block p-4 rounded-[14px] border border-[#e0e0e0] bg-[#f5f5f7] hover:border-[#1d1d1f]/30 transition-all btn-press group"
                >
                  <div className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors truncate">{mk.nama}</div>
                  <div className="text-[13px] text-[#7a7a7a] mt-1">{mk.kode} • {mk.enrollments.length} Mahasiswa</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
