import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { siteUrl } from "@/lib/site";
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== siteUrl().origin) throw new HttpError(403,"مبدأ درخواست معتبر نیست");
}
export async function jsonBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400,"درخواست خالی است");
  const chunks: Uint8Array[] = []; let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;
    if(size>128*1024){await reader.cancel();throw new HttpError(413,"حجم درخواست بیش از حد مجاز است");}
    chunks.push(value);
  }
  const raw=Buffer.concat(chunks).toString('utf8');
  try { return JSON.parse(raw); } catch { throw new HttpError(400,"فرمت درخواست نامعتبر است"); }
}
export function apiError(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({message:error.message},{status:error.status});
  if (error instanceof ZodError) return NextResponse.json({message:error.issues.map(i=>i.message).join("، ")},{status:400});
  if (typeof error === "object" && error && "code" in error && error.code===11000) return NextResponse.json({message:"این مقدار قبلاً ثبت شده است"},{status:409});
  console.error(error);
  return NextResponse.json({message:"خطا در انجام درخواست"},{status:500});
}
