import type { Metadata } from "next";
import { getPageByKey, getSettings } from "@/lib/db";
import { buildPageMeta } from "@/lib/seo";
import PlaceholderPage from "@/components/PlaceholderPage";
import SitePageContent from "@/components/SitePageContent";

const FALLBACK_TR = "İletişim";
const FALLBACK_EN = "Contact";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageByKey("contact"), getSettings()]);
  if (!page || !page.published) return {};
  const meta = buildPageMeta(page, FALLBACK_TR, settings.seoTitle);
  return { title: meta.title, description: meta.description };
}

export default async function Page() {
  const page = await getPageByKey("contact");
  if (!page || !page.published) {
    return <PlaceholderPage titleTR={FALLBACK_TR} titleEN={FALLBACK_EN} />;
  }
  return <SitePageContent page={page} />;
}
