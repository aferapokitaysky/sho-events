import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider, Kicker, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { ButtonLink } from "@/components/ui/Button";
import { IconHandshake, IconLeaf, IconSparkle, IconStar } from "@/components/icons";
import quotePhoto from "@/assets/photos/table-candlelit-dark.webp";
import storyPhotoRu from "@/assets/photos/envelope-about.webp";
import storyPhotoEn from "@/assets/photos/aboutusEN.webp";
import storyPhotoSk from "@/assets/photos/aboutusclovac.webp";
import heroPhoto from "@/assets/photos/hero-about-band.webp";
import type { Lang } from "@/content";

const valueIcons = [IconStar, IconSparkle, IconLeaf, IconHandshake];
const storyPhotos: Record<Lang, string> = { ru: storyPhotoRu, en: storyPhotoEn, sk: storyPhotoSk };

export default function About() {
  const { t, lang } = useLanguage();

  return (
    <div>
      <PhotoBandHero
        kicker={t.about.kicker}
        title={t.about.title}
        lead={t.about.lead}
        image={heroPhoto}
        alt="SHO Events"
        objectPosition="60% 55%"
      />

      <section className="py-28 sm:py-36">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-card">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lang}
                  src={storyPhotos[lang]}
                  alt="SHO Events"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
          </Reveal>

          <div>
            <Kicker>{t.about.storyKicker}</Kicker>
            <h2 className="mt-5 text-balance text-[2.4rem] leading-tight text-ink sm:text-[3rem]">{t.about.storyTitle}</h2>
            <div className="mt-8 space-y-5">
              {t.about.storyParagraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="text-lg leading-relaxed text-ink-soft/80">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-wine-950 py-28 text-ivory">
        <img src={quotePhoto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-wine-950/70 via-wine-950/85 to-wine-950/70" />
        <Container className="relative flex flex-col items-center text-center">
          <Reveal>
            <p className="mx-auto max-w-2xl text-balance font-display text-3xl italic leading-snug sm:text-4xl">
              «{t.about.quote}»
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper py-28 sm:py-36">
        <Container>
          <SectionHeading kicker={t.about.valuesKicker} title={t.about.valuesTitle} center className="mx-auto" />
          <RevealStagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.about.values.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <RevealItem key={v.title}>
                  <div className="h-full rounded-2xl bg-ivory p-8 shadow-card">
                    <Icon className="h-7 w-7 text-wine-700" />
                    <h3 className="mt-6 text-2xl text-ink">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft/70">{v.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </Container>
      </section>

      <section className="py-28 sm:py-36">
        <Container>
          <SectionHeading kicker={t.about.approachKicker} title={t.about.approachTitle} />
          <div className="mt-16 divide-y divide-ink/10 border-y border-ink/10">
            {t.about.approachSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <div className="grid gap-4 py-8 sm:grid-cols-[100px_1fr_2fr] sm:items-center">
                  <span className="font-display text-3xl text-beige-dark">0{i + 1}</span>
                  <h3 className="text-2xl text-ink">{step.title}</h3>
                  <p className="text-ink-soft/75">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-28 sm:pb-36">
        <Container className="flex flex-col items-center text-center">
          <Divider className="mb-10" />
          <Reveal>
            <h2 className="max-w-xl text-balance text-[2.4rem] leading-tight text-ink sm:text-[3rem]">{t.about.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-ink-soft/80">{t.about.ctaText}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <ButtonLink to="/contacts" className="mt-9">
              {t.common.ctaWriteUs}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
