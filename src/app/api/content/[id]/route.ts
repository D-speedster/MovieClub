import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { contentInput, objectId } from "@/lib/content";
import { Content,Comment,DownloadLink,Trailer,SiteSettings } from "@/server/models";
import { requireUser } from "@/server/auth";
import { apiError,HttpError,jsonBody,requireSameOrigin } from "@/server/http";
type Context={params:Promise<{id:string}>};
export async function PUT(request:Request,{params}:Context){try{
 requireSameOrigin(request);await requireUser(true);const id=objectId.parse((await params).id);
 const data=contentInput.parse(await jsonBody(request));
 const item=await Content.findByIdAndUpdate(id,{$set:data},{new:true,runValidators:true});
 if(!item)throw new HttpError(404,'محتوا یافت نشد');
 revalidatePath('/');revalidatePath(`/movie/${item.slug}`);revalidatePath('/sitemap.xml');
 return NextResponse.json(item);
}catch(e){return apiError(e);}}
export async function DELETE(request:Request,{params}:Context){try{
 requireSameOrigin(request);await requireUser(true);const id=objectId.parse((await params).id);
 // Transactions require a MongoDB replica set; do not partially delete related records.
 const session=await Content.startSession();
 try{await session.withTransaction(async()=>{
  const item=await Content.findByIdAndDelete(id,{session});if(!item)throw new HttpError(404,'محتوا یافت نشد');
  await Comment.deleteMany({contentId:id},{session});await DownloadLink.deleteMany({contentId:id},{session});
  await Trailer.deleteMany({contentId:id},{session});
  await SiteSettings.updateOne({key:'featured_content'},{$pull:{value:id}},{session});
 });}finally{await session.endSession();}
 revalidatePath('/');revalidatePath('/sitemap.xml');
 return NextResponse.json({message:'محتوا و وابستگی‌ها حذف شدند'});
}catch(e){return apiError(e);}}
