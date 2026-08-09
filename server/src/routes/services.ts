import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

export const servicesPublicRouter = Router();
export const servicesAdminRouter = Router();

interface ServiceRow {
  id: number;
  title_ru: string;
  title_en: string;
  title_sk: string;
  description_ru: string;
  description_en: string;
  description_sk: string;
  image_url: string | null;
  price: string | null;
  sort_order: number;
}

function serialize(row: ServiceRow) {
  return {
    id: row.id,
    title: { ru: row.title_ru, en: row.title_en, sk: row.title_sk },
    description: { ru: row.description_ru, en: row.description_en, sk: row.description_sk },
    imageUrl: row.image_url,
    price: row.price,
    sortOrder: row.sort_order,
  };
}

servicesPublicRouter.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM services ORDER BY sort_order ASC, id ASC").all() as ServiceRow[];
  res.json({ ok: true, services: rows.map(serialize) });
});

servicesAdminRouter.get("/", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT * FROM services ORDER BY sort_order ASC, id ASC").all() as ServiceRow[];
  res.json({ ok: true, services: rows.map(serialize) });
});

servicesAdminRouter.post("/", requireAdmin, (req, res) => {
  const { title, description, imageUrl, price, sortOrder } = req.body ?? {};
  if (!title?.ru || !title?.en || !title?.sk || !description?.ru || !description?.en || !description?.sk) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }
  const stmt = db.prepare(`
    INSERT INTO services (title_ru, title_en, title_sk, description_ru, description_en, description_sk, image_url, price, sort_order)
    VALUES (@title_ru, @title_en, @title_sk, @description_ru, @description_en, @description_sk, @image_url, @price, @sort_order)
  `);
  const result = stmt.run({
    title_ru: title.ru,
    title_en: title.en,
    title_sk: title.sk,
    description_ru: description.ru,
    description_en: description.en,
    description_sk: description.sk,
    image_url: imageUrl ?? null,
    price: price ?? null,
    sort_order: sortOrder ?? 0,
  });
  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(result.lastInsertRowid) as ServiceRow;
  res.status(201).json({ ok: true, service: serialize(row) });
});

servicesAdminRouter.put("/:id", requireAdmin, (req, res) => {
  const { title, description, imageUrl, price, sortOrder } = req.body ?? {};
  const existing = db.prepare("SELECT * FROM services WHERE id = ?").get(req.params.id) as ServiceRow | undefined;
  if (!existing) return res.status(404).json({ ok: false, error: "Not found" });

  db.prepare(`
    UPDATE services SET
      title_ru = @title_ru, title_en = @title_en, title_sk = @title_sk,
      description_ru = @description_ru, description_en = @description_en, description_sk = @description_sk,
      image_url = @image_url, price = @price, sort_order = @sort_order
    WHERE id = @id
  `).run({
    id: existing.id,
    title_ru: title?.ru ?? existing.title_ru,
    title_en: title?.en ?? existing.title_en,
    title_sk: title?.sk ?? existing.title_sk,
    description_ru: description?.ru ?? existing.description_ru,
    description_en: description?.en ?? existing.description_en,
    description_sk: description?.sk ?? existing.description_sk,
    image_url: imageUrl !== undefined ? imageUrl : existing.image_url,
    price: price !== undefined ? price : existing.price,
    sort_order: sortOrder !== undefined ? sortOrder : existing.sort_order,
  });

  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(existing.id) as ServiceRow;
  res.json({ ok: true, service: serialize(row) });
});

servicesAdminRouter.delete("/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM services WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});
