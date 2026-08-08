const SITE_URL = (process.env.VITE_SITE_URL || "https://shoevents.sk").replace(/\/+$/, "");
const languages = ["ru", "en", "sk"];
const pages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.95" },
  { path: "/formats", changefreq: "monthly", priority: "0.9" },
  { path: "/partners", changefreq: "monthly", priority: "0.75" },
  { path: "/contacts", changefreq: "monthly", priority: "0.85" },
];

function pageUrl(path, lang) {
  const url = new URL(path, `${SITE_URL}/`);
  url.searchParams.set("lang", lang);
  return url.toString();
}

const urls = pages.flatMap((page) =>
  languages.map((lang) => {
    const alternates = languages
      .map(
        (alternateLang) =>
          `    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${pageUrl(page.path, alternateLang)}" />`,
      )
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page.path, "ru")}" />`)
      .join("\n");

    return `  <url>
    <loc>${pageUrl(page.path, lang)}</loc>
${alternates}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }),
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

process.stdout.write(sitemap);
