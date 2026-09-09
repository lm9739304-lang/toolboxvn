"use client";

import Link from "next/link";
import { useLang } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";

export default function InfoPage({
  titleKey,
  leadKey,
  bodyKey,
}: {
  titleKey: TranslationKey;
  leadKey: TranslationKey;
  bodyKey: TranslationKey;
}) {
  const { t } = useLang();
  const body = t(bodyKey) as unknown as string[];

  return (
    <div className="page-enter pb-16">
      <nav
        className="flex items-center gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="tg hover:text-[var(--fg)]">
          {t("breadcrumbHome")}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--fg)]">{t(titleKey)}</span>
      </nav>

      <p className="tb-kicker">ToolboxVN</p>
      <h1 className="tb-headline mt-4 text-[clamp(2.2rem,6vw,3.8rem)] text-[var(--fg)]">
        {t(titleKey)}
      </h1>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--fg-secondary)]">
        {t(leadKey)}
      </p>

      <div className="mt-8 max-w-2xl border-t border-[var(--border-subtle)]">
        {body.map((p, i) => (
          <p
            key={i}
            className="border-b border-[var(--border-subtle)] py-5 text-[14px] leading-relaxed text-[var(--fg-secondary)]"
          >
            {p}
          </p>
        ))}
      </div>

      <Link
        href="/"
        className="tb-go mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--fg-secondary)] tg hover:text-[var(--fg)]"
      >
        <span aria-hidden="true">←</span> {t("backHome")}
      </Link>
    </div>
  );
}
