"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export function AuthForm({register=false}:{register?:boolean}) {
 const [error,setError]=useState('');const [busy,setBusy]=useState(false);const router=useRouter();
 async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setError('');setBusy(true);
  try{const values=Object.fromEntries(new FormData(event.currentTarget));
   const response=await fetch(`/api/auth/${register?'register':'login'}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
   const data=await response.json();if(!response.ok)throw new Error(data.message);
   router.push(register?'/auth/login':data.role==='User'?'/user':'/admin');router.refresh();
  }catch(e){setError(e instanceof Error?e.message:'ارتباط برقرار نشد');}finally{setBusy(false);}}
 return <form className="form-stack" onSubmit={submit}><h1>{register?'ساخت حساب':'ورود'}</h1>{register&&<><label>نام<input name="name" minLength={3} maxLength={100} required autoComplete="name"/></label><label>ایمیل<input name="email" type="email" required autoComplete="email"/></label></>}<label>نام کاربری<input name="username" required maxLength={100} autoComplete="username" dir="ltr"/></label><label>رمز عبور<input name="password" type="password" required minLength={register?8:1} maxLength={72} autoComplete={register?'new-password':'current-password'} dir="ltr"/></label>{error&&<p role="alert">{error}</p>}<button disabled={busy}>{busy?'در حال انجام…':register?'ثبت‌نام':'ورود'}</button><Link href={register?'/auth/login':'/auth/register'}>{register?'ورود به حساب':'ساخت حساب جدید'}</Link></form>;
}
