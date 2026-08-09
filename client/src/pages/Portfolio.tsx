import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { ButtonLink } from "@/components/ui/Button";
import { ConnectingPath } from "@/components/ui/ConnectingPath";
import { fetchPortfolioPhotos, pick, type PublicPortfolioPhoto } from "@/lib/publicContent";
import heroPhotoDefault from "@/assets/photos/card-memorable-moments.webp";
import { useSiteImage } from "@/lib/useSiteImage";

const ROW_OFFSET = ["sm:mt-0", "sm:mt-20", "sm:mt-10"];

export default function Portfolio() {
  const { t, lang } = useLanguage();
  const heroPhoto = useSiteImage("portfolio_hero", heroPhotoDefault);
  const [photos, setPhotos] = useState<PublicPortfolioPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

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
            <div ref={containerRef} className="relative">
              <ConnectingPath containerRef={containerRef} itemRefs={itemRefs} count={photos.length} />
              <RevealStagger className="relative grid grid-cols-2 gap-16 sm:gap-24 lg:grid-cols-3">
                {photos.map((photo, i) => {
                  const title = pick(photo.title, lang);
                  const caption = pick(photo.caption, lang);
                  return (
                    <RevealItem key={photo.id} className={ROW_OFFSET[i % 3]}>
                      <div
                        ref={(el) => {
                          itemRefs.current[i] = el;
                        }}
                        className="group overflow-hidden rounded-2xl bg-paper shadow-soft"
                      >
                        <div className="aspect-[4/5] overflow-hidden">
                          <img
                            src={photo.imageUrl}
                            alt={title || "SHO Events"}
                            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                          />
                        </div>
                        {(title || caption) && (
                          <div className="p-4">
                            {title && <h3 className="text-base text-ink">{title}</h3>}
                            {caption && <p className="mt-1 text-sm leading-relaxed text-ink-soft/70">{caption}</p>}
                          </div>
                        )}
                      </div>
                    </RevealItem>
                  );
                })}
              </RevealStagger>
            </div>
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
