import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth";
import { getSettings, saveSettings } from "@/server/settings";
import { apiError, requireSameOrigin } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
export const runtime = "nodejs";
export async function GET() {
  try {
    await requireUser(true);
    return NextResponse.json(await getSettings());
  } catch (error) {
    return apiError(error);
  }
}
export async function PUT(request: Request) {
  try {
    requireSameOrigin(request);
    const user = await requireUser(true);
    await rateLimit(`settings:${user._id}`, 30);
    const settings = await saveSettings(request);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (error) {
    return apiError(error);
  }
}
