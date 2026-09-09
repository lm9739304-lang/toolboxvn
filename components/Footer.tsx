"use client";

import Link from "next/link";
import { CATEGORIES, TOOLS, getToolDisplay } from "@/lib/tools";
import AdSlot from "./AdSlot";
import { useLang } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const CAT_KEY_MAP: Record<string, keyof typeof translations.en> = {
  "Văn bản": "catText",
  "Mã hoá & Dev": "catDev",
  "Màu sắc": "catColor",
  "Ngẫu nhiên": "catRandom",
  "Chuyển đổi": "catConvert",
  "Tài chính": "catFinance",
  "Sức khoẻ": "catHealth",
  "Thời gian": "catTime",
  "SEO & Marketing": "catSeo",
  "Hình ảnh": "catImage",
  "Tiện ích": "catUtility",
};

export default function Footer() {
  const { t, lang } = useLang();
  const popularSlugs = ["dem-tu", "tao-mat-khau", "json-formatter", "tao-ma-qr", "tinh-bmi"];
  const popularTools = popularSlugs
    .map((s) => TOOLS.find((tool) => tool.slug === s))
    .filter(Boolean) as typeof TOOLS;

  return (
    <footer className="mt-8 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot zone="footer-bottom" />

        <div className="py-12">
          <Link
            href="/"
            className="tb-wordmark block text-[clamp(2.8rem,11vw,8rem)] text-[var(--fg)]"
            aria-label="ToolboxVN home"
          >
            TOOLBOX<span style={{ color: "var(--accent)" }}>VN</span>
          </Link>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">
            {t("footerStatement")}
          </p>

          <div className="mt-10 grid gap-10 border-t border-[var(--border-subtle)] pt-8 sm:grid-cols-3">
            <nav aria-label={t("footerExplore")}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                {t("footerExplore")}
              </p>
              <ul className="mt-3 space-y-2 text-[13px]">
                <li>
                  <a href="#explorer" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">
                    {t("navTools")}
                  </a>
                </li>
                <li>
                  <a href="#explorer" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">
                    {t("navCategories")}
                  </a>
                </li>
                <li>
                  <a href="#popular" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">
                    {t("navPopular")}
                  </a>
                </li>
                <li>
                  <Link href="/" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">
                    {t("footerAllTools")}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label={t("footerCategories")}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                {t("footerCategories")}
              </p>
              <ul className="mt-3 space-y-2 text-[13px]">
                {CATEGORIES.slice(0, 6).map((c) => {
                  const key = CAT_KEY_MAP[c.name];
                  return (
                    <li key={c.name}>
                      <Link
                        href={`/?cat=${encodeURIComponent(c.name)}`}
                        className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]"
                      >
                        {key ? t(key) : c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                {t("footerCompany")}
              </p>
              <ul className="mt-3 space-y-2 text-[13px]">
                {popularTools.slice(0, 4).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/cong-cu/${tool.slug}`}
                      className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]"
                    >
                      {getToolDisplay(tool, lang).name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/admin" className="tb-link text-[var(--fg-secondary)] hover:text-[var(--fg)]">
                    {t("navAdmin")}
                  </Link>
                </li>
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
