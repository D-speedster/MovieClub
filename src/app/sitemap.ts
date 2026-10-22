import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/server/models";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 await connectDB();
 const items = await Content.find({}).select("slug updatedAt").sort({_id:1}).limit(45000).lean();
 return [...["/","/movies","/series","/anime"].map(p=>({url:new URL(p,siteUrl()).href})),...items.map(item=>({url:new URL(`/movie/${encodeURIComponent(item.slug || String(item._id))}`,siteUrl()).href,lastModified:item.updatedAt as Date}))];
}
