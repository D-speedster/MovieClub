import { Catalog } from "@/components/catalog";
export const dynamic = "force-dynamic";
export const metadata = { title: "جستجو", alternates: { canonical: "/search" }, robots: { index: false, follow: true } };
export default function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
 return <Catalog title="جستجو" base="/search"   searchParams={searchParams} />;
}
