// src/app/api/promocodes/route.ts

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

interface PromoCode {
  code: string;
  discountPercent: number;
  active: boolean;
  freeShipping?: boolean;
}

export async function POST(request: Request) {
  const { codes } = await request.json();
  const filePath = path.join(process.cwd(), 'db.json');

  if (!Array.isArray(codes) || codes.length === 0 || codes.length > 2) {
    return NextResponse.json(
      { valid: false, message: 'Можно применить до двух промокодов.' },
      { status: 400 }
    );
  }

  try {
    const jsonData = await readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    let totalDiscountPercent = 0;
    let freeShipping = false;
    const appliedCodes: string[] = [];

    for (const code of codes) {
      const promo = data.promocodes.find(
        (promo: PromoCode) => promo.code.toLowerCase() === code.toLowerCase() && promo.active
      );

      if (promo && !appliedCodes.includes(promo.code.toLowerCase())) {
        if (promo.discountPercent > 0) {
          totalDiscountPercent += promo.discountPercent;
        }
        if (promo.freeShipping) {
          freeShipping = true;
        }
        appliedCodes.push(promo.code.toLowerCase());
      }
    }

    if (appliedCodes.length === 0) {
      return NextResponse.json(
        { valid: false, message: 'Неверные или неактивные промокоды.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      totalDiscountPercent: totalDiscountPercent > 100 ? 100 : totalDiscountPercent,
      freeShipping: freeShipping
    });
  } catch (error) {
    console.error("Ошибка при чтении db.json:", error);
    return NextResponse.json(
      { valid: false, message: 'Внутренняя ошибка сервера.' },
      { status: 500 }
    );
  }
}