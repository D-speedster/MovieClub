import { Catalog } from "@/components/catalog";
export const dynamic = "force-dynamic";
export const metadata = { title: "فیلم‌ها", alternates: { canonical: "/movies" }, robots: { index: true, follow: true } };
export default function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
 return <Catalog title="فیلم‌ها" base="/movies" type="movie"  searchParams={searchParams} />;
}
