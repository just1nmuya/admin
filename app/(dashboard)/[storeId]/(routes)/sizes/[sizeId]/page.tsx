import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

// Define params as a Promise resolving to an object with sizeId.
const SizePage = async ({
  params,
}: {
  params: Promise<{ sizeId: string }>;
}) => {
  // Await params to extract sizeId.
  const { sizeId } = await params;

  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
