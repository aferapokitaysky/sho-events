import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { IconChevronDown } from "@/components/icons";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  name?: string;
}

export function CustomSelect({ value, onChange, options, placeholder, required, name }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} required={required} />

      <button
        type="button"
        data-cursor-hover
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "flex w-full items-center justify-between border-b border-ink/20 bg-transparent py-3 text-left text-lg transition-colors focus:outline-none",
          open ? "border-wine-700" : "hover:border-ink/35",
          value ? "text-ink" : "text-ink-soft/45",
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="ml-3 shrink-0 text-ink-soft/50"
        >
          <IconChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-ink/10 bg-ivory py-2 shadow-soft"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                data-cursor-hover
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={clsx(
                  "block w-full px-4 py-2.5 text-left text-[0.95rem] transition-colors duration-200",
                  opt === value ? "bg-cream text-wine-700" : "text-ink-soft hover:bg-cream/60 hover:text-ink",
                )}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
