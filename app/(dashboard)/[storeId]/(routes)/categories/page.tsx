import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

// Update props type: params is now a Promise resolving to an object with storeId.
const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  // Await the params to access storeId.
  const { storeId } = await params;

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    image: item.image,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col animate-in fade-in duration-500">
          <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
            <div className="flex flex-col gap-2 slide-in-from-left-5 duration-300">
              <Heading title={`Categories (${categories.length})`} description="Manage your store categories" />
              <Separator />
            </div>
            <CategoryClient data={formattedCategories} />
          </div>
        </div>
  );
};

export default CategoriesPage;
