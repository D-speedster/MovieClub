import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/server/auth";
import { Logout } from "@/components/logout";
export const metadata={title:"حساب کاربری",robots:{index:false,follow:false}};
export default async function UserPage(){const user=await currentUser();if(!user)redirect('/auth/login');return <section className="container notice"><h1>{user.name}</h1><p>{user.email}</p>{['Admin','Owner'].includes(user.role)&&<p><Link href="/admin">پنل مدیریت</Link></p>}<Logout/></section>;}
