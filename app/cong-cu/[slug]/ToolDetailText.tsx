"use client";

import Link from "next/link";
import Icon, { CATEGORY_ICONS } from "@/components/Icon";
import { useLang } from "@/lib/language-context";
import { getToolDisplay } from "@/lib/tools";
import type { Tool } from "@/lib/tools";

export default function ToolDetailText({ tool }: { tool: Tool }) {
  const { t, lang } = useLang();
  const display = getToolDisplay(tool, lang);
  return (
    <>
      <nav className="flex items-center gap-1.5 py-4 text-[12px] text-[var(--fg-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="transition-default hover:text-[var(--fg)]">{t("breadcrumbHome")}</Link>
        <span>/</span>
        <Link href={`/?cat=${encodeURIComponent(tool.category)}`} className="transition-default hover:text-[var(--fg)]">{tool.category}</Link>
        <span>/</span>
        <span className="font-medium text-[var(--fg)]">{display.name}</span>
      </nav>
    </>
  );
}

export function ToolGuide({ guide }: { guide: string[] }) {
  const { t } = useLang();
  return (
    <section className="mt-6">
      <h2 className="text-[14px] font-semibold text-[var(--fg)]">{t("howToUse")}</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-[var(--fg-secondary)]">
        {(guide.length ? guide : (t("defaultGuide") as unknown as string[])).map((g: string, i: number) => (
          <li key={i}>{g}</li>
        ))}
      </ol>

      <h3 className="mt-6 text-[14px] font-semibold text-[var(--fg)]">{t("faqTitle")}</h3>
      <div className="mt-2 space-y-1 text-[13px]">
        <details className="rounded-lg bg-[var(--bg-recessed)] p-3"><summary className="cursor-pointer font-medium text-[var(--fg)]">{t("faqFree")}</summary><p className="mt-1 text-[var(--fg-secondary)]">{t("faqFreeAnswer")}</p></details>
        <details className="rounded-lg bg-[var(--bg-recessed)] p-3"><summary className="cursor-pointer font-medium text-[var(--fg)]">{t("faqSafe")}</summary><p className="mt-1 text-[var(--fg-secondary)]">{t("faqSafeAnswer")}</p></details>
        <details className="rounded-lg bg-[var(--bg-recessed)] p-3"><summary className="cursor-pointer font-medium text-[var(--fg)]">{t("faqMobile")}</summary><p className="mt-1 text-[var(--fg-secondary)]">{t("faqMobileAnswer")}</p></details>
      </div>
    </section>
  );
}

export function ToolRelated({ related }: { related: Tool[] }) {
  const { t, lang } = useLang();
  return (
    <section className="mt-8">
      <h2 className="text-[14px] font-semibold text-[var(--fg)]">{t("relatedTools")}</h2>
      <div className="mt-3 space-y-1">
        {related.map((r) => {
          const d = getToolDisplay(r, lang);
          return (
            <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="tool-row">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--bg-recessed)] text-[var(--fg-muted)]">
                <Icon name={r.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{d.name}</span>
                <span className="block text-[11px] text-[var(--fg-muted)]">{r.category}</span>
              </div>
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
      <div className="sticky top-16 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            {CATEGORY_ICONS[category] && (() => {
              const CatIcon = CATEGORY_ICONS[category];
              return <CatIcon className="h-3.5 w-3.5 text-[var(--fg-muted)]" strokeWidth={1.5} />;
            })()}
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{category}</p>
          </div>
          <div className="mt-2 space-y-0.5">
            {related.slice(0, 6).map((r) => {
              const d = getToolDisplay(r, lang);
              return (
                <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="block truncate rounded-md px-2 py-1.5 text-[13px] text-[var(--fg-secondary)] transition-default hover:bg-[var(--bg-recessed)] hover:text-[var(--fg)]">
                  {d.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
