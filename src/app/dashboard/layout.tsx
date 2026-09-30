import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <DashboardShell
        role={(session.user as any).role || "MAHASISWA"}
        userName={session.user.name || "User"}
        userEmail={session.user.email || ""}
      >
        <main className="flex-1 min-w-0">{children}</main>
      </DashboardShell>
    </SessionProvider>
  );
}
