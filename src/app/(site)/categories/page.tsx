import Link from "next/link";
import {connectDB} from "@/lib/db";
import {Content} from "@/server/models";
export const dynamic='force-dynamic';
export const metadata={title:'دسته‌بندی‌ها',alternates:{canonical:'/categories'}};
export default async function Page(){await connectDB();const genres=await Content.distinct('genres');return <section className="container notice"><h1>دسته‌بندی‌ها</h1><div className="search-form">{genres.sort().map((genre:string)=><Link key={genre} href={`/genre/${encodeURIComponent(genre)}`}>{genre}</Link>)}</div></section>;}
