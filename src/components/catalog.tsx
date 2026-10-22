import { getSettings } from "@/server/settings";
import { heroKeys, type HeroKey } from "@/lib/settings";
import { posterUrl } from "@/lib/content";
import Link from "next/link";
import { MovieCard } from "./movie-card";
import { listContent } from "@/server/catalog";
import { parsePage } from "@/lib/content";
export async function Catalog({
  title,
  base,
  type,
  genre,
  searchParams,
}: {
  title: string;
  base: string;
  type?: "movie" | "series";
  genre?: string;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 120) : "";
  const result = await listContent({
    type,
    genre,
    q,
    page: parsePage(query.page),
  });
  function href(page: number) {
    return `${base}?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page) })}`;
  }
  const heroKey = base.slice(1);
  const settings = await getSettings();
  const hero = heroKeys.includes(heroKey as HeroKey)
    ? settings.heroes[heroKey as HeroKey]
    : "";
  return (
    <div className="catalog container">
      {hero ? (
        <section
          className="catalog-banner"
          style={{
            backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.8),rgba(0,0,0,.2)),url(${JSON.stringify(posterUrl(hero))})`,
          }}
        >
          <h1>{title}</h1>
        </section>
      ) : (
        <h1>{title}</h1>
      )}
      <form action={base} className="search-form">
        <label htmlFor="q">جستجوی عنوان</label>
        <input id="q" name="q" defaultValue={q} maxLength={120} />
        <button type="submit">جستجو</button>
      </form>
      <p>{result.total.toLocaleString("fa-IR")} عنوان</p>
      <div className="catalog-grid">
        {result.items.map((item) => (
          <MovieCard key={item._id} item={item} />
        ))}
      </div>
      {!result.items.length && <p role="status">محتوایی یافت نشد.</p>}
      <nav className="pagination" aria-label="صفحه‌بندی">
        {result.page > 1 && <Link href={href(result.page - 1)}>صفحه قبل</Link>}
        <span>صفحه {result.page.toLocaleString("fa-IR")}</span>
        {result.page < result.pages && (
          <Link href={href(result.page + 1)}>صفحه بعد</Link>
        )}
      </nav>
    </div>
  );
}
