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

// Interface to type the props correctly
interface BillboardPageProps {
  params: { billboardId: string }; // Ensure that params has the correct shape
}

const BillboardPage = async ({ params }: BillboardPageProps) => {
  // Fetch the billboard based on the dynamic billboardId
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  // Check if the billboard exists
  if (!billboard) {
    return <div>Billboard not found.</div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Pass the fetched billboard data to the form */}
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
