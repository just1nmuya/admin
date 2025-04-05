// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe";
// import prismadb from "@/lib/prismadb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(req: Request, props: { params: Promise<{ storeId: string }> }) {
//   const params = await props.params;
//   const { productIds } = await req.json();

//   if (!productIds || productIds.length === 0) {
//     return new NextResponse("Product Ids are required", { status: 400 });
//   }

//   const products = await prismadb.product.findMany({
//     where: {
//       id: {
//         in: productIds,
//       },
//     },
//   });

//   const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

//   products.forEach((product) => {
//     line_items.push({
//       quantity: 1,
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: product.name,
//         },
//         unit_amount: product.price.toNumber() * 100,
//       },
//     });
//   });

//   const order = await prismadb.order.create({
//     data: {
//       storeId: params.storeId,
//       isPaid: false,
//       paymentMethod: "stripe",
//       orderItems: {
//         create: productIds.map((productid: string) => ({
//           product: {
//             connect: {
//               id: productid,
//             },
//           },
//         })),
//       },
//     },
//   });

//   const session = await stripe.checkout.sessions.create({
//     line_items,
//     mode: "payment",
//     billing_address_collection: "required",
//     phone_number_collection: {
//       enabled: true,
//     },
//     success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
//     cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
//     metadata: {
//       order_id: order.id,
//     },
//   });

//   return NextResponse.json(
//     { url: session.url },
//     {
//       headers: corsHeaders,
//     }
//   );
// }

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
  props: { params: Promise<{ storeId: string }> }
) {
  const params = await props.params;
  const { productIds, customerEmail } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product Ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  // Add all products as line items
  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  // Calculate subtotal from products
  const subtotal = products.reduce(
    (total, product) => total + product.price.toNumber(),
    0
  );

  // Calculate shipping cost based on the same logic as frontend
  const shippingCost = subtotal > 150 ? 0 : 10;

  // Add shipping as a separate line item if there's a cost
  if (shippingCost > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping",
        },
        unit_amount: shippingCost * 100,
      },
    });
  }

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      paymentMethod: "stripe",
      orderItems: {
        create: productIds.map((productid: string) => ({
          product: {
            connect: {
              id: productid,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      order_id: order.id,
    },
  });

 if (customerEmail) {
  await sendEmail(
    customerEmail,
    "Order Confirmation",
    `Thank you for your order! Your order ID is ${order.id}.`,
    `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <svg
            style="height: auto; width: 240px;"
            viewBox="0 0 100 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 30C25 15 35 10 45 15C55 20 65 15 70 5"
              stroke="black"
              strokeWidth="2"
            />
          </svg>          
        </div>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #000000; font-weight: 600; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Your order is confirmed</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Thanks for your purchase! We're preparing your items now.</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Your order ID is <span style="font-weight: 600; color: #000;">${order.id}</span></p>
          
          <div style="background-color: #ffffff; border-radius: 6px; padding: 15px; border: 1px solid #eaeaea;">
            <p style="font-size: 14px; color: #666; margin: 0;">You'll receive another email when your order ships.</p>
          </div>
        </div>
        
        <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border: 1px solid #eaeaea; margin-bottom: 20px;">
          <p style="font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">Order Summary</p>
          <p style="font-size: 14px; margin: 0 0 5px 0;">Order ID: <span style="font-weight: 500;">${order.id}</span></p>
          <p style="font-size: 14px; margin: 0 0 5px 0;">Date: <span style="font-weight: 500;">${new Date().toLocaleDateString()}</span></p>
          <div style="margin: 15px 0; border-top: 1px solid #eaeaea;"></div>
        <p style="font-size: 16px; margin: 0; text-align: right; font-weight: 600;">Total: $${(subtotal + shippingCost).toFixed(2)}</p>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; color: #999; font-size: 14px;">
          <p>Need help? <a href="https://stores-nu.vercel.app/contact" style="color: #000000; text-decoration: underline;">Contact our support team</a></p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
        </div>
      </div>
    `
  );
}
  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
