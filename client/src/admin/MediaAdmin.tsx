import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  siteImagesApi,
  servicesApi,
  decorApi,
  formatsApi,
  portfolioApi,
  uploadImage,
  type SiteImageSlot,
} from "@/lib/adminApi";
import homeHeroDefault from "@/assets/photos/table-candlelit-dark.webp";
import aboutHeroDefault from "@/assets/photos/hero-about-band.webp";
import servicesHeroDefault from "@/assets/photos/hero-services-band.webp";
import formatsHeroDefault from "@/assets/photos/hero-formats-band.webp";
import partnersHeroDefault from "@/assets/photos/hero-partners-band.webp";
import contactsHeroDefault from "@/assets/photos/hero-contacts-band.webp";
import decorHeroDefault from "@/assets/photos/table-bright.webp";
import portfolioHeroDefault from "@/assets/photos/card-memorable-moments.webp";

const DEFAULT_IMAGES: Record<string, string> = {
  home_hero: homeHeroDefault,
  about_hero: aboutHeroDefault,
  services_hero: servicesHeroDefault,
  formats_hero: formatsHeroDefault,
  partners_hero: partnersHeroDefault,
  contacts_hero: contactsHeroDefault,
  decor_hero: decorHeroDefault,
  portfolio_hero: portfolioHeroDefault,
};

interface GalleryEntry {
  url: string;
  label: string;
  source: string;
}

export default function MediaAdmin() {
  const [slots, setSlots] = useState<SiteImageSlot[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryEntry[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  function refreshSlots() {
    siteImagesApi.list().then((res) => {
      setSlots(res.slots);
      setImages(res.images);
    });
  }

  function refreshGallery() {
    setLoadingGallery(true);
    Promise.all([servicesApi.list(), decorApi.list(), formatsApi.list(), portfolioApi.list()])
      .then(([services, decor, formats, portfolio]) => {
        const entries: GalleryEntry[] = [];
        services.forEach((s) => {
          if (s.imageUrl) entries.push({ url: s.imageUrl, label: s.title.ru, source: "Услуга" });
        });
        decor.forEach((d) => {
          d.images.forEach((img, i) => {
            entries.push({ url: img.url, label: `${d.name.ru}${d.images.length > 1 ? ` (фото ${i + 1})` : ""}`, source: "Аренда декора" });
          });
        });
        formats.forEach((f) => {
          if (f.imageUrl) entries.push({ url: f.imageUrl, label: f.title.ru, source: "Формат" });
        });
        portfolio.forEach((p) => {
          entries.push({ url: p.imageUrl, label: p.title.ru || "Без названия", source: p.published ? "Портфолио" : "Портфолио (черновик)" });
        });
        setGallery(entries);
      })
      .finally(() => setLoadingGallery(false));
  }

  useEffect(() => {
    refreshSlots();
    refreshGallery();
  }, []);

  async function handleSlotUpload(key: string, file: File) {
    setUploadingKey(key);
    try {
      const url = await uploadImage(file);
      await siteImagesApi.set(key, url);
      refreshSlots();
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSlotReset(key: string) {
    await siteImagesApi.set(key, null);
    refreshSlots();
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Медиа</h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Фоновые фото на первом экране каждой страницы, и сводный просмотр всех фото на сайте в одном месте.
      </p>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-ink">Фоновые фото страниц</h2>
        <p className="mt-1 text-xs text-ink-soft/50">
          Ниже — то фото, которое сейчас реально показывается на сайте. Метка показывает, стандартное оно или загруженное вами.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {slots.map((slot) => {
            const custom = images[slot.key];
            const effective = custom || DEFAULT_IMAGES[slot.key];
            return (
              <div key={slot.key} className="overflow-hidden rounded-xl border border-ink/10 bg-ivory">
                <div className="relative aspect-[4/3] bg-cream">
                  {effective && <img src={effective} alt="" className="h-full w-full object-cover" />}
                  <span
                    className={clsx(
                      "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[0.65rem]",
                      custom ? "bg-wine-800 text-ivory" : "bg-ivory/90 text-ink-soft/70",
                    )}
                  >
                    {custom ? "своё фото" : "по умолчанию"}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs text-ink">{slot.label}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <label className="cursor-pointer text-wine-700 hover:underline">
                      {uploadingKey === slot.key ? "Загрузка…" : "Заменить"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingKey !== null}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSlotUpload(slot.key, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {custom && (
                      <button onClick={() => handleSlotReset(slot.key)} className="text-ink-soft hover:underline">
                        Вернуть по умолчанию
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-sm font-medium text-ink">Все фото на сайте ({gallery.length})</h2>
        <p className="mt-1 text-xs text-ink-soft/50">
          Собрано из услуг, аренды декора, форматов и портфолио. Изменить можно на соответствующей вкладке.
        </p>
        {loadingGallery ? (
          <p className="mt-4 text-sm text-ink-soft/50">Загрузка…</p>
        ) : gallery.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft/40">Пока фото не загружены</p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {gallery.map((entry, i) => (
              <div key={`${entry.url}-${i}`} className="overflow-hidden rounded-lg border border-ink/10 bg-ivory">
                <div className="aspect-square bg-cream">
                  <img src={entry.url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="truncate text-[0.7rem] text-ink-soft/50">{entry.source}</p>
                  <p className="truncate text-xs text-ink">{entry.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
