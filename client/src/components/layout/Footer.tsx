import { Link } from "react-router-dom";
import { BrandMark } from "@/components/Logo";
import { useLanguage } from "@/lib/LanguageContext";
import { IconInstagram, IconMail, IconPhone, IconPin, IconThreads, IconWhatsapp } from "@/components/icons";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

const navKeys = ["home", "about", "services", "formats", "partners", "contacts"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  home: "/",
  about: "/about",
  services: "/services",
  formats: "/formats",
  partners: "/partners",
  contacts: "/contacts",
};

export function Footer() {
  const { t } = useLanguage();
  const phone = t.contacts.channels.find((c) => c.id === "phone");
  const whatsapp = t.contacts.channels.find((c) => c.id === "whatsapp");
  const instagram = t.contacts.channels.find((c) => c.id === "instagram");
  const threads = t.contacts.channels.find((c) => c.id === "threads");
  const email = t.contacts.channels.find((c) => c.id === "email");

  return (
    <footer className="relative overflow-hidden bg-wine-950 pt-24 text-ivory">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true">
        <svg viewBox="0 0 400 400" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
          <circle cx="330" cy="360" r="220" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="330" cy="360" r="170" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <Container className="relative">
        <div className="grid gap-14 pb-16 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <Reveal>
            <BrandMark imgClassName="h-11 w-11" textClassName="text-ivory" />
            <p className="mt-6 max-w-xs text-balance font-display text-xl italic leading-relaxed text-ivory/70">
              «{t.home.quote}»
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="kicker text-beige-dark">{t.common.menu}</p>
            <ul className="mt-5 space-y-3">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link to={navPaths[key]} className="text-ivory/70 transition-colors hover:text-ivory" data-cursor-hover>
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="kicker text-beige-dark">{t.contacts.kicker}</p>
            <ul className="mt-5 space-y-3 text-ivory/70">
              <li className="flex items-center gap-2.5">
                <IconPin className="h-4 w-4 shrink-0 text-beige-dark" /> {t.contacts.city}
              </li>
              {phone && (
                <li>
                  <a href={phone.href} data-cursor-hover className="flex items-center gap-2.5 transition-colors hover:text-ivory">
                    <IconPhone className="h-4 w-4 shrink-0 text-beige-dark" /> {phone.value}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    className="flex items-center gap-2.5 transition-colors hover:text-ivory"
                  >
                    <IconWhatsapp className="h-4 w-4 shrink-0 text-beige-dark" /> {whatsapp.label}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={email.href} data-cursor-hover className="flex items-center gap-2.5 transition-colors hover:text-ivory">
                    <IconMail className="h-4 w-4 shrink-0 text-beige-dark" /> {email.value}
                  </a>
                </li>
              )}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="kicker text-beige-dark">{t.common.followUs}</p>
            <div className="mt-5 flex items-center gap-4">
              {whatsapp && (
                <a
                  href={whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  data-cursor-hover
                  className="rounded-full border border-ivory/20 p-3 text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
                >
                  <IconWhatsapp className="h-4 w-4" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  data-cursor-hover
                  className="rounded-full border border-ivory/20 p-3 text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
                >
                  <IconInstagram className="h-4 w-4" />
                </a>
              )}
              {threads && (
                <a
                  href={threads.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Threads"
                  data-cursor-hover
                  className="rounded-full border border-ivory/20 p-3 text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
                >
                  <IconThreads className="h-4 w-4" />
                </a>
              )}
            </div>
            <ButtonLink to="/contacts" variant="inverse" className="mt-8">
              {t.common.ctaBook}
            </ButtonLink>
          </Reveal>
        </div>

        <Divider className="text-ivory/20" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-ivory/45 sm:flex-row">
          <p>
            SHO Events — {new Date().getFullYear()}. {t.common.rights}.
          </p>
          <p className="font-script text-lg text-ivory/60">Made for Memorable Moments</p>
        </div>
      </Container>
    </footer>
  );
}
