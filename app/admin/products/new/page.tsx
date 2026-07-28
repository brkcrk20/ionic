import { getCategories } from "@/lib/db";
import ProductWizardForm from "../ProductWizardForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return <ProductWizardForm product={null} categories={categories || []} />;
}