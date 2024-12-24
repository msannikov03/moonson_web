import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isEmailValid(email: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}
function isPhoneValid(phone: string) {
  return /^\+?\d{7,15}$/.test(phone);
}

export async function POST(request: NextRequest) {
  try {
    const {
      orderNumber,
      firstName,
      lastName,
      email,
      phone,
      address,
      shippingMethod,
      cartItems,
      subtotal,
      totalPrice,
      coupons,
    } = await request.json();

    if (!isEmailValid(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }
    if (!isPhoneValid(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone format" },
        { status: 400 }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        firstName,
        lastName,
        email,
        phone,
        address,
        shippingMethod,
        items: cartItems,
        subtotal,
        total: totalPrice,
        status: "pending",
        coupons,
      },
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    console.error("[Checkout API Error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}