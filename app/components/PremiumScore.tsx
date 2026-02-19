"use client";

import { useEffect, useMemo, useState } from "react";

function clamp(n: number, a = 0, b = 100) {
  return Math.min(b, Math.max(a, n));
}

export default function PremiumScore({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: number; // 0 a 100
  subtitle?: string;
}) {
  const target = useMemo(() => clamp(Math.round(value)), [value]);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 900;

    const tick = (t: number) => {
      const progress = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(target * eased);
      setShown(next);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const ringStyle = useMemo(() => {
    const deg = (shown / 100) * 360;
    return {
      background: `conic-gradient(
        from 180deg,
        rgba(34,197,94,0.95) 0deg ${deg}deg,
        rgba(255,255,255,0.08) ${deg}deg 360deg
      )`,
    } as React.CSSProperties;
  }, [shown]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/70">{label}</div>
          <div className="text-xs text-white/50 mt-1">
            {subtitle ?? "Resultado estimado"}
          </div>
        </div>

        <div className="relative h-28 w-28 rounded-full p-[6px]" style={ringStyle}>
          <div className="absolute inset-[6px] rounded-full bg-[#07101c]/90 border border-white/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white tabular-nums">
              {shown}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <span className="inline-flex items-center rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-200 border border-yellow-400/20">
          PREMIUM ANALYSIS
        </span>
      </div>
    </div>
  );
}
