/* eslint-disable @typescript-eslint/no-unused-vars */
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
  return NextResponse.json({}, { headers: mpesaHeaders });
}

// Helper function to format the phone number
function formatPhoneNumber(phone: string): string {
  // Remove spaces and any leading "+"
  phone = phone.replace(/\s+/g, '');
  if (phone.startsWith('+')) {
    phone = phone.substring(1);
  }
  // If the phone number starts with "0", replace it with "254"
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
  const { phone, amount, productIds } = await request.json();

  if (!phone || !amount || !productIds || productIds.length === 0) {
    return NextResponse.json("Phone, Amount and Product Ids are required", { status: 400 });
  }

  // Format the phone number to international format (2547XXXXXXXX)
  const formattedPhone = formatPhoneNumber(phone);

  // Ensure the amount is a number
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) {
    return NextResponse.json("Amount must be a valid number", { status: 400 });
  }

  // Create order record in DB
  const order = await prismadb.order.create({
    data: {
      storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: { connect: { id: productId } },
        })),
      },
    },
  });

  // Generate timestamp in format YYYYMMDDHHMMSS
  const date = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  const timestamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

  // Use MPESA_SHORTCODE as defined in your .env file
  const businessShortCode = process.env.MPESA_SHORTCODE;
  const passKey = process.env.MPESA_PASSKEY;
  if (!businessShortCode || !passKey) {
    return NextResponse.json("M-Pesa credentials not set", { status: 500 });
  }
  const password = Buffer.from(businessShortCode + passKey + timestamp).toString("base64");

  // Obtain M-Pesa access token
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  let accessToken: string;
  try {
    const tokenResponse = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });
    accessToken = tokenResponse.data.access_token;
  } catch (error: any) {
    console.error("Access Token Error:", error.response ? error.response.data : error.message);
    return NextResponse.json("Failed to generate access token", { status: 500 });
  }

  // Build the STK push payload
  const payload = {
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: numericAmount,
    PartyA: formattedPhone,
    PartyB: businessShortCode,
    PhoneNumber: formattedPhone,
    CallBackURL: `${process.env.FRONTEND_STORE_URL}/api/mpesa/callback?order_id=${order.id}`,
    AccountReference: "Stores",
    TransactionDesc: "Purchase Payment",
  };

  // Initiate the STK push
  try {
    const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Log the successful response
    console.log("STK Push Response:", response.data);
    
    return NextResponse.json(
      { message: response.data.CustomerMessage || "STK Push initiated", orderId: order.id },
      { headers: mpesaHeaders }
    );
  } catch (error: any) {
    console.error("STK Push Error:", error.response ? error.response.data : error.message);
    return NextResponse.json("Failed to initiate STK push", { status: 500 });
  }
}
