"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import AdSlot from "./AdSlot";
import { useLang } from "@/lib/language-context";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Footer() {
  const { t } = useLang();
  const revealRef = useReveal();

  return (
    <footer className="mt-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot zone="footer-bottom" />

        <div ref={revealRef} className="reveal py-16">
          {/* Large wordmark */}
          <Link href="/" className="block text-[clamp(3rem,12vw,9rem)] font-black leading-[0.85] tracking-[-0.05em] text-[var(--fg)] transition-colors duration-300 hover:text-[var(--accent)]" aria-label="ToolboxVN home">
            TOOLBOX<span style={{ color: "var(--accent)" }}>VN</span>
          </Link>

          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">
            {t("footerStatement")}
          </p>

          {/* Navigation columns */}
          <div className="mt-12 grid gap-10 border-t border-[var(--border-subtle)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            <nav aria-label={t("footerToolsCol")}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">{t("footerToolsCol")}</p>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><a href="#tools" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("footerAllTools")}</a></li>
                <li><a href="#popular" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("navPopular")}</a></li>
                <li><a href="#categories" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("navCategories")}</a></li>
                <li><a href="#recent" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("recentTitle")}</a></li>
              </ul>
            </nav>

            <nav aria-label={t("footerResourcesCol")}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">{t("footerResourcesCol")}</p>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><Link href="/about" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("aboutTitle")}</Link></li>
                <li><a href="#faq" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("homeFaqKicker")}</a></li>
                <li><a href="mailto:lm9739304@gmail.com" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("contactCta")}</a></li>
                <li><Link href="/admin" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("navAdmin")}</Link></li>
              </ul>
            </nav>

            <nav aria-label={t("footerLegal")}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">{t("footerLegal")}</p>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><Link href="/privacy" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("privacyTitle")}</Link></li>
                <li><Link href="/terms" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">{t("termsTitle")}</Link></li>
              </ul>
            </nav>

            <div aria-label={t("footerContactCol")}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">{t("footerContactCol")}</p>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><a href="mailto:lm9739304@gmail.com" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">lm9739304@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-[var(--border-subtle)] py-5 text-[11px] text-[var(--fg-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TOOLBOXVN</span>
          <span>{t("footerRights")}</span>
        </div>
      </div>
    </footer>
  );
}
