import type { Metadata } from "next";
import { getPageByKey, getSettings } from "@/lib/db";
import { buildPageMeta } from "@/lib/seo";
import PlaceholderPage from "@/components/PlaceholderPage";
import SitePageContent from "@/components/SitePageContent";

const FALLBACK_TR = "Otomasyon & Kontrol";
const FALLBACK_EN = "Automation & Control";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageByKey("automation-control"), getSettings()]);
  if (!page || !page.published) return {};
  const meta = buildPageMeta(page, FALLBACK_TR, settings.seoTitle);
  return { title: meta.title, description: meta.description };
}

export default async function Page() {
  const page = await getPageByKey("automation-control");
  if (!page || !page.published) {
    return <PlaceholderPage titleTR={FALLBACK_TR} titleEN={FALLBACK_EN} />;
  }
  return <SitePageContent page={page} />;
}
