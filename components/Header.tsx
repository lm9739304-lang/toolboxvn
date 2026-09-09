"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TOOLS } from "@/lib/tools";
import { getToolDisplay } from "@/lib/tools";
import ThemeToggle from "./ThemeToggle";
import Icon from "./Icon";
import { useLang } from "@/lib/language-context";

export default function Header() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { lang, t, setLang } = useLang();

  const results = useMemo(() => {
    const s = cmdQ.trim().toLowerCase();
    if (!s) return TOOLS.slice(0, 8);
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.slug.includes(s.replace(/\s+/g, "-")) ||
        t.keywords.some((k) => k.toLowerCase().includes(s))
    ).slice(0, 12);
  }, [cmdQ]);

  const openCmd = useCallback(() => { setCmdOpen(true); setCmdQ(""); }, []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); openCmd(); }
      if (e.key === "Escape") closeCmd();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openCmd, closeCmd]);

  useEffect(() => {
    if (cmdOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [cmdOpen]);

  return (
    <>
      <header className="site-header sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg)]">
        <div className="mx-auto flex h-11 max-w-6xl items-center gap-6 px-4">
          <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)] text-[11px] font-bold text-white">
              T
            </span>
            <span>
              toolbox<span className="text-[var(--accent)]">vn</span>
            </span>
          </Link>

          <button
            onClick={openCmd}
            className="ml-auto flex h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-[13px] text-[var(--fg-muted)] transition-default hover:border-[var(--border)] hover:text-[var(--fg-secondary)] md:w-56"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <span className="hidden sm:inline">{t("searchPlaceholder")}</span>
            <kbd className="ml-auto hidden rounded border border-[var(--border)] bg-[var(--bg-recessed)] px-1 py-px text-[10px] font-medium text-[var(--fg-muted)] sm:inline">/</kbd>
          </button>

          <nav className="flex items-center gap-1 text-[13px] font-medium">
            <Link href="/?cat=Tiện%20 ích" className="hidden px-2 py-1 text-[var(--fg-muted)] transition-default hover:text-[var(--fg)] sm:block">{t("navTools")}</Link>
            <Link href="/?q=" className="hidden px-2 py-1 text-[var(--fg-muted)] transition-default hover:text-[var(--fg)] sm:block">{t("navPopular")}</Link>
            <Link href="/admin" className="hidden px-2 py-1 text-[var(--fg-muted)] transition-default hover:text-[var(--fg)] sm:block">{t("navAdmin")}</Link>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "vi" : "en")}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[var(--border)] px-1.5 text-[11px] font-medium text-[var(--fg-muted)] transition-default hover:bg-[var(--bg-recessed)] hover:text-[var(--fg)]"
              title={lang === "en" ? "Chuyển tiếng Việt" : "Switch to English"}
            >
              {lang === "en" ? "EN" : "VI"}
            </button>

            <ThemeToggle />
          </nav>
        </div>
      </header>

      {cmdOpen && (
        <div className="cmd-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={closeCmd}>
          <div
            className="w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4">
              <svg className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                ref={inputRef}
                value={cmdQ}
                onChange={(e) => setCmdQ(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-11 w-full bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
              />
              <kbd className="rounded border border-[var(--border)] bg-[var(--bg-recessed)] px-1.5 py-0.5 text-[10px] text-[var(--fg-muted)]">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-1">
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] text-[var(--fg-muted)]">No tools found.</p>
              )}
              {results.map((tool) => {
                const display = getToolDisplay(tool, lang);
                return (
                <button
                  key={tool.slug}
                  onClick={() => { router.push(`/cong-cu/${tool.slug}`); closeCmd(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-default hover:bg-[var(--bg-recessed)]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-recessed)] text-[var(--fg-muted)]">
                    <Icon name={tool.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--fg)]">{display.name}</p>
                    <p className="truncate text-[12px] text-[var(--fg-muted)]">{display.description}</p>
                  </div>
                  <span className="shrink-0 rounded bg-[var(--bg-recessed)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--fg-muted)]">{tool.category}</span>
                </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
