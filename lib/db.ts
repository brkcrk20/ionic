import { promises as fs } from "fs";
import path from "path";

export type MultiLangString = string | { tr: string; en: string };

export type Category = {
  id: string;
  name: MultiLangString;
  slug: string;
  parentId: string | null;
  image: string | null;
  // Bu kategori sayfası için özel SEO başlığı/açıklaması — boşsa site genel ayarlarından/otomatik üretilir
  seoTitle?: string;
  seoDescription?: string;
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

  // Bu ürün sayfası için özel SEO başlığı/açıklaması — boşsa ürün adından/açıklamasından otomatik üretilir
  seoTitle?: string;
  seoDescription?: string;

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
  // SEO — sitenin arama motorlarında ve paylaşımlarda görünen başlık/açıklaması
  seoTitle: string;
  seoDescription: string;
  // Bakım modu — açıkken ziyaretçiler siteyi göremez, admin panel etkilenmez
  maintenanceMode: boolean;
  maintenanceMessage: MultiLangString;
  // Duyuru çubuğu — navbar'ın üstünde gösterilen ince bilgilendirme şeridi
  announcementEnabled: boolean;
  announcementText: MultiLangString;
  announcementLink: string;
  // Google Analytics ölçüm kimliği (ör. G-XXXXXXXXXX) — boşsa hiçbir şey yüklenmez
  googleAnalyticsId: string;
  // Footer'da gösterilen telif hakkı metni (yıl otomatik eklenir)
  footerText: MultiLangString;
};

export type NavSubItem = {
  id: string;
  label: MultiLangString;
  href: string;
  // Bir alt başlığın kendi altında da alt başlıkları olabilir (ör. "Komple Hatlar" başlığı altında "Reçine Hatları" vb.)
  children?: NavSubItem[];
};

export type NavMenuItem = {
  id: string;
  label: MultiLangString;
  href: string;
  // Açılır alt menüdeki düzenlenebilir başlık/alt başlıklar (boşsa alt menü gösterilmez)
  children?: NavSubItem[];
};

export type NewsItem = {
  id: string;
  title: MultiLangString;
  slug: string;
  excerpt: MultiLangString;
  content: MultiLangString;
  coverImage: string | null;
  date: string;
  active: boolean;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
};

// Kurumsal/sabit sayfalar (Hakkımızda, Yetkinlikler vb.) için içerik bloğu — ürünlerdeki StyledPair ile aynı yapı
export type SitePage = {
  id: string;
  // Sabit sayfa yuvasının anahtarı (bkz. lib/pageSlots.ts) — hangi route'a karşılık geldiğini belirler
  key: string;
  title: MultiLangString;
  description: MultiLangString;
  heroImage: string | null;
  coverImage: string | null;
  contentBlocks: StyledPair[];
  published: boolean;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type DB = {
  categories: Category[];
  products: Product[];
  slider: SliderItem[];
  settings: SiteSettings;
  navMenu: NavMenuItem[];
  news: NewsItem[];
  pages: SitePage[];
};

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const DEFAULT_SETTINGS: SiteSettings = {
  seoTitle: "Ion Meccanica",
  seoDescription: "Doğal taş işleme makineleri ve komple üretim hatları.",
  maintenanceMode: false,
  maintenanceMessage: { tr: "Sitemiz kısa bir bakımda. Kısa süre sonra tekrar burada olacağız.", en: "Our site is under brief maintenance. We'll be back shortly." },
  announcementEnabled: false,
  announcementText: { tr: "", en: "" },
  announcementLink: "",
  googleAnalyticsId: "",
  footerText: { tr: "Tüm hakları saklıdır.", en: "All rights reserved." },
};

// Vercel build hatasını çözen eksik sabit tanımı:
const DEFAULT_NAV_MENU: NavMenuItem[] = [
  {
    id: "nav-1",
    label: { tr: "Anasayfa", en: "Home" },
    href: "/",
  },
  {
    id: "nav-2",
    label: { tr: "Şirket", en: "Company" },
    href: "/about-us/company",
  },
  {
    id: "nav-3",
    label: { tr: "İletişim", en: "Contact" },
    href: "/contact",
  },
];

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
    seoTitle: typeof raw?.seoTitle === "string" && raw.seoTitle.trim() ? raw.seoTitle.trim() : undefined,
    seoDescription: typeof raw?.seoDescription === "string" && raw.seoDescription.trim() ? raw.seoDescription.trim() : undefined,
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

function normalizeNewsItem(raw: unknown): NewsItem | null {
  if (!isObject(raw)) return null;
  return {
    id: String(raw.id ?? makeId("news")),
    title: normalizeMultiLang(raw.title),
    slug: String(raw.slug ?? ""),
    excerpt: normalizeMultiLang(raw.excerpt),
    content: normalizeMultiLang(raw.content),
    coverImage: typeof raw.coverImage === "string" && raw.coverImage ? raw.coverImage : null,
    date: typeof raw.date === "string" && raw.date ? raw.date : new Date().toISOString(),
    active: Boolean(raw.active ?? true),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    seoTitle: typeof raw.seoTitle === "string" && raw.seoTitle.trim() ? raw.seoTitle.trim() : undefined,
    seoDescription: typeof raw.seoDescription === "string" && raw.seoDescription.trim() ? raw.seoDescription.trim() : undefined,
  };
}

function normalizeSitePage(raw: unknown): SitePage | null {
  if (!isObject(raw)) return null;
  const contentBlocks = Array.isArray(raw.contentBlocks)
    ? raw.contentBlocks.map((item: unknown) => normalizeStyledPair(item)).filter((x: StyledPair | null): x is StyledPair => x !== null)
    : [];
  return {
    id: String(raw.id ?? makeId("page")),
    key: String(raw.key ?? ""),
    title: normalizeMultiLang(raw.title),
    description: normalizeMultiLang(raw.description),
    heroImage: typeof raw.heroImage === "string" && raw.heroImage ? raw.heroImage : null,
    coverImage: typeof raw.coverImage === "string" && raw.coverImage ? raw.coverImage : null,
    contentBlocks,
    published: Boolean(raw.published ?? false),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
    seoTitle: typeof raw.seoTitle === "string" && raw.seoTitle.trim() ? raw.seoTitle.trim() : undefined,
    seoDescription: typeof raw.seoDescription === "string" && raw.seoDescription.trim() ? raw.seoDescription.trim() : undefined,
  };
}

function normalizeNavSubItem(raw: unknown): NavSubItem | null {
  if (!isObject(raw)) return null;
  const children = Array.isArray(raw.children)
    ? raw.children.map((item) => normalizeNavSubItem(item)).filter((x): x is NavSubItem => x !== null)
    : undefined;
  return {
    id: String(raw.id ?? makeId("navsub")),
    label: normalizeMultiLang(raw.label),
    href: typeof raw.href === "string" ? raw.href : "/",
    children: children && children.length > 0 ? children : undefined,
  };
}

function normalizeNavMenuItem(raw: unknown): NavMenuItem | null {
  if (!isObject(raw)) return null;
  const children = Array.isArray(raw.children)
    ? raw.children.map((item) => normalizeNavSubItem(item)).filter((x): x is NavSubItem => x !== null)
    : undefined;
  return {
    id: String(raw.id ?? makeId("nav")),
    label: normalizeMultiLang(raw.label),
    href: typeof raw.href === "string" ? raw.href : "/",
    children: children && children.length > 0 ? children : undefined,
  };
}

function normalizeDB(parsed: Partial<DB>): DB {
  return {
    categories: Array.isArray(parsed.categories) ? parsed.categories as Category[] : [],
    products: Array.isArray(parsed.products) ? parsed.products.map((p) => normalizeProduct(p)) : [],
    slider: Array.isArray(parsed.slider) ? parsed.slider as SliderItem[] : [],
    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    navMenu: Array.isArray(parsed.navMenu) && parsed.navMenu.length > 0
      ? parsed.navMenu.map((item) => normalizeNavMenuItem(item)).filter((x): x is NavMenuItem => x !== null)
      : DEFAULT_NAV_MENU,
    news: Array.isArray(parsed.news) ? parsed.news.map((item) => normalizeNewsItem(item)).filter((x): x is NewsItem => x !== null) : [],
    pages: Array.isArray(parsed.pages) ? parsed.pages.map((item) => normalizeSitePage(item)).filter((x): x is SitePage => x !== null) : [],
  };
}

async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    return normalizeDB(parsed);
  } catch {
    return { categories: [], products: [], slider: [], settings: { ...DEFAULT_SETTINGS }, navMenu: DEFAULT_NAV_MENU, news: [], pages: [] };
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
export async function getNavMenu() { return (await getDB()).navMenu; }
export async function getNews() { return (await getDB()).news; }
export async function getPages() { return (await getDB()).pages; }

export async function updateNavMenu(items: unknown[]): Promise<NavMenuItem[]> {
  const db = await getDB();
  const normalized = items
    .map((item) => normalizeNavMenuItem(item))
    .filter((x): x is NavMenuItem => x !== null);
  db.navMenu = normalized.length > 0 ? normalized : DEFAULT_NAV_MENU;
  await updateDB(db);
  return db.navMenu;
}

export async function createCategory(input: any) {
  const db = await getDB();
  const rawNameStr = typeof input.name === "object" ? input.name.tr : input.name;
  const cat: Category = {
    id: makeId("cat"),
    name: normalizeMultiLang(input.name),
    slug: slugify(rawNameStr || "category"),
    parentId: input.parentId,
    image: input.image,
    seoTitle: typeof input.seoTitle === "string" && input.seoTitle.trim() ? input.seoTitle.trim() : undefined,
    seoDescription: typeof input.seoDescription === "string" && input.seoDescription.trim() ? input.seoDescription.trim() : undefined,
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

export async function updateCategory(id: string, input: Partial<Pick<Category, "name" | "parentId" | "image" | "seoTitle" | "seoDescription">>) {
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
  if (input.seoTitle !== undefined) cat.seoTitle = input.seoTitle?.trim() ? input.seoTitle.trim() : undefined;
  if (input.seoDescription !== undefined) cat.seoDescription = input.seoDescription?.trim() ? input.seoDescription.trim() : undefined;
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

  if (typeof input.seoTitle === "string") prod.seoTitle = input.seoTitle.trim() ? input.seoTitle.trim() : undefined;
  if (typeof input.seoDescription === "string") prod.seoDescription = input.seoDescription.trim() ? input.seoDescription.trim() : undefined;

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

// ---------------------------------------------------------------------------
// HABERLER (NEWS) — Ürünlere benzer basit bir CRUD
// ---------------------------------------------------------------------------

async function uniqueNewsSlug(base: string, db: DB, ignoreId?: string): Promise<string> {
  let slug = base || "haber";
  let i = 2;
  while (db.news.some((n) => n.slug === slug && n.id !== ignoreId)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

export async function getNewsBySlug(slug: string) {
  const db = await getDB();
  return db.news.find((n) => n.slug === slug) ?? null;
}

export async function createNews(input: any) {
  const db = await getDB();
  const rawTitleStr = typeof input.title === "object" ? input.title?.tr : input.title;
  const base = slugify(rawTitleStr || "haber");
  const slug = await uniqueNewsSlug(base, db);

  const news: NewsItem = {
    id: makeId("news"),
    title: normalizeMultiLang(input.title),
    slug,
    excerpt: normalizeMultiLang(input.excerpt),
    content: normalizeMultiLang(input.content),
    coverImage: typeof input.coverImage === "string" && input.coverImage ? input.coverImage : null,
    date: typeof input.date === "string" && input.date ? input.date : new Date().toISOString(),
    active: input.active !== undefined ? Boolean(input.active) : true,
    createdAt: new Date().toISOString(),
    seoTitle: typeof input.seoTitle === "string" && input.seoTitle.trim() ? input.seoTitle.trim() : undefined,
    seoDescription: typeof input.seoDescription === "string" && input.seoDescription.trim() ? input.seoDescription.trim() : undefined,
  };

  db.news.unshift(news);
  await updateDB(db);
  return news;
}

export async function updateNews(id: string, input: Record<string, unknown>) {
  const db = await getDB();
  const news = db.news.find((n) => n.id === id);
  if (!news) return null;

  if (input.title !== undefined) {
    news.title = normalizeMultiLang(input.title);
    const rawTitleStr = typeof news.title === "object" ? news.title.tr : news.title;
    if (rawTitleStr.trim()) {
      news.slug = await uniqueNewsSlug(slugify(rawTitleStr), db, news.id);
    }
  }

  if (input.excerpt !== undefined) news.excerpt = normalizeMultiLang(input.excerpt);
  if (input.content !== undefined) news.content = normalizeMultiLang(input.content);
  if (input.coverImage !== undefined) news.coverImage = (input.coverImage as string) || null;
  if (typeof input.date === "string" && input.date) news.date = input.date;
  if (input.active !== undefined) news.active = Boolean(input.active);
  if (typeof input.seoTitle === "string") news.seoTitle = input.seoTitle.trim() ? input.seoTitle.trim() : undefined;
  if (typeof input.seoDescription === "string") news.seoDescription = input.seoDescription.trim() ? input.seoDescription.trim() : undefined;

  await updateDB(db);
  return news;
}

export async function deleteNews(id: string) {
  const db = await getDB();
  const exists = db.news.some((n) => n.id === id);
  if (!exists) return false;
  db.news = db.news.filter((n) => n.id !== id);
  await updateDB(db);
  return true;
}

// ---------------------------------------------------------------------------
// SAYFA YÖNETİMİ — About Us, Capabilities, Automation Control gibi sabit
// kurumsal sayfaların admin panelinden düzenlenebilmesi için basit bir CMS.
// Sayfalar `key` alanına göre (bkz. lib/pageSlots.ts) sabit "yuva"lara karşılık
// gelir; silinmezler, sadece düzenlenir ve yayın durumu açılıp kapatılır.
// ---------------------------------------------------------------------------

export async function getPageByKey(key: string) {
  const db = await getDB();
  return db.pages.find((p) => p.key === key) ?? null;
}

export async function upsertPage(key: string, input: Record<string, unknown>) {
  const db = await getDB();
  let page = db.pages.find((p) => p.key === key);

  if (!page) {
    page = {
      id: makeId("page"),
      key,
      title: { tr: "", en: "" },
      description: { tr: "", en: "" },
      heroImage: null,
      coverImage: null,
      contentBlocks: [],
      published: false,
      updatedAt: new Date().toISOString(),
    };
    db.pages.push(page);
  }

  if (input.title !== undefined) page.title = normalizeMultiLang(input.title);
  if (input.description !== undefined) page.description = normalizeMultiLang(input.description);
  if (input.heroImage !== undefined) page.heroImage = (input.heroImage as string) || null;
  if (input.coverImage !== undefined) page.coverImage = (input.coverImage as string) || null;
  if (Array.isArray(input.contentBlocks)) {
    page.contentBlocks = input.contentBlocks
      .map((item: unknown) => normalizeStyledPair(item))
      .filter((x: StyledPair | null): x is StyledPair => x !== null);
  }
  if (typeof input.seoTitle === "string") page.seoTitle = input.seoTitle.trim() ? input.seoTitle.trim() : undefined;
  if (typeof input.seoDescription === "string") page.seoDescription = input.seoDescription.trim() ? input.seoDescription.trim() : undefined;
  if (input.published !== undefined) page.published = Boolean(input.published);

  page.updatedAt = new Date().toISOString();
  await updateDB(db);
  return page;
}