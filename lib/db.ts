import { promises as fs } from "fs";
import path from "path";

export type Category = { id: string; name: string; slug: string; parentId: string | null; image: string | null; };
export type ProductSpec = { label: string; unit: string; value: string };
export type Product = { id: string; name: string; slug: string; description: string; categoryId: string | null; images: string[]; specs: ProductSpec[]; active: boolean; createdAt: string; };
export type SliderItem = { id: string; image: string; title: string; subtitle: string; buttonText: string; buttonLink: string; };
export type SiteSettings = { phone: string; email: string; address: string; instagram: string; facebook: string; linkedin: string; };

export type DB = {
  categories: Category[];
  products: Product[];
  slider: SliderItem[];
  settings: SiteSettings;
};

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const DEFAULT_SETTINGS: SiteSettings = {
  phone: "",
  email: "",
  address: "",
  instagram: "",
  facebook: "",
  linkedin: "",
};

export async function getDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    // Eksik alanlar için güvenli varsayılanlar (ör. eski veri dosyalarında "settings" olmayabilir)
    return {
      categories: parsed.categories ?? [],
      products: parsed.products ?? [],
      slider: parsed.slider ?? [],
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    };
  } catch {
    return { categories: [], products: [], slider: [], settings: { ...DEFAULT_SETTINGS } };
  }
}

export async function updateDB(db: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// Helperlar
function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function makeId(prefix: string): string { return `${prefix}-${Date.now().toString(36)}`; }

// Dışa Aktarımlar
export async function getCategories() { return (await getDB()).categories; }
export async function getProducts() { return (await getDB()).products; }
export async function getSlider() { return (await getDB()).slider; }
export async function getSettings() { return (await getDB()).settings; }

export async function createCategory(input: any) {
  const db = await getDB();
  const cat: Category = { id: makeId("cat"), name: input.name, slug: slugify(input.name), parentId: input.parentId, image: input.image };
  db.categories.push(cat);
  await updateDB(db);
  return cat;
}

export async function createProduct(input: any) {
  const db = await getDB();
  const prod: Product = {
    id: makeId("prod"),
    name: input.name,
    slug: slugify(input.name),
    description: input.description ?? "",
    categoryId: input.categoryId ?? null,
    images: input.images ?? [],
    specs: input.specs ?? [],
    active: input.active ?? true,
    createdAt: new Date().toISOString(),
  };
  db.products.push(prod);
  await updateDB(db);
  return prod;
}

export async function updateCategory(id: string, input: Partial<Pick<Category, "name" | "parentId" | "image">>) {
  const db = await getDB();
  const cat = db.categories.find((c) => c.id === id);
  if (!cat) return null;
  if (input.name !== undefined) {
    cat.name = input.name;
    cat.slug = slugify(input.name);
  }
  if (input.parentId !== undefined) cat.parentId = input.parentId;
  if (input.image !== undefined) cat.image = input.image;
  await updateDB(db);
  return cat;
}

export async function deleteCategory(id: string) {
  const db = await getDB();
  const exists = db.categories.some((c) => c.id === id);
  if (!exists) return false;
  // Alt kategorileri de birlikte sil
  const idsToDelete = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of db.categories) {
      if (c.parentId && idsToDelete.has(c.parentId) && !idsToDelete.has(c.id)) {
        idsToDelete.add(c.id);
        changed = true;
      }
    }
  }
  db.categories = db.categories.filter((c) => !idsToDelete.has(c.id));
  db.products.forEach((p) => {
    if (p.categoryId && idsToDelete.has(p.categoryId)) p.categoryId = null;
  });
  await updateDB(db);
  return true;
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  const db = await getDB();
  const prod = db.products.find((p) => p.id === id);
  if (!prod) return null;
  if (typeof input.name === "string") {
    prod.name = input.name;
    prod.slug = slugify(input.name);
  }
  if (typeof input.description === "string") prod.description = input.description;
  if (input.categoryId !== undefined) prod.categoryId = input.categoryId as string | null;
  if (Array.isArray(input.images)) prod.images = input.images as string[];
  if (Array.isArray(input.specs)) prod.specs = input.specs as ProductSpec[];
  if (input.active !== undefined) prod.active = Boolean(input.active);
  await updateDB(db);
  return prod;
}

export async function deleteProduct(id: string) {
  const db = await getDB();
  const exists = db.products.some((p) => p.id === id);
  if (!exists) return false;
  db.products = db.products.filter((p) => p.id !== id);
  await updateDB(db);
  return true;
}