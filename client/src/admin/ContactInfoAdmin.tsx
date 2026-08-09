import { useEffect, useState } from "react";
import { contactInfoApi, type AdminContactInfo } from "@/lib/adminApi";

type Draft = Omit<AdminContactInfo, "id">;

export default function ContactInfoAdmin() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    contactInfoApi.get().then(({ id: _id, ...rest }) => setDraft(rest));
  }, []);

  function update(field: keyof Draft, value: string) {
    setDraft((d) => (d ? { ...d, [field]: value } : d));
    setSaved(false);
  }

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      await contactInfoApi.update({
        phone: draft.phone,
        whatsapp: draft.whatsapp,
        instagram: draft.instagram,
        threads: draft.threads,
        email: draft.email,
        city: { ru: draft.city_ru, en: draft.city_en, sk: draft.city_sk },
        addressNote: { ru: draft.address_note_ru, en: draft.address_note_en, sk: draft.address_note_sk },
      });
      setSaved(true);
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  if (!draft) {
    return <div className="p-8 text-sm text-ink-soft/50">Загрузка…</div>;
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink">Контактная информация</h1>
      <p className="mt-1 text-sm text-ink-soft/60">
        Эти данные показываются на странице «Контакты» и в подвале сайта на всех языках.
      </p>

      <div className="mt-8 max-w-2xl rounded-2xl border border-ink/10 bg-ivory p-6">
        <h2 className="text-sm font-medium text-ink">Способы связи</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Телефон</label>
            <input
              value={draft.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
              placeholder="+421 900 000 000"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">WhatsApp</label>
            <input
              value={draft.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
              placeholder="+421 900 000 000"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Instagram (без @)</label>
            <input
              value={draft.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
              placeholder="sho.events.sk"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Threads (без @)</label>
            <input
              value={draft.threads}
              onChange={(e) => update("threads", e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
              placeholder="sho.events.sk"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">Email</label>
            <input
              value={draft.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
              placeholder="hello@shoevents.org"
            />
          </div>
        </div>

        <h2 className="mt-8 text-sm font-medium text-ink">Город и зона работы</h2>
        <p className="mt-1 text-xs text-ink-soft/50">Нужно заполнить на всех трёх языках.</p>
        <div className="mt-4 space-y-4">
          {(["ru", "en", "sk"] as const).map((lang) => (
            <div key={lang} className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">
                  Город ({lang.toUpperCase()})
                </label>
                <input
                  value={draft[`city_${lang}`]}
                  onChange={(e) => update(`city_${lang}`, e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">
                  Зона работы ({lang.toUpperCase()})
                </label>
                <input
                  value={draft[`address_note_${lang}`]}
                  onChange={(e) => update(`address_note_${lang}`, e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-cream px-3.5 py-2.5 text-ink outline-none focus:border-wine-700"
                />
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        {saved && <p className="mt-4 text-sm text-wine-700">Сохранено</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 rounded-full bg-wine-800 px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-wine-700 disabled:opacity-50"
        >
          {saving ? "Сохраняем…" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
