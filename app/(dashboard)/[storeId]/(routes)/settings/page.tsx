// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import prismadb from "@/lib/prismadb";

// import { SettingsForm } from "./components/settings-form";

// interface SettingPageProps {
//   params: {
//     storeId: string;
//   };
// }

// const SettingsPage: React.FC<SettingPageProps> = async ({ params }) => {
//   const { userId } = await auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   const store = await prismadb.store.findFirst({
//     where: {
//       id: params.storeId,
//       userId,
//     },
//   });
//   if (!store) {
//     redirect("/");
//   }

//   return (
//     <div className="flec-col">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <SettingsForm initialData={store}/>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { SettingsForm } from "./components/settings-form";

// Update the type so that params is a Promise resolving to { storeId: string }
interface SettingPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function SettingsPage({
  params,
}: SettingPageProps) {
  // Await params to extract storeId
  const { storeId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}
