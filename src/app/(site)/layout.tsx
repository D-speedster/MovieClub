import { Header } from "@/components/header";
import Footer from "@/components/footer";
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
    </>
  );
}
