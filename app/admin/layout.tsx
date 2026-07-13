import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F7F6F4] text-[#1A1A1A]">{children}</div>;
}
