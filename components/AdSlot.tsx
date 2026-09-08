"use client";

import React from "react";
import { useSite } from "@/lib/site-config";
import { sanitizeAdHtml } from "@/lib/ads";
import type { AdZoneId } from "@/lib/ads";

/**
 * AdSlot — khu vực quảng cáo an toàn:
 * - Luôn có nhãn "Quảng cáo" + margin lớn (≥32px) cách nút chức năng.
 * - Không sticky/fixed che nội dung, không popup, không giả nút.
 * - Responsive: mobile co giãn 100%, không tràn ngang.
 * - Admin bật/tắt từng zone, dán custom HTML (Adsense).
 */
export default function AdSlot({ zone, className = "" }: { zone: AdZoneId; className?: string }) {
  const { isAdEnabled, getAdZone } = useSite();
  if (!isAdEnabled(zone)) return null;
  const z = getAdZone(zone);
  const custom = z?.customHtml?.trim() ?? "";

  return (
    <div
      className={`ad-slot ${className}`}
      role="complementary"
      aria-label={`Quảng cáo: ${z?.name ?? zone}`}
      style={{ minHeight: 90 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-1 flex items-center justify-center gap-2">
          <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Quảng cáo
          </span>
        </div>
        {custom ? (
          <div
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            dangerouslySetInnerHTML={{ __html: sanitizeAdHtml(custom) }}
          />
        ) : (
          <div className="flex min-h-[90px] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 py-6 text-center">
            <span className="text-sm font-semibold text-slate-500">
              {z?.name ?? zone} — {z?.sizes ?? "Responsive"}
            </span>
            <span className="max-w-xl text-xs text-slate-400">
              Vị trí dành cho Google AdSense. Dán mã vào Trang Admin → Quảng cáo. Banner responsive, không che nội
              dung.
            </span>
            <span className="mt-1 hidden text-[11px] text-slate-300 sm:block">970×250 • 728×90 • 336×280 • 320×100</span>
          </div>
        )}
      </div>
    </div>
  );
}
