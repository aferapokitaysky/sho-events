import { motion } from "framer-motion";
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
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
