import { NextResponse } from "next/server";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/server/models";
import { createSession, deleteSession, requireUser } from "@/server/auth";
import { apiError, HttpError, jsonBody, requireSameOrigin } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
const login = z.object({username:z.string().trim().min(1).max(100),password:z.string().min(1).max(72).refine(value=>Buffer.byteLength(value,'utf8')<=72)});
const register = login.extend({username:z.string().trim().regex(/^[a-zA-Z0-9_]{3,30}$/),name:z.string().trim().min(3).max(100),email:z.email().trim().toLowerCase(),password:z.string().min(8).max(72).refine(value=>Buffer.byteLength(value,'utf8')<=72)});
export async function GET(_request: Request,{params}:{params:Promise<{action:string}>}) {
 try{if((await params).action!=='me')throw new HttpError(404,'یافت نشد');return NextResponse.json(await requireUser());}catch(e){return apiError(e);}
}
export async function POST(request: Request,{params}:{params:Promise<{action:string}>}) {
 try {
  requireSameOrigin(request);
  const {action}=await params;
  if(action==='logout'){await deleteSession();return NextResponse.json({message:'خارج شدید'});}
  if(!['login','register'].includes(action))throw new HttpError(404,'یافت نشد');
  await connectDB();
  const body=await jsonBody(request);
  if(action==='register'){
   await rateLimit('register-global',30);
   const data=register.parse(body);
   await User.create({...data,password:await hash(data.password,12),role:'User'});
   return NextResponse.json({message:'حساب ساخته شد'},{status:201});
  }
  const data=login.parse(body);
  await rateLimit('login-global',200);
  await rateLimit(`login:${data.username.toLowerCase()}`,10);
  const user=await User.findOne({username:data.username}).select('+password');
  if(!user||!await compare(data.password,user.password))throw new HttpError(401,'نام کاربری یا رمز عبور نادرست است');
  await createSession(String(user._id));
  return NextResponse.json({message:'وارد شدید',role:user.role});
 }catch(e){return apiError(e);}
}
