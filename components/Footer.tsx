"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/tools";
import AdSlot from "./AdSlot";
import { CATEGORY_ICONS } from "./Icon";
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
  const { t } = useLang();
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
              {t("footerDesc")}
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("footerCategories")}</h3>
            <ul className="mt-2.5 space-y-1.5">
              {CATEGORIES.slice(0, 6).map((c) => {
                const CatIcon = CATEGORY_ICONS[c.name];
                const catKey = CAT_KEY_MAP[c.name];
                return (
                  <li key={c.name}>
                    <Link href={`/?cat=${encodeURIComponent(c.name)}`} className="flex items-center gap-2 text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]">
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
            <ul className="mt-2.5 space-y-1.5">
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/dem-tu">Word counter</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/tao-mat-khau">Password generator</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/json-formatter">JSON formatter</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/tao-ma-qr">QR generator</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/cong-cu/tinh-bmi">BMI calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("footerInfo")}</h3>
            <ul className="mt-2.5 space-y-1.5">
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/admin">Admin</Link></li>
              <li><Link className="text-[13px] text-[var(--fg-secondary)] transition-default hover:text-[var(--fg)]" href="/">{t("footerAllTools")}</Link></li>
            </ul>
            <p className="mt-3 text-[11px] text-[var(--fg-muted)]">
              {t("footerAds")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] py-4 text-[11px] text-[var(--fg-muted)]">
          <span>&copy; 2026 toolboxvn</span>
          <span>{t("footerCopyright")}</span>
        </div>
      </div>
    </footer>
  );
}
