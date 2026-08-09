import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { ButtonLink } from "@/components/ui/Button";
import { fetchPortfolioPhotos, pick, type PublicPortfolioPhoto } from "@/lib/publicContent";
import heroPhoto from "@/assets/photos/card-memorable-moments.webp";

export default function Portfolio() {
  const { t, lang } = useLanguage();
  const [photos, setPhotos] = useState<PublicPortfolioPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioPhotos()
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PhotoBandHero
        kicker={t.portfolio.kicker}
        title={t.portfolio.title}
        lead={t.portfolio.lead}
        image={heroPhoto}
        alt="SHO Events"
        objectPosition="50% 45%"
      />

      <section className="py-24 sm:py-32">
        <Container>
          {!loading && photos.length === 0 ? (
            <p className="text-center text-ink-soft/50">{t.portfolio.emptyText}</p>
          ) : (
            <RevealStagger className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
              {photos.map((photo) => {
                const caption = pick(photo.caption, lang);
                return (
                  <RevealItem key={photo.id} className="break-inside-avoid">
                    <div className="overflow-hidden rounded-2xl bg-ivory shadow-soft">
                      <img src={photo.imageUrl} alt={caption || "SHO Events"} className="w-full object-cover" />
                      {caption && <p className="p-4 text-sm text-ink-soft/70">{caption}</p>}
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
            <h2 className="max-w-xl text-balance text-[2.4rem] leading-tight text-ink sm:text-[3rem]">{t.portfolio.ctaTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-ink-soft/80">{t.portfolio.ctaText}</p>
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
