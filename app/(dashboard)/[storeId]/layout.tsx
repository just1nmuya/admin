// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import Navbar from "@/components/navbar";
// import prismadb from "@/lib/prismadb";

// export default async function DashboardLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { storeId: string };
// }) {
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

//   const navbar = await Navbar();

//   return (
//     <>
//       {navbar}
//       {children}
//     </>
//   );
// }

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // Update the type so that params is a Promise resolving to an object with storeId
  params: Promise<{ storeId: string }>;
}) {
  // Await the params to extract storeId
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

  // If Navbar is a server component and async, you may await it; otherwise, you can render it directly.
  const navbar = await Navbar();

  return (
    <>
      {navbar}
      {children}
    </>
  );
}
