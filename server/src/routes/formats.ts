import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

export const formatsPublicRouter = Router();
export const formatsAdminRouter = Router();

interface FormatRow {
  id: number;
  title_ru: string;
  title_en: string;
  title_sk: string;
  description_ru: string;
  description_en: string;
  description_sk: string;
  image_url: string | null;
  sort_order: number;
}

function serialize(row: FormatRow) {
  return {
    id: row.id,
    title: { ru: row.title_ru, en: row.title_en, sk: row.title_sk },
    description: { ru: row.description_ru, en: row.description_en, sk: row.description_sk },
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

formatsPublicRouter.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM formats ORDER BY sort_order ASC, id ASC").all() as FormatRow[];
  res.json({ ok: true, formats: rows.map(serialize) });
});

formatsAdminRouter.get("/", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT * FROM formats ORDER BY sort_order ASC, id ASC").all() as FormatRow[];
  res.json({ ok: true, formats: rows.map(serialize) });
});

formatsAdminRouter.post("/", requireAdmin, (req, res) => {
  const { title, description, imageUrl, sortOrder } = req.body ?? {};
  if (!title?.ru || !title?.en || !title?.sk || !description?.ru || !description?.en || !description?.sk) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }
  const stmt = db.prepare(`
    INSERT INTO formats (title_ru, title_en, title_sk, description_ru, description_en, description_sk, image_url, sort_order)
    VALUES (@title_ru, @title_en, @title_sk, @description_ru, @description_en, @description_sk, @image_url, @sort_order)
  `);
  const result = stmt.run({
    title_ru: title.ru,
    title_en: title.en,
    title_sk: title.sk,
    description_ru: description.ru,
    description_en: description.en,
    description_sk: description.sk,
    image_url: imageUrl ?? null,
    sort_order: sortOrder ?? 0,
  });
  const row = db.prepare("SELECT * FROM formats WHERE id = ?").get(result.lastInsertRowid) as FormatRow;
  res.status(201).json({ ok: true, format: serialize(row) });
});

formatsAdminRouter.put("/:id", requireAdmin, (req, res) => {
  const { title, description, imageUrl, sortOrder } = req.body ?? {};
  const existing = db.prepare("SELECT * FROM formats WHERE id = ?").get(req.params.id) as FormatRow | undefined;
  if (!existing) return res.status(404).json({ ok: false, error: "Not found" });

  db.prepare(`
    UPDATE formats SET
      title_ru = @title_ru, title_en = @title_en, title_sk = @title_sk,
      description_ru = @description_ru, description_en = @description_en, description_sk = @description_sk,
      image_url = @image_url, sort_order = @sort_order
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
    sort_order: sortOrder !== undefined ? sortOrder : existing.sort_order,
  });

  const row = db.prepare("SELECT * FROM formats WHERE id = ?").get(existing.id) as FormatRow;
  res.json({ ok: true, format: serialize(row) });
});

formatsAdminRouter.delete("/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM formats WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});
