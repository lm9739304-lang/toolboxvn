"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSite } from "@/lib/site-config";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { config } = useSite();
  const router = useRouter();

  return (
    <header className="site-header sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            🧰
          </span>
          <span>
            {config.siteName}
            <span className="ml-2 hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 sm:inline">
              100+ tools miễn phí
            </span>
          </span>
        </Link>
        <form
          className="ml-auto hidden min-w-0 flex-1 max-w-md items-center md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`);
          }}
          role="search"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm công cụ: đếm từ, QR, BMI..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-blue-400 dark:focus:bg-slate-700"
            aria-label="Tìm công cụ"
          />
        </form>
        <nav className="ml-auto flex items-center gap-1 text-sm font-medium md:ml-0">
          <Link href="/" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            Trang chủ
          </Link>
          <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            Admin
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Menu"
          >
            ☰
          </button>
        </nav>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm công cụ..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
              aria-label="Tìm công cụ"
            />
          </form>
        </div>
      )}
    </header>
  );
}
