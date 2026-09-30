import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MahasiswaDashboard from "./MahasiswaDashboard";
import DosenDashboard from "./DosenDashboard";
import AdminDashboard from "./AdminDashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  if (role === "ADMIN") {
    return <AdminDashboard userId={userId} />;
  }

  if (role === "DOSEN") {
    return <DosenDashboard userId={userId} />;
  }

  return <MahasiswaDashboard userId={userId} />;
}
