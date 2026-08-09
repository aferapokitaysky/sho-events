import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { ButtonLink } from "@/components/ui/Button";
import { IconArrowUpRight, IconSparkle } from "@/components/icons";
import { Link } from "react-router-dom";
import { fetchServices, pick, type PublicService } from "@/lib/publicContent";
import heroPhoto from "@/assets/photos/hero-services-band.webp";

export default function Services() {
  const { t, lang } = useLanguage();
  const [services, setServices] = useState<PublicService[]>([]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

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
            {services.map((service) => {
              const title = pick(service.title, lang);
              const description = pick(service.description, lang);
              return (
                <RevealItem key={service.id}>
                  {service.imageUrl ? (
                    <div className="group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden p-9">
                      <img
                        src={service.imageUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-wine-950/92 via-wine-950/45 to-wine-950/10" />
                      <IconSparkle className="relative h-8 w-8 text-beige-dark" />
                      <div className="relative">
                        <h3 className="text-2xl text-ivory">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ivory/70">{description}</p>
                        {service.price && <p className="mt-3 kicker text-beige-dark">{service.price}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="group flex h-full min-h-[300px] flex-col justify-between bg-paper p-9 transition-colors duration-500 hover:bg-wine-900">
                      <IconSparkle className="h-8 w-8 text-wine-700 transition-colors duration-500 group-hover:text-beige-dark" />
                      <div>
                        <h3 className="text-2xl text-ink transition-colors duration-500 group-hover:text-ivory">{title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft/70 transition-colors duration-500 group-hover:text-ivory/60">
                          {description}
                        </p>
                        {service.price && (
                          <p className="mt-3 kicker text-wine-700 transition-colors duration-500 group-hover:text-beige-dark">
                            {service.price}
                          </p>
                        )}
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
