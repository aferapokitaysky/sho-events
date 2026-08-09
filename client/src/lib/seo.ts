import { languages, type Lang } from "@/content";
import { pagePaths, pathToPage, type PageKey } from "@/content/seo";

const FALLBACK_SITE_URL = "https://shoevents.org";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL;
  if (configured) return trimTrailingSlash(configured);
  if (typeof window !== "undefined" && window.location.origin.startsWith("http")) {
    return trimTrailingSlash(window.location.origin);
  }
  return FALLBACK_SITE_URL;
}

export function getPageKey(pathname: string): PageKey {
  const normalized = pathname === "" ? "/" : pathname.replace(/\/+$/, "") || "/";
  return pathToPage[normalized] ?? "home";
}

export function getPathForPage(page: PageKey) {
  return pagePaths[page];
}

export function buildPageUrl(pathname: string, lang: Lang) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const url = new URL(path || "/", `${getSiteUrl()}/`);
  url.searchParams.set("lang", lang);
  return url.toString();
}

export function buildAlternateLinks(pathname: string) {
  return languages.map(({ code }) => ({
    lang: code,
    href: buildPageUrl(pathname, code),
  }));
}
