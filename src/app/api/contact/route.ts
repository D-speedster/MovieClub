import {NextResponse} from "next/server";
import {z} from "zod";
import {ContactMessage} from "@/server/models";
import {rateLimit} from "@/server/rate-limit";
import {apiError,jsonBody,requireSameOrigin} from "@/server/http";
export async function POST(request:Request){try{requireSameOrigin(request);await rateLimit('contact-global',30);const data=z.object({name:z.string().trim().min(3).max(100),email:z.email().max(254),message:z.string().trim().min(10).max(4000)}).parse(await jsonBody(request));await ContactMessage.create(data);return NextResponse.json({message:'پیام شما ثبت شد'},{status:201});}catch(e){return apiError(e);}}
