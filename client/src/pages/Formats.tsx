import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import {
  IconBriefcase,
  IconCandle,
  IconGift,
  IconGlass,
  IconGrapes,
  IconPalette,
  IconRing,
  IconSparkle,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";
import bannerPhoto from "@/assets/photos/hero-formats-band.webp";

const formatIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  romantic: IconRing,
  brunch: IconGlass,
  tasting: IconGrapes,
  masterclass: IconPalette,
  private: IconGift,
  corporate: IconBriefcase,
  brand: IconSparkle,
  seasonal: IconCandle,
};

export default function Formats() {
  const { t } = useLanguage();

  return (
    <div>
      <PhotoBandHero
        kicker={t.formats.kicker}
        title={t.formats.title}
        lead={t.formats.lead}
        image={bannerPhoto}
        alt="SHO Events"
        objectPosition="65% 45%"
      />

      <section className="py-24 sm:py-32">
        <Container>
          <RevealStagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.formats.formats.map((format) => {
              const Icon = formatIcons[format.id] ?? IconSparkle;
              return (
                <RevealItem key={format.id}>
                  <div
                    id={format.id}
                    className="group relative flex h-full scroll-mt-32 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-paper p-9 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
                  >
                    <Icon className="h-9 w-9 text-wine-700" />
                    <div className="mt-10">
                      <h3 className="text-2xl text-ink">{format.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft/70">{format.description}</p>
                    </div>
                    <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-wine-700/0 blur-2xl transition-colors duration-500 group-hover:bg-wine-700/10" />
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </Container>
      </section>

      <section className="pb-28 sm:pb-36">
        <Container className="flex flex-col items-center text-center">
          <Divider className="mb-10" />
          <Reveal>
            <h2 className="max-w-xl text-balance text-[2.4rem] leading-tight text-ink sm:text-[3rem]">{t.formats.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-ink-soft/80">{t.formats.ctaText}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <ButtonLink to="/contacts" className="mt-9">
              {t.common.ctaBook}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
