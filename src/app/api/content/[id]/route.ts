import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { objectId } from "@/lib/content";
import {
  Content,
  Comment,
  DownloadLink,
  Trailer,
  SiteSettings,
} from "@/server/models";
import { requireUser } from "@/server/auth";
import { apiError, HttpError, requireSameOrigin } from "@/server/http";
import {
  prepareContent,
  cleanupMedia,
  contentMediaReferences,
} from "@/server/media";
import { rateLimit } from "@/server/rate-limit";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Context) {
  let created: string[] = [];
  try {
    requireSameOrigin(request);
    const user = await requireUser(true);
    const id = objectId.parse((await params).id);
    const previous = await Content.findById(id);
    if (!previous) throw new HttpError(404, "محتوا یافت نشد");
    if (request.headers.get("content-type")?.startsWith("multipart/form-data"))
      await rateLimit(`media:${user._id}`, 30);
    const prepared = await prepareContent(request, previous);
    created = prepared.created;
    const item = await Content.findOneAndUpdate(
      {
        _id: id,
        ...(prepared.version === 0
          ? { $or: [{ __v: 0 }, { __v: { $exists: false } }] }
          : { __v: prepared.version }),
      },
      { $set: prepared.data, $inc: { __v: 1 } },
      { new: true, runValidators: true },
    );
    if (!item)
      throw new HttpError(
        409,
        "این محتوا تغییر کرده است؛ صفحه را دوباره بارگذاری کنید",
      );
    await cleanupMedia(contentMediaReferences(previous));
    revalidatePath("/");
    revalidatePath(`/movie/${item.slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json(item);
  } catch (e) {
    await cleanupMedia(created.map((name) => `/media/${name}`));
    return apiError(e);
  }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    requireSameOrigin(request);
    await requireUser(true);
    const id = objectId.parse((await params).id);
    let references: string[] = [];
    let slug = "";
    const session = await Content.startSession();
    try {
      await session.withTransaction(async () => {
        const item = await Content.findByIdAndDelete(id, { session });
        if (!item) throw new HttpError(404, "محتوا یافت نشد");
        references = contentMediaReferences(item);
        slug = item.slug;
        await Comment.deleteMany({ contentId: id }, { session });
        await DownloadLink.deleteMany({ contentId: id }, { session });
        const trailers = await Trailer.find({ contentId: id })
          .select("poster")
          .session(session);
        references.push(
          ...trailers
            .map((item) => item.poster)
            .filter((value): value is string => typeof value === "string"),
        );
        await Trailer.deleteMany({ contentId: id }, { session });
        await SiteSettings.updateOne(
          { key: "featured_content" },
          { $pull: { value: id } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }
    await cleanupMedia(references);
    revalidatePath("/");
    revalidatePath(`/movie/${slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ message: "محتوا و وابستگی‌ها حذف شدند" });
  } catch (e) {
    return apiError(e);
  }
}
