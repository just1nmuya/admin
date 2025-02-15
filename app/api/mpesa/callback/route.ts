
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    if (!bodyText) {
      console.warn("Empty request body received in callback");
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }
    
    const data = JSON.parse(bodyText);
    console.log("M-Pesa Callback Data:", data);
    
    // Expect the callback data inside data.Body.stkCallback
    const callback = data.Body?.stkCallback;
    if (!callback) {
      console.error("Invalid callback format");
      return NextResponse.json({ error: "Invalid callback format" }, { status: 400 });
    }
    
    const { ResultCode, ResultDesc } = callback;
    const url = new URL(request.url);
    const orderId = url.searchParams.get("order_id");
    
    if (!orderId) {
      console.warn("Missing order_id in callback URL");
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }
    
    if (ResultCode === 0) {
      // Payment successful: update the order and then update associated products.
      const updatedOrder = await prismadb.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          transactionDetails: callback, // Make sure your Prisma schema has a JSON field for this.
        },
        include: { orderItems: true },  // Include orderItems so we can update the products.
      });
      
      // Loop through each order item and update its corresponding product.
      for (const orderItem of updatedOrder.orderItems) {
        // Ensure your orderItem includes a productId field that links to the Product model.
        await prismadb.product.update({
          where: { id: orderItem.productId },
          data: {
            isArchived: true,
            isFeatured: false,
          },
        });
      }
      
      console.log(`Order ${orderId} marked as paid and associated products updated.`);
    } else {
      // Payment failed: update the order to reflect the failure.
      await prismadb.order.update({
        where: { id: orderId },
        data: {
          isPaid: false,
          transactionDetails: callback,
        },
      });
      console.log(`Order ${orderId} marked as not paid. Result: ${ResultDesc}`);
    }
    
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error processing M-Pesa callback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
