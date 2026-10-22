import { Catalog } from "@/components/catalog";
export const dynamic = "force-dynamic";
export const metadata = { title: "سریال‌ها", alternates: { canonical: "/series" }, robots: { index: true, follow: true } };
export default function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
 return <Catalog title="سریال‌ها" base="/series" type="series"  searchParams={searchParams} />;
}
