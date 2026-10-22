import Link from "next/link";
import {redirect} from "next/navigation";
import {currentUser} from "@/server/auth";
export const metadata={title:"مدیریت",robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const user=await currentUser();if(!user)redirect('/auth/login');if(!['Admin','Owner'].includes(user.role))redirect('/user');return <div className="container"><nav className="search-form"><Link href="/admin">محتواها</Link><Link href="/admin/new">افزودن محتوا</Link><Link href="/user">حساب کاربری</Link></nav>{children}</div>;}
