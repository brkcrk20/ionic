import { getCategories, getProducts } from "@/lib/db";
import type { MultiLangString } from "@/lib/db";

const STATIC_POSITRON = {
  id: "static-positron",
  name: "POSITRON 60",
  code: "POSITRON",
  category: "Fırın Kule",
  categoryId: "firin-kule",
  categorySlug: "firin-kule",
  parentCategoryId: null as string | null,
  image: "/Positron_3.jpg",
  slug: "positron",
};

function getLangText(val: MultiLangString | undefined, lang: "tr" | "en" = "tr"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "tr" ? (val.tr || val.en || "") : (val.en || val.tr || "");
}

// /products ve /kategori/[slug] sayfalarının ikisinin de kullandığı ortak veri hazırlama mantığı
export async function getProductsPageData() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const dbProducts = products
    .filter((p) => p.active)
    .map((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      const catName = getLangText(cat?.name, "tr");
      return {
        id: p.id,
        name: getLangText(p.name, "tr"),
        code: p.slug.toUpperCase().replace(/-/g, " "),
        category: catName,
        categoryId: p.categoryId,
        categorySlug: cat?.slug || "",
        parentCategoryId: cat?.parentId || null,
        image: p.images[0] || "/resim1.jpg",
        slug: p.slug,
      };
    });

  const withPositron = dbProducts.some((item) => item.slug === STATIC_POSITRON.slug)
    ? dbProducts
    : [STATIC_POSITRON, ...dbProducts];

  return { dbProducts: withPositron, categories };
}
