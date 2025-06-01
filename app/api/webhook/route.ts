import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;
  const phone = session.customer_details?.phone;

  const addressString = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]
    .filter((c) => c != null)
    .join(", ");

  if (
    event.type === "checkout.session.completed" &&
    session.metadata?.order_id
  ) {
    await prismadb.order.update({
      where: {
        // If you trust frontend data, you can skip updating address & phone here.
        id: session.metadata.order_id,
      },
      data: {
        isPaid: true,
        // Fallback: uncomment if you want to overwrite with Stripe's version
        address: addressString,
        phone: phone || "",
      },
    });

    // Optionally mark products as archived, etc.
    const order = await prismadb.order.findUnique({
      where: { id: session.metadata.order_id },
      include: { orderItems: true },
    });
    const productIds = order?.orderItems?.map((oi) => oi.productId) || [];
    if (productIds.length > 0) {
      await prismadb.product.updateMany({
        where: { id: { in: productIds } },
        data: { isArchived: true },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
