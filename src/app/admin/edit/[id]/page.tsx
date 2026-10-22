import {notFound} from "next/navigation";
import {getContent} from "@/server/catalog";
import {ContentForm} from "@/components/content-form";
export default async function Page({params}:{params:Promise<{id:string}>}){const item=await getContent((await params).id);if(!item)notFound();return <ContentForm item={item}/>;}
