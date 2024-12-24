import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// For phone/email validation on server side
function isEmailValid(email: string) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}
function isPhoneValid(phone: string) {
  return /^\+?\d{7,15}$/.test(phone);
}

// (Optional) put these in your .env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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
    } = await request.json();

    // Server-side validation
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

    // Create an order with "pending" status
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        firstName,
        lastName,
        email,
        phone,
        address,
        shippingMethod,
        items: cartItems, // JSON field
        subtotal,
        total: totalPrice,
        status: "pending",
      },
    });

    // Send Telegram notification (if token and chat exist)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const message = `
Новый заказ #${orderNumber}
Имя: ${firstName} ${lastName}
Email: ${email}
Телефон: ${phone}
Адрес: ${address}
Сумма: ${totalPrice}
Статус: pending
Дата: ${newOrder.createdAt}
      `;
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    console.error("[Checkout API Error]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}