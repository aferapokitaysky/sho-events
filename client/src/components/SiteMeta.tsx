import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { languages } from "@/content";
import { languageNameByLang, localeByLang, seoByLang } from "@/content/seo";
import { buildAlternateLinks, buildPageUrl, getPageKey, getSiteUrl } from "@/lib/seo";

const BRAND_NAME = "SHO Events";
const PHONE = "+421918165503";
const EMAIL = "sho.events.sk@gmail.com";
const INSTAGRAM = "https://www.instagram.com/sho.events.sk";
const IMAGE_PATH = "/og-image.jpg";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([name, value]) => tag.setAttribute(name, value));
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = document.createElement("link");
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([name, value]) => tag.setAttribute(name, value));
}

function upsertJsonLd(id: string, data: unknown) {
  let tag = document.head.querySelector<HTMLScriptElement>(`script#${id}`);
  if (!tag) {
    tag = document.createElement("script");
    tag.id = id;
    tag.type = "application/ld+json";
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

export function SiteMeta() {
  const { lang, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const pageKey = getPageKey(location.pathname);
    const pageSeo = seoByLang[lang][pageKey];
    const canonical = buildPageUrl(location.pathname, lang);
    const siteUrl = getSiteUrl();
    const imageUrl = new URL(IMAGE_PATH, `${siteUrl}/`).toString();
    const alternateLinks = buildAlternateLinks(location.pathname);

    document.title = pageSeo.title;
    upsertMeta('meta[name="description"]', { name: "description", content: pageSeo.description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: pageSeo.keywords.join(", ") });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
    upsertMeta('meta[name="author"]', { name: "author", content: BRAND_NAME });
    upsertMeta('meta[name="language"]', { name: "language", content: languageNameByLang[lang] });

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonical });
    alternateLinks.forEach(({ lang: alternateLang, href }) => {
      upsertLink(`link[rel="alternate"][hreflang="${alternateLang}"]`, {
        rel: "alternate",
        hreflang: alternateLang,
        href,
      });
    });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: "alternate",
      hreflang: "x-default",
      href: buildPageUrl(location.pathname, "ru"),
    });

    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: BRAND_NAME });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: pageSeo.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: pageSeo.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    upsertMeta('meta[property="og:image:secure_url"]', { property: "og:image:secure_url", content: imageUrl });
    upsertMeta('meta[property="og:image:type"]', { property: "og:image:type", content: "image/jpeg" });
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: localeByLang[lang] });
    document.head
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach((tag) => tag.remove());
    languages
      .filter(({ code }) => code !== lang)
      .forEach(({ code }) => {
        upsertMeta(`meta[property="og:locale:alternate"][content="${localeByLang[code]}"]`, {
          property: "og:locale:alternate",
          content: localeByLang[code],
        });
      });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageSeo.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: pageSeo.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });

    upsertJsonLd("sho-organization-jsonld", {
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness", "EventService"],
      "@id": `${siteUrl}/#organization`,
      name: BRAND_NAME,
      url: siteUrl,
      logo: new URL("/favicon.svg", `${siteUrl}/`).toString(),
      image: imageUrl,
      description: t.meta.description,
      telephone: PHONE,
      email: EMAIL,
      sameAs: [INSTAGRAM, "https://www.threads.com/@sho.events.sk"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bratislava",
        addressCountry: "SK",
      },
      areaServed: [
        { "@type": "City", name: "Bratislava" },
        { "@type": "Country", name: "Slovakia" },
      ],
      knowsLanguage: ["ru", "en", "sk"],
      priceRange: "$$",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: PHONE,
        email: EMAIL,
        contactType: "customer service",
        availableLanguage: ["Russian", "English", "Slovak"],
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Event planning services",
        itemListElement: t.services.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
            areaServed: "Bratislava, Slovakia",
          },
        })),
      },
    });

    upsertJsonLd("sho-webpage-jsonld", {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: pageSeo.title,
      description: pageSeo.description,
      inLanguage: lang,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: BRAND_NAME,
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      about: { "@id": `${siteUrl}/#organization` },
    });
  }, [lang, location.pathname, t]);

  return null;
}
