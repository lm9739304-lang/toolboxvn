"use client";

import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import AdSlot from "./AdSlot";
import { CATEGORY_ICONS } from "./Icon";
import { useLang } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { getToolDisplay } from "@/lib/tools";

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
  const popularTools = popularSlugs.map((s) => TOOLS.find((tool) => tool.slug === s)).filter(Boolean) as typeof TOOLS;
  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot zone="footer-bottom" />
        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-[14px] font-bold tracking-[-0.02em]">
              <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[var(--accent)] text-[9px] font-black text-white">T</span>
              toolbox<span className="text-[var(--accent)]">vn</span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[var(--fg-secondary)]">
              {t("footerDesc")}
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("footerCategories")}</h3>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.slice(0, 6).map((c) => {
                const CatIcon = CATEGORY_ICONS[c.name];
                const catKey = CAT_KEY_MAP[c.name];
                return (
                  <li key={c.name}>
                    <Link href={`/?cat=${encodeURIComponent(c.name)}`} className="flex items-center gap-2 text-[13px] text-[var(--fg-secondary)] tg hover:text-[var(--fg)]">
                      {CatIcon && <CatIcon className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      {catKey ? t(catKey) : c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("footerPopular")}</h3>
            <ul className="mt-3 space-y-2">
              {popularTools.map((tool) => {
                const d = getToolDisplay(tool, lang);
                return (
                  <li key={tool.slug}>
                    <Link className="text-[13px] text-[var(--fg-secondary)] tg hover:text-[var(--fg)]" href={`/cong-cu/${tool.slug}`}>
                      {d.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("footerInfo")}</h3>
            <ul className="mt-3 space-y-2">
              <li><Link className="text-[13px] text-[var(--fg-secondary)] tg hover:text-[var(--fg)]" href="/admin">Admin</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] tg hover:text-[var(--fg)]" href="/">{t("footerAllTools")}</Link></li>
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-[var(--fg-muted)]">
              {t("footerAds")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] py-5 text-[11px] text-[var(--fg-muted)]">
          <span>&copy; 2026 toolboxvn</span>
          <span>{t("footerCopyright")}</span>
        </div>
      </div>
    </footer>
  );
}
