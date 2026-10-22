import { Catalog } from "@/components/catalog";
export const dynamic = "force-dynamic";
export const metadata = { title: "انیمه و انیمیشن", alternates: { canonical: "/anime" }, robots: { index: true, follow: true } };
export default function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
 return <Catalog title="انیمه و انیمیشن" base="/anime"  genre="anime" searchParams={searchParams} />;
}
