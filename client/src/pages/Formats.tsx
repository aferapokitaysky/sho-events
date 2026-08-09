import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { IconSparkle } from "@/components/icons";
import { fetchFormats, pick, type PublicFormat } from "@/lib/publicContent";
import bannerPhotoDefault from "@/assets/photos/hero-formats-band.webp";
import { useSiteImage } from "@/lib/useSiteImage";

export default function Formats() {
  const { t, lang } = useLanguage();
  const bannerPhoto = useSiteImage("formats_hero", bannerPhotoDefault);
  const [formats, setFormats] = useState<PublicFormat[]>([]);

  useEffect(() => {
    fetchFormats()
      .then(setFormats)
      .catch(() => setFormats([]));
  }, []);

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
            {formats.map((format, i) => {
              const title = pick(format.title, lang);
              const description = pick(format.description, lang);
              const isLastAlone = i === formats.length - 1 && formats.length % 3 === 1;
              return (
                <RevealItem key={format.id} className={isLastAlone ? "sm:col-span-2 lg:col-span-3" : undefined}>
                  <div className="group relative flex h-full scroll-mt-32 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-paper p-9 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card">
                    {format.imageUrl && (
                      <>
                        <img
                          src={format.imageUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-wine-950/88 via-wine-950/35 to-wine-950/5" />
                      </>
                    )}
                    <IconSparkle className={format.imageUrl ? "relative h-9 w-9 text-beige-dark" : "h-9 w-9 text-wine-700"} />
                    <div className={format.imageUrl ? "relative mt-10" : "mt-10"}>
                      <h3 className={format.imageUrl ? "text-2xl text-ivory" : "text-2xl text-ink"}>{title}</h3>
                      <p className={format.imageUrl ? "mt-2 text-sm leading-relaxed text-ivory/70" : "mt-2 text-sm leading-relaxed text-ink-soft/70"}>
                        {description}
                      </p>
                    </div>
                    {!format.imageUrl && (
                      <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-wine-700/0 blur-2xl transition-colors duration-500 group-hover:bg-wine-700/10" />
                    )}
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
