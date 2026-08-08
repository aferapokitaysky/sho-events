import type { ReactNode } from "react";
import clsx from "clsx";
import { IconFlorish } from "@/components/icons";
import { Reveal } from "./Reveal";

export function Kicker({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <span
      className={clsx(
        "kicker inline-flex items-center gap-3",
        dark ? "text-beige-dark" : "text-wine-600",
        className,
      )}
    >
      <span className={clsx("h-px w-8", dark ? "bg-beige-dark" : "bg-wine-500")} />
      {children}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return <IconFlorish className={clsx("mx-auto h-5 w-40 text-beige-dark", className)} />;
}

export function SectionHeading({
  kicker,
  title,
  lead,
  center,
  dark,
  className,
}: {
  kicker?: string;
  title: ReactNode;
  lead?: string;
  center?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-3xl", center && "mx-auto text-center", className)}>
      {kicker && (
        <Reveal>
          <Kicker dark={dark} className={center ? "justify-center" : ""}>
            {kicker}
          </Kicker>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={clsx(
            "mt-5 text-balance text-[2.5rem] leading-[1.08] sm:text-[3.1rem]",
            dark ? "text-ivory" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className={clsx("mt-6 text-lg leading-relaxed", dark ? "text-ivory/70" : "text-ink-soft/80")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-[1240px] px-6 sm:px-10", className)}>{children}</div>;
}
