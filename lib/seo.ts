import type { MultiLangString, Product, Category, SitePage, NewsItem } from "./db";

/** Bir kategorinin kendisi + tüm alt kategorilerinin id'lerini döner (ProductsPageClient'taki mantığın sunucu tarafı eşdeğeri). */
export function getDescendantAndSelfCategoryIds(categories: Category[], rootId: string): Set<string> {
  const result = new Set<string>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of categories) {
      if (c.parentId && result.has(c.parentId) && !result.has(c.id)) {
        result.add(c.id);
        changed = true;
      }
    }
  }
  return result;
}

/**
 * Sitenin canonical/mutlak URL'lerde kullanılacak temel adresi.
 * Vercel/production ortamında NEXT_PUBLIC_SITE_URL ile override edilebilir.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://www.ionmeccanica.com";
}

export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function getLangText(val: MultiLangString | undefined, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? val.tr || val.en || "" : val.en || val.tr || "";
}

/** Zengin metin alanlarında (RichTextEditor çıktısı) HTML etiketi geçebiliyor; meta description'a düz metin gerekir. */
export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(value: string, maxLength: number): string {
  const clean = value.trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

/** Ürün için meta title/description üretir: admin özel bir değer girdiyse onu, girmediyse ürün verisinden otomatik üretir. */
export function buildProductMeta(product: Product, siteTitle: string) {
  const name = getLangText(product.name) || "Ürün";
  const subtitle = getLangText(product.subtitle);
  const heroDescription = stripHtml(getLangText(product.heroDescription));

  const title = product.seoTitle || `${name}${subtitle ? ` — ${subtitle}` : ""} | ${siteTitle}`;
  const description =
    product.seoDescription ||
    truncate(subtitle || heroDescription || `${name} hakkında teknik bilgiler ve detaylar.`, 160);

  return { title: truncate(title, 70), description };
}

/** Kategori için meta title/description üretir. */
export function buildCategoryMeta(category: Category, siteTitle: string, productCount: number) {
  const name = getLangText(category.name) || "Kategori";

  const title = category.seoTitle || `${name} | ${siteTitle}`;
  const description =
    category.seoDescription ||
    truncate(
      `${name} kategorisindeki${productCount > 0 ? ` ${productCount} ürünü` : " ürünleri"} inceleyin. Teknik özellikler ve detaylı bilgi için ${siteTitle}.`,
      160
    );

  return { title: truncate(title, 70), description };
}

/** Google zengin sonuçları için Product JSON-LD (schema.org/Product). Fiyat/teklif temelli değil, çünkü bu makineler talep üzerine teklif ile satılıyor. */
export function buildProductJsonLd(product: Product, categoryName: string | null) {
  const name = getLangText(product.name);
  const description = stripHtml(getLangText(product.subtitle)) || stripHtml(getLangText(product.heroDescription));
  const images = [product.heroImage, ...product.images].filter(Boolean).map((img) => absoluteUrl(img));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || undefined,
    image: images.length > 0 ? images : undefined,
    sku: product.slug,
    category: categoryName || undefined,
    brand: {
      "@type": "Brand",
      name: "Ion Meccanica",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Ion Meccanica",
      url: getSiteUrl(),
    },
    url: absoluteUrl(`/products/${product.slug}`),
  };
}

export function buildCategoryItemListJsonLd(products: { name: MultiLangString; slug: string; image?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${p.slug}`),
      name: getLangText(p.name),
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ion Meccanica",
    url: getSiteUrl(),
    logo: absoluteUrl("/logo.png"),
    email: "info@ionmeccanica.com",
  };
}

/** Sabit kurumsal sayfalar (About Us, Capabilities vb.) için meta title/description üretir. */
export function buildPageMeta(page: SitePage, fallbackTitle: string, siteTitle: string) {
  const name = getLangText(page.title) || fallbackTitle;
  const description = stripHtml(getLangText(page.description));

  const title = page.seoTitle || `${name} | ${siteTitle}`;
  const metaDescription =
    page.seoDescription ||
    truncate(description || `${name} hakkında bilgi edinin.`, 160);

  return { title: truncate(title, 70), description: metaDescription };
}

/** Haber/duyuru sayfaları için meta title/description üretir. */
export function buildNewsMeta(news: NewsItem, siteTitle: string) {
  const name = getLangText(news.title) || "Haber";
  const excerpt = stripHtml(getLangText(news.excerpt));
  const content = stripHtml(getLangText(news.content));

  const title = news.seoTitle || `${name} | ${siteTitle}`;
  const description =
    news.seoDescription ||
    truncate(excerpt || content || `${name} hakkında detaylar.`, 160);

  return { title: truncate(title, 70), description };
}

/** Haber için Article JSON-LD (schema.org/NewsArticle). */
export function buildNewsJsonLd(news: NewsItem) {
  const name = getLangText(news.title);
  const description = stripHtml(getLangText(news.excerpt)) || stripHtml(getLangText(news.content));

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: name,
    description: description || undefined,
    image: news.coverImage ? [absoluteUrl(news.coverImage)] : undefined,
    datePublished: news.date,
    dateModified: news.date,
    url: absoluteUrl(`/news/${news.slug}`),
    publisher: {
      "@type": "Organization",
      name: "Ion Meccanica",
      url: getSiteUrl(),
    },
  };
}
