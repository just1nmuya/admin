
/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import axios from "axios";

const mpesaHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler for CORS
export async function OPTIONS() {
  // For a 204 No Content response, use NextResponse directly with a null body
  return new NextResponse(null, {
    status: 204,
    headers: mpesaHeaders,
  });
}

// Helper function to format phone numbers to international format
function formatPhoneNumber(phone: string): string {
  phone = phone.replace(/\s+/g, "");
  if (phone.startsWith("+")) {
    phone = phone.substring(1);
  }

  if (phone.startsWith("0")) {
    return "254" + phone.substring(1);
  }
  return phone;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  

  const { storeId } = await params;
  

  // Extract phone, amount, productIds, and address from the request body
  const { phone, amount, productIds, address } = await request.json();

  // Validate that all required fields are provided
  if (!phone || !amount || !productIds || productIds.length === 0 || !address) {
    return NextResponse.json(
      "Phone, Amount, Product Ids, and Delivery Address are required",
      { status: 400 }
    );
  }


  const formattedPhone = formatPhoneNumber(phone);


  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return NextResponse.json("Amount must be a valid number", { status: 400 });
  }

  // Create an order record with initial values and capture the phone number and delivery address
  const order = await prismadb.order.create({
    data: {
      storeId,
      isPaid: false,
      phone: formattedPhone, // Save the formatted phone number
      address, // Save the delivery address
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: { connect: { id: productId } },
        })),
      },
    },
  });
  console.log("Created Order ID:", order.id);

  // Generate timestamp and password for STK push request
  const date = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  const timestamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;


  const businessShortCode = process.env.MPESA_SHORTCODE;
  const passKey = process.env.MPESA_PASSKEY;
  if (!businessShortCode || !passKey) {
    return NextResponse.json("M-Pesa credentials not set", { status: 500 });
  }
  const password = Buffer.from(
    businessShortCode + passKey + timestamp
  ).toString("base64");

  // Obtain the access token from Safaricom
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");
  let accessToken: string;
  try {
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    accessToken = tokenResponse.data.access_token;
  } catch (error: any) {
    console.error(
      "Access Token Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json("Failed to generate access token", {
      status: 500,
    });
  }

  // Build payload with the callback URL including the order ID.

  const callbackURL = `${process.env.FRONTEND_STORE_URL}/api/mpesa/callback?order_id=${order.id}`;
  const payload = {
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: numericAmount,
    PartyA: formattedPhone,
    PartyB: businessShortCode,
    PhoneNumber: formattedPhone,
    CallBackURL: callbackURL,
    AccountReference: "Stores",
    TransactionDesc: "Purchase Payment",
  };


  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    console.log("STK Push Response:", response.data);

    return NextResponse.json(
      {
        message: response.data.CustomerMessage || "STK Push initiated",
        orderId: order.id,
      },
      { headers: mpesaHeaders }
    );
  } catch (error: any) {
    console.error(
      "STK Push Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json("Failed to initiate STK push", { status: 500 });
  }
}
