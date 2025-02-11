import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request, props: { params: Promise<{ billboardId: string }> }) {
  const params = await props.params;
  try {
    if (!params.billboardId) {
      return new Response("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new Response("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new Response("Image Url is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new Response("Billboard id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new Response("Billboard id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
