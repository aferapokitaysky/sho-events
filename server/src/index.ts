import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appendSubmission, listSubmissions, type Submission } from "./store.js";
import { sendTelegramNotification } from "./telegram.js";
import "./db.js";
import { seedServicesIfEmpty, seedFormatsIfEmpty, seedContactInfoIfEmpty, ensureSeedImages } from "./seed.js";
import { adminRouter } from "./routes/admin.js";
import { servicesPublicRouter, servicesAdminRouter } from "./routes/services.js";
import { decorPublicRouter, decorAdminRouter } from "./routes/decor.js";
import { portfolioPublicRouter, portfolioAdminRouter } from "./routes/portfolio.js";
import { formatsPublicRouter, formatsAdminRouter } from "./routes/formats.js";
import { contactInfoPublicRouter, contactInfoAdminRouter } from "./routes/contactInfo.js";
import { siteImagesPublicRouter, siteImagesAdminRouter } from "./routes/siteImages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
ensureSeedImages();
seedServicesIfEmpty();
seedFormatsIfEmpty();
seedContactInfoIfEmpty();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") ?? ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use("/api/uploads", express.static(UPLOADS_DIR, { maxAge: "30d" }));

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests, please try again later." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many login attempts, please try again later." },
});

const MAX_FIELD_LENGTH = 2000;

function sanitize(body: unknown): Record<string, string> {
  if (typeof body !== "object" || body === null) return {};
  const entries = Object.entries(body as Record<string, unknown>)
    .filter(([, v]) => typeof v === "string")
    .map(([k, v]) => [k, String(v).trim().slice(0, MAX_FIELD_LENGTH)] as const);
  return Object.fromEntries(entries);
}

function handleForm(type: Submission["type"], requiredFields: string[]) {
  return async (req: express.Request, res: express.Response) => {
    const data = sanitize(req.body);

    const missing = requiredFields.filter((field) => !data[field]);
    if (missing.length > 0) {
      return res.status(400).json({ ok: false, error: `Missing fields: ${missing.join(", ")}` });
    }

    const entry: Submission = {
      id: randomUUID(),
      type,
      receivedAt: new Date().toISOString(),
      data,
    };

    try {
      await appendSubmission(entry);
      sendTelegramNotification(entry).catch((err) =>
        console.error("Telegram notification dispatch error:", err),
      );
      return res.status(200).json({ ok: true, id: entry.id });
    } catch (err) {
      console.error("Failed to persist submission", err);
      return res.status(500).json({ ok: false, error: "Internal error" });
    }
  };
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/partners", formLimiter, handleForm("partners", ["name", "company", "contact"]));
app.post("/api/contact", formLimiter, handleForm("contact", ["name", "contact", "message"]));

app.use("/api/admin/login", loginLimiter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/services", servicesAdminRouter);
app.use("/api/admin/decor", decorAdminRouter);
app.use("/api/admin/portfolio", portfolioAdminRouter);
app.use("/api/admin/formats", formatsAdminRouter);
app.use("/api/admin/contact-info", contactInfoAdminRouter);
app.use("/api/admin/site-images", siteImagesAdminRouter);

app.use("/api/services", servicesPublicRouter);
app.use("/api/decor", decorPublicRouter);
app.use("/api/portfolio", portfolioPublicRouter);
app.use("/api/formats", formatsPublicRouter);
app.use("/api/contact-info", contactInfoPublicRouter);
app.use("/api/site-images", siteImagesPublicRouter);

app.get("/api/submissions", async (req, res) => {
  if (!ADMIN_TOKEN || req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  const list = await listSubmissions();
  res.json({ ok: true, submissions: list });
});

app.listen(PORT, () => {
  console.log(`SHO Events API listening on http://localhost:${PORT}`);
});
