"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/site-config";
import { sanitizeAdHtml } from "@/lib/ads";
import type { AdZoneId } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/* Dedup: track which zones are already mounted in this page */
const mountedZones = new Set<string>();

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
  const [hasContent, setHasContent] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const z = getAdZone(zone);
  const custom = z?.customHtml?.trim() ?? "";
  const enabled = isAdEnabled(zone);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    // Dedup: if this zone key is already mounted, hide this duplicate
    if (mountedZones.has(zone)) {
      ref.current.style.display = "none";
      return;
    }
    mountedZones.add(zone);

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const run = async () => {
      const ins = ref.current?.querySelectorAll("ins.adsbygoogle");
      if (!ins || ins.length === 0) {
        if (!custom) {
          // No content at all — mark as failed after delay
          timeout = setTimeout(() => { if (!cancelled) setIsFailed(true); }, 2000);
        }
        return;
      }

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
        // After push, check if ad actually rendered
        timeout = setTimeout(() => {
          if (cancelled) return;
          const insEl = ref.current?.querySelector("ins.adsbygoogle");
          const hasAd = insEl && insEl.getAttribute("data-ad-status") === "filled";
          setHasContent(!!hasAd || !!custom);
          if (!hasAd && !custom) setIsFailed(true);
        }, 1500);
      } catch {
        setIsFailed(true);
      }
    };

    run();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      mountedZones.delete(zone);
    };
  }, [enabled, custom, zone]);

  if (!enabled) return null;

  // Graceful failure: collapse to nothing
  if (isFailed && !custom) return null;

  return (
    <div
      ref={ref}
      className={`ad-slot ${className}`}
      role="complementary"
      aria-label={`Ad: ${z?.name ?? zone}`}
      style={{ minHeight: 90 }}
    >
      <div className="mx-auto max-w-full overflow-hidden">
        {custom ? (
          <div
            className="overflow-hidden rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
            dangerouslySetInnerHTML={{ __html: sanitizeAdHtml(custom) }}
          />
        ) : (
          <div className="ad-slot-fallback flex-col gap-1 px-4 py-6 text-center">
            <span className="text-[12px] font-medium text-[var(--fg-muted)]">{z?.name ?? zone}</span>
            <span className="max-w-xl text-[11px] text-[var(--fg-muted)] opacity-60">Ad slot</span>
          </div>
        )}
      </div>
    </div>
  );
}
