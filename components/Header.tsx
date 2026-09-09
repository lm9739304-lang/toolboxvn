"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TOOLS, getToolDisplay } from "@/lib/tools";
import ThemeToggle from "./ThemeToggle";
import Icon from "./Icon";
import { useLang } from "@/lib/language-context";

export default function Header() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { lang, t, setLang } = useLang();

  const results = useMemo(() => {
    const s = cmdQ.trim().toLowerCase();
    if (!s) return TOOLS.slice(0, 8);
    return TOOLS.filter((tool) => {
      const d = getToolDisplay(tool, lang);
      return (
        tool.name.toLowerCase().includes(s) ||
        d.name.toLowerCase().includes(s) ||
        tool.description.toLowerCase().includes(s) ||
        d.description.toLowerCase().includes(s) ||
        tool.slug.includes(s.replace(/\s+/g, "-")) ||
        tool.keywords.some((k) => k.toLowerCase().includes(s))
      );
    }).slice(0, 12);
  }, [cmdQ, lang]);

  const openCmd = useCallback(() => { setCmdOpen(true); setCmdQ(""); setActiveIdx(0); }, []);
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

  useEffect(() => { setActiveIdx(0); }, [cmdQ]);

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[activeIdx]) {
      router.push(`/cong-cu/${results[activeIdx].slug}`);
      closeCmd();
    }
  };

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[activeIdx] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  return (
    <>
      <header className="site-header sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-6xl items-center gap-5 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-[14px] font-bold tracking-[-0.02em] text-[var(--fg)]">
            <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[var(--accent)] text-[10px] font-black text-white">T</span>
            <span className="hidden sm:inline">toolbox</span><span className="text-[var(--accent)]">vn</span>
          </Link>

          <button
            onClick={openCmd}
            className="ml-auto flex h-8 items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-[13px] text-[var(--fg-muted)] tg hover:border-[var(--border)] hover:text-[var(--fg-secondary)] md:w-52"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <span className="hidden sm:inline">{t("searchPlaceholder")}</span>
            <kbd className="ml-auto hidden rounded-[4px] border border-[var(--border)] bg-[var(--bg-recessed)] px-1 py-px text-[10px] font-medium text-[var(--fg-muted)] sm:inline">⌘K</kbd>
          </button>

          <nav className="flex items-center gap-0.5 text-[13px] font-medium">
            <Link href="/?q=" className="hidden px-2.5 py-1.5 rounded-[6px] text-[var(--fg-muted)] tg hover:text-[var(--fg)] hover:bg-[var(--bg-hover)] sm:block">{t("navPopular")}</Link>
            <Link href="/admin" className="hidden px-2.5 py-1.5 rounded-[6px] text-[var(--fg-muted)] tg hover:text-[var(--fg)] hover:bg-[var(--bg-hover)] sm:block">{t("navAdmin")}</Link>

            <button
              onClick={() => setLang(lang === "en" ? "vi" : "en")}
              className="inline-flex h-7 items-center rounded-[6px] border border-[var(--border)] px-2 text-[11px] font-semibold text-[var(--fg-muted)] tg hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]"
              title={lang === "en" ? "Chuyển tiếng Việt" : "Switch to English"}
            >
              {lang === "en" ? "EN" : "VI"}
            </button>

            <ThemeToggle />
          </nav>
        </div>
      </header>

      {cmdOpen && (
        <div className="cmd-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[18vh]" onClick={closeCmd}>
          <div
            className="w-full max-w-lg overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4">
              <svg className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                ref={inputRef}
                value={cmdQ}
                onChange={(e) => setCmdQ(e.target.value)}
                onKeyDown={handleKeyNav}
                placeholder={t("searchPlaceholder")}
                className="h-12 w-full bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
                aria-label="Search tools"
                role="combobox"
                aria-expanded={cmdOpen}
                aria-controls="cmd-list"
              />
              <kbd className="rounded-[4px] border border-[var(--border)] bg-[var(--bg-recessed)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--fg-muted)]">ESC</kbd>
            </div>
            <div ref={listRef} id="cmd-list" role="listbox" className="max-h-80 overflow-y-auto p-1.5">
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] text-[var(--fg-muted)]">{t("noResults")}</p>
              )}
              {results.map((tool, idx) => {
                const display = getToolDisplay(tool, lang);
                return (
                <button
                  key={tool.slug}
                  role="option"
                  aria-selected={idx === activeIdx}
                  onClick={() => { router.push(`/cong-cu/${tool.slug}`); closeCmd(); }}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left tg-fast ${idx === activeIdx ? "bg-[var(--bg-hover)]" : ""}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--bg-recessed)] text-[var(--fg-muted)]">
                    <Icon name={tool.icon} className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--fg)]">{display.name}</p>
                    <p className="truncate text-[11px] text-[var(--fg-muted)]">{display.description}</p>
                  </div>
                  <span className="shrink-0 rounded-[4px] bg-[var(--bg-recessed)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--fg-muted)]">{tool.category}</span>
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
