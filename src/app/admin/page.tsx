import Link from "next/link";
import {listContent} from "@/server/catalog";
import {parsePage} from "@/lib/content";
export default async function Admin({searchParams}:{searchParams:Promise<{page?:string}>}){const data=await listContent({page:parsePage((await searchParams).page)});return <section><h1>مدیریت محتوا</h1>{data.items.map(item=><div className="download-row" key={item._id}><span>{item.title}</span><Link href={`/admin/edit/${item._id}`}>ویرایش</Link><Link href={`/movie/${item.slug}`}>مشاهده</Link></div>)}<nav className="pagination">{data.page>1&&<Link href={`/admin?page=${data.page-1}`}>قبل</Link>}{data.page<data.pages&&<Link href={`/admin?page=${data.page+1}`}>بعد</Link>}</nav></section>;}
