const LANG_PAIRS: Record<string, string> = {
  ru: "ru-RU",
  en: "en-GB",
  sk: "sk-SK",
};

async function translateOne(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return "";
  const langpair = `${LANG_PAIRS[from] ?? from}|${LANG_PAIRS[to] ?? to}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translation request failed (${res.status})`);
  const data = (await res.json()) as { responseData?: { translatedText?: string } };
  return data.responseData?.translatedText ?? text;
}

export async function translateToAll(
  text: string,
  sourceLang: "ru" | "en" | "sk",
): Promise<{ ru: string; en: string; sk: string }> {
  const targets = (["ru", "en", "sk"] as const).filter((lang) => lang !== sourceLang);
  const results = await Promise.all(targets.map((lang) => translateOne(text, sourceLang, lang)));
  const out = { ru: "", en: "", sk: "" };
  out[sourceLang] = text;
  targets.forEach((lang, i) => {
    out[lang] = results[i];
  });
  return out;
}
