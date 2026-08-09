import { useEffect, useState } from "react";
import clsx from "clsx";
import { portfolioApi, translateText, type AdminPortfolioPhoto } from "@/lib/adminApi";
import { ImageUploader } from "@/admin/components/ImageUploader";
import { Toggle } from "@/admin/components/Toggle";

interface DraftPhoto {
  id: number | null;
  imageUrl: string | null;
  captionRu: string;
}

const EMPTY_DRAFT: DraftPhoto = { id: null, imageUrl: null, captionRu: "" };

export default function PortfolioAdmin() {
  const [photos, setPhotos] = useState<AdminPortfolioPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DraftPhoto>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    portfolioApi
      .list()
      .then(setPhotos)
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function editPhoto(photo: AdminPortfolioPhoto) {
    setDraft({ id: photo.id, imageUrl: photo.imageUrl, captionRu: photo.caption.ru });
  }

  function resetDraft() {
    setDraft(EMPTY_DRAFT);
    setError(null);
  }

  async function handleSave() {
    if (!draft.imageUrl) {
      setError("Загрузите фото");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const caption = await translateText(draft.captionRu, "ru");
      if (draft.id) {
        await portfolioApi.update(draft.id, { caption });
      } else {
        await portfolioApi.create({ imageUrl: draft.imageUrl, caption });
      }
      resetDraft();
      refresh();
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(photo: AdminPortfolioPhoto) {
    await portfolioApi.publish(photo.id, !photo.published);
    refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить это фото?")) return;
    await portfolioApi.remove(id);
    if (draft.id === id) resetDraft();
    refresh();
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Портфолио</h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Загружайте фото по мере наработки. Пока фото не опубликовано — его видите только вы.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-ink/10 bg-ivory p-6">
            <h2 className="text-sm font-medium text-ink">{draft.id ? "Редактирование фото" : "Новое фото"}</h2>

            <div className="mt-4 space-y-4">
              <ImageUploader value={draft.imageUrl} onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))} />
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Подпись (необязательно)</label>
                <input
                  value={draft.captionRu}
                  onChange={(e) => setDraft((d) => ({ ...d, captionRu: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="Например: Свадебный бранч, июль 2026"
                />
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-wine-800 px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-wine-700 disabled:opacity-50"
              >
                {saving ? "Сохраняем…" : draft.id ? "Сохранить" : "Добавить"}
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
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-ink">Как будет выглядеть на сайте</h2>
          <div className="rounded-2xl bg-wine-950/5 p-6">
            <div className="mx-auto max-w-xs overflow-hidden rounded-2xl bg-ivory shadow-soft">
              <div className="aspect-[4/5] bg-cream">
                {draft.imageUrl ? (
                  <img src={draft.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink-soft/40">нет фото</div>
                )}
              </div>
              {draft.captionRu && <p className="p-3 text-sm text-ink-soft/70">{draft.captionRu}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-sm font-medium text-ink">Все фото ({photos.length})</h2>
        {loading ? (
          <p className="text-sm text-ink-soft/50">Загрузка…</p>
        ) : photos.length === 0 ? (
          <p className="text-sm text-ink-soft/40">Пока ничего не загружено</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={clsx(
                  "overflow-hidden rounded-xl border bg-ivory",
                  draft.id === photo.id ? "border-wine-700" : "border-ink/10",
                )}
              >
                <div className="aspect-[4/3] bg-cream">
                  <img src={photo.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={clsx(
                        "inline-block rounded-full px-2.5 py-0.5 text-xs",
                        photo.published ? "bg-wine-800 text-ivory" : "bg-cream text-ink-soft/60",
                      )}
                    >
                      {photo.published ? "Опубликовано" : "Черновик"}
                    </span>
                    <Toggle checked={photo.published} onChange={() => togglePublish(photo)} label="Опубликовать" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <button onClick={() => editPhoto(photo)} className="text-ink-soft hover:underline">
                      править
                    </button>
                    <button onClick={() => handleDelete(photo.id)} className="text-red-700 hover:underline">
                      удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
