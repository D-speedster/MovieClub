import {NextResponse} from "next/server";
import {z} from "zod";
import {objectId} from "@/lib/content";
import {requireUser} from "@/server/auth";
import {Content,Comment} from "@/server/models";
import {apiError,HttpError,jsonBody,requireSameOrigin} from "@/server/http";
import {rateLimit} from "@/server/rate-limit";
export async function POST(request:Request){try{
 requireSameOrigin(request);const user=await requireUser();await rateLimit(`comment:${user._id}`,10);
 const data=z.object({contentId:objectId,text:z.string().trim().min(3).max(1000),rating:z.number().min(1).max(10).optional()}).parse(await jsonBody(request));
 if(!await Content.exists({_id:data.contentId}))throw new HttpError(404,'محتوا یافت نشد');
 await Comment.create({...data,userId:user._id,username:user.name,status:'pending'});
 return NextResponse.json({message:'نظر شما ثبت شد و پس از بررسی منتشر می‌شود'},{status:201});
}catch(e){return apiError(e);}}
