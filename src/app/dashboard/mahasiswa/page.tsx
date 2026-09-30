import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { Users, Mail, GraduationCap } from "lucide-react";

export default async function MahasiswaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  if (role !== "DOSEN" && role !== "ADMIN") redirect("/dashboard");

  const userId = (session.user as any).id;

  const mataKuliah = await prisma.mataKuliah.findMany({
    where: role === "DOSEN" ? { dosenId: userId } : undefined,
    include: {
      enrollments: {
        include: {
          user: true,
        },
      },
    },
  });

  const allMahasiswa = new Map<
    string,
    { user: any; mataKuliah: string[] }
  >();

  mataKuliah.forEach((mk) => {
    mk.enrollments.forEach((e) => {
      if (!allMahasiswa.has(e.userId)) {
        allMahasiswa.set(e.userId, { user: e.user, mataKuliah: [] });
      }
      allMahasiswa.get(e.userId)!.mataKuliah.push(mk.nama);
    });
  });

  return (
    <>
      <Header
        title={role === "ADMIN" ? "Civitas Mahasiswa Kampus" : "Daftar Mahasiswa Bimbingan"}
        subtitle={
          role === "ADMIN"
            ? `${allMahasiswa.size} mahasiswa terdaftar di seluruh mata kuliah aktif`
            : `${allMahasiswa.size} mahasiswa terdaftar di kelas perkuliahan Anda`
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f5f7] border-b border-[#e0e0e0] text-[#7a7a7a] text-[12px] font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Mahasiswa</th>
                  <th className="px-6 py-4">NIM</th>
                  <th className="px-6 py-4">Email Kampus</th>
                  <th className="px-6 py-4">Mata Kuliah Diikuti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0] text-[14px]">
                {Array.from(allMahasiswa.values()).map(
                  ({ user, mataKuliah: mkList }) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#f5f5f7]/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1d1d1f]">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[13px] text-[#1d1d1f] flex items-center gap-1.5 font-normal">
                          <GraduationCap className="w-3.5 h-3.5 text-[#7a7a7a]" />
                          {user.nim || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[13px] text-[#7a7a7a] flex items-center gap-1.5 font-normal">
                          <Mail className="w-3.5 h-3.5 text-[#7a7a7a]" />
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {mkList.map((mk, i) => (
                            <span
                              key={i}
                              className="text-[12px] font-normal bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0] px-2.5 py-0.5 rounded-full"
                            >
                              {mk}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {allMahasiswa.size === 0 && (
          <div className="text-center py-20 bg-white rounded-[18px] border border-[#e0e0e0] text-[#7a7a7a]">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1d1d1f]" />
            <p className="text-[17px] font-semibold text-[#1d1d1f]">Belum ada mahasiswa terdaftar</p>
            <p className="text-[14px] mt-1">Data mahasiswa akan muncul setelah enrollment terdaftar.</p>
          </div>
        )}
      </div>
    </>
  );
}
