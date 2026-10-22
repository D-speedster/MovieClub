import {NextResponse} from "next/server";
import {z} from "zod";
import {objectId} from "@/lib/content";
import {canManageUser} from "@/lib/permissions";
import {requireUser} from "@/server/auth";
import {User,Session} from "@/server/models";
import {apiError,HttpError,jsonBody,requireSameOrigin} from "@/server/http";
type Context={params:Promise<{id:string}>};
async function targetUser(id:string){const target=await User.findById(objectId.parse(id));if(!target)throw new HttpError(404,'کاربر یافت نشد');return target;}
export async function PUT(request:Request,{params}:Context){try{
 requireSameOrigin(request);const actor=await requireUser(true);const target=await targetUser((await params).id);
 const {role}=z.object({role:z.enum(['User','Admin','Owner'])}).parse(await jsonBody(request));
 if(!canManageUser({id:String(actor._id),role:actor.role},{id:String(target._id),role:target.role},role))throw new HttpError(403,'تغییر نقش این حساب مجاز نیست');
 // Compare target role as well to avoid overwriting a concurrent promotion to Owner.
 const updated=await User.findOneAndUpdate({_id:target._id,role:target.role},{$set:{role}},{new:true,runValidators:true});
 if(!updated)throw new HttpError(409,'حساب تغییر کرده است؛ دوباره دریافت کنید');
 await Session.deleteMany({userId:target._id});return NextResponse.json(updated);
}catch(e){return apiError(e);}}
export async function DELETE(request:Request,{params}:Context){try{
 requireSameOrigin(request);const actor=await requireUser(true);const target=await targetUser((await params).id);
 if(!canManageUser({id:String(actor._id),role:actor.role},{id:String(target._id),role:target.role}))throw new HttpError(403,'حذف این حساب مجاز نیست');
 const deleted=await User.findOneAndDelete({_id:target._id,role:target.role});if(!deleted)throw new HttpError(409,'حساب تغییر کرده است');
 await Session.deleteMany({userId:target._id});return NextResponse.json({message:'حساب حذف شد'});
}catch(e){return apiError(e);}}
