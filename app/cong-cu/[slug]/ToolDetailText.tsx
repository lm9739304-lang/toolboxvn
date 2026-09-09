"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useLang } from "@/lib/language-context";
import { getToolDisplay } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import type { Tool } from "@/lib/tools";

export default function ToolDetailText({ tool }: { tool: Tool }) {
  const { t, lang } = useLang();
  const display = getToolDisplay(tool, lang);
  return (
    <>
      <nav className="flex items-center gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="tg hover:text-[var(--fg)]">{t("breadcrumbHome")}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/?cat=${encodeURIComponent(tool.category)}`} className="tg hover:text-[var(--fg)]">{tool.category}</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--fg)]">{display.name}</span>
      </nav>
    </>
  );
}

export function ToolExplanation({ tool }: { tool: Tool }) {
  const { t, lang } = useLang();
  const display = getToolDisplay(tool, lang);
  const content = getToolContent(tool, lang, display.description);
  if (!content.why) return null;
  return (
    <section className="mt-10 grid gap-8 sm:grid-cols-2">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {t("toolWhat")}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-secondary)]">
          {content.what}
        </p>
      </div>
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {t("toolWhy")}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-secondary)]">
          {content.why}
        </p>
      </div>
    </section>
  );
}

export function ToolExampleBlock({ tool }: { tool: Tool }) {
  const { t, lang } = useLang();
  const display = getToolDisplay(tool, lang);
  const content = getToolContent(tool, lang, display.description);
  if (!content.example) return null;
  return (
    <section className="mt-8 border-t border-[var(--border-subtle)] pt-8">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
        {t("toolExample")}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-secondary)]">
        {content.example}
      </p>
    </section>
  );
}

export function ToolGuide({ guide }: { guide: string[] }) {
  const { t } = useLang();
  const steps = guide.length ? guide : (t("defaultGuide") as unknown as string[]);
  const faqs: [string, string][] = [
    [t("faqFree"), t("faqFreeAnswer")],
    [t("faqSafe"), t("faqSafeAnswer")],
    [t("faqMobile"), t("faqMobileAnswer")],
  ];
  return (
    <section className="mt-12">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
        {t("howToUse")}
      </p>
      <ol className="mt-1 border-t border-[var(--border-subtle)]">
        {steps.map((g: string, i: number) => (
          <li
            key={i}
            className="flex gap-5 border-b border-[var(--border-subtle)] py-3.5 text-[13px] leading-relaxed text-[var(--fg-secondary)]"
          >
            <span className="shrink-0 font-mono text-[11px] text-[var(--fg-muted)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{g}</span>
          </li>
        ))}
      </ol>

      <p className="mb-1 mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
        {t("faqTitle")}
      </p>
      <div className="border-t border-[var(--border-subtle)]">
        {faqs.map(([q, a]) => (
          <details key={q} className="group border-b border-[var(--border-subtle)] py-3.5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-semibold text-[var(--fg)] [&::-webkit-details-marker]:hidden">
              {q}
              <span
                className="shrink-0 text-[15px] font-normal text-[var(--fg-muted)] transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[var(--fg-secondary)]">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ToolRelated({ related }: { related: Tool[] }) {
  const { t, lang } = useLang();
  return (
    <section className="mt-12">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
        {t("relatedTools")}
      </p>
      <div className="mt-2" role="list">
        {related.map((r, i) => {
          const d = getToolDisplay(r, lang);
          return (
            <Link key={r.slug} href={`/cong-cu/${r.slug}`} role="listitem" className="tb-entry group">
              <span className="tb-num">{String(i + 1).padStart(2, "0")}</span>
              <Icon name={r.icon} className="h-[18px] w-[18px] text-[var(--fg-secondary)]" />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-semibold tracking-[-0.01em]">{d.name}</span>
                <span className="mt-0.5 block truncate text-[12px] text-[var(--fg-muted)]">{r.category}</span>
              </span>
              <span className="tb-arrow" aria-hidden="true">↗</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ToolSidebar({ category, related }: { category: string; related: Tool[] }) {
  const { lang } = useLang();
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {category}
        </p>
        <div className="mt-2 border-t border-[var(--border-subtle)]">
          {related.slice(0, 6).map((r) => {
            const d = getToolDisplay(r, lang);
            return (
              <Link
                key={r.slug}
                href={`/cong-cu/${r.slug}`}
                className="tg flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] py-2.5 text-[13px] text-[var(--fg-secondary)] hover:pl-1 hover:text-[var(--fg)]"
              >
                <span className="truncate">{d.name}</span>
                <span aria-hidden="true" className="text-[11px] text-[var(--fg-muted)]">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
