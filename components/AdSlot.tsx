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
      aria-label={`Ad: ${z?.name ?? zone}`}
      style={{ minHeight: 90 }}
    >
      <div className="mx-auto max-w-6xl">
        {custom ? (
          <div
            className="overflow-hidden rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
            dangerouslySetInnerHTML={{ __html: sanitizeAdHtml(custom) }}
          />
        ) : (
          <div className="flex min-h-[90px] flex-col items-center justify-center gap-1 overflow-hidden rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--bg-recessed)] px-4 py-6 text-center">
            <span className="text-[12px] font-medium text-[var(--fg-muted)]">
              {z?.name ?? zone}
            </span>
            <span className="max-w-xl text-[11px] text-[var(--fg-muted)] opacity-60">
              Ad slot
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
