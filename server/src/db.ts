import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../data/sho.db");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_ru TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_sk TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_sk TEXT NOT NULL,
    image_url TEXT,
    price TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS decor_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ru TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_sk TEXT NOT NULL,
    description_ru TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    description_sk TEXT NOT NULL DEFAULT '',
    price TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS decor_item_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    decor_item_id INTEGER NOT NULL REFERENCES decor_items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS portfolio_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    caption_ru TEXT NOT NULL DEFAULT '',
    caption_en TEXT NOT NULL DEFAULT '',
    caption_sk TEXT NOT NULL DEFAULT '',
    published INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    phone TEXT NOT NULL DEFAULT '',
    whatsapp TEXT NOT NULL DEFAULT '',
    instagram TEXT NOT NULL DEFAULT '',
    threads TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    city_ru TEXT NOT NULL DEFAULT '',
    city_en TEXT NOT NULL DEFAULT '',
    city_sk TEXT NOT NULL DEFAULT '',
    address_note_ru TEXT NOT NULL DEFAULT '',
    address_note_en TEXT NOT NULL DEFAULT '',
    address_note_sk TEXT NOT NULL DEFAULT ''
  );
`);
