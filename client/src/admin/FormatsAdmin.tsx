import { useEffect, useState } from "react";
import clsx from "clsx";
import { formatsApi, translateText, type AdminFormat } from "@/lib/adminApi";
import { ImageUploader } from "@/admin/components/ImageUploader";
import { IconSparkle } from "@/components/icons";

interface DraftFormat {
  id: number | null;
  titleRu: string;
  descriptionRu: string;
  imageUrl: string | null;
}

const EMPTY_DRAFT: DraftFormat = { id: null, titleRu: "", descriptionRu: "", imageUrl: null };

function FormatPreviewCard({ title, description, imageUrl }: { title: string; description: string; imageUrl: string | null }) {
  return (
    <div className="relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-paper p-9">
      {imageUrl && (
        <>
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-wine-950/85 via-wine-950/30 to-transparent" />
        </>
      )}
      <IconSparkle className={clsx("relative h-9 w-9", imageUrl ? "text-beige-dark" : "text-wine-700")} />
      <div className="relative mt-10">
        <h3 className={clsx("text-2xl", imageUrl ? "text-ivory" : "text-ink")}>{title || "Название формата"}</h3>
        <p className={clsx("mt-2 text-sm leading-relaxed", imageUrl ? "text-ivory/70" : "text-ink-soft/70")}>
          {description || "Описание формата"}
        </p>
      </div>
    </div>
  );
}

export default function FormatsAdmin() {
  const [formats, setFormats] = useState<AdminFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DraftFormat>(EMPTY_DRAFT);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    formatsApi
      .list()
      .then(setFormats)
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function editFormat(format: AdminFormat) {
    setDraft({
      id: format.id,
      titleRu: format.title.ru,
      descriptionRu: format.description.ru,
      imageUrl: format.imageUrl,
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
      const payload = { title, description, imageUrl: draft.imageUrl };
      if (draft.id) {
        await formatsApi.update(draft.id, payload);
      } else {
        await formatsApi.create(payload);
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
    if (!confirm("Удалить этот формат?")) return;
    await formatsApi.remove(id);
    if (draft.id === id) resetDraft();
    refresh();
  }

  async function moveFormat(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= formats.length) return;
    const a = formats[index];
    const b = formats[target];
    await Promise.all([
      formatsApi.update(a.id, { sortOrder: b.sortOrder }),
      formatsApi.update(b.id, { sortOrder: a.sortOrder }),
    ]);
    refresh();
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Форматы</h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Введите текст на русском — при сохранении он автоматически переведётся на английский и словацкий.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-ink/10 bg-ivory p-6">
            <h2 className="text-sm font-medium text-ink">{draft.id ? "Редактирование формата" : "Новый формат"}</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Название</label>
                <input
                  value={draft.titleRu}
                  onChange={(e) => setDraft((d) => ({ ...d, titleRu: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="Например: Тематические вечеринки"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Описание</label>
                <textarea
                  value={draft.descriptionRu}
                  onChange={(e) => setDraft((d) => ({ ...d, descriptionRu: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="Короткое описание формата"
                />
              </div>
              <ImageUploader value={draft.imageUrl} onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))} label="Фото (необязательно)" />
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
            <h2 className="mb-3 text-sm font-medium text-ink">Список форматов ({formats.length})</h2>
            {loading ? (
              <p className="text-sm text-ink-soft/50">Загрузка…</p>
            ) : (
              <ul className="space-y-2">
                {formats.map((format, i) => (
                  <li
                    key={format.id}
                    className={clsx(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
                      draft.id === format.id ? "border-wine-700 bg-cream" : "border-ink/10 bg-ivory",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{format.title.ru}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={() => moveFormat(i, -1)} disabled={i === 0} className="px-1.5 text-ink-soft/50 hover:text-wine-700 disabled:opacity-30">
                        ↑
                      </button>
                      <button
                        onClick={() => moveFormat(i, 1)}
                        disabled={i === formats.length - 1}
                        className="px-1.5 text-ink-soft/50 hover:text-wine-700 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button onClick={() => editFormat(format)} className="px-2 text-xs text-wine-700 hover:underline">
                        править
                      </button>
                      <button onClick={() => handleDelete(format.id)} className="px-2 text-xs text-red-700 hover:underline">
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
              <FormatPreviewCard title={draft.titleRu} description={draft.descriptionRu} imageUrl={draft.imageUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
