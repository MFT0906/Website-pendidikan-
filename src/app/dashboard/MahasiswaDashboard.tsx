import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { BookOpen, CheckSquare, Clock, FileText } from "lucide-react";
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

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jadwal Hari Ini */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Jadwal Hari Ini</h2>
            </div>
            <div className="p-6">
              {jadwalHariIni.length > 0 ? (
                <div className="space-y-4">
                  {jadwalHariIni.map((jadwal) => (
                    <div
                      key={jadwal.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50"
                    >
                      <div className="w-16 text-center shrink-0">
                        <div className="text-sm font-bold text-gray-900">{jadwal.jamMulai}</div>
                        <div className="text-xs text-gray-500">{jadwal.jamSelesai}</div>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{jadwal.mk.nama}</h3>
                        <p className="text-sm text-gray-500">Ruang {jadwal.ruangan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada jadwal kuliah hari ini.
                </div>
              )}
            </div>
          </div>

          {/* Mata Kuliah List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Mata Kuliah</h2>
              <Link href="/dashboard/mata-kuliah" className="text-sm text-blue-600 hover:underline">
                Lihat Semua
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {enrollments.slice(0, 5).map((e) => (
                <Link
                  key={e.id}
                  href={`/dashboard/mata-kuliah/${e.mataKuliah.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{e.mataKuliah.nama}</div>
                  <div className="text-sm text-gray-500 mt-1">{e.mataKuliah.kode} • {e.mataKuliah.sks} SKS</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
