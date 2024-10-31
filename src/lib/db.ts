import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

export type InventoryItem = {
  color: string;
  size: string;
  quantity: number;
};

type Data = {
  inventory: InventoryItem[];
};

let db: low.LowdbSync<Data> | null = null;

export function getDB() {
  if (!db) {
    const file = path.join(process.cwd(), 'db.json');
    const adapter = new FileSync<Data>(file);
    db = low(adapter);
    db.read();
  }
  return db;
}