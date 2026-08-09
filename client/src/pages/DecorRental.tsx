import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { ButtonLink } from "@/components/ui/Button";
import { IconGlass } from "@/components/icons";
import { fetchDecorItems, pick, type PublicDecorItem } from "@/lib/publicContent";
import heroPhotoDefault from "@/assets/photos/table-bright.webp";
import { useSiteImage } from "@/lib/useSiteImage";

export default function DecorRental() {
  const { t, lang } = useLanguage();
  const heroPhoto = useSiteImage("decor_hero", heroPhotoDefault);
  const [items, setItems] = useState<PublicDecorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecorItems()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PhotoBandHero
        kicker={t.decor.kicker}
        title={t.decor.title}
        lead={t.decor.lead}
        image={heroPhoto}
        alt="SHO Events"
        objectPosition="50% 60%"
      />

      <section className="py-24 sm:py-32">
        <Container>
          {!loading && items.length === 0 ? (
            <p className="text-center text-ink-soft/50">{t.decor.emptyText}</p>
          ) : (
            <RevealStagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => {
                const name = pick(item.name, lang);
                const description = pick(item.description, lang);
                const isLastAlone = i === items.length - 1 && items.length % 3 === 1;
                return (
                  <RevealItem key={item.id} className={isLastAlone ? "sm:col-span-2 lg:col-span-3" : undefined}>
                    <div
                      className={
                        isLastAlone
                          ? "group grid gap-0 overflow-hidden rounded-[1.75rem] bg-paper shadow-soft sm:grid-cols-2"
                          : "group overflow-hidden rounded-[1.75rem] bg-paper shadow-soft"
                      }
                    >
                      <div className={isLastAlone ? "relative aspect-[4/3] overflow-hidden sm:aspect-auto" : "relative aspect-[4/3] overflow-hidden"}>
                        {item.images[0] ? (
                          <img
                            src={item.images[0].url}
                            alt={name}
                            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-cream">
                            <IconGlass className="h-9 w-9 text-wine-700/40" />
                          </div>
                        )}
                        {item.price && (
                          <span className="absolute bottom-4 left-4 rounded-full bg-ivory/90 px-4 py-1.5 text-sm text-wine-800 shadow-soft backdrop-blur-sm">
                            {item.price}
                          </span>
                        )}
                      </div>
                      <div className={isLastAlone ? "flex flex-col justify-center p-8 sm:p-10" : "p-6"}>
                        <h3 className={isLastAlone ? "text-2xl text-ink" : "text-xl text-ink"}>{name}</h3>
                        {description && (
                          <p className="mt-2 text-sm leading-relaxed text-ink-soft/70">{description}</p>
                        )}
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          )}
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container className="flex flex-col items-center text-center">
          <Divider className="mb-10" />
          <Reveal>
            <h2 className="max-w-xl text-balance text-[2.4rem] leading-tight text-ink sm:text-[3rem]">{t.decor.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-ink-soft/80">{t.decor.ctaText}</p>
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
