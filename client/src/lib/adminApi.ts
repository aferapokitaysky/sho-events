export interface LocalizedText {
  ru: string;
  en: string;
  sk: string;
}

export function formatPriceEuro(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/[€$£]/.test(trimmed)) return trimmed;

  const match = trimmed.match(/\d+(?:[.,]\d+)?/);
  if (!match || match.index === undefined) return trimmed;

  const insertAt = match.index + match[0].length;
  return `${trimmed.slice(0, insertAt)} €${trimmed.slice(insertAt)}`;
}

export interface AdminService {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string | null;
  price: string | null;
  sortOrder: number;
}

export interface AdminFormat {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string | null;
  sortOrder: number;
}

export interface DecorImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface AdminDecorItem {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  price: string | null;
  sortOrder: number;
  images: DecorImage[];
}

export interface AdminPortfolioPhoto {
  id: number;
  imageUrl: string;
  title: LocalizedText;
  caption: LocalizedText;
  published: boolean;
  sortOrder: number;
}

export interface AdminContactInfo {
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const adminAuth = {
  login: (username: string, password: string) =>
    request<{ ok: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request<{ ok: true }>("/api/admin/logout", { method: "POST" }),
  me: () => request<{ ok: true; username: string }>("/api/admin/me"),
};

export async function translateText(text: string, sourceLang: "ru" | "en" | "sk"): Promise<LocalizedText> {
  const res = await request<{ ok: true; translations: LocalizedText }>("/api/admin/translate", {
    method: "POST",
    body: JSON.stringify({ text, sourceLang }),
  });
  return res.translations;
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Upload failed: ${res.status}`);
  }
  const data = (await res.json()) as { ok: true; url: string };
  return data.url;
}

export const servicesApi = {
  list: () => request<{ ok: true; services: AdminService[] }>("/api/admin/services").then((r) => r.services),
  create: (payload: Partial<Omit<AdminService, "id">>) =>
    request<{ ok: true; service: AdminService }>("/api/admin/services", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((r) => r.service),
  update: (id: number, payload: Partial<Omit<AdminService, "id">>) =>
    request<{ ok: true; service: AdminService }>(`/api/admin/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((r) => r.service),
  remove: (id: number) => request<{ ok: true }>(`/api/admin/services/${id}`, { method: "DELETE" }),
};

export const formatsApi = {
  list: () => request<{ ok: true; formats: AdminFormat[] }>("/api/admin/formats").then((r) => r.formats),
  create: (payload: Partial<Omit<AdminFormat, "id">>) =>
    request<{ ok: true; format: AdminFormat }>("/api/admin/formats", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((r) => r.format),
  update: (id: number, payload: Partial<Omit<AdminFormat, "id">>) =>
    request<{ ok: true; format: AdminFormat }>(`/api/admin/formats/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((r) => r.format),
  remove: (id: number) => request<{ ok: true }>(`/api/admin/formats/${id}`, { method: "DELETE" }),
};

export const decorApi = {
  list: () => request<{ ok: true; items: AdminDecorItem[] }>("/api/admin/decor").then((r) => r.items),
  create: (payload: { name: LocalizedText; description: LocalizedText; price: string | null; images: string[] }) =>
    request<{ ok: true; item: AdminDecorItem }>("/api/admin/decor", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((r) => r.item),
  update: (
    id: number,
    payload: Partial<{ name: LocalizedText; description: LocalizedText; price: string | null; images: string[] }>,
  ) =>
    request<{ ok: true; item: AdminDecorItem }>(`/api/admin/decor/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((r) => r.item),
  remove: (id: number) => request<{ ok: true }>(`/api/admin/decor/${id}`, { method: "DELETE" }),
};

export const portfolioApi = {
  list: () => request<{ ok: true; photos: AdminPortfolioPhoto[] }>("/api/admin/portfolio").then((r) => r.photos),
  create: (payload: { imageUrl: string; title: LocalizedText; caption: LocalizedText }) =>
    request<{ ok: true; photo: AdminPortfolioPhoto }>("/api/admin/portfolio", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((r) => r.photo),
  update: (id: number, payload: Partial<{ title: LocalizedText; caption: LocalizedText }>) =>
    request<{ ok: true; photo: AdminPortfolioPhoto }>(`/api/admin/portfolio/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((r) => r.photo),
  publish: (id: number, published: boolean) =>
    request<{ ok: true; photo: AdminPortfolioPhoto }>(`/api/admin/portfolio/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ published }),
    }).then((r) => r.photo),
  remove: (id: number) => request<{ ok: true }>(`/api/admin/portfolio/${id}`, { method: "DELETE" }),
};

export const contactInfoApi = {
  get: () => request<{ ok: true; contactInfo: AdminContactInfo }>("/api/admin/contact-info").then((r) => r.contactInfo),
  update: (payload: {
    phone: string;
    whatsapp: string;
    instagram: string;
    threads: string;
    email: string;
    city: LocalizedText;
    addressNote: LocalizedText;
  }) =>
    request<{ ok: true; contactInfo: AdminContactInfo }>("/api/admin/contact-info", {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((r) => r.contactInfo),
};

export interface SiteImageSlot {
  key: string;
  label: string;
}

export const siteImagesApi = {
  list: () =>
    request<{ ok: true; slots: SiteImageSlot[]; images: Record<string, string> }>("/api/admin/site-images"),
  set: (key: string, imageUrl: string | null) =>
    request<{ ok: true; imageUrl: string | null }>(`/api/admin/site-images/${key}`, {
      method: "PUT",
      body: JSON.stringify({ imageUrl }),
    }),
};
