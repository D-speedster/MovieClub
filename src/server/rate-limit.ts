import "server-only";
import {createHash} from "node:crypto";
import {RateBucket} from "./models";
import {connectDB} from "@/lib/db";
import {HttpError} from "./http";
export async function rateLimit(subject:string,limit=10,windowMs=15*60*1000){
 await connectDB();const now=Date.now();const window=Math.floor(now/windowMs);
 const key=createHash('sha256').update(`${subject}:${window}`).digest('hex');
 // The unique key index is created by db:indexes before accepting production traffic.
 const bucket=await RateBucket.findOneAndUpdate({key},{$inc:{count:1},$setOnInsert:{expiresAt:new Date((window+2)*windowMs)}},{upsert:true,new:true});
 if(bucket.count>limit)throw new HttpError(429,'تعداد درخواست‌ها زیاد است؛ کمی بعد تلاش کنید');
}
