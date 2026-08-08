import waxSealPhoto from "@/assets/photos/wax-seal-photo.webp";

interface LogoProps {
  className?: string;
  variant?: "seal" | "wordmark";
}

export function LogoSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 6c4.8 0 7.9 5.1 12.4 6.4 4.6 1.4 10.4-1.4 14.3 1.4 3.9 2.8 3 8.9 5.9 12.6 2.9 3.7 9.1 4.8 10.6 9.3 1.5 4.4-2.6 9.1-2.6 13.8 0 4.7 4.1 9.4 2.6 13.8-1.5 4.5-7.7 5.6-10.6 9.3-2.9 3.7-2 9.8-5.9 12.6-3.9 2.8-9.7 0-14.3 1.4C68 90.9 64.8 96 60 96s-7.9-5.1-12.4-6.4c-4.6-1.4-10.4 1.4-14.3-1.4-3.9-2.8-3-8.9-5.9-12.6-2.9-3.7-9.1-4.8-10.6-9.3-1.5-4.4 2.6-9.1 2.6-13.8 0-4.7-4.1-9.4-2.6-13.8 1.5-4.5 7.7-5.6 10.6-9.3 2.9-3.7 2-9.8 5.9-12.6 3.9-2.8 9.7 0 14.3-1.4C52.1 11.1 55.2 6 60 6Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M60 6c4.8 0 7.9 5.1 12.4 6.4 4.6 1.4 10.4-1.4 14.3 1.4 3.9 2.8 3 8.9 5.9 12.6 2.9 3.7 9.1 4.8 10.6 9.3 1.5 4.4-2.6 9.1-2.6 13.8 0 4.7 4.1 9.4 2.6 13.8-1.5 4.5-7.7 5.6-10.6 9.3-2.9 3.7-2 9.8-5.9 12.6-3.9 2.8-9.7 0-14.3 1.4C68 90.9 64.8 96 60 96s-7.9-5.1-12.4-6.4c-4.6-1.4-10.4 1.4-14.3-1.4-3.9-2.8-3-8.9-5.9-12.6-2.9-3.7-9.1-4.8-10.6-9.3-1.5-4.4 2.6-9.1 2.6-13.8 0-4.7-4.1-9.4-2.6-13.8 1.5-4.5 7.7-5.6 10.6-9.3 2.9-3.7 2-9.8 5.9-12.6 3.9-2.8 9.7 0 14.3-1.4C52.1 11.1 55.2 6 60 6Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="60" cy="51" r="30.5" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <text
        x="60"
        y="52"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="24"
        fill="currentColor"
      >
        SHO
      </text>
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fontFamily="'Jost', sans-serif"
        fontSize="6.5"
        letterSpacing="3.5"
        fill="currentColor"
      >
        EVENTS
      </text>
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 46" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="21" cy="23" r="18.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="21" cy="23" r="13.5" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
      <text x="21" y="27" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="13" fill="currentColor">
        S
      </text>
      <text x="52" y="27" fontFamily="'Cormorant Garamond', serif" fontSize="23" letterSpacing="1" fill="currentColor">
        SHO
      </text>
      <text x="52" y="39" fontFamily="'Jost', sans-serif" fontSize="7" letterSpacing="4" fill="currentColor" opacity="0.85">
        EVENTS
      </text>
    </svg>
  );
}

export function BrandMark({
  className,
  textClassName,
  imgClassName,
}: {
  className?: string;
  textClassName?: string;
  imgClassName?: string;
}) {
  return (
    <span className={`flex items-center gap-3 ${className ?? ""}`}>
      <img
        src={waxSealPhoto}
        alt="SHO Events"
        className={`aspect-square shrink-0 rounded-full object-cover ring-1 ring-current/25 ${imgClassName ?? "h-9 w-9"}`}
      />
      <span className={`leading-none ${textClassName ?? ""}`}>
        <span className="block font-display text-2xl tracking-wide">SHO</span>
        <span className="kicker block text-[0.6rem] opacity-85">EVENTS</span>
      </span>
    </span>
  );
}

export default function Logo({ className, variant = "seal" }: LogoProps) {
  return variant === "seal" ? <LogoSeal className={className} /> : <LogoWordmark className={className} />;
}
