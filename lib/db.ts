import { promises as fs } from "fs";
import path from "path";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string | null;
  images: string[];
  active: boolean;
  createdAt: string;
};

export type DB = {
  categories: Category[];
  products: Product[];
};

const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function readDB(): Promise<DB> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

async function writeDB(db: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function slugify(input: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return input
    .split("")
    .map((ch) => trMap[ch] ?? ch)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ----- Categories -----

export async function getCategories(): Promise<Category[]> {
  const db = await readDB();
  return db.categories;
}

export async function createCategory(input: {
  name: string;
  parentId: string | null;
  image?: string | null;
}): Promise<Category> {
  const db = await readDB();
  const category: Category = {
    id: makeId("cat"),
    name: input.name,
    slug: slugify(input.name),
    parentId: input.parentId ?? null,
    image: input.image ?? null,
  };
  db.categories.push(category);
  await writeDB(db);
  return category;
}

export async function updateCategory(
  id: string,
  input: { name?: string; parentId?: string | null; image?: string | null }
): Promise<Category | null> {
  const db = await readDB();
  const category = db.categories.find((c) => c.id === id);
  if (!category) return null;
  if (input.name !== undefined) {
    category.name = input.name;
    category.slug = slugify(input.name);
  }
  if (input.parentId !== undefined) category.parentId = input.parentId;
  if (input.image !== undefined) category.image = input.image;
  await writeDB(db);
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id && c.parentId !== id);
  // Ürünleri silinen kategoriden ayır
  db.products = db.products.map((p) =>
    p.categoryId === id ? { ...p, categoryId: null } : p
  );
  await writeDB(db);
  return db.categories.length < before;
}

// ----- Products -----

export async function getProducts(): Promise<Product[]> {
  const db = await readDB();
  return db.products;
}

export async function createProduct(input: {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string | null;
  images: string[];
  active: boolean;
}): Promise<Product> {
  const db = await readDB();
  const product: Product = {
    id: makeId("prod"),
    name: input.name,
    slug: slugify(input.name),
    description: input.description,
    price: input.price,
    stock: input.stock,
    categoryId: input.categoryId ?? null,
    images: input.images ?? [],
    active: input.active ?? true,
    createdAt: new Date().toISOString(),
  };
  db.products.push(product);
  await writeDB(db);
  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | null> {
  const db = await readDB();
  const product = db.products.find((p) => p.id === id);
  if (!product) return null;
  Object.assign(product, input);
  if (input.name) product.slug = slugify(input.name);
  await writeDB(db);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await readDB();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  await writeDB(db);
  return db.products.length < before;
}
