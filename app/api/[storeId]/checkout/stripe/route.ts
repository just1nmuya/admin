import Stripe from "stripe";
import { NextResponse } from "next/server";

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

export async function POST(req: Request, props: { params: Promise<{ storeId: string }> }) {
  const params = await props.params;
  const { productIds } = await req.json();

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

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "kes",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
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

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}

// // app/api/[storeid]/checkout/route.ts
// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";
// import prismadb from "@/lib/prismadb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// // Add this at the TOP of every API route file
// export async function OPTIONS() {
//   return new Response(null, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }


// export async function POST(
//   req: Request,
//   { params }: { params: { storeid: string } }
// ) {
//   try {
//     const { productIds } = await req.json();

//     if (!productIds || productIds.length === 0) {
//       return new NextResponse("Product Ids are required", { status: 400 });
//     }

//     const products = await prismadb.product.findMany({
//       where: { id: { in: productIds } },
//     });

//     const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

//     products.forEach((product) => {
//       line_items.push({
//         quantity: 1,
//         price_data: {
//           currency: "kes",
//           product_data: { name: product.name },
//           unit_amount: product.price.toNumber() * 100,
//         },
//       });
//     });

//     const order = await prismadb.order.create({
//       data: {
//         storeId: params.storeid,
//         isPaid: false,
//         orderItems: {
//           create: productIds.map((productid: string) => ({
//             product: { connect: { id: productid } },
//           })),
//         },
//       },
//     });

//     const session = await stripe.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       billing_address_collection: "required",
//       phone_number_collection: { enabled: true },
//       success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
//       cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
//       metadata: { order_id: order.id },
//     });

//     return NextResponse.json(
//       { url: session.url },
//       { headers: corsHeaders }
//     );
//   } catch (error) {
//     console.error("Stripe Checkout Error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
