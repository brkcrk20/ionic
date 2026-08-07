import type { Metadata } from "next";
import { getPageByKey, getSettings } from "@/lib/db";
import { buildPageMeta } from "@/lib/seo";
import PlaceholderPage from "@/components/PlaceholderPage";
import AboutUsClient from "./AboutUsClient";

// Admin panelindeki "Sayfalar" bölümünden bu sayfa gizlendiğinde (published:false)
// gerçek içerik yerine "Yakında" ekranı gösterilir. İçeriğin kendisi (metinler,
// görseller) hâlâ AboutUsClient.tsx içinde koddan yönetiliyor; burada sadece
// yayın durumu kontrol ediliyor. Sayfa hiç admin'de düzenlenmemişse (kayıt yoksa)
// varsayılan olarak yayında kabul edilir.
const FALLBACK_TR = "Hakkımızda";
const FALLBACK_EN = "About Us";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageByKey("about-us"), getSettings()]);
  if (!page) return {};
  const meta = buildPageMeta(page, FALLBACK_TR, settings.seoTitle);
  return { title: meta.title, description: meta.description };
}

export default async function Page() {
  const page = await getPageByKey("about-us");
  if (page && !page.published) {
    return <PlaceholderPage titleTR={FALLBACK_TR} titleEN={FALLBACK_EN} />;
  }
  return <AboutUsClient />;
}
