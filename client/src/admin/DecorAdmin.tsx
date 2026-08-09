import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { decorApi, translateText, uploadImage, formatPriceEuro, type AdminDecorItem } from "@/lib/adminApi";

interface DraftDecorItem {
  id: number | null;
  nameRu: string;
  descriptionRu: string;
  price: string;
  images: string[];
}

const EMPTY_DRAFT: DraftDecorItem = { id: null, nameRu: "", descriptionRu: "", price: "", images: [] };

function DecorPreviewCard({
  name,
  description,
  price,
  images,
}: {
  name: string;
  description: string;
  price: string;
  images: string[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-paper shadow-soft">
      <div className="aspect-[4/3] bg-cream">
        {images[0] ? (
          <img src={images[0]} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-soft/40">нет фото</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base text-ink">{name || "Название позиции"}</h3>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft/70">{description}</p>}
        {price && <p className="mt-2 kicker text-wine-700">{price}</p>}
        {images.length > 1 && <p className="mt-1 text-xs text-ink-soft/40">+{images.length - 1} фото</p>}
      </div>
    </div>
  );
}

export default function DecorAdmin() {
  const [items, setItems] = useState<AdminDecorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DraftDecorItem>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function refresh() {
    setLoading(true);
    decorApi
      .list()
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function editItem(item: AdminDecorItem) {
    setDraft({
      id: item.id,
      nameRu: item.name.ru,
      descriptionRu: item.description.ru,
      price: item.price ?? "",
      images: item.images.map((img) => img.url),
    });
  }

  function resetDraft() {
    setDraft(EMPTY_DRAFT);
    setError(null);
  }

  async function handleAddImage(file: File) {
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setDraft((d) => ({ ...d, images: [...d.images, url] }));
    } catch {
      setError("Не удалось загрузить фото");
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImage(url: string) {
    setDraft((d) => ({ ...d, images: d.images.filter((img) => img !== url) }));
  }

  async function handleSave() {
    if (!draft.nameRu.trim()) {
      setError("Введите название позиции");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const [name, description] = await Promise.all([
        translateText(draft.nameRu, "ru"),
        translateText(draft.descriptionRu, "ru"),
      ]);
      const payload = {
        name,
        description,
        price: draft.price.trim() || null,
        images: draft.images,
      };
      if (draft.id) {
        await decorApi.update(draft.id, payload);
      } else {
        await decorApi.create(payload);
      }
      resetDraft();
      refresh();
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить эту позицию?")) return;
    await decorApi.remove(id);
    if (draft.id === id) resetDraft();
    refresh();
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Аренда декора</h1>
      <p className="mt-1 text-sm text-ink-soft/60">Каждая позиция может иметь несколько фото — покажутся все варианты.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-ink/10 bg-ivory p-6">
            <h2 className="text-sm font-medium text-ink">{draft.id ? "Редактирование позиции" : "Новая позиция"}</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Название</label>
                <input
                  value={draft.nameRu}
                  onChange={(e) => setDraft((d) => ({ ...d, nameRu: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="Например: Набор бокалов «Винтаж»"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Описание (необязательно)</label>
                <textarea
                  value={draft.descriptionRu}
                  onChange={(e) => setDraft((d) => ({ ...d, descriptionRu: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Цена</label>
                <input
                  value={draft.price}
                  onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                  onBlur={(e) => setDraft((d) => ({ ...d, price: formatPriceEuro(e.target.value) }))}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                  placeholder="например: 15 или 15 € / день"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Фото ({draft.images.length})</label>
                <div className="flex flex-wrap gap-3">
                  {draft.images.map((url) => (
                    <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-ink/10">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-wine-950/70 text-xs text-ivory"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-ink/20 text-xs text-ink-soft/50 hover:border-wine-700 hover:text-wine-700 disabled:opacity-50"
                  >
                    {uploadingImage ? "…" : "+ фото"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddImage(file);
                      e.target.value = "";
                    }}
                  />
                </div>
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

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-medium text-ink">Позиции ({items.length})</h2>
            {loading ? (
              <p className="text-sm text-ink-soft/50">Загрузка…</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-ink-soft/40">Пока ничего не добавлено</p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={clsx(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
                      draft.id === item.id ? "border-wine-700 bg-cream" : "border-ink/10 bg-ivory",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{item.name.ru}</p>
                      {item.price && <p className="text-xs text-ink-soft/50">{item.price}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={() => editItem(item)} className="px-2 text-xs text-wine-700 hover:underline">
                        править
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="px-2 text-xs text-red-700 hover:underline">
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
            <div className="mx-auto max-w-xs">
              <DecorPreviewCard
                name={draft.nameRu}
                description={draft.descriptionRu}
                price={draft.price}
                images={draft.images}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
