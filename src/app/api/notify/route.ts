import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const isValid = validateSignature(body);
    if (!isValid) {
      return new NextResponse('Signature Invalid', { status: 403 });
    }
    const {
      OrderId,
      Status,
    } = body;

    let newStatus: string = 'pending';
    switch (Status) {
      case 'AUTHORIZED':
        newStatus = 'authorized';
        break;
      case 'CONFIRMED':
        newStatus = 'confirmed';
        break;
      case 'REFUNDED':
        newStatus = 'refunded';
        break;
      case 'PARTIAL_REFUNDED':
        newStatus = 'partially_refunded';
        break;
      case 'REJECTED':
      case 'CANCELED':
      case 'REVERSED':
        newStatus = 'canceled';
        break;
      default:
        newStatus = 'pending';
        break;
    }

    const updatedOrder = await prisma.order.update({
      where: {
        orderNumber: OrderId,
      },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });


    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('[T‑Bank Notification Error]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function validateSignature(body: Record<string, any>): boolean {
  const { Token, ...rest } = body;

  const tbankPassword = process.env.TINKOFF_SECRET_KEY || '';
  rest['Password'] = tbankPassword;

  const sortedKeys = Object.keys(rest).sort();

  let concatenated = '';
  for (const key of sortedKeys) {
    concatenated += String(rest[key] ?? '');
  }

  const computedHash = crypto
    .createHash('sha256')
    .update(concatenated)
    .digest('hex');

  if (!Token) return false;
  return computedHash.toLowerCase() === Token.toLowerCase();
}