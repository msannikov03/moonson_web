import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function GET() {
  const db = getDB();
  const rawInventory = db.get("inventory").value(); 
  const sanitized = JSON.parse(JSON.stringify(rawInventory));
  return NextResponse.json(sanitized);
}