import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request, props: { params: Promise<{ categoryId: string }> }) {
  const params = await props.params;
  try {
    if (!params.categoryId) {
      return new Response("Category id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ storeId: string; categoryId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, image, billboardId } = body;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    if (!image) {
      return new Response("Image is required", { status: 400 });
    }

    if (!billboardId) {
      return new Response("Billboard Id is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new Response("Category id is required", { status: 400 });
    }

    const storeByBuser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByBuser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        image,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ storeId: string; categoryId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!params.categoryId) {
      return new Response("Category id is required", { status: 400 });
    }

    const storeByBuser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByBuser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
