import { motion } from "framer-motion";
import { Container, Kicker } from "./Section";

interface PhotoBandHeroProps {
  kicker: string;
  title: string;
  lead: string;
  image: string;
  alt: string;
  objectPosition?: string;
}

export function PhotoBandHero({ kicker, title, lead, image, alt, objectPosition = "50% 50%" }: PhotoBandHeroProps) {
  return (
    <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-wine-950 text-ivory sm:min-h-[70vh]">
      <motion.img
        src={image}
        alt={alt}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-wine-950/88 via-wine-950/30 to-wine-950/5" />

      <Container className="relative w-full pb-14 pt-40 sm:pb-20 sm:pt-48">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <Kicker dark>{kicker}</Kicker>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-balance text-[2.9rem] leading-[1.05] sm:text-[3.8rem]"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-md text-balance text-lg leading-relaxed text-ivory/70"
        >
          {lead}
        </motion.p>
      </Container>
    </section>
  );
}
