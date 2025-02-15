import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storeId: string; orderId: string }> }
) {
  const { storeId, orderId } = await params;
  try {
    // Find the order by orderId and ensure it belongs to the given storeId
    const order = await prismadb.order.findFirst({
      where: {
        id: orderId,
        storeId,
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
    
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
