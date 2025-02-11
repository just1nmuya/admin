// pages/api/user-stores.ts
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = await auth();
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  res.status(200).json(stores);
}
