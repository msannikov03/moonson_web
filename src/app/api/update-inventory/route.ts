import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';

export async function POST(request: NextRequest) {
  const db = getDB();
  const { cartItems } = await request.json();

  for (const item of cartItems) {
    const { color, size, quantity } = item;

    const inventoryItem = db.get('inventory').find({ color, size }).value();

    if (inventoryItem) {
      if (inventoryItem.quantity >= quantity) {
        db.get('inventory')
          .find({ color, size })
          .assign({ quantity: inventoryItem.quantity - quantity })
          .write();
      } else {
        return NextResponse.json(
          { error: `Not enough stock for ${color} ${size}` },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: `Item not found: ${color} ${size}` },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ message: 'Inventory updated successfully' });
}