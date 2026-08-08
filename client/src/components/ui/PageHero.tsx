import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Container, Kicker } from "./Section";
import { LogoSeal } from "@/components/Logo";

export function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-wine-950 pb-24 pt-40 text-ivory sm:pb-32 sm:pt-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-wine-800/40 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-[360px] w-[360px] rounded-full bg-wine-700/30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
        animate={{ opacity: 0.12, rotate: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -right-16 top-16 hidden text-beige-dark sm:block"
      >
        <LogoSeal className="h-64 w-64" />
      </motion.div>

      <Container className="relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <Kicker dark>{kicker}</Kicker>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-balance text-[3rem] leading-[1.05] sm:text-[4.2rem]"
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-ivory/70"
          >
            {lead}
          </motion.p>
        )}
        {children}
      </Container>
    </section>
  );
}
