"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TOOLS } from "@/lib/tools";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0a0e1a]/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-extrabold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm text-white shadow-md shadow-blue-500/20">
              T
            </span>
            <span className="text-base tracking-tight">
              toolbox<span className="text-blue-600 dark:text-blue-400">vn</span>
            </span>
          </Link>

          {/* Search trigger */}
          <button
            onClick={openCmd}
            className="ml-auto flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 md:w-64"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="hidden sm:inline">Tìm công cụ...</span>
            <kbd className="ml-auto hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline dark:border-slate-600 dark:bg-slate-700">⌘K</kbd>
          </button>

          {/* Nav */}
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link href="/?cat=Tiện ích" className="hidden rounded-lg px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">Tools</Link>
            <Link href="/?q=" className="hidden rounded-lg px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">Popular</Link>
            <Link href="/admin" className="hidden rounded-lg px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">Admin</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Command palette */}
      {cmdOpen && (
        <div className="cmd-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={closeCmd}>
          <div
            className="w-full max-w-lg animate-fade-in-scale rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-800">
              <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                ref={inputRef}
                value={cmdQ}
                onChange={(e) => setCmdQ(e.target.value)}
                placeholder="Nhập tên tool, từ khoá..."
                className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none dark:text-slate-100"
              />
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-600 dark:bg-slate-800">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-slate-400">Không tìm thấy công cụ nào.</p>
              )}
              {results.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => { router.push(`/cong-cu/${t.slug}`); closeCmd(); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="text-xl">{t.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{t.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
