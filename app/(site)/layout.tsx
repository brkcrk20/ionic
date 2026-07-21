import Navbar from "@/components/Navbar";
import { getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <>
      <Navbar categories={categories} />
      <main>{children}</main>
    </>
  );
}