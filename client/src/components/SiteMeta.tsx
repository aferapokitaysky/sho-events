import { useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export function SiteMeta() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t.meta.title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", t.meta.description);
  }, [t]);

  return null;
}
