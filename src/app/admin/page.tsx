import { dashboardStats } from "@/server/management";
import { Dashboard } from "@/components/admin/dashboard";
export default async function Page() {
  return <Dashboard stats={await dashboardStats()} />;
}
