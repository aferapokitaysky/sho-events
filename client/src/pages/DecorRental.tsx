import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { ButtonLink } from "@/components/ui/Button";
import { fetchDecorItems, pick, type PublicDecorItem } from "@/lib/publicContent";
import heroPhoto from "@/assets/photos/table-bright.webp";

export default function DecorRental() {
  const { t, lang } = useLanguage();
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
              {items.map((item) => {
                const name = pick(item.name, lang);
                const description = pick(item.description, lang);
                return (
                  <RevealItem key={item.id}>
                    <div className="overflow-hidden rounded-2xl bg-ivory shadow-soft">
                      <div className="aspect-[4/3] bg-cream">
                        {item.images[0] && (
                          <img src={item.images[0].url} alt={name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl text-ink">{name}</h3>
                        {description && <p className="mt-2 text-sm leading-relaxed text-ink-soft/70">{description}</p>}
                        {item.price && <p className="mt-3 kicker text-wine-700">{item.price}</p>}
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
