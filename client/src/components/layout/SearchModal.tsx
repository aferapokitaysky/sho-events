import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { IconArrowUpRight, IconClose, IconSearch } from "@/components/icons";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const index = useMemo(() => {
    const items: { title: string; group: string; path: string }[] = [];
    (Object.keys(t.nav) as (keyof typeof t.nav)[]).forEach((key) => {
      const paths: Record<string, string> = {
        home: "/",
        about: "/about",
        services: "/services",
        formats: "/formats",
        decor: "/decor",
        portfolio: "/portfolio",
        partners: "/partners",
        contacts: "/contacts",
      };
      items.push({ title: t.nav[key], group: t.common.menu, path: paths[key] });
    });
    t.services.services.forEach((s) => {
      items.push({ title: s.title, group: t.services.kicker, path: `/services#${s.id}` });
    });
    t.formats.formats.forEach((f) => {
      items.push({ title: f.title, group: t.formats.kicker, path: `/formats#${f.id}` });
    });
    return items;
  }, [t]);

  const results = useMemo(() => {
    if (!query.trim()) return index;
    const q = query.trim().toLowerCase();
    return index.filter((item) => item.title.toLowerCase().includes(q));
  }, [index, query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-wine-950/70 px-6 pt-[14vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-ivory shadow-soft"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-6 py-5">
              <IconSearch className="h-5 w-5 shrink-0 text-ink-soft" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.common.searchPlaceholder}
                className="w-full bg-transparent text-lg text-ink placeholder:text-ink-soft/50 focus:outline-none"
              />
              <button type="button" onClick={onClose} aria-label={t.common.close}>
                <IconClose className="h-5 w-5 text-ink-soft" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <p className="px-6 py-8 text-center text-ink-soft/70">{t.common.searchNoResults}</p>
              ) : (
                results.map((item, i) => (
                  <button
                    key={item.path + i}
                    onClick={() => go(item.path)}
                    className="flex w-full items-center justify-between px-6 py-3.5 text-left transition-colors hover:bg-cream/60"
                  >
                    <span>
                      <span className="block text-lg text-ink">{item.title}</span>
                      <span className="kicker text-ink-soft/50">{item.group}</span>
                    </span>
                    <IconArrowUpRight className="h-4 w-4 text-ink-soft/40" />
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
