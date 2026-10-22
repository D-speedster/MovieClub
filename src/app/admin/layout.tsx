import { redirect } from "next/navigation";
import { currentUser } from "@/server/auth";
import { AdminShell } from "@/components/admin/shell";
import "@/styles/admin.css";
export const metadata = {
  title: "مدیریت",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/auth/login");
  if (!["Admin", "Owner"].includes(user.role)) redirect("/user");
  return <AdminShell name={user.name}>{children}</AdminShell>;
}
