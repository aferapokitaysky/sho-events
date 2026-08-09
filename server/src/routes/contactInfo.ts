import { Router } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../auth.js";

export const contactInfoPublicRouter = Router();
export const contactInfoAdminRouter = Router();

interface ContactInfoRow {
  id: number;
  phone: string;
  whatsapp: string;
  instagram: string;
  threads: string;
  email: string;
  city_ru: string;
  city_en: string;
  city_sk: string;
  address_note_ru: string;
  address_note_en: string;
  address_note_sk: string;
}

function digitsOnly(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

function serializePublic(row: ContactInfoRow) {
  const phoneDigits = digitsOnly(row.phone);
  const whatsappDigits = digitsOnly(row.whatsapp).replace(/^\+/, "");
  return {
    city: { ru: row.city_ru, en: row.city_en, sk: row.city_sk },
    addressNote: { ru: row.address_note_ru, en: row.address_note_en, sk: row.address_note_sk },
    channels: [
      { id: "phone", value: row.phone, href: `tel:${phoneDigits}` },
      { id: "whatsapp", value: row.whatsapp, href: `https://wa.me/${whatsappDigits}` },
      { id: "instagram", value: `@${row.instagram}`, href: `https://www.instagram.com/${row.instagram}` },
      { id: "threads", value: `@${row.threads}`, href: `https://www.threads.com/@${row.threads}` },
      { id: "email", value: row.email, href: `mailto:${row.email}` },
    ],
  };
}

function getRow(): ContactInfoRow {
  return db.prepare("SELECT * FROM contact_info WHERE id = 1").get() as ContactInfoRow;
}

contactInfoPublicRouter.get("/", (_req, res) => {
  res.json({ ok: true, contactInfo: serializePublic(getRow()) });
});

contactInfoAdminRouter.get("/", requireAdmin, (_req, res) => {
  res.json({ ok: true, contactInfo: getRow() });
});

contactInfoAdminRouter.put("/", requireAdmin, (req, res) => {
  const { phone, whatsapp, instagram, threads, email, city, addressNote } = req.body ?? {};
  const existing = getRow();

  db.prepare(`
    UPDATE contact_info SET
      phone = @phone, whatsapp = @whatsapp, instagram = @instagram, threads = @threads, email = @email,
      city_ru = @city_ru, city_en = @city_en, city_sk = @city_sk,
      address_note_ru = @address_note_ru, address_note_en = @address_note_en, address_note_sk = @address_note_sk
    WHERE id = 1
  `).run({
    phone: phone ?? existing.phone,
    whatsapp: whatsapp ?? existing.whatsapp,
    instagram: instagram ?? existing.instagram,
    threads: threads ?? existing.threads,
    email: email ?? existing.email,
    city_ru: city?.ru ?? existing.city_ru,
    city_en: city?.en ?? existing.city_en,
    city_sk: city?.sk ?? existing.city_sk,
    address_note_ru: addressNote?.ru ?? existing.address_note_ru,
    address_note_en: addressNote?.en ?? existing.address_note_en,
    address_note_sk: addressNote?.sk ?? existing.address_note_sk,
  });

  res.json({ ok: true, contactInfo: getRow() });
});
