"use client";

import React, { useState } from "react";
import { useLang } from "@/lib/language-context";

export function copyText(text: string): Promise<boolean> {
  if (!text) return Promise.resolve(false);
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}
function fallbackCopy(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  const { t } = useLang();
  const btnLabel = label ?? t("copyBtn");
  return (
    <button
      onClick={async () => {
        const r = await copyText(text);
        setOk(r);
        setTimeout(() => setOk(false), 1500);
      }}
      className="rounded-lg bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white transition-default hover:bg-[var(--accent-hover)] disabled:opacity-40"
      disabled={!text}
    >
      {ok ? `✓ ${t("copied")}` : btnLabel}
    </button>
  );
}

export function DownloadBtn({ text, filename, mime = "text/plain" }: { text: string; filename: string; mime?: string }) {
  const { t } = useLang();
  return (
    <button
      onClick={() => {
        const blob = new Blob([text], { type: mime });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }}
      disabled={!text}
      className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-[13px] font-semibold text-[var(--fg)] transition-default hover:bg-[var(--bg-recessed)] disabled:opacity-40"
    >
      {t("download")}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-semibold text-[var(--fg-secondary)]">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-[13px] text-[var(--fg)] outline-none transition-default focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bg)]";

export const textareaCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 font-mono text-[13px] text-[var(--fg)] outline-none transition-default focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-bg)]";

export function ResultBox({ children, mono = true }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <div
      className={`min-h-[80px] whitespace-pre-wrap break-words rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-recessed)] p-3 text-[13px] text-[var(--fg)] ${
        mono ? "font-mono" : ""
      }`}
    >
      {children}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string | number | React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-center">
      <div className="text-[20px] font-extrabold text-[var(--fg)]" suppressHydrationWarning>{value}</div>
      <div className="mt-1 text-[11px] font-medium text-[var(--fg-muted)]">{label}</div>
    </div>
  );
}

export function removeAccents(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function toSlug(s: string): string {
  return removeAccents(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
