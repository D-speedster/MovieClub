import "server-only";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { Model } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { objectId, escapeRegex } from "@/lib/content";
import {
  downloadInput,
  trailerInput,
  userInput,
  moderationInput,
  contactInput,
  type Resource,
  type PageData,
} from "@/lib/management";
import {
  Content,
  DownloadLink,
  Trailer,
  User,
  Comment,
  ContactMessage,
} from "./models";
import { serialize } from "./catalog";
import { requireUser } from "./auth";
import { HttpError } from "./http";
function modelFor(resource: Resource): Model<any> {
  return {
    trailers: Trailer,
    downloads: DownloadLink,
    users: User,
    comments: Comment,
    contacts: ContactMessage,
  }[resource];
}
export async function listManagement(
  resource: Resource,
  search: URLSearchParams,
) {
  await requireUser(true);
  await connectDB();
  const params = z
    .object({
      page: z.coerce.number().int().min(1).max(10000).default(1),
      q: z.string().trim().max(120).default(""),
      status: z.enum(["pending", "approved", "rejected"]).optional(),
      contentId: objectId.optional(),
      read: z.enum(["true", "false"]).optional(),
    })
    .parse(Object.fromEntries(search));
  const filter: Record<string, unknown> = {};
  if (params.q) {
    const regex = { $regex: escapeRegex(params.q), $options: "i" };
    filter.$or = (
      resource === "users"
        ? ["name", "username", "email"]
        : resource === "contacts"
          ? ["name", "email", "message"]
          : resource === "comments"
            ? ["username", "text"]
            : resource === "downloads"
              ? ["label", "quality", "encoder"]
              : ["title"]
    ).map((field) => ({ [field]: regex }));
  }
  if (resource === "comments" && params.status) filter.status = params.status;
  if (resource === "contacts" && params.read)
    filter.read = params.read === "true" ? true : { $ne: true };
  if ((resource === "downloads" || resource === "comments") && params.contentId)
    filter.contentId = params.contentId;
  const model = modelFor(resource);
  let query = model
    .find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((params.page - 1) * 20)
    .limit(20);
  if (resource === "users")
    query = query.select("name username email phone role createdAt");
  if (["downloads", "trailers", "comments"].includes(resource))
    query = query.populate("contentId", "title type");
  const [items, total] = await Promise.all([
    query.lean(),
    model.countDocuments(filter),
  ]);
  return serialize<PageData>({
    items,
    total,
    page: params.page,
    pages: Math.ceil(total / 20),
  });
}
export async function contentOptions(q = "") {
  await requireUser(true);
  await connectDB();
  return serialize<{ _id: string; title: string; type: "movie" | "series" }[]>(
    await Content.find(
      q
        ? { title: { $regex: escapeRegex(q.slice(0, 120)), $options: "i" } }
        : {},
    )
      .select("title type")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  );
}
async function checkContent(id: string, episodic = false) {
  const item = await Content.findById(objectId.parse(id));
  if (!item) throw new HttpError(404, "محتوا یافت نشد");
  if (episodic && item.type !== "series")
    throw new HttpError(400, "فصل و قسمت فقط برای سریال مجاز است");
  return item;
}
export async function createManaged(resource: Resource, body: unknown) {
  const actor = await requireUser(true);
  await connectDB();
  if (resource === "downloads") {
    const data = downloadInput.parse(body);
    await checkContent(data.contentId, data.season !== null);
    const result = await DownloadLink.create(data);
    return serialize(result);
  }
  if (resource === "trailers") {
    const data = trailerInput.parse(body);
    if (data.contentId) await checkContent(data.contentId);
    return serialize(
      await Trailer.create({ ...data, contentId: data.contentId || undefined }),
    );
  }
  if (resource === "users") {
    const data = userInput.parse(body);
    if (Buffer.byteLength(data.password, "utf8") > 72)
      throw new HttpError(400, "رمز عبور بیش از حد طولانی است");
    if (data.role === "Owner" && actor.role !== "Owner")
      throw new HttpError(403, "فقط مالک می‌تواند مالک دیگری ایجاد کند");
    const result = await User.create({
      ...data,
      password: await hash(data.password, 12),
    });
    return serialize({
      _id: result._id,
      name: result.name,
      username: result.username,
      email: result.email,
      role: result.role,
    });
  }
  throw new HttpError(405, "ایجاد این نوع داده از این مسیر مجاز نیست");
}
export async function updateManaged(
  resource: Resource,
  id: string,
  body: unknown,
) {
  await requireUser(true);
  await connectDB();
  objectId.parse(id);
  if (resource === "users")
    throw new HttpError(405, "برای تغییر نقش از مسیر کاربران استفاده کنید");
  let data: Record<string, unknown>;
  if (resource === "downloads") {
    const parsed = downloadInput.parse(body);
    await checkContent(parsed.contentId, parsed.season !== null);
    data = parsed;
  } else if (resource === "trailers") {
    const parsed = trailerInput.parse(body);
    if (parsed.contentId) await checkContent(parsed.contentId);
    data = { ...parsed, contentId: parsed.contentId || null };
  } else if (resource === "comments") data = moderationInput.parse(body);
  else data = contactInput.parse(body);
  const result = await modelFor(resource).findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );
  if (!result) throw new HttpError(404, "رکورد یافت نشد");
  revalidatePath("/");
  return serialize(result);
}
export async function deleteManaged(resource: Resource, id: string) {
  await requireUser(true);
  await connectDB();
  objectId.parse(id);
  if (resource === "users")
    throw new HttpError(405, "برای حذف کاربر از مسیر کاربران استفاده کنید");
  const result = await modelFor(resource).findByIdAndDelete(id);
  if (!result) throw new HttpError(404, "رکورد یافت نشد");
  revalidatePath("/");
  return { message: "رکورد حذف شد" };
}
export async function dashboardStats() {
  await requireUser(true);
  await connectDB();
  const [movies, series, users, pending, contacts, trailers, downloads] =
    await Promise.all([
      Content.countDocuments({ type: "movie" }),
      Content.countDocuments({ type: "series" }),
      User.countDocuments(),
      Comment.countDocuments({ status: "pending" }),
      ContactMessage.countDocuments({ read: { $ne: true } }),
      Trailer.countDocuments(),
      DownloadLink.countDocuments(),
    ]);
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 5);
  cutoff.setDate(1);
  cutoff.setHours(0, 0, 0, 0);
  const growth = await User.aggregate([
    { $match: { createdAt: { $gte: cutoff } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$createdAt",
            timezone: "Asia/Tehran",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return serialize<{
    movies: number;
    series: number;
    users: number;
    pending: number;
    contacts: number;
    trailers: number;
    downloads: number;
    growth: { _id: string; count: number }[];
  }>({ movies, series, users, pending, contacts, trailers, downloads, growth });
}
