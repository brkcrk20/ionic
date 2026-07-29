import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/db";
import ProductWizardForm from "../../ProductWizardForm";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const product = products.find((item) => item.id === id) ?? null;
  if (!product) notFound();
  return <ProductWizardForm product={product} categories={categories} />;
}
