import { scrypt, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "sho_admin_session";

function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return resolve(false);
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      const hashBuffer = Buffer.from(hash, "hex");
      if (hashBuffer.length !== derivedKey.length) return resolve(false);
      resolve(timingSafeEqual(hashBuffer, derivedKey));
    });
  });
}

export async function checkAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!expectedUsername || !expectedHash) return false;
  if (username !== expectedUsername) return false;
  return verifyPassword(password, expectedHash);
}

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not set");
  return secret;
}

export function issueSessionCookie(res: Response, username: string) {
  const token = jwt.sign({ sub: username }, getJwtSecret(), { expiresIn: "7d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ ok: false, error: "Unauthorized" });
  try {
    jwt.verify(token, getJwtSecret());
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
}

export function getSessionUsername(req: Request): string | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}
