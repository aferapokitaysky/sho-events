import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider, Kicker, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import heroPhotoDefault from "@/assets/photos/table-candlelit-dark.webp";
import { useSiteImage } from "@/lib/useSiteImage";
import {
  IconArrowRight,
  IconBriefcase,
  IconCandle,
  IconCube,
  IconGlass,
  IconGrapes,
  IconHandshake,
  IconPalette,
  IconQuote,
  IconRing,
  IconSparkle,
} from "@/components/icons";
import { Link } from "react-router-dom";

const serviceIconsById: Record<string, typeof IconSparkle> = {
  turnkey: IconSparkle,
  brunchMasterclass: IconPalette,
  corporate: IconBriefcase,
  figures3d: IconCube,
  dating: IconRing,
  rentalDecor: IconGlass,
};

export default function Home() {
  const { t } = useLanguage();
  const heroPhoto = useSiteImage("home_hero", heroPhotoDefault);

  return (
    <div>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-wine-950 text-ivory">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src={heroPhoto}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.55, scale: 1 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-wine-950/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(140,32,41,0.35),transparent_60%)]" />
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: "linear-gradient(180deg, transparent 0%, rgba(28,5,9,0.9) 100%)",
          }} />
        </div>

        <Container className="relative flex w-full flex-col pb-16 pt-40 sm:pb-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Kicker dark>{t.home.heroKicker}</Kicker>
          </motion.div>

          <h1 className="mt-7 max-w-4xl text-balance text-[3.2rem] leading-[1.02] sm:text-[5.6rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.home.heroTitleTop}{" "}
              <span className="font-script text-[1.2em] italic text-beige-dark">{t.home.heroTitleScript}</span>
            </motion.span>
            <motion.span
              className="block text-ivory/85"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.home.heroTitleBottom}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-8 max-w-md text-balance text-lg leading-relaxed text-ivory/65"
          >
            {t.home.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <ButtonLink to="/contacts" variant="inverse">
              {t.home.heroCtaPrimary}
            </ButtonLink>
            <ButtonLink to="/services" variant="outline-inverse">
              {t.home.heroCtaSecondary}
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 grid grid-cols-2 gap-6 border-t border-ivory/15 pt-8 sm:mt-24 sm:grid-cols-4"
          >
            {t.home.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl text-beige-dark sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-ivory/55">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </Container>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/50 sm:flex"
        >
          <span className="kicker text-[0.65rem]">{t.common.scrollHint}</span>
          <span className="h-10 w-px bg-ivory/30" />
        </motion.div>
      </section>

      <section className="py-28 sm:py-36">
        <Container className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <SectionHeading kicker={t.home.introKicker} title={t.home.introTitle} lead={t.home.introText} />
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-[2rem] bg-wine-900 px-10 py-14 text-ivory shadow-card">
              <IconQuote className="h-8 w-14 text-beige-dark/70" />
              <p className="mt-6 font-display text-3xl italic leading-snug text-balance sm:text-4xl">
                {t.home.quote}
              </p>
              <p className="mt-6 kicker text-beige-dark">{t.home.quoteAuthor}</p>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-wine-700/40 blur-3xl" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper py-28 sm:py-36">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <SectionHeading kicker={t.home.servicesKicker} title={t.home.servicesTitle} lead={t.home.servicesText} className="max-w-xl" />
            <Reveal delay={0.1}>
              <ButtonLink to="/services" variant="outline" className="shrink-0">
                {t.common.ctaViewAll}
              </ButtonLink>
            </Reveal>
          </div>

          <RevealStagger className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.services.map((service) => {
              const Icon = serviceIconsById[service.id] ?? IconSparkle;
              return (
                <RevealItem key={service.id}>
                  <Link
                    to={`/services#${service.id}`}
                    data-cursor-hover
                    className="group flex h-full flex-col justify-between bg-ivory p-9 transition-colors duration-500 hover:bg-wine-900"
                  >
                    <Icon className="h-8 w-8 text-wine-700 transition-colors duration-500 group-hover:text-beige-dark" />
                    <div className="mt-10">
                      <h3 className="text-2xl text-ink transition-colors duration-500 group-hover:text-ivory">{service.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft/70 transition-colors duration-500 group-hover:text-ivory/60">
                        {service.description}
                      </p>
                    </div>
                    <IconArrowRight className="mt-8 h-5 w-5 text-ink-soft/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-beige-dark" />
                  </Link>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </Container>
      </section>

      <section className="overflow-hidden bg-wine-950 py-20 text-ivory">
        <Container>
          <SectionHeading kicker={t.home.formatsKicker} title={t.home.formatsTitle} dark center />
        </Container>
        <div className="mt-14 space-y-6">
          <Marquee duration={62} reverse>
            {t.formats.formats.map((f) => (
              <span key={f.id} className="flex items-center gap-6 whitespace-nowrap">
                <span className="font-display text-3xl italic text-ivory/70 sm:text-4xl">{f.title}</span>
                <IconSparkle className="h-5 w-5 text-beige-dark" />
              </span>
            ))}
          </Marquee>
          <Marquee duration={72}>
            {t.formats.formats
              .slice()
              .reverse()
              .map((f) => (
                <span key={f.id} className="flex items-center gap-6 whitespace-nowrap">
                  <span className="font-display text-3xl text-beige-dark/50 sm:text-4xl">{f.title}</span>
                  <IconCandle className="h-5 w-5 text-ivory/40" />
                </span>
              ))}
          </Marquee>
        </div>
      </section>

      <section className="bg-wine-950 py-28 text-ivory sm:py-36">
        <Container>
          <SectionHeading kicker={t.home.processKicker} title={t.home.processTitle} dark center className="mx-auto" />
          <RevealStagger className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.processSteps.map((step) => (
              <RevealItem key={step.number}>
                <p className="font-display text-5xl text-beige-dark">{step.number}</p>
                <h3 className="mt-4 text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/65">{step.text}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <Reveal>
            <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-wine-900 px-8 py-14 text-ivory shadow-card sm:px-16 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <Kicker dark>{t.home.partnersKicker}</Kicker>
                <h2 className="mt-5 max-w-lg text-balance text-[2.3rem] leading-tight sm:text-[2.9rem]">
                  {t.home.partnersTitle}
                </h2>
                <p className="mt-5 max-w-md text-ivory/70">{t.home.partnersText}</p>
                <ButtonLink to="/partners" variant="inverse" className="mt-9">
                  {t.nav.partners}
                </ButtonLink>
              </div>
              <div className="flex flex-wrap gap-4">
                {[IconHandshake, IconBriefcase, IconGrapes, IconCube].map((Icon, i) => (
                  <div key={i} className="flex h-24 w-24 items-center justify-center rounded-2xl bg-ivory text-wine-700 shadow-card">
                    <Icon className="h-8 w-8" />
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-wine-700/50 blur-3xl" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-28 sm:py-36">
        <Container className="flex flex-col items-center text-center">
          <Divider className="mb-10" />
          <Reveal>
            <h2 className="max-w-2xl text-balance text-[2.6rem] leading-tight text-ink sm:text-[3.4rem]">{t.home.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-balance text-lg text-ink-soft/80">{t.home.ctaText}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <ButtonLink to="/contacts" className="mt-10">
              {t.common.ctaConsult}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
