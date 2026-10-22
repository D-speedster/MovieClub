import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { getContent, getRelatedData } from "@/server/catalog";
import { posterUrl, safeJsonLd } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import {CommentForm} from "@/components/comment-form";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getContent((await params).slug);
  if (!item) return { title: "محتوا یافت نشد", robots: { index: false } };
  const canonical = `/movie/${encodeURIComponent(item.slug || item._id)}`;
  return { title: item.title, description: item.description?.slice(0,160), alternates: { canonical }, openGraph: { title: item.title, description: item.description?.slice(0,160), url: canonical, images: [posterUrl(item.poster)] } };
}
export default async function MoviePage({ params }: Props) {
  const { slug } = await params;
  const item = await getContent(slug);
  if (!item) notFound();
  if (item.slug && slug !== item.slug) permanentRedirect(`/movie/${encodeURIComponent(item.slug)}`);
  const { downloads, comments } = await getRelatedData(item._id);
  const structured = { "@context": "https://schema.org", "@type": item.type === "series" ? "TVSeries" : "Movie", name: item.title, description: item.description, image: new URL(posterUrl(item.poster),siteUrl()).href, ...(item.year ? { dateCreated: String(item.year) } : {}), genre: item.genres, director: item.directors.map(name=>({"@type":"Person",name})) };
  return <div className="movie-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(structured) }} />
    <section className="movie-hero"><div className="container"><div className="movie-hero__content"><div className="movie-hero__poster"><Image src={posterUrl(item.poster)} alt={`پوستر ${item.title}`} width={300} height={450} unoptimized priority className="movie-hero__poster-image" /></div><div className="movie-hero__info"><h1 className="movie-hero__title">{item.title}</h1><p>{item.year} · ★ {item.imdb?.rating ?? 0} · {item.type === "series" ? "سریال" : "فیلم"}</p><p>{item.genres.join("، ")}</p><p>{item.description}</p><a href="#download-section" className="btn-primary">لینک‌های دانلود</a></div></div></div></section>
    <section className="container detail-section"><h2>اطلاعات اثر</h2><dl><dt>کارگردان</dt><dd>{item.directors.join("، ") || "—"}</dd><dt>بازیگران</dt><dd>{item.actors.join("، ") || "—"}</dd><dt>زبان</dt><dd>{item.languages.join("، ") || "—"}</dd><dt>کشور</dt><dd>{item.countries.join("، ") || "—"}</dd></dl></section>
    <section id="download-section" className="container detail-section"><h2>دانلود</h2>{downloads.map(link=><div key={link._id} className="download-row"><span>{link.quality} · {link.size}{link.season ? ` · فصل ${link.season}` : ""}{link.episode ? ` · قسمت ${link.episode}` : ""}</span>{/^https?:\/\//i.test(link.url) && <a href={link.url} rel="noopener noreferrer" target="_blank">دانلود</a>}{link.subtitleUrl && /^https?:\/\//i.test(link.subtitleUrl) && <a href={link.subtitleUrl} rel="noopener noreferrer" target="_blank">زیرنویس</a>}</div>)}{!downloads.length&&<p>لینک دانلودی ثبت نشده است.</p>}</section>
    <section className="container detail-section"><h2>نظرات</h2>{comments.map(c=><article key={c._id}><h3>{c.username}</h3><p>{c.text}</p></article>)}{!comments.length&&<p>هنوز نظری ثبت نشده است.</p>}</section>
  <CommentForm contentId={item._id}/></div>;
}
