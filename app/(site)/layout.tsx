import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import { getCategories, getNavMenu, getSettings } from "@/lib/db";
import { buildOrganizationJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.seoTitle || "Ion Meccanica",
    description: settings.seoDescription || undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categories, navMenu, settings] = await Promise.all([getCategories(), getNavMenu(), getSettings()]);

  if (settings.maintenanceMode) {
    return <MaintenanceScreen message={settings.maintenanceMessage} />;
  }

  const announcement = settings.announcementEnabled
    ? { text: settings.announcementText, link: settings.announcementLink || undefined }
    : null;

  const organizationJsonLd = buildOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {settings.googleAnalyticsId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAnalyticsId}');`}
          </Script>
        </>
      )}
      <Navbar categories={categories} navMenu={navMenu} announcement={announcement} />
      {announcement && <div className="h-9" />}
      <main>{children}</main>
      <Footer text={settings.footerText} />
    </>
  );
}