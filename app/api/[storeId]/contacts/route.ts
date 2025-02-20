import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;
  let body;

  // Read and log the raw request body for debugging
  const rawBody = await request.text();
  console.log("Raw request body:", rawBody);

  // Check if the raw body is empty
  if (!rawBody) {
    console.error("Empty request body");
    return NextResponse.json({ error: "Empty JSON payload" }, { status: 400 });
  }

  // Attempt to parse the JSON body
  try {
    body = JSON.parse(rawBody);
  } catch (err) {
    console.error("Failed to parse JSON body:", err);
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const newContact = await prismadb.contact.create({
    data: {
      id: crypto.randomUUID(),
      storeId,
      name,
      email,
      message,
    },
  });

  return NextResponse.json(newContact, {
    status: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
