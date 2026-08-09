import type { ReactNode } from "react";

export function Marquee({
  children,
  duration = 32,
  className,
  reverse,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`no-scrollbar flex overflow-hidden ${className ?? ""}`}>
      <div
        className="animate-marquee flex shrink-0 items-center gap-10 pr-10"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
