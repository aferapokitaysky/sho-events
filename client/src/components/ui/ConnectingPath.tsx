import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useInView } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function ConnectingPath({
  containerRef,
  itemRefs,
  count,
}: {
  containerRef: RefObject<HTMLElement | null>;
  itemRefs: RefObject<(HTMLElement | null)[]>;
  count: number;
}) {
  const [state, setState] = useState<{ d: string; width: number; height: number }>({ d: "", width: 0, height: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, margin: "-100px" });

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current;
      if (!container || count < 2) {
        setState({ d: "", width: 0, height: 0 });
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const points: Point[] = [];
      for (const el of itemRefs.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        points.push({
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top,
        });
      }
      if (points.length < 2) {
        setState({ d: "", width: 0, height: 0 });
        return;
      }
      setState({ d: smoothPath(points), width: containerRect.width, height: containerRect.height });
    }

    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recompute);
    const raf = requestAnimationFrame(recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
      cancelAnimationFrame(raf);
    };
  }, [containerRef, itemRefs, count]);

  const duration = Math.min(2.4 + count * 0.65, 7.5);

  return (
    <svg
      ref={svgRef}
      data-connecting-path=""
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${state.width || 1} ${state.height || 1}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="portfolio-thread" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-wine-700)" />
          <stop offset="50%" stopColor="var(--color-beige-dark)" />
          <stop offset="100%" stopColor="var(--color-wine-700)" />
        </linearGradient>
        <filter id="portfolio-thread-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {state.d && (
        <motion.path
          d={state.d}
          fill="none"
          stroke="url(#portfolio-thread)"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
          filter="url(#portfolio-thread-glow)"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration, delay: 0.3, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}
