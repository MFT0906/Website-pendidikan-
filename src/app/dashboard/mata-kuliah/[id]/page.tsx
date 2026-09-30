import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Header from "@/components/Header";
import {
  BookOpen,
  Users,
  Clock,
  FileText,
  ClipboardList,
  CheckCircle2,
  Circle,
  Calendar,
  Megaphone,
  ChevronRight,
  Download,
  Play,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailMataKuliah({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const mk = await prisma.mataKuliah.findUnique({
    where: { id },
    include: {
      dosen: true,
      enrollments: { include: { user: true } },
      jadwal: true,
      materi: { orderBy: { pertemuan: "asc" } },
      tugas: {
        include: { submissions: true },
        orderBy: { deadline: "asc" },
      },
      pengumuman: { orderBy: { createdAt: "desc" } },
      quizzes: {
        include: { attempts: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!mk) notFound();

  const materiSelesai = mk.materi.filter((m) => m.selesai).length;
  const progress =
    mk.materi.length > 0
      ? Math.round((materiSelesai / mk.materi.length) * 100)
      : 0;

  return (
    <>
      <Header
        title={mk.nama}
        subtitle={`${mk.kode} • ${mk.sks} SKS • Semester ${mk.semester}`}
        action={
          <Link
            href="/dashboard/mata-kuliah"
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#e0e0e0] text-[13px] text-[#1d1d1f] hover:bg-[#e8e8ed] btn-press flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </Link>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Course Info Card (Apple store-utility-card style) */}
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] font-mono px-2.5 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#7a7a7a]">
                  {mk.kode}
                </span>
                <span className="text-[12px] text-[#7a7a7a]">
                  {mk.sks} SKS • Semester {mk.semester}
                </span>
              </div>

              <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                {mk.nama}
              </h2>
              <p className="text-[15px] text-[#7a7a7a] mt-2 leading-relaxed">
                {mk.deskripsi || "Rencana pembelajaran dan materi kuliah terstruktur."}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-[#f0f0f0] text-[13px] text-[#7a7a7a]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1d1d1f]" />
                  {mk.enrollments.length} Mahasiswa
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#1d1d1f]" />
                  {mk.materi.length} Materi Pertemuan
                </span>
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-[#1d1d1f]" />
                  {mk.tugas.length} Tugas
                </span>
                {mk.jadwal[0] && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#1d1d1f]" />
                    {mk.jadwal[0].hari} {mk.jadwal[0].jamMulai} - {mk.jadwal[0].jamSelesai} ({mk.jadwal[0].ruangan})
                  </span>
                )}
              </div>

              <p className="text-[13px] text-[#7a7a7a] mt-3">
                Dosen Pengampu: <strong className="text-[#1d1d1f]">{mk.dosen.name}</strong>
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="flex flex-col items-center justify-center p-5 bg-[#f5f5f7] rounded-[16px] border border-[#e0e0e0] shrink-0 min-w-[140px]">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="#0066cc"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 2.2} ${220 - progress * 2.2}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[19px] font-semibold text-[#1d1d1f]">
                    {progress}%
                  </span>
                </div>
              </div>
              <p className="text-[12px] text-[#7a7a7a] mt-2 font-medium">Progres Materi</p>
            </div>
          </div>
        </div>

        {/* Lessons & Announcements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Materi Pertemuan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7a7a7a]" />
                Materi Perkuliahan
              </h3>

              <div className="space-y-2.5">
                {mk.materi.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-[14px] bg-[#f5f5f7] border border-[#e0e0e0] hover:border-[#1d1d1f]/30 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        {m.selesai ? (
                          <CheckCircle2 className="w-5 h-5 text-[#0066cc]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#d2d2d7]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-[#7a7a7a] bg-white px-2 py-0.5 rounded-full border border-[#e0e0e0]">
                            Pertemuan {m.pertemuan}
                          </span>
                        </div>
                        <h4 className="text-[15px] font-semibold text-[#1d1d1f] mt-1 truncate">
                          {m.judul}
                        </h4>
                        {m.deskripsi && (
                          <p className="text-[13px] text-[#7a7a7a] mt-0.5 truncate">
                            {m.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {m.fileUrl && (
                        <button className="p-2 text-[#7a7a7a] hover:text-[#0066cc] hover:bg-white rounded-full border border-transparent hover:border-[#e0e0e0] transition-colors btn-press">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {m.videoUrl && (
                        <button className="p-2 text-[#7a7a7a] hover:text-[#0066cc] hover:bg-white rounded-full border border-transparent hover:border-[#e0e0e0] transition-colors btn-press">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tugas Card */}
            <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#7a7a7a]" />
                Tugas Terjadwal
              </h3>

              <div className="space-y-3">
                {mk.tugas.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-[14px] bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#1d1d1f]">
                        {t.judul}
                      </h4>
                      <p className="text-[13px] text-[#7a7a7a] mt-0.5">
                        Tenggat Waktu: {new Date(t.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className="text-[12px] font-medium text-[#0066cc] bg-white px-3 py-1 rounded-full border border-[#e0e0e0] shrink-0">
                      {t.submissions.length} Diserahkan
                    </span>
                  </div>
                ))}

                {mk.tugas.length === 0 && (
                  <p className="text-center text-[#7a7a7a] text-[14px] py-4">
                    Belum ada tugas untuk mata kuliah ini.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pengumuman & Jadwal Kuliah Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#7a7a7a]" />
                Pengumuman Kelas
              </h3>

              <div className="space-y-3">
                {mk.pengumuman.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]"
                  >
                    <h5 className="text-[14px] font-semibold text-[#1d1d1f]">
                      {p.judul}
                    </h5>
                    <p className="text-[13px] text-[#7a7a7a] mt-1 leading-relaxed">
                      {p.isi}
                    </p>
                    <span className="text-[11px] text-[#7a7a7a] mt-2 block">
                      {new Date(p.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                ))}

                {mk.pengumuman.length === 0 && (
                  <p className="text-center text-[#7a7a7a] text-[14px] py-4">
                    Belum ada pengumuman kelas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
