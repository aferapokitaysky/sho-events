import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

export const decorPublicRouter = Router();
export const decorAdminRouter = Router();

interface DecorRow {
  id: number;
  name_ru: string;
  name_en: string;
  name_sk: string;
  description_ru: string;
  description_en: string;
  description_sk: string;
  price_ru: string;
  price_en: string;
  price_sk: string;
  sort_order: number;
}

interface DecorImageRow {
  id: number;
  decor_item_id: number;
  image_url: string;
  sort_order: number;
}

function serialize(row: DecorRow, images: DecorImageRow[]) {
  const hasPrice = Boolean(row.price_ru || row.price_en || row.price_sk);
  return {
    id: row.id,
    name: { ru: row.name_ru, en: row.name_en, sk: row.name_sk },
    description: { ru: row.description_ru, en: row.description_en, sk: row.description_sk },
    price: hasPrice ? { ru: row.price_ru, en: row.price_en, sk: row.price_sk } : null,
    sortOrder: row.sort_order,
    images: images.map((img) => ({ id: img.id, url: img.image_url, sortOrder: img.sort_order })),
  };
}

function getImages(decorItemId: number): DecorImageRow[] {
  return db
    .prepare("SELECT * FROM decor_item_images WHERE decor_item_id = ? ORDER BY sort_order ASC, id ASC")
    .all(decorItemId) as DecorImageRow[];
}

function listAll() {
  const rows = db.prepare("SELECT * FROM decor_items ORDER BY sort_order ASC, id ASC").all() as DecorRow[];
  return rows.map((row) => serialize(row, getImages(row.id)));
}

decorPublicRouter.get("/", (_req, res) => {
  res.json({ ok: true, items: listAll() });
});

decorAdminRouter.get("/", requireAdmin, (_req, res) => {
  res.json({ ok: true, items: listAll() });
});

decorAdminRouter.post("/", requireAdmin, (req, res) => {
  const { name, description, price, sortOrder, images } = req.body ?? {};
  if (!name?.ru || !name?.en || !name?.sk) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }
  const result = db
    .prepare(`
      INSERT INTO decor_items (name_ru, name_en, name_sk, description_ru, description_en, description_sk, price_ru, price_en, price_sk, sort_order)
      VALUES (@name_ru, @name_en, @name_sk, @description_ru, @description_en, @description_sk, @price_ru, @price_en, @price_sk, @sort_order)
    `)
    .run({
      name_ru: name.ru,
      name_en: name.en,
      name_sk: name.sk,
      description_ru: description?.ru ?? "",
      description_en: description?.en ?? "",
      description_sk: description?.sk ?? "",
      price_ru: price?.ru ?? "",
      price_en: price?.en ?? "",
      price_sk: price?.sk ?? "",
      sort_order: sortOrder ?? 0,
    });

  const id = result.lastInsertRowid as number;
  if (Array.isArray(images)) {
    const insertImg = db.prepare("INSERT INTO decor_item_images (decor_item_id, image_url, sort_order) VALUES (?, ?, ?)");
    images.forEach((url: string, i: number) => insertImg.run(id, url, i));
  }

  const row = db.prepare("SELECT * FROM decor_items WHERE id = ?").get(id) as DecorRow;
  res.status(201).json({ ok: true, item: serialize(row, getImages(id)) });
});

decorAdminRouter.put("/:id", requireAdmin, (req, res) => {
  const { name, description, price, sortOrder, images } = req.body ?? {};
  const existing = db.prepare("SELECT * FROM decor_items WHERE id = ?").get(req.params.id) as DecorRow | undefined;
  if (!existing) return res.status(404).json({ ok: false, error: "Not found" });

  db.prepare(`
    UPDATE decor_items SET
      name_ru = @name_ru, name_en = @name_en, name_sk = @name_sk,
      description_ru = @description_ru, description_en = @description_en, description_sk = @description_sk,
      price_ru = @price_ru, price_en = @price_en, price_sk = @price_sk, sort_order = @sort_order
    WHERE id = @id
  `).run({
    id: existing.id,
    name_ru: name?.ru ?? existing.name_ru,
    name_en: name?.en ?? existing.name_en,
    name_sk: name?.sk ?? existing.name_sk,
    description_ru: description?.ru ?? existing.description_ru,
    description_en: description?.en ?? existing.description_en,
    description_sk: description?.sk ?? existing.description_sk,
    price_ru: price !== undefined ? (price?.ru ?? "") : existing.price_ru,
    price_en: price !== undefined ? (price?.en ?? "") : existing.price_en,
    price_sk: price !== undefined ? (price?.sk ?? "") : existing.price_sk,
    sort_order: sortOrder !== undefined ? sortOrder : existing.sort_order,
  });

  if (Array.isArray(images)) {
    db.prepare("DELETE FROM decor_item_images WHERE decor_item_id = ?").run(existing.id);
    const insertImg = db.prepare("INSERT INTO decor_item_images (decor_item_id, image_url, sort_order) VALUES (?, ?, ?)");
    images.forEach((url: string, i: number) => insertImg.run(existing.id, url, i));
  }

  const row = db.prepare("SELECT * FROM decor_items WHERE id = ?").get(existing.id) as DecorRow;
  res.json({ ok: true, item: serialize(row, getImages(existing.id)) });
});

decorAdminRouter.delete("/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM decor_items WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});
