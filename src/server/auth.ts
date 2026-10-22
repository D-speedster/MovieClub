import "server-only";
import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { connectDB } from "@/lib/db";
import { Session, User } from "./models";
import { HttpError } from "./http";
const COOKIE = "movieclub_session";
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
export async function currentUser() {
 const token = (await cookies()).get(COOKIE)?.value;
 if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
 await connectDB();
 const session = await Session.findOne({ tokenHash:hash(token), expiresAt:{$gt:new Date()} });
 if (!session) return null;
 return User.findById(session.userId).select("name username email phone role createdAt");
}
export async function requireUser(admin=false) {
 const user=await currentUser();
 if(!user) throw new HttpError(401,"ابتدا وارد حساب خود شوید");
 if(admin&&!['Admin','Owner'].includes(user.role)) throw new HttpError(403,"دسترسی غیرمجاز");
 return user;
}
export async function createSession(userId: string) {
 await connectDB();
 const token=randomBytes(32).toString("hex");
 const expiresAt=new Date(Date.now()+24*60*60*1000);
 await Session.create({tokenHash:hash(token),userId,expiresAt});
 (await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',expires:expiresAt});
}
export async function deleteSession() {
 const store=await cookies(); const token=store.get(COOKIE)?.value;
 if(token){ await connectDB(); await Session.deleteOne({tokenHash:hash(token)}); }
 store.set(COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:0});
}
