"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const links = [["فیلم", "/movies"], ["سریال", "/series"], ["انیمه", "/anime"], ["دسته‌بندی‌ها", "/categories"], ["تماس با ما", "/contact"]];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <><header className="global-header global-header--solid"><div className="global-header__content">
    <Link href="/" className="global-header__logo"><span className="global-header__logo-text">MOVIE</span><span className="global-header__logo-accent">CLUB</span></Link>
    <nav className="global-header__nav" aria-label="ناوبری اصلی">{links.map(([title, url]) => <Link key={url} href={url} aria-current={pathname === url ? "page" : undefined} className="global-header__nav-link">{title}</Link>)}</nav>
    <div className="global-header__actions"><Link href="/user" className="global-header__login-btn">حساب کاربری</Link><Link href="/search" className="global-header__subscribe-btn">جستجو</Link></div>
    <button className="mobile-menu-button" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>منو</button>
  </div></header>{open && <nav id="mobile-nav" className="mobile-links" aria-label="منوی موبایل">{[...links,["حساب کاربری","/user"],["جستجو","/search"]].map(([t,u])=><Link key={u} href={u} onClick={()=>setOpen(false)}>{t}</Link>)}</nav>}</>;
}
