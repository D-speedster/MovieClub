import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { getSettings } from "@/server/settings";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.siteName} | فیلم و سریال`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.description,
  };
}
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <>
      <Header siteName={settings.siteName} />
      <main className="app-main">{children}</main>
      <Footer
        siteName={settings.siteName}
        footerText={settings.footerText}
        telegram={settings.telegram}
        instagram={settings.instagram}
      />
    </>
  );
}
