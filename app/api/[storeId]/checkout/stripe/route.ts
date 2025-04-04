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

import type Stripe from "stripe"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: Request, props: { params: Promise<{ storeId: string }> }) {
  const params = await props.params
  const { productIds } = await req.json()

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product Ids are required", { status: 400 })
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  })

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

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
    })
  })

  // Calculate subtotal from products
  const subtotal = products.reduce((total, product) => total + product.price.toNumber(), 0)

  // Calculate shipping cost based on the same logic as frontend
  const shippingCost = subtotal > 150 ? 0 : 10

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
    })
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
  })

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
  })

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    },
  )
}

