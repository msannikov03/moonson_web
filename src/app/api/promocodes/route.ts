// pages/api/promocodes.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface PromoCode {
  code: string;
  discountPercent: number;
  active: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'db.json');

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    const activePromos: PromoCode[] = data.promocodes.filter((promo: PromoCode) => promo.active);
    res.status(200).json(activePromos);
  } catch (error) {
    console.error("Error reading db.json:", error);
    res.status(500).json({ error: 'Failed to load promo codes.' });
  }
}