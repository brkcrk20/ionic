import { promises as fs } from "fs";
import path from "path";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string | null;
};

export type TextAlign = "left" | "center" | "right" | "justify";

export type TextStyle = {
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: TextAlign;
  lineHeight?: string;
  letterSpacing?: string;
};

export type StyledBlock = {
  text: string;
  style?: TextStyle;
};

export type StyledPair = {
  title: string;
  text: string;
  titleStyle?: TextStyle;
  textStyle?: TextStyle;
};

export type ProductConfig = {
  name: string;
  text: string;
  nameStyle?: TextStyle;
  textStyle?: TextStyle;
};

export type ProductVersion = {
  label: string;
  text: string;
  labelStyle?: TextStyle;
  textStyle?: TextStyle;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  heroDescription: string;
  heroImage: string;
  descriptionParagraphs: string[];
  configs: ProductConfig[];
  configNote: string;
  configNote2: string;
  versions: ProductVersion[];
  features: string[];
  categoryId: string | null;
  images: string[];
  active: boolean;
  createdAt: string;

  // Yeni çok adımlı ürün ekleme yapısı
  nameStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  heroDescriptionStyle?: TextStyle;
  descriptionBlocks?: StyledPair[];
  configBlocks?: StyledPair[];
  configNoteStyle?: TextStyle;
  configNote2Style?: TextStyle;
  versionBlocks?: StyledPair[];
  featureBlocks?: StyledPair[];

  // Bölüm başlıkları (admin tarafından serbestçe yazılabilir)
  descriptionSectionTitle?: string;
  configsSectionTitle?: string;
  versionsSectionTitle?: string;
  featuresSectionTitle?: string;
};

export type SliderItem = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
};

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
};

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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeTextStyle(value: unknown): TextStyle | undefined {
  if (!isObject(value)) return undefined;
  const style: TextStyle = {};
  if (typeof value.color === "string") style.color = value.color;
  if (typeof value.fontSize === "string") style.fontSize = value.fontSize;
  if (typeof value.fontFamily === "string") style.fontFamily = value.fontFamily;
  if (typeof value.fontWeight === "string") style.fontWeight = value.fontWeight;
  if (typeof value.fontStyle === "string") style.fontStyle = value.fontStyle;
  if (typeof value.textDecoration === "string") style.textDecoration = value.textDecoration;
  if (["left", "center", "right", "justify"].includes(String(value.textAlign))) {
    style.textAlign = value.textAlign as TextAlign;
  }
  if (typeof value.lineHeight === "string") style.lineHeight = value.lineHeight;
  if (typeof value.letterSpacing === "string") style.letterSpacing = value.letterSpacing;
  return Object.keys(style).length > 0 ? style : undefined;
}

function normalizeStyledBlock(value: unknown): StyledBlock | null {
  if (typeof value === "string") return { text: value };
  if (!isObject(value) || typeof value.text !== "string") return null;
  return {
    text: value.text,
    style: normalizeTextStyle(value.style),
  };
}

function normalizeStyledPair(value: unknown): StyledPair | null {
  if (!isObject(value)) return null;
  const title = typeof value.title === "string" ? value.title : typeof value.name === "string" ? value.name : typeof value.label === "string" ? value.label : "";
  const text = typeof value.text === "string" ? value.text : "";
  if (!title && !text) return null;
  return {
    title,
    text,
    titleStyle: normalizeTextStyle(value.titleStyle),
    textStyle: normalizeTextStyle(value.textStyle),
  };
}

function normalizeProduct(raw: any): Product {
  const descriptionParagraphs = Array.isArray(raw?.descriptionParagraphs)
    ? raw.descriptionParagraphs.map((item: unknown) => normalizeStyledBlock(item)).filter(Boolean).map((item: StyledBlock | null) => item!.text)
    : [];
  const configs = Array.isArray(raw?.configs)
    ? raw.configs.map((item: unknown) => {
        if (typeof item === "string") return { name: item, text: "" };
        if (!isObject(item)) return null;
        const name = typeof item.name === "string" ? item.name : typeof item.label === "string" ? item.label : "";
        const text = typeof item.text === "string" ? item.text : "";
        if (!name && !text) return null;
        return {
          name,
          text,
          nameStyle: normalizeTextStyle(item.nameStyle),
          textStyle: normalizeTextStyle(item.textStyle),
        } as ProductConfig;
      }).filter(Boolean)
    : [];
  const versions = Array.isArray(raw?.versions)
    ? raw.versions.map((item: unknown) => {
        if (typeof item === "string") return { label: item, text: "" };
        if (!isObject(item)) return null;
        const label = typeof item.label === "string" ? item.label : typeof item.name === "string" ? item.name : "";
        const text = typeof item.text === "string" ? item.text : "";
        if (!label && !text) return null;
        return {
          label,
          text,
          labelStyle: normalizeTextStyle(item.labelStyle),
          textStyle: normalizeTextStyle(item.textStyle),
        } as ProductVersion;
      }).filter(Boolean)
    : [];
  const features = Array.isArray(raw?.features)
    ? raw.features.map((item: unknown) => normalizeStyledBlock(item)).filter(Boolean).map((item: StyledBlock | null) => item!.text)
    : [];

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? ""),
    slug: String(raw?.slug ?? ""),
    subtitle: String(raw?.subtitle ?? ""),
    heroDescription: String(raw?.heroDescription ?? ""),
    heroImage: String(raw?.heroImage ?? ""),
    descriptionParagraphs,
    configs,
    configNote: String(raw?.configNote ?? ""),
    configNote2: String(raw?.configNote2 ?? ""),
    versions,
    features,
    categoryId: raw?.categoryId ?? null,
    images: Array.isArray(raw?.images) ? raw.images.filter((x: unknown) => typeof x === "string") : [],
    active: Boolean(raw?.active ?? true),
    createdAt: String(raw?.createdAt ?? new Date().toISOString()),
    nameStyle: normalizeTextStyle(raw?.nameStyle),
    subtitleStyle: normalizeTextStyle(raw?.subtitleStyle),
    heroDescriptionStyle: normalizeTextStyle(raw?.heroDescriptionStyle),
    descriptionBlocks: Array.isArray(raw?.descriptionBlocks)
      ? raw.descriptionBlocks.map((item: unknown) => normalizeStyledPair(item)).filter(Boolean).map((item: StyledPair | null) => item!)
      : descriptionParagraphs.length > 0
        ? descriptionParagraphs.map((text: string) => ({ title: "", text }))
        : undefined,
    configBlocks: Array.isArray(raw?.configBlocks)
      ? raw.configBlocks.map((item: unknown) => normalizeStyledPair(item)).filter(Boolean).map((item: StyledPair | null) => item!)
      : undefined,
    configNoteStyle: normalizeTextStyle(raw?.configNoteStyle),
    configNote2Style: normalizeTextStyle(raw?.configNote2Style),
    versionBlocks: Array.isArray(raw?.versionBlocks)
      ? raw.versionBlocks.map((item: unknown) => normalizeStyledPair(item)).filter(Boolean).map((item: StyledPair | null) => item!)
      : undefined,
    featureBlocks: Array.isArray(raw?.featureBlocks)
      ? raw.featureBlocks.map((item: unknown) => normalizeStyledPair(item)).filter(Boolean).map((item: StyledPair | null) => item!)
      : Array.isArray(raw?.features)
        ? raw.features
            .map((item: unknown) => (typeof item === "string" ? { title: "", text: item } : normalizeStyledPair(item)))
            .filter(Boolean)
            .map((item: StyledPair | null) => item!)
        : undefined,
    descriptionSectionTitle: typeof raw?.descriptionSectionTitle === "string" ? raw.descriptionSectionTitle : "",
    configsSectionTitle: typeof raw?.configsSectionTitle === "string" ? raw.configsSectionTitle : "",
    versionsSectionTitle: typeof raw?.versionsSectionTitle === "string" ? raw.versionsSectionTitle : "",
    featuresSectionTitle: typeof raw?.featuresSectionTitle === "string" ? raw.featuresSectionTitle : "",
  };
}

function normalizeDB(parsed: Partial<DB>): DB {
  return {
    categories: Array.isArray(parsed.categories) ? parsed.categories as Category[] : [],
    products: Array.isArray(parsed.products) ? parsed.products.map((p) => normalizeProduct(p)) : [],
    slider: Array.isArray(parsed.slider) ? parsed.slider as SliderItem[] : [],
    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
  };
}

async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    return normalizeDB(parsed);
  } catch {
    return { categories: [], products: [], slider: [], settings: { ...DEFAULT_SETTINGS } };
  }
}

export async function getDB(): Promise<DB> {
  return readDB();
}

export async function updateDB(db: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

const TR_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

function slugify(input: string): string {
  const transliterated = input
    .split("")
    .map((ch) => TR_CHAR_MAP[ch] ?? ch)
    .join("");
  return transliterated
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(base: string, db: DB, ignoreId?: string): Promise<string> {
  let slug = base || "urun";
  let i = 2;
  while (db.products.some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function getCategories() {
  return (await getDB()).categories;
}

export async function getProducts() {
  return (await getDB()).products;
}

export async function getSlider() {
  return (await getDB()).slider;
}

export async function getSettings() {
  return (await getDB()).settings;
}

export async function createCategory(input: any) {
  const db = await getDB();
  const cat: Category = {
    id: makeId("cat"),
    name: input.name,
    slug: slugify(input.name),
    parentId: input.parentId,
    image: input.image,
  };
  db.categories.push(cat);
  await updateDB(db);
  return cat;
}

const RESERVED_SLUGS = new Set(["positron"]);

export async function createProduct(input: any) {
  const db = await getDB();
  let base = slugify(input.name);
  if (RESERVED_SLUGS.has(base)) base = `${base}-2`;
  const slug = await uniqueSlug(base, db);

  const prod: Product = normalizeProduct({
    id: makeId("prod"),
    name: input.name,
    slug,
    subtitle: input.subtitle ?? "",
    heroDescription: input.heroDescription ?? "",
    heroImage: input.heroImage ?? "",
    descriptionParagraphs: Array.isArray(input.descriptionParagraphs) ? input.descriptionParagraphs : [],
    configs: Array.isArray(input.configs) ? input.configs : [],
    configNote: input.configNote ?? "",
    configNote2: input.configNote2 ?? "",
    versions: Array.isArray(input.versions) ? input.versions : [],
    features: Array.isArray(input.features) ? input.features : [],
    categoryId: input.categoryId ?? null,
    images: input.images ?? [],
    active: input.active ?? true,
    createdAt: new Date().toISOString(),
    nameStyle: input.nameStyle,
    subtitleStyle: input.subtitleStyle,
    heroDescriptionStyle: input.heroDescriptionStyle,
    descriptionBlocks: input.descriptionBlocks,
    configBlocks: input.configBlocks,
    configNoteStyle: input.configNoteStyle,
    configNote2Style: input.configNote2Style,
    versionBlocks: input.versionBlocks,
    featureBlocks: input.featureBlocks,
    descriptionSectionTitle: input.descriptionSectionTitle ?? "",
    configsSectionTitle: input.configsSectionTitle ?? "",
    versionsSectionTitle: input.versionsSectionTitle ?? "",
    featuresSectionTitle: input.featuresSectionTitle ?? "",
  });

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

  if (typeof input.name === "string" && input.name.trim() && input.name !== prod.name) {
    prod.name = input.name;
    let base = slugify(input.name);
    if (RESERVED_SLUGS.has(base)) base = `${base}-2`;
    prod.slug = await uniqueSlug(base, db, prod.id);
  }

  if (typeof input.subtitle === "string") prod.subtitle = input.subtitle;
  if (typeof input.heroDescription === "string") prod.heroDescription = input.heroDescription;
  if (typeof input.heroImage === "string") prod.heroImage = input.heroImage;
  if (Array.isArray(input.descriptionParagraphs)) prod.descriptionParagraphs = input.descriptionParagraphs.filter((x) => typeof x === "string") as string[];
  if (Array.isArray(input.descriptionBlocks)) {
    prod.descriptionBlocks = input.descriptionBlocks.map((item) => normalizeStyledPair(item)).filter(Boolean).map((item) => item!);
    prod.descriptionParagraphs = prod.descriptionBlocks.map((item) => item.text);
  }
  if (Array.isArray(input.configs)) {
    prod.configs = input.configs.map((item) => normalizeStyledPair(item)).filter(Boolean).map((item) => ({
      name: item!.title,
      text: item!.text,
      nameStyle: item!.titleStyle,
      textStyle: item!.textStyle,
    }));
  }
  if (typeof input.configNote === "string") prod.configNote = input.configNote;
  if (typeof input.configNote2 === "string") prod.configNote2 = input.configNote2;
  if (Array.isArray(input.versions)) {
    prod.versions = input.versions.map((item) => normalizeStyledPair(item)).filter(Boolean).map((item) => ({
      label: item!.title,
      text: item!.text,
      labelStyle: item!.titleStyle,
      textStyle: item!.textStyle,
    }));
  }
  if (Array.isArray(input.features)) prod.features = input.features.filter((x) => typeof x === "string") as string[];
  if (input.categoryId !== undefined) prod.categoryId = input.categoryId as string | null;
  if (Array.isArray(input.images)) prod.images = input.images.filter((x) => typeof x === "string") as string[];
  if (input.active !== undefined) prod.active = Boolean(input.active);

  if (input.nameStyle !== undefined) prod.nameStyle = input.nameStyle as TextStyle;
  if (input.subtitleStyle !== undefined) prod.subtitleStyle = input.subtitleStyle as TextStyle;
  if (input.heroDescriptionStyle !== undefined) prod.heroDescriptionStyle = input.heroDescriptionStyle as TextStyle;
  if (Array.isArray(input.descriptionBlocks)) prod.descriptionBlocks = input.descriptionBlocks.map((item) => normalizeStyledPair(item)).filter(Boolean).map((item) => item!);
  if (Array.isArray(input.configBlocks)) {
    prod.configBlocks = input.configBlocks.map((item) => normalizeStyledPair(item)).filter(Boolean).map((item) => item!);
  }
  if (input.configNoteStyle !== undefined) prod.configNoteStyle = input.configNoteStyle as TextStyle;
  if (input.configNote2Style !== undefined) prod.configNote2Style = input.configNote2Style as TextStyle;
  if (Array.isArray(input.versionBlocks)) {
    prod.versionBlocks = input.versionBlocks.map((item) => normalizeStyledPair(item)).filter(Boolean).map((item) => item!);
  }
  if (Array.isArray(input.featureBlocks)) {
    prod.featureBlocks = input.featureBlocks.map((item) => normalizeStyledPair(item)).filter(Boolean).map((item) => item!);
  }
  if (typeof input.descriptionSectionTitle === "string") prod.descriptionSectionTitle = input.descriptionSectionTitle;
  if (typeof input.configsSectionTitle === "string") prod.configsSectionTitle = input.configsSectionTitle;
  if (typeof input.versionsSectionTitle === "string") prod.versionsSectionTitle = input.versionsSectionTitle;
  if (typeof input.featuresSectionTitle === "string") prod.featuresSectionTitle = input.featuresSectionTitle;

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