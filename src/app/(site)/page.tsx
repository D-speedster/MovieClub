import { getSettings, featuredContent } from "@/server/settings";
import { defaultHomeHero } from "@/lib/settings";
import { posterUrl } from "@/lib/content";
import Link from "next/link";
import { listContent } from "@/server/catalog";
import { MovieCard } from "@/components/movie-card";
export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const settings = await getSettings();
  const featured = await featuredContent(settings.featuredIds);
  const [movies, series, anime] = await Promise.all([
    listContent({ type: "movie", limit: 12 }),
    listContent({ type: "series", limit: 12 }),
    listContent({ genre: "anime", limit: 12 }),
  ]);
  return (
    <div className="home-page">
      <section className="hero-section">
        <div
          className="hero-section__background"
          style={{
            backgroundImage: `url(${JSON.stringify(posterUrl(settings.heroes.home || defaultHomeHero))})`,
          }}
        >
          <div className="hero-section__overlay" />
        </div>
        <div className="hero-section__content">
          <div className="container">
            <div className="hero-section__main">
              <h1 className="hero-section__slogan">{settings.heroTitle}</h1>
              <p>{settings.heroSubtitle}</p>
              <Link href="/movies" className="hero-section__cta-btn">
                مشاهده فیلم‌ها
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        {!!featured.length && (
          <section className="catalog-section" aria-label="پیشنهادهای ویژه">
            <h2>پیشنهادهای ویژه</h2>
            <div className="catalog-grid">
              {featured.map((item) => (
                <MovieCard key={item._id} item={item} />
              ))}
            </div>
          </section>
        )}
        {[
          ["تازه‌ترین فیلم‌ها", movies, "/movies"],
          ["سریال‌های تازه", series, "/series"],
          ["انیمه و انیمیشن", anime, "/anime"],
        ].map(([title, data, url]) => {
          const section = data as typeof movies;
          return (
            <section key={String(url)} className="catalog-section">
              <div className="section-heading">
                <h2>{String(title)}</h2>
                <Link href={String(url)}>مشاهده همه</Link>
              </div>
              <div className="catalog-grid">
                {section.items.map((item) => (
                  <MovieCard key={item._id} item={item} />
                ))}
              </div>
              {!section.items.length && <p>هنوز محتوایی ثبت نشده است.</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
