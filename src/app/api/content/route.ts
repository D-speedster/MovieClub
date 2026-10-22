import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { slugify, parsePage } from "@/lib/content";
import { listContent } from "@/server/catalog";
import { requireUser } from "@/server/auth";
import { Content } from "@/server/models";
import { apiError, requireSameOrigin } from "@/server/http";
import { prepareContent, cleanupMedia } from "@/server/media";
import { rateLimit } from "@/server/rate-limit";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const p = new URL(request.url).searchParams;
    return NextResponse.json(
      await listContent({
        q: p.get("q") || "",
        page: parsePage(p.get("page") || undefined),
      }),
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request) {
  let created: string[] = [];
  try {
    requireSameOrigin(request);
    const user = await requireUser(true);
    if (request.headers.get("content-type")?.startsWith("multipart/form-data"))
      await rateLimit(`media:${user._id}`, 30);
    const prepared = await prepareContent(request);
    created = prepared.created;
    const item = await Content.create({
      ...prepared.data,
      slug: `${slugify(prepared.data.title)}-${randomUUID().slice(0, 8)}`,
    });
    revalidatePath("/");
    revalidatePath("/movies");
    revalidatePath("/series");
    revalidatePath("/sitemap.xml");
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    await cleanupMedia(created.map((name) => `/media/${name}`));
    return apiError(e);
  }
}
