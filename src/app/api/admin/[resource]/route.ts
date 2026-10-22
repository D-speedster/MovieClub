import { NextResponse } from "next/server";
import { isResource } from "@/lib/management";
import {
  apiError,
  HttpError,
  jsonBody,
  requireSameOrigin,
} from "@/server/http";
import {
  listManagement,
  createManaged,
  contentOptions,
} from "@/server/management";
import { requireUser } from "@/server/auth";
type Context = { params: Promise<{ resource: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    const { resource } = await params;
    const search = new URL(request.url).searchParams;
    if (resource === "content-options")
      return NextResponse.json(await contentOptions(search.get("q") || ""));
    if (!isResource(resource)) throw new HttpError(404, "مسیر یافت نشد");
    return NextResponse.json(await listManagement(resource, search));
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    requireSameOrigin(request);
    await requireUser(true);
    const { resource } = await params;
    if (!isResource(resource)) throw new HttpError(404, "مسیر یافت نشد");
    return NextResponse.json(
      await createManaged(resource, await jsonBody(request)),
      { status: 201 },
    );
  } catch (e) {
    return apiError(e);
  }
}
