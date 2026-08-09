import { useEffect, useState } from "react";
import { fetchSiteImages } from "@/lib/publicContent";

let cachedPromise: Promise<Record<string, string>> | null = null;

function getSiteImages(): Promise<Record<string, string>> {
  if (!cachedPromise) {
    cachedPromise = fetchSiteImages().catch(() => ({}));
  }
  return cachedPromise;
}

export function useSiteImage(key: string, fallback: string): string {
  const [url, setUrl] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    getSiteImages().then((images) => {
      if (!cancelled && images[key]) setUrl(images[key]);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return url;
}
