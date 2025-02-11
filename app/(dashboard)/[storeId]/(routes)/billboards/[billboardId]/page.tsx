// import prismadb from "@/lib/prismadb";
// import { BillboardForm } from "./components/billboard-form";

// const BillboardPage = async ({
//   params,
// }: {
//   params: { billboardId: string };
// }) => {
//   const billboard = await prismadb.billboard.findUnique({
//     where: {
//       id: params.billboardId,
//     },
//   });

//   return (
//     <div className="flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//             <BillboardForm initialData={billboard}/>
//         </div>
//     </div>
//   );
// };

// export default BillboardPage;


import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

// Define the props such that params is a Promise resolving to an object
type Props = {
  params: Promise<{ billboardId: string }>;
};

const BillboardPage = async ({ params }: Props) => {
  // Await the promise to access the actual params
  const { billboardId } = await params;

  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
