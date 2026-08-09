import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

export const portfolioPublicRouter = Router();
export const portfolioAdminRouter = Router();

interface PortfolioRow {
  id: number;
  image_url: string;
  caption_ru: string;
  caption_en: string;
  caption_sk: string;
  published: number;
  sort_order: number;
}

function serialize(row: PortfolioRow) {
  return {
    id: row.id,
    imageUrl: row.image_url,
    caption: { ru: row.caption_ru, en: row.caption_en, sk: row.caption_sk },
    published: Boolean(row.published),
    sortOrder: row.sort_order,
  };
}

portfolioPublicRouter.get("/", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM portfolio_photos WHERE published = 1 ORDER BY sort_order ASC, id DESC")
    .all() as PortfolioRow[];
  res.json({ ok: true, photos: rows.map(serialize) });
});

portfolioAdminRouter.get("/", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT * FROM portfolio_photos ORDER BY sort_order ASC, id DESC").all() as PortfolioRow[];
  res.json({ ok: true, photos: rows.map(serialize) });
});

portfolioAdminRouter.post("/", requireAdmin, (req, res) => {
  const { imageUrl, caption, sortOrder } = req.body ?? {};
  if (!imageUrl) return res.status(400).json({ ok: false, error: "Missing imageUrl" });
  const result = db
    .prepare(`
      INSERT INTO portfolio_photos (image_url, caption_ru, caption_en, caption_sk, sort_order)
      VALUES (@image_url, @caption_ru, @caption_en, @caption_sk, @sort_order)
    `)
    .run({
      image_url: imageUrl,
      caption_ru: caption?.ru ?? "",
      caption_en: caption?.en ?? "",
      caption_sk: caption?.sk ?? "",
      sort_order: sortOrder ?? 0,
    });
  const row = db.prepare("SELECT * FROM portfolio_photos WHERE id = ?").get(result.lastInsertRowid) as PortfolioRow;
  res.status(201).json({ ok: true, photo: serialize(row) });
});

portfolioAdminRouter.put("/:id", requireAdmin, (req, res) => {
  const { caption, sortOrder } = req.body ?? {};
  const existing = db.prepare("SELECT * FROM portfolio_photos WHERE id = ?").get(req.params.id) as
    | PortfolioRow
    | undefined;
  if (!existing) return res.status(404).json({ ok: false, error: "Not found" });

  db.prepare(`
    UPDATE portfolio_photos SET
      caption_ru = @caption_ru, caption_en = @caption_en, caption_sk = @caption_sk, sort_order = @sort_order
    WHERE id = @id
  `).run({
    id: existing.id,
    caption_ru: caption?.ru ?? existing.caption_ru,
    caption_en: caption?.en ?? existing.caption_en,
    caption_sk: caption?.sk ?? existing.caption_sk,
    sort_order: sortOrder !== undefined ? sortOrder : existing.sort_order,
  });

  const row = db.prepare("SELECT * FROM portfolio_photos WHERE id = ?").get(existing.id) as PortfolioRow;
  res.json({ ok: true, photo: serialize(row) });
});

portfolioAdminRouter.post("/:id/publish", requireAdmin, (req, res) => {
  const { published } = req.body ?? {};
  const result = db.prepare("UPDATE portfolio_photos SET published = ? WHERE id = ?").run(published ? 1 : 0, req.params.id);
  if (result.changes === 0) return res.status(404).json({ ok: false, error: "Not found" });
  const row = db.prepare("SELECT * FROM portfolio_photos WHERE id = ?").get(req.params.id) as PortfolioRow;
  res.json({ ok: true, photo: serialize(row) });
});

portfolioAdminRouter.delete("/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM portfolio_photos WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true });
});
