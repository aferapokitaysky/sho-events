import type { Lang } from "@/content";
import type { LocalizedText } from "@/lib/adminApi";

export interface PublicService {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string | null;
  price: string | null;
}

export interface PublicDecorItem {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  price: string | null;
  images: { id: number; url: string }[];
}

export interface PublicPortfolioPhoto {
  id: number;
  imageUrl: string;
  caption: LocalizedText;
}

export interface PublicContactChannel {
  id: "phone" | "whatsapp" | "instagram" | "threads" | "email";
  value: string;
  href: string;
}

export interface PublicContactInfo {
  city: LocalizedText;
  addressNote: LocalizedText;
  channels: PublicContactChannel[];
}

export function pick(text: LocalizedText, lang: Lang): string {
  return text[lang] || text.ru;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson<T>(url: string, retries = 2): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request to ${url} failed: ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      if (attempt >= retries) throw err;
      await wait(400 * (attempt + 1));
    }
  }
}

export async function fetchServices(): Promise<PublicService[]> {
  const data = await getJson<{ ok: true; services: PublicService[] }>("/api/services");
  return data.services;
}

export async function fetchDecorItems(): Promise<PublicDecorItem[]> {
  const data = await getJson<{ ok: true; items: PublicDecorItem[] }>("/api/decor");
  return data.items;
}

export async function fetchPortfolioPhotos(): Promise<PublicPortfolioPhoto[]> {
  const data = await getJson<{ ok: true; photos: PublicPortfolioPhoto[] }>("/api/portfolio");
  return data.photos;
}

export async function fetchContactInfo(): Promise<PublicContactInfo> {
  const data = await getJson<{ ok: true; contactInfo: PublicContactInfo }>("/api/contact-info");
  return data.contactInfo;
}
