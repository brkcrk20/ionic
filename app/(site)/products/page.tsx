import { getCategories, getProducts, MultiLangString } from "@/lib/db";
import ProductsPageClient from "./ProductsPageClient";

const STATIC_POSITRON = {
  id: "static-positron",
  name: "POSITRON 60",
  code: "POSITRON",
  category: "Fırın Kule",
  image: "/Positron_3.jpg",
  slug: "positron",
};

// Çoklu dili güvenli bir şekilde string'e çeviren yardımcı fonksiyon
function getLangText(val: MultiLangString | undefined, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const dbProducts = products
    .filter((p) => p.active)
    .map((p) => {
      const catObj = categories.find((c) => c.id === p.categoryId)?.name;
      return {
        id: p.id,
        name: getLangText(p.name, "tr"), // Varsayılan olarak TR metin
        code: p.slug.toUpperCase().replace(/-/g, " "),
        category: getLangText(catObj, "tr"),
        image: p.images[0] || "/resim1.jpg",
        slug: p.slug,
      };
    });

  const withPositron = dbProducts.some((item) => item.slug === STATIC_POSITRON.slug)
    ? dbProducts
    : [STATIC_POSITRON, ...dbProducts];

  return <ProductsPageClient dbProducts={withPositron} />;
}