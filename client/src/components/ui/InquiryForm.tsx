import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useLanguage } from "@/lib/LanguageContext";
import { submitForm, type FormEndpoint } from "@/lib/api";
import { IconCheck } from "@/components/icons";
import { Button } from "./Button";
import { CustomSelect } from "./CustomSelect";

export interface ChannelOption {
  key: string;
  label: string;
  placeholder: string;
  inputType?: "text" | "tel" | "email";
}

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "textarea" | "select" | "dateMask" | "checkboxGroup";
  options?: string[];
  channelOptions?: ChannelOption[];
  required?: boolean;
  span?: "full" | "half";
}

function toggleInList(current: string, option: string): string {
  const list = current ? current.split(", ") : [];
  const next = list.includes(option) ? list.filter((v) => v !== option) : [...list, option];
  return next.join(", ");
}

function formatDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join(".");
}

interface InquiryFormProps {
  endpoint: FormEndpoint;
  fields: FieldConfig[];
  submitLabel: string;
  note?: string;
}

export function InquiryForm({ endpoint, fields, submitLabel, note }: InquiryFormProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const update = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitForm(endpoint, values);
      setStatus("success");
      setValues({});
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center rounded-2xl border border-wine-800/15 bg-cream/50 px-8 py-16 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-wine-800 text-ivory"
        >
          <IconCheck className="h-6 w-6" />
        </motion.span>
        <h3 className="mt-6 text-3xl text-ink">{t.common.formSuccessTitle}</h3>
        <p className="mt-3 max-w-sm text-ink-soft/80">{t.common.formSuccessText}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="kicker mt-8 text-wine-700 underline decoration-wine-700/30 underline-offset-4 hover:decoration-wine-700"
        >
          {t.common.ctaWriteUs}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
      {fields.map((field) => {
        const wide = field.span !== "half";
        const selectedLabels = (values[field.name] ?? "").split(", ").filter(Boolean);

        return (
          <div key={field.name} className={clsx(wide && "sm:col-span-2")}>
            {field.type === "checkboxGroup" ? (
              <div>
                <p className="kicker mb-3 text-ink-soft/50">{field.label}</p>
                <div className="flex flex-wrap gap-2">
                  {(field.channelOptions ?? field.options?.map((o) => ({ key: o, label: o, placeholder: o })) ?? []).map(
                    (opt) => {
                      const selected = selectedLabels.includes(opt.label);
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          data-cursor-hover
                          onClick={() => update(field.name, toggleInList(values[field.name] ?? "", opt.label))}
                          className={clsx(
                            "kicker rounded-full border px-4 py-2 transition-colors duration-300",
                            selected
                              ? "border-wine-800 bg-wine-800 text-ivory"
                              : "border-ink/20 text-ink-soft hover:border-wine-700 hover:text-wine-700",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    },
                  )}
                </div>

                {field.channelOptions && (
                  <div className="mt-1">
                    <AnimatePresence initial={false}>
                      {field.channelOptions
                        .filter((opt) => selectedLabels.includes(opt.label))
                        .map((opt) => (
                          <motion.div
                            key={opt.key}
                            layout
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <input
                              type={opt.inputType ?? "text"}
                              placeholder={opt.placeholder}
                              value={values[`${field.name}_${opt.key}`] ?? ""}
                              onChange={(e) => update(`${field.name}_${opt.key}`, e.target.value)}
                              className="w-full border-b border-ink/20 bg-transparent py-2.5 text-base text-ink placeholder:text-ink-soft/40 focus:border-wine-700 focus:outline-none"
                            />
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ) : field.type === "textarea" ? (
              <textarea
                required={field.required}
                placeholder={field.label}
                rows={4}
                value={values[field.name] ?? ""}
                onChange={(e) => update(field.name, e.target.value)}
                className="w-full resize-none border-b border-ink/20 bg-transparent py-3 text-lg text-ink placeholder:text-ink-soft/45 focus:border-wine-700 focus:outline-none"
              />
            ) : field.type === "select" ? (
              <CustomSelect
                name={field.name}
                required={field.required}
                value={values[field.name] ?? ""}
                onChange={(v) => update(field.name, v)}
                options={field.options ?? []}
                placeholder={field.label}
              />
            ) : field.type === "dateMask" ? (
              <input
                type="text"
                inputMode="numeric"
                required={field.required}
                placeholder={field.label}
                value={values[field.name] ?? ""}
                onChange={(e) => update(field.name, formatDateMask(e.target.value))}
                className="w-full border-b border-ink/20 bg-transparent py-3 text-lg text-ink placeholder:text-ink-soft/45 focus:border-wine-700 focus:outline-none"
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.label}
                value={values[field.name] ?? ""}
                onChange={(e) => update(field.name, e.target.value)}
                className="w-full border-b border-ink/20 bg-transparent py-3 text-lg text-ink placeholder:text-ink-soft/45 focus:border-wine-700 focus:outline-none"
              />
            )}
          </div>
        );
      })}

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={status === "loading"} className="sm:col-span-1">
          {status === "loading" ? t.common.formSubmitting : submitLabel}
        </Button>
        {note && <p className="text-sm text-ink-soft/60">{note}</p>}
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-wine-700 sm:col-span-2"
          >
            {t.common.formError}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
