"use client";
import {useRouter} from "next/navigation";
import {useState} from "react";
export function Logout(){const router=useRouter();const [error,setError]=useState('');return <><button onClick={async()=>{try{const r=await fetch('/api/auth/logout',{method:'POST'});if(!r.ok)throw new Error();router.push('/auth/login');router.refresh();}catch{setError('خروج انجام نشد؛ دوباره تلاش کنید');}}}>خروج از حساب</button>{error&&<p role="alert">{error}</p>}</>;}
