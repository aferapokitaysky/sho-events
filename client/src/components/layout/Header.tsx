import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { BrandMark } from "@/components/Logo";
import { useLanguage } from "@/lib/LanguageContext";
import { useScrolled } from "@/lib/useScrolled";
import { languages } from "@/content";
import { IconClose, IconMenu, IconSearch } from "@/components/icons";
import { SearchModal } from "./SearchModal";

const navKeys = ["home", "about", "services", "formats", "partners", "contacts"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  home: "/",
  about: "/about",
  services: "/services",
  formats: "/formats",
  partners: "/partners",
  contacts: "/contacts",
};

export function Header() {
  const { t, lang, setLang } = useLanguage();
  const scrolled = useScrolled(30);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          solid ? "bg-ivory/90 shadow-[0_1px_0_rgba(36,21,17,0.08)] backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 sm:px-10">
          <Link to="/" data-cursor-hover>
            <BrandMark
              imgClassName="h-10 w-10"
              textClassName={clsx("transition-colors duration-500", solid ? "text-wine-800" : "text-ivory")}
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navKeys.map((key) => (
              <NavLink
                key={key}
                to={navPaths[key]}
                data-cursor-hover
                className={({ isActive }) =>
                  clsx(
                    "kicker relative py-1 transition-colors duration-300",
                    solid ? "text-ink-soft hover:text-wine-700" : "text-ivory/80 hover:text-ivory",
                    isActive && (solid ? "text-wine-700" : "text-ivory"),
                  )
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {t.nav[key]}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className={clsx("absolute -bottom-1.5 left-0 h-px w-full", solid ? "bg-wine-700" : "bg-ivory")}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              data-cursor-hover
              aria-label={t.common.searchPlaceholder}
              className={clsx("transition-colors duration-300", solid ? "text-ink-soft hover:text-wine-700" : "text-ivory/80 hover:text-ivory")}
            >
              <IconSearch className="h-[18px] w-[18px]" />
            </button>

            <div className={clsx("hidden items-center gap-1 kicker sm:flex", solid ? "text-ink-soft" : "text-ivory/80")}>
              {languages.map((l, i) => (
                <span key={l.code} className="flex items-center">
                  {i > 0 && <span className="mx-1 opacity-40">/</span>}
                  <button
                    type="button"
                    onClick={() => setLang(l.code)}
                    data-cursor-hover
                    className={clsx(
                      "transition-colors duration-300",
                      lang === l.code ? (solid ? "text-wine-700" : "text-ivory") : "hover:opacity-70",
                    )}
                  >
                    {l.label}
                  </button>
                </span>
              ))}
            </div>

            <Link
              to="/contacts"
              data-cursor-hover
              className={clsx(
                "kicker hidden whitespace-nowrap rounded-full px-5 py-2.5 transition-colors duration-300 sm:inline-flex",
                solid ? "bg-wine-800 text-ivory hover:bg-wine-700" : "bg-ivory text-wine-800 hover:bg-ivory/90",
              )}
            >
              {t.common.ctaBook}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              data-cursor-hover
              aria-label={menuOpen ? t.common.close : t.common.menu}
              className={clsx("lg:hidden", solid ? "text-ink" : "text-ivory")}
            >
              {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-ivory pt-[76px] lg:hidden"
          >
            <nav className="flex h-full flex-col justify-center gap-1 px-8 pb-24">
              {navKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={navPaths[key]}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      clsx("block border-b border-ink/10 py-4 text-4xl text-ink", isActive && "text-wine-700")
                    }
                  >
                    {t.nav[key]}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-8 flex items-center gap-4">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={clsx("kicker", lang === l.code ? "text-wine-700" : "text-ink-soft")}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
