import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { BarChart3, Trophy, BookOpen, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";

export default async function NilaiPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === "DOSEN") redirect("/dashboard");

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { quiz: { include: { mataKuliah: true } } },
    orderBy: { createdAt: "desc" },
  });

  const submissions = await prisma.tugasSubmission.findMany({
    where: { userId, nilai: { not: null } },
    include: { tugas: { include: { mataKuliah: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avgQuiz =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((a, q) => a + q.nilai, 0) / quizAttempts.length
        )
      : 0;

  const avgTugas =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((a, s) => a + (s.nilai || 0), 0) /
            submissions.length
        )
      : 0;

  const totalNilai =
    quizAttempts.length + submissions.length > 0
      ? Math.round(
          (quizAttempts.reduce((a, q) => a + q.nilai, 0) +
            submissions.reduce((a, s) => a + (s.nilai || 0), 0)) /
            (quizAttempts.length + submissions.length)
        )
      : 0;

  // Group by mata kuliah
  const mkMap = new Map<
    string,
    {
      nama: string;
      warna: string;
      quizScores: number[];
      tugasScores: number[];
    }
  >();

  quizAttempts.forEach((a) => {
    const mkId = a.quiz.mataKuliahId;
    if (!mkMap.has(mkId)) {
      mkMap.set(mkId, {
        nama: a.quiz.mataKuliah.nama,
        warna: a.quiz.mataKuliah.warna || "#0066cc",
        quizScores: [],
        tugasScores: [],
      });
    }
    mkMap.get(mkId)!.quizScores.push(a.nilai);
  });

  submissions.forEach((s) => {
    const mkId = s.tugas.mataKuliahId;
    if (!mkMap.has(mkId)) {
      mkMap.set(mkId, {
        nama: s.tugas.mataKuliah.nama,
        warna: s.tugas.mataKuliah.warna || "#0066cc",
        quizScores: [],
        tugasScores: [],
      });
    }
    mkMap.get(mkId)!.tugasScores.push(s.nilai!);
  });

  return (
    <>
      <Header
        title="Rekap Nilai Akademik"
        subtitle="Evaluasi capaian belajar, nilai kuis, dan penugasan seluruh mata kuliah"
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Stats Grid (store-utility-card style from DESIGN.md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Rata-rata Keseluruhan"
            value={totalNilai}
            icon={<BarChart3 className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Nilai kumulatif"
            trend={totalNilai >= 80 ? "Sangat Baik" : "Baik"}
          />
          <StatCard
            title="Rata-rata Quiz"
            value={avgQuiz}
            icon={<BookOpen className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Dari evaluasi kuis"
          />
          <StatCard
            title="Rata-rata Tugas"
            value={avgTugas}
            icon={<TrendingUp className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Dari seluruh tugas"
          />
          <StatCard
            title="Total Evaluasi"
            value={quizAttempts.length + submissions.length}
            icon={<Trophy className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Nilai yang tercatat"
          />
        </div>

        {/* Per Mata Kuliah Breakdown */}
        <div className="space-y-4">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">
            Capaian per Mata Kuliah
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from(mkMap.entries()).map(([mkId, data]) => {
              const allScores = [...data.quizScores, ...data.tugasScores];
              const avg =
                allScores.length > 0
                  ? Math.round(
                      allScores.reduce((a, b) => a + b, 0) / allScores.length
                    )
                  : 0;

              return (
                <div
                  key={mkId}
                  className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
                      <h4 className="text-[17px] font-semibold text-[#1d1d1f] truncate">
                        {data.nama}
                      </h4>
                      <span className="text-[16px] font-semibold text-[#0066cc]">
                        {avg} <span className="text-[12px] text-[#7a7a7a]">/ 100</span>
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-[12px] text-[#7a7a7a] mb-1">
                          <span>Evaluasi Quiz ({data.quizScores.length})</span>
                          <span className="font-semibold text-[#1d1d1f]">
                            {data.quizScores.length > 0
                              ? Math.round(
                                  data.quizScores.reduce((a, b) => a + b, 0) /
                                    data.quizScores.length
                                )
                              : "-"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0066cc] rounded-full"
                            style={{
                              width: `${
                                data.quizScores.length > 0
                                  ? Math.round(
                                      data.quizScores.reduce((a, b) => a + b, 0) /
                                        data.quizScores.length
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[12px] text-[#7a7a7a] mb-1">
                          <span>Penugasan ({data.tugasScores.length})</span>
                          <span className="font-semibold text-[#1d1d1f]">
                            {data.tugasScores.length > 0
                              ? Math.round(
                                  data.tugasScores.reduce((a, b) => a + b, 0) /
                                    data.tugasScores.length
                                )
                              : "-"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#f5f5f7] border border-[#e0e0e0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0066cc] rounded-full"
                            style={{
                              width: `${
                                data.tugasScores.length > 0
                                  ? Math.round(
                                      data.tugasScores.reduce((a, b) => a + b, 0) /
                                        data.tugasScores.length
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {mkMap.size === 0 && (
            <div className="text-center py-20 bg-white rounded-[18px] border border-[#e0e0e0] text-[#7a7a7a]">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1d1d1f]" />
              <p className="text-[17px] font-semibold text-[#1d1d1f]">Belum ada nilai yang dicatat</p>
              <p className="text-[14px] mt-1">Nilai akan otomatis muncul setelah kuis atau tugas dinilai.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
