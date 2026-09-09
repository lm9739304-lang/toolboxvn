"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/tools";
import AdSlot from "./AdSlot";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-6xl px-4">
        <AdSlot zone="footer-bottom" />
        <div className="grid gap-8 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[var(--accent)] text-[10px] font-bold text-white">T</span>
              toolboxvn
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[var(--fg-secondary)]">
              100+ free online tools. Everything runs in your browser. No data uploads. No accounts required.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">Categories</h3>
            <ul className="mt-2.5 space-y-1.5">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.name}>
                  <Link href={`/?cat=${encodeURIComponent(c.name)}`} className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">Popular tools</h3>
            <ul className="mt-2.5 space-y-1.5">
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/dem-tu">Word counter</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/tao-mat-khau">Password generator</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/json-formatter">JSON formatter</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/tao-ma-qr">QR generator</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/tinh-bmi">BMI calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">Info</h3>
            <ul className="mt-2.5 space-y-1.5">
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/admin">Admin</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/">All tools</Link></li>
            </ul>
            <p className="mt-3 text-[11px] text-[var(--fg-muted)]">
              Ads are placed in fixed positions with clear labels. They never obscure content or functional buttons.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] py-4 text-[11px] text-[var(--fg-muted)]">
          <span>&copy; 2026 toolboxvn</span>
          <span>Built for speed. Deployed on Cloudflare Pages.</span>
        </div>
      </div>
    </footer>
  );
}
