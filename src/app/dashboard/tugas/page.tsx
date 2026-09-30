import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import {
  ClipboardList,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default async function TugasPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  if (role === "ADMIN" || role === "DOSEN") {
    const tugas = await prisma.tugas.findMany({
      where: role === "DOSEN" ? { mataKuliah: { dosenId: userId } } : undefined,
      include: {
        mataKuliah: true,
        submissions: { include: { user: true } },
      },
      orderBy: { deadline: "asc" },
    });

    return (
      <>
        <Header
          title={role === "ADMIN" ? "Semua Penugasan Kampus" : "Tugas & Penilaian"}
          subtitle={
            role === "ADMIN"
              ? "Monitoring seluruh penugasan dan evaluasi mahasiswa"
              : "Kelola tugas dan evaluasi penyerahan mahasiswa"
          }
        />
        <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
          {tugas.map((t) => {
            const belumDinilai = t.submissions.filter(
              (s) => s.nilai === null
            ).length;
            return (
              <div
                key={t.id}
                className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 hover:border-[#1d1d1f]/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[12px] font-mono px-2.5 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#7a7a7a]">
                      {t.mataKuliah.kode} • {t.mataKuliah.nama}
                    </span>
                    <h3 className="text-[19px] font-semibold text-[#1d1d1f] tracking-tight mt-2">
                      {t.judul}
                    </h3>
                    <p className="text-[14px] text-[#7a7a7a] mt-1 leading-relaxed">
                      {t.deskripsi || "Instruksi pengerjaan tugas perkuliahan."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-[13px] text-[#7a7a7a]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#7a7a7a]" />
                        Tenggat: {new Date(t.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-[#7a7a7a]" />
                        {t.submissions.length} Pengumpulan
                      </span>
                      {belumDinilai > 0 && (
                        <span className="text-[#0066cc] font-medium bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                          {belumDinilai} Perlu Dinilai
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {t.submissions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-2">
                    <p className="text-[12px] font-semibold text-[#7a7a7a] uppercase tracking-wider mb-2">
                      Daftar Penyerahan Mahasiswa
                    </p>
                    {t.submissions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0]"
                      >
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-[#1d1d1f] truncate">
                            {s.user.name}
                          </p>
                          <p className="text-[12px] text-[#7a7a7a] truncate">
                            NIM: {s.user.nim || "-"} • Diserahkan {new Date(s.createdAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          {s.nilai !== null ? (
                            <span className="text-[14px] font-semibold text-[#0066cc]">
                              Nilai: {s.nilai}
                            </span>
                          ) : (
                            <span className="text-[12px] font-medium text-[#7a7a7a] bg-white px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
                              Belum Dinilai
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {tugas.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[18px] border border-[#e0e0e0] text-[#7a7a7a]">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1d1d1f]" />
              <p className="text-[17px] font-semibold text-[#1d1d1f]">Belum ada tugas</p>
              <p className="text-[14px] mt-1">Daftar penugasan akan tampil di sini saat dibuat.</p>
            </div>
          )}
        </div>
      </>
    );
  }

  // Mahasiswa view
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      mataKuliah: {
        include: {
          tugas: {
            include: {
              submissions: { where: { userId } },
            },
            orderBy: { deadline: "asc" },
          },
        },
      },
    },
  });

  const allTugas = enrollments.flatMap((e) =>
    e.mataKuliah.tugas.map((t) => ({
      ...t,
      mataKuliah: e.mataKuliah,
    }))
  );

  return (
    <>
      <Header
        title="Tugas Perkuliahan"
        subtitle="Daftar tugas dari seluruh mata kuliah yang Anda ikuti"
      />

      <div className="p-6 sm:p-8 space-y-4 max-w-7xl mx-auto">
        {allTugas.map((t) => {
          const submission = t.submissions[0];
          const isOverdue = new Date(t.deadline) < new Date();

          return (
            <div
              key={t.id}
              className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 hover:border-[#1d1d1f]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[12px] font-mono px-2.5 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#7a7a7a]">
                  {t.mataKuliah.kode} • {t.mataKuliah.nama}
                </span>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight mt-2">
                  {t.judul}
                </h3>
                <p className="text-[14px] text-[#7a7a7a] mt-1 leading-relaxed line-clamp-2">
                  {t.deskripsi || "Selesaikan tugas sesuai instruksi dan kumpulkan tepat waktu."}
                </p>
                <div className="flex items-center gap-4 mt-3 text-[13px] text-[#7a7a7a]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7a7a7a]" />
                    Tenggat: {new Date(t.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {submission?.nilai !== null && submission?.nilai !== undefined ? (
                  <span className="text-[14px] font-semibold text-[#0066cc] bg-[#f5f5f7] px-3.5 py-1.5 rounded-full border border-[#e0e0e0]">
                    Nilai: {submission.nilai} / 100
                  </span>
                ) : submission ? (
                  <span className="text-[13px] font-medium text-[#7a7a7a] bg-[#f5f5f7] px-3.5 py-1.5 rounded-full border border-[#e0e0e0]">
                    Sudah Diserahkan
                  </span>
                ) : isOverdue ? (
                  <span className="text-[13px] font-medium text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
                    Terlewat
                  </span>
                ) : (
                  <button className="px-4 py-2 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] font-medium rounded-full btn-press">
                    Kumpulkan Tugas
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {allTugas.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[18px] border border-[#e0e0e0] text-[#7a7a7a]">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1d1d1f]" />
            <p className="text-[17px] font-semibold text-[#1d1d1f]">Tidak ada tugas aktif</p>
            <p className="text-[14px] mt-1">Seluruh penugasan perkuliahan telah diselesaikan.</p>
          </div>
        )}
      </div>
    </>
  );
}
