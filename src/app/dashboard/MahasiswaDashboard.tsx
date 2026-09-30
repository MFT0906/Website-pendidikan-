import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { BookOpen, CheckSquare, Clock, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function MahasiswaDashboard({
  userId,
}: {
  userId: string;
}) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      mataKuliah: {
        include: {
          jadwal: true,
          tugas: {
            include: {
              submissions: { where: { userId } },
            },
          },
        },
      },
    },
  });

  const totalSKS = enrollments.reduce((acc, curr) => acc + curr.mataKuliah.sks, 0);
  const totalTugas = enrollments.reduce((acc, curr) => acc + curr.mataKuliah.tugas.length, 0);
  const tugasSelesai = enrollments.reduce(
    (acc, curr) =>
      acc + curr.mataKuliah.tugas.filter((t) => t.submissions.length > 0).length,
    0
  );

  const hariIni = new Date().toLocaleDateString("id-ID", { weekday: "long" }).toUpperCase();
  const jadwalHariIni = enrollments
    .flatMap((e) => e.mataKuliah.jadwal.map((j) => ({ ...j, mk: e.mataKuliah })))
    .filter((j) => j.hari === hariIni)
    .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));

  return (
    <>
      <Header
        title="Dashboard Mahasiswa"
        subtitle="Ringkasan aktivitas akademik Anda"
      />

      <div className="p-4 sm:p-8 max-w-[1440px] mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Mata Kuliah Aktif"
            value={enrollments.length}
            icon={<BookOpen className="w-5 h-5" />}
            subtitle={`${totalSKS} SKS Total`}
          />
          <StatCard
            title="Tugas Selesai"
            value={tugasSelesai}
            icon={<CheckSquare className="w-5 h-5" />}
            subtitle={`Dari ${totalTugas} tugas`}
            trend={totalTugas > 0 ? `${Math.round((tugasSelesai / totalTugas) * 100)}%` : undefined}
          />
          <StatCard
            title="Jadwal Hari Ini"
            value={jadwalHariIni.length}
            icon={<Clock className="w-5 h-5" />}
            subtitle="Kelas yang harus dihadiri"
          />
          <StatCard
            title="IPK Sementara"
            value="3.85"
            icon={<FileText className="w-5 h-5" />}
            subtitle="Semester Ganjil 2024"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jadwal Hari Ini */}
          <div className="lg:col-span-2 store-utility-card flex flex-col">
            <div className="pb-4 border-b border-[#f0f0f0] mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">Jadwal Hari Ini</h2>
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
                        <p className="text-[13px] text-[#7a7a7a] mt-0.5">Ruang {jadwal.ruangan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#7a7a7a]">
                  <Clock className="w-8 h-8 mx-auto mb-3 opacity-30 text-[#1d1d1f]" />
                  <p className="text-[14px]">Tidak ada jadwal kuliah hari ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* Mata Kuliah List */}
          <div className="store-utility-card flex flex-col">
            <div className="pb-4 border-b border-[#f0f0f0] mb-4 flex justify-between items-center">
              <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">Mata Kuliah</h2>
              <Link href="/dashboard/mata-kuliah" className="text-[13px] text-[#0066cc] hover:underline font-normal btn-press flex items-center gap-0.5">
                Lihat Semua
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3 flex-1">
              {enrollments.slice(0, 5).map((e) => (
                <Link
                  key={e.id}
                  href={`/dashboard/mata-kuliah/${e.mataKuliah.id}`}
                  className="block p-4 rounded-[14px] border border-[#e0e0e0] bg-[#f5f5f7] hover:border-[#1d1d1f]/30 transition-all btn-press group"
                >
                  <div className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors truncate">{e.mataKuliah.nama}</div>
                  <div className="text-[13px] text-[#7a7a7a] mt-1">{e.mataKuliah.kode} • {e.mataKuliah.sks} SKS</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
