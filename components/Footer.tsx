"use client";

import type { MultiLangString } from "@/lib/db";
import { useLanguage } from "@/lib/i18n";

export default function Footer({ text }: { text: MultiLangString }) {
  const { lang } = useLanguage();
  const label = typeof text === "string" ? text : (lang === "EN" ? text.en || text.tr : text.tr || text.en);
  const year = new Date().getFullYear();

  if (!label) return null;

  return (
    <footer className="bg-[#3A3A3A] text-[#F3F1EC]/70 py-5 px-6">
      <p className="text-center text-xs font-montserrat tracking-wide">
        © {year} Ion Meccanica — {label}
      </p>
    </footer>
  );
}
