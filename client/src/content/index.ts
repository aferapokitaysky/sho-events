import { ru } from "./ru";
import { en } from "./en";
import { sk } from "./sk";
import type { Lang, SiteContent } from "./types";

export const dictionaries: Record<Lang, SiteContent> = { ru, en, sk };
export const languages: { code: Lang; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "sk", label: "SK" },
];

export type { Lang, SiteContent } from "./types";
