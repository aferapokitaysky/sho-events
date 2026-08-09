const LANG_PAIRS: Record<string, string> = {
  ru: "ru-RU",
  en: "en-GB",
  sk: "sk-SK",
};

async function translateOnce(text: string, from: string, to: string): Promise<string> {
  const langpair = `${LANG_PAIRS[from] ?? from}|${LANG_PAIRS[to] ?? to}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Translation request failed (${res.status})`);
  const data = (await res.json()) as { responseStatus?: number | string; responseData?: { translatedText?: string } };
  const translated = data.responseData?.translatedText;
  if (!translated || /MYMEMORY WARNING/i.test(translated) || String(data.responseStatus) === "403") {
    throw new Error("Translation unavailable");
  }
  return translated;
}

// Always resolves — falls back to the source text so every field ends up
// populated in all three languages even if the free translation API is down
// or rate-limited, per requirement that admin edits always cover ru/en/sk.
async function translateOne(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await translateOnce(text, from, to);
    } catch {
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  return text;
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
