import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

// Define params as a Promise resolving to an object with colorId
const ColorPage = async ({
  params,
}: {
  params: Promise<{ colorId: string }>;
}) => {
  // Await the params to extract colorId
  const { colorId } = await params;

  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
