import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import "@/styles/tokens.css";
import "@/styles/fonts.css";
import "@/styles/header.css";
import "@/styles/footer.css";
import "@/styles/hero.css";
import "@/styles/card.css";
import "@/styles/movie.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl(), title: { default: "مووی کلاب | فیلم و سریال", template: "%s | مووی کلاب" },
  description: "اطلاعات، معرفی و دانلود فیلم و سریال در مووی کلاب",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="rtl"><body><Header /><main className="app-main">{children}</main><Footer /></body></html>;
}
