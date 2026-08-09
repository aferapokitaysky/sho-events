import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

export const siteImagesPublicRouter = Router();
export const siteImagesAdminRouter = Router();

export const SITE_IMAGE_SLOTS: { key: string; label: string }[] = [
  { key: "home_hero", label: "Главная — первый экран" },
  { key: "about_hero", label: "О нас — шапка" },
  { key: "services_hero", label: "Услуги — шапка" },
  { key: "formats_hero", label: "Форматы — шапка" },
  { key: "partners_hero", label: "Партнёрам — шапка" },
  { key: "contacts_hero", label: "Контакты — шапка" },
  { key: "decor_hero", label: "Аренда декора — шапка" },
  { key: "portfolio_hero", label: "Портфолио — шапка" },
];

interface Row {
  image_key: string;
  image_url: string;
}

siteImagesPublicRouter.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM site_images").all() as Row[];
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    map[r.image_key] = r.image_url;
  });
  res.json({ ok: true, images: map });
});

siteImagesAdminRouter.get("/", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT * FROM site_images").all() as Row[];
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    map[r.image_key] = r.image_url;
  });
  res.json({ ok: true, slots: SITE_IMAGE_SLOTS, images: map });
});

siteImagesAdminRouter.put("/:key", requireAdmin, (req, res) => {
  const { key } = req.params;
  const { imageUrl } = req.body ?? {};
  if (!SITE_IMAGE_SLOTS.some((s) => s.key === key)) {
    return res.status(400).json({ ok: false, error: "Unknown image slot" });
  }
  if (!imageUrl) {
    db.prepare("DELETE FROM site_images WHERE image_key = ?").run(key);
    return res.json({ ok: true, imageUrl: null });
  }
  db.prepare(`
    INSERT INTO site_images (image_key, image_url) VALUES (?, ?)
    ON CONFLICT(image_key) DO UPDATE SET image_url = excluded.image_url
  `).run(key, imageUrl);
  res.json({ ok: true, imageUrl });
});
