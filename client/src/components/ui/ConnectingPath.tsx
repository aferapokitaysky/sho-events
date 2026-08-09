import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useInView } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

function buildLoopyPath(points: Point[]): string {
  if (points.length < 2) return "";

  let totalDist = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDist += Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
  }
  const avgDist = totalDist / (points.length - 1) || 1;
  const loopRadius = Math.max(26, Math.min(avgDist * 0.22, 64));

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const nx = -uy;
    const ny = ux;
    const side = i % 2 === 0 ? 1 : -1;

    const bulge = dist * 0.34 * side;
    const c1x = p1.x + dx * 0.28 + nx * bulge;
    const c1y = p1.y + dy * 0.28 + ny * bulge;
    const c2x = p1.x + dx * 0.72 + nx * bulge;
    const c2y = p1.y + dy * 0.72 + ny * bulge;

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;

    const isIntermediate = i < points.length - 2;
    if (isIntermediate) {
      const sweep = side > 0 ? 1 : 0;
      const exitX = p2.x + ux * 4 + nx * side * 4;
      const exitY = p2.y + uy * 4 + ny * side * 4;
      d += ` A ${loopRadius} ${loopRadius} 0 1 ${sweep} ${exitX} ${exitY}`;
    }
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
      setState({ d: buildLoopyPath(points), width: containerRect.width, height: containerRect.height });
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

  const duration = Math.min(2.8 + count * 0.75, 8.5);

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
      </defs>
      {state.d && (
        <motion.path
          d={state.d}
          fill="none"
          stroke="url(#portfolio-thread)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.8}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration, delay: 0.3, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}
