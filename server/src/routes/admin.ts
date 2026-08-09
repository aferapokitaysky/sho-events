import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { checkAdminCredentials, issueSessionCookie, clearSessionCookie, requireAdmin, getSessionUsername } from "../auth.js";
import { translateToAll } from "../translate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Unsupported file type"));
    cb(null, true);
  },
});

export const adminRouter = Router();

adminRouter.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ ok: false, error: "Missing credentials" });
  }
  const valid = await checkAdminCredentials(username, password);
  if (!valid) return res.status(401).json({ ok: false, error: "Invalid credentials" });
  issueSessionCookie(res, username);
  res.json({ ok: true });
});

adminRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

adminRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ ok: true, username: getSessionUsername(req) });
});

adminRouter.post("/translate", requireAdmin, async (req, res) => {
  const { text, sourceLang } = req.body ?? {};
  if (typeof text !== "string" || !["ru", "en", "sk"].includes(sourceLang)) {
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }
  try {
    const result = await translateToAll(text, sourceLang);
    res.json({ ok: true, translations: result });
  } catch (err) {
    console.error("Translation failed", err);
    res.status(502).json({ ok: false, error: "Translation service unavailable" });
  }
});

adminRouter.post("/upload", requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No file uploaded" });

  try {
    const filename = `${randomUUID()}.webp`;
    await sharp(req.file.buffer)
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(path.join(UPLOADS_DIR, filename));

    res.json({ ok: true, url: `/api/uploads/${filename}` });
  } catch (err) {
    console.error("Image processing failed", err);
    res.status(422).json({ ok: false, error: "Could not process this image" });
  }
});
