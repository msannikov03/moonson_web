import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';

export async function GET() {
  const db = getDB();
  const inventory = db.get('inventory').value();
  return NextResponse.json(inventory);
}