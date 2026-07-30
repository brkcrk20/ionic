import { getCategories, getProducts } from "@/lib/db";
import type { MultiLangString } from "@/lib/db";

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
        name: p.name, 
        code: p.slug.toUpperCase().replace(/-/g, " "),
        category: cat?.name || "",
        categoryId: p.categoryId,
        categorySlug: cat?.slug || "",
        parentCategoryId: cat?.parentId || null,
        image: p.images[0] || "/resim1.jpg",
        slug: p.slug,
      };
    });

  return { dbProducts, categories };
}