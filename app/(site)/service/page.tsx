import type { Metadata } from "next";
import { getPageByKey, getSettings } from "@/lib/db";
import { buildPageMeta } from "@/lib/seo";
import PlaceholderPage from "@/components/PlaceholderPage";
import ServiceClient from "./ServiceClient";

// Admin panelindeki "Sayfalar" bölümünden bu sayfa gizlenirse (published:false)
// gerçek Hizmetler içeriği yerine "Yakında" ekranı gösterilir.
const FALLBACK_TR = "Hizmetler";
const FALLBACK_EN = "Services";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageByKey("services"), getSettings()]);
  if (!page) return {};
  const meta = buildPageMeta(page, FALLBACK_TR, settings.seoTitle);
  return { title: meta.title, description: meta.description };
}

export default async function Page() {
  const page = await getPageByKey("services");
  if (page && !page.published) {
    return <PlaceholderPage titleTR={FALLBACK_TR} titleEN={FALLBACK_EN} />;
  }
  return <ServiceClient />;
}
