import { useRef, useState } from "react";
import { uploadImage } from "@/lib/adminApi";

export function ImageUploader({
  value,
  onChange,
  label = "Фото",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setError("Не удалось загрузить фото");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft/50">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-ink/10">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-wine-950/70 text-xs text-ivory"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-ink/20 text-xs text-ink-soft/40">
            нет фото
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-ink/15 px-4 py-2 text-xs text-ink-soft transition-colors hover:border-wine-700 hover:text-wine-700 disabled:opacity-50"
          >
            {uploading ? "Загрузка…" : value ? "Заменить" : "Загрузить фото"}
          </button>
          {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
