import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { BookOpen, Users, Clock, FileText } from "lucide-react";
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

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jadwal Mengajar */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Jadwal Mengajar Hari Ini</h2>
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
                        <p className="text-sm text-gray-500">Ruang {jadwal.ruangan} • {jadwal.mk.enrollments.length} Mahasiswa</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada jadwal mengajar hari ini.
                </div>
              )}
            </div>
          </div>

          {/* Mata Kuliah List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Kelas Anda</h2>
              <Link href="/dashboard/mata-kuliah" className="text-sm text-blue-600 hover:underline">
                Lihat Semua
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {mataKuliah.slice(0, 5).map((mk) => (
                <Link
                  key={mk.id}
                  href={`/dashboard/mata-kuliah/${mk.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{mk.nama}</div>
                  <div className="text-sm text-gray-500 mt-1">{mk.kode} • {mk.enrollments.length} Mahasiswa</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
