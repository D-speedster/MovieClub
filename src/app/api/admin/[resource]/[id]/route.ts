import { NextResponse } from "next/server";
import { isResource } from "@/lib/management";
import {
  apiError,
  HttpError,
  jsonBody,
  requireSameOrigin,
} from "@/server/http";
import { updateManaged, deleteManaged } from "@/server/management";
import { requireUser } from "@/server/auth";
type Context = { params: Promise<{ resource: string; id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try {
    requireSameOrigin(request);
    await requireUser(true);
    const { resource, id } = await params;
    if (!isResource(resource)) throw new HttpError(404, "مسیر یافت نشد");
    return NextResponse.json(
      await updateManaged(resource, id, await jsonBody(request)),
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    requireSameOrigin(request);
    await requireUser(true);
    const { resource, id } = await params;
    if (!isResource(resource)) throw new HttpError(404, "مسیر یافت نشد");
    return NextResponse.json(await deleteManaged(resource, id));
  } catch (e) {
    return apiError(e);
  }
}
