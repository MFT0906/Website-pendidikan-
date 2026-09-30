import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trophy,
  BarChart3,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default async function QuizPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  if (role === "ADMIN" || role === "DOSEN") {
    const quizzes = await prisma.quiz.findMany({
      where: role === "DOSEN" ? { mataKuliah: { dosenId: userId } } : undefined,
      include: {
        mataKuliah: true,
        attempts: { include: { user: true } },
        soal: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalQuiz = quizzes.length;
    const totalAttempts = quizzes.reduce((a, q) => a + q.attempts.length, 0);
    const avgScore =
      totalAttempts > 0
        ? Math.round(
            quizzes.reduce(
              (a, q) => a + q.attempts.reduce((b, at) => b + at.nilai, 0),
              0
            ) / totalAttempts
          )
        : 0;

    return (
      <>
        <Header
          title={role === "ADMIN" ? "Bank Quiz & Evaluasi" : "Quiz & Evaluasi"}
          subtitle={
            role === "ADMIN"
              ? "Monitoring seluruh evaluasi dan quiz mahasiswa"
              : "Kelola quiz dan pantau hasil evaluasi mahasiswa"
          }
        />
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Quiz"
              value={totalQuiz}
              icon={<FileText className="w-5 h-5 text-[#1d1d1f]" />}
              subtitle="Quiz terdaftar"
            />
            <StatCard
              title="Total Pengerjaan"
              value={totalAttempts}
              icon={<Trophy className="w-5 h-5 text-[#1d1d1f]" />}
              subtitle="Sesi pengerjaan"
            />
            <StatCard
              title="Rata-rata Skor"
              value={avgScore}
              icon={<BarChart3 className="w-5 h-5 text-[#1d1d1f]" />}
              subtitle="Rata-rata kumulatif"
              trend={avgScore >= 80 ? "Memuaskan" : "Cukup"}
            />
          </div>

          <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4">
              Daftar Quiz & Evaluasi
            </h3>
            <div className="space-y-3">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-4 rounded-[14px] bg-[#f5f5f7] border border-[#e0e0e0] hover:border-[#1d1d1f]/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[12px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#e0e0e0] text-[#7a7a7a]">
                      {q.mataKuliah.kode} • {q.mataKuliah.nama}
                    </span>
                    <h4 className="text-[16px] font-semibold text-[#1d1d1f] tracking-tight mt-1.5 truncate">
                      {q.judul}
                    </h4>
                    <p className="text-[13px] text-[#7a7a7a] mt-0.5">
                      {q.jumlahSoal} Soal • Durasi {q.durasi} Menit
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[14px] font-semibold text-[#0066cc] bg-white px-3 py-1 rounded-full border border-[#e0e0e0]">
                      {q.attempts.length} Pengerjaan
                    </span>
                  </div>
                </div>
              ))}

              {quizzes.length === 0 && (
                <p className="text-center text-[#7a7a7a] text-[14px] py-12">
                  Belum ada quiz yang dibuat.
                </p>
              )}
            </div>
          </div>
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
          quizzes: {
            include: {
              attempts: { where: { userId } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  const allQuizzes = enrollments.flatMap((e) =>
    e.mataKuliah.quizzes.map((q) => ({
      ...q,
      mataKuliah: e.mataKuliah,
    }))
  );

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { quiz: { include: { mataKuliah: true } } },
    orderBy: { createdAt: "desc" },
  });

  const quizBelum = allQuizzes.filter((q) => q.attempts.length === 0);
  const quizSelesai = allQuizzes.filter((q) => q.attempts.length > 0);
  const avgNilai =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((a, at) => a + at.nilai, 0) / attempts.length
        )
      : 0;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.nilai)) : 0;

  return (
    <>
      <Header
        title="Quiz & Evaluasi Belajar"
        subtitle="Kerjakan quiz dan pantau perkembangan belajar Anda"
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Quiz Tersedia"
            value={quizBelum.length}
            icon={<FileText className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Belum dikerjakan"
          />
          <StatCard
            title="Quiz Selesai"
            value={quizSelesai.length}
            icon={<CheckCircle2 className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Sudah dikerjakan"
          />
          <StatCard
            title="Rata-rata Skor"
            value={avgNilai}
            icon={<BarChart3 className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Seluruh evaluasi"
          />
          <StatCard
            title="Skor Tertinggi"
            value={bestScore}
            icon={<Trophy className="w-5 h-5 text-[#1d1d1f]" />}
            subtitle="Pencapaian terbaik"
            trend={bestScore >= 90 ? "Optimal" : undefined}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quiz Tersedia */}
          <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#0066cc]" />
              Quiz Belum Dikerjakan
            </h3>
            <div className="space-y-3">
              {quizBelum.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-[14px] bg-[#f5f5f7] border border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#e0e0e0] text-[#7a7a7a]">
                      {q.mataKuliah.nama}
                    </span>
                    <h4 className="text-[15px] font-semibold text-[#1d1d1f] mt-1.5">
                      {q.judul}
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-0.5">
                      {q.jumlahSoal} Soal • Durasi {q.durasi} Menit
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] font-medium rounded-full btn-press shrink-0 shadow-2xs">
                    Mulai Kerjakan
                  </button>
                </div>
              ))}

              {quizBelum.length === 0 && (
                <p className="text-center text-[#7a7a7a] text-[14px] py-12">
                  Seluruh quiz telah diselesaikan!
                </p>
              )}
            </div>
          </div>

          {/* Riwayat Pengerjaan */}
          <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight pb-3 border-b border-[#f0f0f0] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0066cc]" />
              Riwayat Evaluasi Selesai
            </h3>
            <div className="space-y-3">
              {attempts.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-[14px] bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#e0e0e0] text-[#7a7a7a]">
                      {a.quiz.mataKuliah.nama}
                    </span>
                    <h4 className="text-[15px] font-semibold text-[#1d1d1f] mt-1.5 truncate">
                      {a.quiz.judul}
                    </h4>
                    <p className="text-[12px] text-[#7a7a7a] mt-0.5">
                      {a.benar} Benar • {a.salah} Salah • {new Date(a.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[16px] font-semibold text-[#0066cc]">
                      {a.nilai}
                    </span>
                    <span className="text-[12px] text-[#7a7a7a]"> / 100</span>
                  </div>
                </div>
              ))}

              {attempts.length === 0 && (
                <p className="text-center text-[#7a7a7a] text-[14px] py-12">
                  Belum ada riwayat quiz yang dikerjakan.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
