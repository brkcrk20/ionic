"use client";

import Image from "next/image";
import type { MultiLangString } from "@/lib/db";
import { useLanguage } from "@/lib/i18n";

export default function MaintenanceScreen({ message }: { message: MultiLangString }) {
  const { lang } = useLanguage();
  const text = typeof message === "string" ? message : (lang === "EN" ? message.en || message.tr : message.tr || message.en);

  return (
    <div className="min-h-screen w-full bg-[#3A3A3A] flex flex-col items-center justify-center px-6 text-center gap-6">
      <Image src="/logo.svg" alt="Ion Meccanica" width={72} height={72} className="object-contain h-14 w-auto opacity-90" />
      <p className="text-[#F3F1EC] text-base md:text-lg max-w-md font-montserrat">{text}</p>
    </div>
  );
}
