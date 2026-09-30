import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { BookOpen, Users, Clock, ChevronRight } from "lucide-react";

export default async function MataKuliahPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  let mataKuliahList;

  if (role === "ADMIN") {
    mataKuliahList = await prisma.mataKuliah.findMany({
      include: {
        dosen: true,
        enrollments: true,
        jadwal: true,
        materi: true,
        tugas: true,
      },
      orderBy: { kode: "asc" },
    });
  } else if (role === "DOSEN") {
    mataKuliahList = await prisma.mataKuliah.findMany({
      where: { dosenId: userId },
      include: {
        dosen: true,
        enrollments: true,
        jadwal: true,
        materi: true,
        tugas: true,
      },
      orderBy: { kode: "asc" },
    });
  } else {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        mataKuliah: {
          include: {
            dosen: true,
            enrollments: true,
            jadwal: true,
            materi: true,
            tugas: true,
          },
        },
      },
    });
    mataKuliahList = enrollments.map((e) => e.mataKuliah);
  }

  return (
    <>
      <Header
        title="Mata Kuliah"
        subtitle={
          role === "ADMIN"
            ? `Seluruh kurikulum (${mataKuliahList.length} mata kuliah terdaftar)`
            : role === "DOSEN"
            ? "Daftar mata kuliah yang Anda ampu semester ini"
            : "Daftar mata kuliah yang Anda ikuti semester ini"
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mataKuliahList.map((mk) => {
            const progress =
              mk.materi.length > 0
                ? Math.round(
                    (mk.materi.filter((m) => m.selesai).length /
                      mk.materi.length) *
                      100
                  )
                : 0;

            return (
              <Link
                key={mk.id}
                href={`/dashboard/mata-kuliah/${mk.id}`}
                className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 hover:border-[#1d1d1f]/40 transition-all btn-press flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[12px] font-mono px-2.5 py-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#7a7a7a]">
                      {mk.kode}
                    </span>
                    <span className="text-[12px] text-[#7a7a7a]">
                      {mk.sks} SKS • Semester {mk.semester}
                    </span>
                  </div>

                  <h3 className="text-[19px] font-semibold text-[#1d1d1f] tracking-tight group-hover:text-[#0066cc] transition-colors leading-snug">
                    {mk.nama}
                  </h3>
                  <p className="text-[14px] text-[#7a7a7a] line-clamp-2 mt-1.5 leading-relaxed">
                    {mk.deskripsi || "Materi dan rencana pembelajaran perkuliahan."}
                  </p>

                  <div className="flex items-center gap-4 text-[12px] text-[#7a7a7a] mt-4 pt-3 border-t border-[#f0f0f0]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {mk.enrollments.length} mahasiswa
                    </span>
                    {mk.jadwal[0] && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {mk.jadwal[0].hari} {mk.jadwal[0].jamMulai}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#f0f0f0]">
                  {role === "MAHASISWA" ? (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#7a7a7a] mb-1.5">
                        <span>Progres Belajar</span>
                        <span className="font-semibold text-[#1d1d1f]">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0066cc] rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#7a7a7a]">
                        Dosen: {role === "DOSEN" ? "Anda" : mk.dosen.name}
                      </span>
                      <span className="text-[#0066cc] font-medium group-hover:underline flex items-center gap-0.5">
                        Buka Detail <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {mataKuliahList.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[18px] border border-[#e0e0e0] text-[#7a7a7a]">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1d1d1f]" />
            <p className="text-[17px] font-semibold text-[#1d1d1f]">Belum ada mata kuliah</p>
            <p className="text-[14px] mt-1">
              {role === "DOSEN"
                ? "Anda belum memiliki mata kuliah yang diampu"
                : "Anda belum terdaftar di mata kuliah manapun"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
