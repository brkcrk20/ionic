import { notFound } from "next/navigation";
import { getPageByKey } from "@/lib/db";
import { getPageSlot } from "@/lib/pageSlots";
import PageForm from "../../PageForm";

export default async function EditPageSlotPage(props: { params: Promise<{ key: string }> }) {
  const { key } = await props.params;
  const slot = getPageSlot(key);
  if (!slot) notFound();
  const page = await getPageByKey(key);
  return <PageForm page={page} slot={slot} />;
}
