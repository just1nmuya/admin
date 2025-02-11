// import prismadb from "@/lib/prismadb";
// import { format } from "date-fns";

// import { CategoryColumn } from "./components/columns";
// import { CategoryClient } from "./components/client";

// const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
//   const categories = await prismadb.category.findMany({
//     where: {
//       storeId: params.storeId,
//     },
//     include: {
//       billboard: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const formattedCategories: CategoryColumn[] = categories.map((item) => ({
//     id: item.id,
//     image: item.image,
//     name: item.name,
//     billboardLabel: item.billboard.label,
//     createdAt: format(item.createdAt, "MMMM do, yyyy"),
//   }));

//   return (
//     <div className="flex-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <CategoryClient data={formattedCategories} />
//       </div>
//     </div>
//   );
// };

// export default CategoriesPage;


import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";

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
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
