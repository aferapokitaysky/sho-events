import clsx from "clsx";

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300",
        checked ? "bg-wine-800" : "bg-ink/15",
      )}
    >
      <span
        className={clsx(
          "inline-block h-4.5 w-4.5 transform rounded-full bg-ivory shadow-sm transition-transform duration-300",
          checked ? "translate-x-[22px]" : "translate-x-[3px]",
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}
