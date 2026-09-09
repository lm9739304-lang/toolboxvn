"use client";

import React, { useEffect, useRef } from "react";
import { useSite } from "@/lib/site-config";
import { sanitizeAdHtml } from "@/lib/ads";
import type { AdZoneId } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

function loadAdSense(clientId: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(); return; }
    if (document.querySelector(`script[src*="${clientId}"]`)) { resolve(); return; }
    window.adsbygoogle = window.adsbygoogle || [];
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

export default function AdSlot({ zone, className = "" }: { zone: AdZoneId; className?: string }) {
  const { isAdEnabled, getAdZone } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const z = getAdZone(zone);
  const custom = z?.customHtml?.trim() ?? "";
  const enabled = isAdEnabled(zone);

  useEffect(() => {
    if (!enabled || !custom || !ref.current) return;

    let cancelled = false;

    const run = async () => {
      const ins = ref.current?.querySelectorAll("ins.adsbygoogle");
      if (!ins || ins.length === 0) return;

      const firstIns = ins[0] as HTMLElement;
      const clientId = firstIns.getAttribute("data-ad-client");
      if (!clientId) return;

      await loadAdSense(clientId);
      await new Promise((r) => setTimeout(r, 300));

      if (cancelled) return;

      try {
        for (const _el of Array.from(ins)) {
          void _el;
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch {}
    };

    run();
    return () => { cancelled = true; };
  }, [enabled, custom]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className={`ad-slot ${className}`}
      role="complementary"
      aria-label={`Quảng cáo: ${z?.name ?? zone}`}
      style={{ minHeight: 90 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-1 flex items-center justify-center gap-2">
          <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500">
            Quảng cáo
          </span>
        </div>
        {custom ? (
          <div
            className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
            dangerouslySetInnerHTML={{ __html: sanitizeAdHtml(custom) }}
          />
        ) : (
          <div className="flex min-h-[90px] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 py-6 text-center dark:border-slate-600 dark:from-slate-800 dark:to-blue-900/20">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {z?.name ?? zone} — {z?.sizes ?? "Responsive"}
            </span>
            <span className="max-w-xl text-xs text-slate-400 dark:text-slate-500">
              Vị trí dành cho Google AdSense. Dán mã ins tag vào Trang Admin → Quảng cáo.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
