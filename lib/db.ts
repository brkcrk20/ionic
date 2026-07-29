import { promises as fs } from "fs";
import path from "path";

export type MultiLangString = string | { tr: string; en: string };

export type Category = {
  id: string;
  name: MultiLangString;
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
  text: MultiLangString;
  style?: TextStyle;
};

export type StyledPair = {
  title: MultiLangString;
  text: MultiLangString;
  titleStyle?: TextStyle;
  textStyle?: TextStyle;
};

export type ProductConfig = {
  name: MultiLangString;
  text: MultiLangString;
  nameStyle?: TextStyle;
  textStyle?: TextStyle;
};

export type ProductVersion = {
  label: MultiLangString;
  text: MultiLangString;
  labelStyle?: TextStyle;
  textStyle?: TextStyle;
};

export type Product = {
  id: string;
  name: MultiLangString;
  slug: string;
  subtitle: MultiLangString;
  heroDescription: MultiLangString;
  heroImage: string;
  descriptionParagraphs: MultiLangString[];
  configs: ProductConfig[];
  configNote: MultiLangString;
  configNote2: MultiLangString;
  versions: ProductVersion[];
  features: MultiLangString[];
  categoryId: string | null;
  images: string[];
  active: boolean;
  createdAt: string;

  nameStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  heroDescriptionStyle?: TextStyle;
  descriptionBlocks?: StyledPair[];
  configBlocks?: StyledPair[];
  configNoteStyle?: TextStyle;
  configNote2Style?: TextStyle;
  versionBlocks?: StyledPair[];
  featureBlocks?: StyledPair[];

  descriptionSectionTitle?: MultiLangString;
  configsSectionTitle?: MultiLangString;
  versionsSectionTitle?: MultiLangString;
  featuresSectionTitle?: MultiLangString;
};

export type SliderItem = {
  id: string;
  image: string;
  title: MultiLangString;
  subtitle: MultiLangString;
  buttonText: MultiLangString;
  buttonLink: string;
};

export type SiteSettings = {
  phone: string;
  email: string;
  address: MultiLangString;
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
  address: { tr: "", en: "" },
  instagram: "",
  facebook: "",
  linkedin: "",
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMultiLang(val: unknown): MultiLangString {
  if (typeof val === "string") return { tr: val, en: "" };
  if (isObject(val)) {
    return {
      tr: typeof val.tr === "string" ? val.tr : "",
      en: typeof val.en === "string" ? val.en : "",
    };
  }
  return { tr: "", en: "" };
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

function normalizeStyledPair(value: unknown): StyledPair | null {
  if (!isObject(value)) return null;
  const rawTitle = value.title ?? value.name ?? value.label ?? "";
  const title = normalizeMultiLang(rawTitle);
  const text = normalizeMultiLang(value.text);
  return {
    title,
    text,
    titleStyle: normalizeTextStyle(value.titleStyle),
    textStyle: normalizeTextStyle(value.textStyle),
  };
}

function normalizeProduct(raw: any): Product {
  const descriptionParagraphs = Array.isArray(raw?.descriptionParagraphs)
    ? raw.descriptionParagraphs.map((item: unknown) => normalizeMultiLang(item))
    : [];

  const configs = Array.isArray(raw?.configs)
    ? raw.configs.map((item: unknown) => {
        if (!isObject(item)) return null;
        return {
          name: normalizeMultiLang(item.name ?? item.label),
          text: normalizeMultiLang(item.text),
          nameStyle: normalizeTextStyle(item.nameStyle),
          textStyle: normalizeTextStyle(item.textStyle),
        } as ProductConfig;
      }).filter((x: ProductConfig | null): x is ProductConfig => x !== null)
    : [];

  const versions = Array.isArray(raw?.versions)
    ? raw.versions.map((item: unknown) => {
        if (!isObject(item)) return null;
        return {
          label: normalizeMultiLang(item.label ?? item.name),
          text: normalizeMultiLang(item.text),
          labelStyle: normalizeTextStyle(item.labelStyle),
          textStyle: normalizeTextStyle(item.textStyle),
        } as ProductVersion;
      }).filter((x: ProductVersion | null): x is ProductVersion => x !== null)
    : [];

  const features = Array.isArray(raw?.features)
    ? raw.features.map((item: unknown) => normalizeMultiLang(item))
    : [];

  return {
    id: String(raw?.id ?? ""),
    name: normalizeMultiLang(raw?.name),
    slug: String(raw?.slug ?? ""),
    subtitle: normalizeMultiLang(raw?.subtitle),
    heroDescription: normalizeMultiLang(raw?.heroDescription),
    heroImage: String(raw?.heroImage ?? ""),
    descriptionParagraphs,
    configs,
    configNote: normalizeMultiLang(raw?.configNote),
    configNote2: normalizeMultiLang(raw?.configNote2),
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
      ? raw.descriptionBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null)
      : descriptionParagraphs.length > 0
        ? descriptionParagraphs.map((text: MultiLangString) => ({ title: { tr: "", en: "" }, text }))
        : undefined,
    configBlocks: Array.isArray(raw?.configBlocks)
      ? raw.configBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null)
      : undefined,
    configNoteStyle: normalizeTextStyle(raw?.configNoteStyle),
    configNote2Style: normalizeTextStyle(raw?.configNote2Style),
    versionBlocks: Array.isArray(raw?.versionBlocks)
      ? raw.versionBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null)
      : undefined,
    featureBlocks: Array.isArray(raw?.featureBlocks)
      ? raw.featureBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null)
      : undefined,
    descriptionSectionTitle: normalizeMultiLang(raw?.descriptionSectionTitle),
    configsSectionTitle: normalizeMultiLang(raw?.configsSectionTitle),
    versionsSectionTitle: normalizeMultiLang(raw?.versionsSectionTitle),
    featuresSectionTitle: normalizeMultiLang(raw?.featuresSectionTitle),
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
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
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

export async function getCategories() { return (await getDB()).categories; }
export async function getProducts() { return (await getDB()).products; }
export async function getSlider() { return (await getDB()).slider; }
export async function getSettings() { return (await getDB()).settings; }

export async function createCategory(input: any) {
  const db = await getDB();
  const rawNameStr = typeof input.name === "object" ? input.name.tr : input.name;
  const cat: Category = {
    id: makeId("cat"),
    name: normalizeMultiLang(input.name),
    slug: slugify(rawNameStr || "category"),
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
  const rawNameStr = typeof input.name === "object" ? input.name.tr : input.name;
  let base = slugify(rawNameStr || "urun");
  if (RESERVED_SLUGS.has(base)) base = `${base}-2`;
  const slug = await uniqueSlug(base, db);

  const prod: Product = normalizeProduct({
    id: makeId("prod"),
    ...input,
    slug,
    createdAt: new Date().toISOString(),
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
    cat.name = normalizeMultiLang(input.name);
    const rawNameStr = typeof cat.name === "object" ? cat.name.tr : cat.name;
    cat.slug = slugify(rawNameStr || "category");
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

  if (input.name !== undefined) {
    prod.name = normalizeMultiLang(input.name);
    const rawNameStr = typeof prod.name === "object" ? prod.name.tr : prod.name;
    if (rawNameStr.trim()) {
      let base = slugify(rawNameStr);
      if (RESERVED_SLUGS.has(base)) base = `${base}-2`;
      prod.slug = await uniqueSlug(base, db, prod.id);
    }
  }

  if (input.subtitle !== undefined) prod.subtitle = normalizeMultiLang(input.subtitle);
  if (input.heroDescription !== undefined) prod.heroDescription = normalizeMultiLang(input.heroDescription);
  if (typeof input.heroImage === "string") prod.heroImage = input.heroImage;

  if (Array.isArray(input.descriptionBlocks)) {
    prod.descriptionBlocks = input.descriptionBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null);
  }
  if (Array.isArray(input.configBlocks)) {
    prod.configBlocks = input.configBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null);
  }
  if (Array.isArray(input.versionBlocks)) {
    prod.versionBlocks = input.versionBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null);
  }
  if (Array.isArray(input.featureBlocks)) {
    prod.featureBlocks = input.featureBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null);
  }

  if (input.configNote !== undefined) prod.configNote = normalizeMultiLang(input.configNote);
  if (input.configNote2 !== undefined) prod.configNote2 = normalizeMultiLang(input.configNote2);
  if (input.categoryId !== undefined) prod.categoryId = input.categoryId as string | null;
  if (Array.isArray(input.images)) prod.images = input.images.filter((x: unknown) => typeof x === "string") as string[];
  if (input.active !== undefined) prod.active = Boolean(input.active);

  if (input.descriptionSectionTitle !== undefined) prod.descriptionSectionTitle = normalizeMultiLang(input.descriptionSectionTitle);
  if (input.configsSectionTitle !== undefined) prod.configsSectionTitle = normalizeMultiLang(input.configsSectionTitle);
  if (input.versionsSectionTitle !== undefined) prod.versionsSectionTitle = normalizeMultiLang(input.versionsSectionTitle);
  if (input.featuresSectionTitle !== undefined) prod.featuresSectionTitle = normalizeMultiLang(input.featuresSectionTitle);

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