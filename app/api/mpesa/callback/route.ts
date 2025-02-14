// app/api/mpesa/callback/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Log or process the callback data from M-Pesa
    console.log("M-Pesa callback data:", data);

    // You can update your order status here based on data received
    // For example: update order in database where order_id = data.order_id

    // Return a success response to M-Pesa
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing M-Pesa callback:", error);
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}
