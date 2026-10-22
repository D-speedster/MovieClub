import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { contentInput, slugify } from "@/lib/content";
import { listContent } from "@/server/catalog";
import { requireUser } from "@/server/auth";
import { Content } from "@/server/models";
import { apiError, jsonBody, requireSameOrigin } from "@/server/http";
export async function GET(request:Request){try{const p=new URL(request.url).searchParams;return NextResponse.json(await listContent({q:p.get('q')||'',page:Math.max(1,Math.min(10000,Number(p.get('page'))||1))}));}catch(e){return apiError(e);}}
export async function POST(request:Request){try{
 requireSameOrigin(request);await requireUser(true);
 const data=contentInput.parse(await jsonBody(request));
 const slug=`${slugify(data.title)}-${randomUUID().slice(0,8)}`;
 const item=await Content.create({...data,slug});
 revalidatePath('/');revalidatePath('/movies');revalidatePath('/series');revalidatePath('/sitemap.xml');
 return NextResponse.json(item,{status:201});
}catch(e){return apiError(e);}}
