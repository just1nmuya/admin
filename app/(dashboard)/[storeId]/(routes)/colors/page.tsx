import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

// Change the type of params to a Promise resolving to { storeId: string }
const ColorsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  // Await the params to extract storeId
  const { storeId } = await params;

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col animate-in fade-in duration-500">
          <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
            <div className="flex flex-col gap-2 slide-in-from-left-5 duration-300">
              <Heading title={`Colors (${colors.length})`} description="Manage your store colors" />
              <Separator />
            </div>
            <ColorsClient data={formattedColors} />
          </div>
        </div>
  );
};

export default ColorsPage;
