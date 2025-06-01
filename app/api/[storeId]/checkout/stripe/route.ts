import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { storeId } = params;
  const { productIds, customerEmail, shippingAddress, phoneNumber } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product Ids are required", { status: 400 });
  }
  if (!shippingAddress || !phoneNumber) {
    return new NextResponse("Address and phone number are required", { status: 400 });
  }
  if (!customerEmail) {
    return new NextResponse("Email is required", { status: 400 });
  }

  // Fetch products for line items
  const products = await prismadb.product.findMany({
    where: { id: { in: productIds } },
  });

  let subtotal = 0;
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    const unitAmount = product.price.toNumber() * 100;
    subtotal += product.price.toNumber();
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: { name: product.name },
        unit_amount: unitAmount,
      },
    });
  });

  const shippingCost = subtotal > 150 ? 0 : 10;
  if (shippingCost > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: shippingCost * 100,
      },
    });
  }

  // Create order in database with address and phone
  const order = await prismadb.order.create({
    data: {
      storeId,
      isPaid: false,
      paymentMethod: "stripe",
      address: shippingAddress,
      phone: phoneNumber,
      orderItems: {
        create: productIds.map((pid: string) => ({
          product: { connect: { id: pid } },
        })),
      },
    },
  });

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: { order_id: order.id },
  });

  // Send a simple, clean confirmation email
  const orderTotal = (subtotal + shippingCost).toFixed(2);
  const emailSubject = "Order Confirmation – Thank You for Shopping!";
  const emailText = `Thank you for your order! Your order ID is ${order.id}.`;

  const emailHtml = `
    <div style="max-width:600px; margin:0 auto; padding:20px; font-family:Arial,sans-serif; background:#ffffff; color:#333333; border:1px solid #e1e1e1; border-radius:8px;">
      <h2 style="text-align:center; color:#1a1a1a; margin-bottom:20px;">Order Confirmed!</h2>
      <p style="font-size:16px; margin-bottom:10px;">
        Hello,
      </p>
      <p style="font-size:16px; margin-bottom:20px;">
        Thank you for shopping with us. Your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> has been confirmed on ${new Date().toLocaleDateString()}.
      </p>
      <hr style="border:none; border-bottom:1px solid #e1e1e1; margin:20px 0;" />

      <h3 style="font-size:18px; margin-bottom:10px; color:#1a1a1a;">Shipping Details</h3>
      <p style="font-size:14px; margin:4px 0;"><strong>Address:</strong> ${shippingAddress}</p>
      <p style="font-size:14px; margin:4px 0;"><strong>Phone:</strong> ${phoneNumber}</p>
      <hr style="border:none; border-bottom:1px solid #e1e1e1; margin:20px 0;" />

      <h3 style="font-size:18px; margin-bottom:10px; color:#1a1a1a;">Order Summary</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px 0; font-weight:600; color:#1a1a1a;">Item(s)</th>
            <th style="text-align:right; padding:8px 0; font-weight:600; color:#1a1a1a;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (p) => `
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#333333;">${p.name}</td>
              <td style="padding:6px 0; font-size:14px; color:#333333; text-align:right;">$${p.price.toNumber().toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
          ${
            shippingCost > 0
              ? `
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#333333;">Shipping</td>
              <td style="padding:6px 0; font-size:14px; color:#333333; text-align:right;">$${shippingCost.toFixed(2)}</td>
            </tr>
          `
              : ""
          }
        </tbody>
        <tfoot>
          <tr>
            <td style="padding:12px 0; font-size:16px; font-weight:600; color:#1a1a1a;">Total</td>
            <td style="padding:12px 0; font-size:16px; font-weight:600; color:#1a1a1a; text-align:right;">$${orderTotal}</td>
          </tr>
        </tfoot>
      </table>

      <p style="font-size:14px; margin-bottom:20px;">
        We will notify you when your items have shipped. In the meantime, if you need assistance, feel free to
        <a href="https://stores-nu.vercel.app/contact" target="_blank" rel="noreferrer" style="color:#1a73e8; text-decoration:none;">contact our support team</a>.
      </p>
      <p style="font-size:12px; color:#777777; text-align:center; margin-top:30px;">
        © ${new Date().getFullYear()} Max’s Store. All rights reserved.
      </p>
    </div>
  `;

  await sendEmail(customerEmail, emailSubject, emailText, emailHtml);

  return NextResponse.json(
    { url: session.url },
    { headers: corsHeaders }
  );
}
