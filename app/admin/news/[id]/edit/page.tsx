import { notFound } from "next/navigation";
import { getNews } from "@/lib/db";
import NewsForm from "../../NewsForm";

export default async function EditNewsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const news = await getNews();
  const item = news.find((n) => n.id === id) ?? null;
  if (!item) notFound();
  return <NewsForm news={item} />;
}
