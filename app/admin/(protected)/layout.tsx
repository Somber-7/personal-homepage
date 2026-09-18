import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";

export const metadata = { title: "관리자 | 임준 포트폴리오" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
