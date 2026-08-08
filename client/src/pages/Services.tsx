import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { ButtonLink } from "@/components/ui/Button";
import {
  IconArrowUpRight,
  IconBriefcase,
  IconCube,
  IconGlass,
  IconPalette,
  IconRing,
  IconSparkle,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";
import rentalPhoto from "@/assets/photos/table-bright.webp";
import sculpturePhoto from "@/assets/photos/figure-hippo.webp";
import heroPhoto from "@/assets/photos/hero-services-band.webp";

const serviceIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  turnkey: IconSparkle,
  brunchMasterclass: IconPalette,
  corporate: IconBriefcase,
  figures3d: IconCube,
  dating: IconRing,
  rentalDecor: IconGlass,
};

const servicePhotos: Record<string, string> = {
  figures3d: sculpturePhoto,
  rentalDecor: rentalPhoto,
};

export default function Services() {
  const { t } = useLanguage();

  return (
    <div>
      <PhotoBandHero
        kicker={t.services.kicker}
        title={t.services.title}
        lead={t.services.lead}
        image={heroPhoto}
        alt="SHO Events"
        objectPosition="45% 50%"
      />

      <section className="py-24 sm:py-32">
        <Container>
          <RevealStagger className="grid gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.services.map((service) => {
              const Icon = serviceIcons[service.id] ?? IconSparkle;
              const photo = servicePhotos[service.id];
              return (
                <RevealItem key={service.id}>
                  {photo ? (
                    <div
                      id={service.id}
                      className="group relative flex h-full min-h-[300px] scroll-mt-32 flex-col justify-between overflow-hidden p-9"
                    >
                      <img
                        src={photo}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-wine-950/92 via-wine-950/45 to-wine-950/10" />
                      <Icon className="relative h-8 w-8 text-beige-dark" />
                      <div className="relative">
                        <h3 className="text-2xl text-ivory">{service.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ivory/70">{service.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      id={service.id}
                      className="group flex h-full min-h-[300px] scroll-mt-32 flex-col justify-between bg-ivory p-9 transition-colors duration-500 hover:bg-wine-900"
                    >
                      <Icon className="h-8 w-8 text-wine-700 transition-colors duration-500 group-hover:text-beige-dark" />
                      <div>
                        <h3 className="text-2xl text-ink transition-colors duration-500 group-hover:text-ivory">{service.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft/70 transition-colors duration-500 group-hover:text-ivory/60">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  )}
                </RevealItem>
              );
            })}
            <RevealItem className="sm:col-span-2 lg:col-span-3">
              <Link
                to="/contacts"
                data-cursor-hover
                className="group flex h-full flex-col items-start justify-center gap-3 bg-wine-800 p-9 text-ivory transition-colors duration-500 hover:bg-wine-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <p className="text-xl leading-snug">{t.services.ctaTitle}</p>
                  <span className="kicker text-beige-dark">{t.common.ctaConsult}</span>
                </span>
                <IconArrowUpRight className="h-7 w-7 text-beige-dark transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </RevealItem>
          </RevealStagger>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container className="flex flex-col items-center text-center">
          <Divider className="mb-10" />
          <Reveal>
            <h2 className="max-w-xl text-balance text-[2.4rem] leading-tight text-ink sm:text-[3rem]">{t.services.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-ink-soft/80">{t.services.ctaText}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <ButtonLink to="/contacts" className="mt-9">
              {t.common.ctaConsult}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
