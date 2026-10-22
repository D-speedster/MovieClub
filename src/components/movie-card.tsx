import Image from "next/image";
import Link from "next/link";
import { posterUrl, type ContentDTO } from "@/lib/content";
export function MovieCard({ item }: { item: ContentDTO }) {
  return <article className="netflix-movie-card"><Link href={`/movie/${encodeURIComponent(item.slug || item._id)}`} className="netflix-movie-card__link">
    <div className="netflix-movie-card__poster-container"><Image src={posterUrl(item.poster)} alt={`پوستر ${item.title}`} width={300} height={450} unoptimized className="netflix-movie-card__poster loaded" />
    <span className="netflix-movie-card__year-badge">{item.year}</span>
    <div className="netflix-movie-card__bottom-overlay"><h3 className="netflix-movie-card__title">{item.title}</h3><p className="netflix-movie-card__description">{item.description?.slice(0,120)}</p><span>★ {item.imdb?.rating ?? 0}</span></div></div>
  </Link></article>;
}
