import { useEffect, useState } from "react";
import clsx from "clsx";
import { servicesApi, translateText, type AdminService } from "@/lib/adminApi";
import { ImageUploader } from "@/admin/components/ImageUploader";
import { IconSparkle } from "@/components/icons";

interface DraftService {
  id: number | null;
  titleRu: string;
  descriptionRu: string;
  price: string;
  imageUrl: string | null;
}

const EMPTY_DRAFT: DraftService = { id: null, titleRu: "", descriptionRu: "", price: "", imageUrl: null };

function ServicePreviewCard({ title, description, imageUrl }: { title: string; description: string; imageUrl: string | null }) {
  if (imageUrl) {
    return (
      <div className="group relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl p-7">
        <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-950/92 via-wine-950/45 to-wine-950/10" />
        <IconSparkle className="relative h-7 w-7 text-beige-dark" />
        <div className="relative">
          <h3 className="text-xl text-ivory">{title || "Название услуги"}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">{description || "Описание услуги"}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full min-h-[240px] flex-col justify-between rounded-2xl bg-paper p-7">
      <IconSparkle className="h-7 w-7 text-wine-700" />
      <div>
        <h3 className="text-xl text-ink">{title || "Название услуги"}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft/70">{description || "Описание услуги"}</p>
      </div>
    </div>
  );
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DraftService>(EMPTY_DRAFT);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    servicesApi
      .list()
      .then(setServices)
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function editService(service: AdminService) {
    setDraft({
      id: service.id,
      titleRu: service.title.ru,
      descriptionRu: service.description.ru,
      price: service.price ?? "",
      imageUrl: service.imageUrl,
    });
  }

  function resetDraft() {
    setDraft(EMPTY_DRAFT);
    setError(null);
  }

  async function handleSave() {
    if (!draft.titleRu.trim() || !draft.descriptionRu.trim()) {
      setError("Заполните название и описание");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const [title, description] = await Promise.all([
        translateText(draft.titleRu, "ru"),
        translateText(draft.descriptionRu, "ru"),
      ]);
      const payload = {
        title,
        description,
        price: draft.price.trim() || null,
        imageUrl: draft.imageUrl,
      };
      if (draft.id) {
        await servicesApi.update(draft.id, payload);
      } else {
        await servicesApi.create(payload);
      }
      resetDraft();
      refresh();
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
      setTranslating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить эту услугу?")) return;
    await servicesApi.remove(id);
    if (draft.id === id) resetDraft();
    refresh();
  }

  async function moveService(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= services.length) return;
    const a = services[index];
    const b = services[target];
    await Promise.all([
      servicesApi.update(a.id, { sortOrder: b.sortOrder }),
      servicesApi.update(b.id, { sortOrder: a.sortOrder }),
    ]);
    refresh();
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Услуги</h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Введите текст на русском — при сохранении он автоматически переведётся на английский и словацкий.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-ink/10 bg-ivory p-6">
            <h2 className="text-sm font-medium text-ink">{draft.id ? "Редактирование услуги" : "Новая услуга"}</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Название</label>
                <input
                  value={draft.titleRu}
                  onChange={(e) => setDraft((d) => ({ ...d, titleRu: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="Например: Организация фотосессий"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Описание</label>
                <textarea
                  value={draft.descriptionRu}
                  onChange={(e) => setDraft((d) => ({ ...d, descriptionRu: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="Короткое описание услуги"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Цена (необязательно)</label>
                <input
                  value={draft.price}
                  onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="например: от 350 €"
                />
              </div>
              <ImageUploader value={draft.imageUrl} onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))} />
            </div>

            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-wine-800 px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-wine-700 disabled:opacity-50"
              >
                {saving ? (translating ? "Переводим…" : "Сохраняем…") : draft.id ? "Сохранить" : "Добавить"}
              </button>
              {draft.id && (
                <button
                  onClick={resetDraft}
                  className="rounded-full border border-ink/15 px-6 py-2.5 text-sm text-ink-soft hover:border-wine-700 hover:text-wine-700"
                >
                  Отмена
                </button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-medium text-ink">Список услуг ({services.length})</h2>
            {loading ? (
              <p className="text-sm text-ink-soft/50">Загрузка…</p>
            ) : (
              <ul className="space-y-2">
                {services.map((service, i) => (
                  <li
                    key={service.id}
                    className={clsx(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
                      draft.id === service.id ? "border-wine-700 bg-cream" : "border-ink/10 bg-ivory",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{service.title.ru}</p>
                      {service.price && <p className="text-xs text-ink-soft/50">{service.price}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={() => moveService(i, -1)} disabled={i === 0} className="px-1.5 text-ink-soft/50 hover:text-wine-700 disabled:opacity-30">
                        ↑
                      </button>
                      <button
                        onClick={() => moveService(i, 1)}
                        disabled={i === services.length - 1}
                        className="px-1.5 text-ink-soft/50 hover:text-wine-700 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button onClick={() => editService(service)} className="px-2 text-xs text-wine-700 hover:underline">
                        править
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="px-2 text-xs text-red-700 hover:underline">
                        удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-ink">Как будет выглядеть на сайте</h2>
          <div className="rounded-2xl bg-wine-950/5 p-6">
            <div className="mx-auto max-w-sm">
              <ServicePreviewCard title={draft.titleRu} description={draft.descriptionRu} imageUrl={draft.imageUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
