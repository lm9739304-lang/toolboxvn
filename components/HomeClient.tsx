"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolCard from "./ToolCard";
import AdSlot from "./AdSlot";
import { CATEGORIES, TOOLS, type Tool } from "@/lib/tools";
import { useSite } from "@/lib/site-config";

const TRENDING_SLUGS = [
  "tinh-bmi", "tao-ma-qr", "json-formatter", "ma-hoa-base64",
  "tao-mat-khau", "dem-tu", "tinh-phan-tram", "may-tinh",
  "doi-tien-te", "luong-gross-net", "tinh-diem-gpa", "tinh-tuoi",
  "doi-timestamp", "kiem-tra-regex", "giai-ma-jwt", "tao-lorem",
  "nen-anh", "doi-size-anh", "kiem-tra-mat-khau", "bam-sha256",
];

const HOT_SLUGS = [
  "tao-ma-qr", "tinh-bmi", "json-formatter", "tao-mat-khau",
  "dem-tu", "may-tinh", "doi-tien-te", "luong-gross-net",
];

const NEW_SLUGS = [
  "tinh-diem-gpa", "luyen-go-phim", "tao-chu-ky", "quay-so",
  "doi-don-vi-van-ban", "lich-van-nien-mini", "tao-ma-vach-qr-wifi",
];

const FAV_KEY = "toolboxvn:favorites";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}

function toggleFavorite(slug: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

function QuickLinks({ title, icon, slugs, favorites, onToggleFav }: {
  title: string; icon: string; slugs: string[];
  favorites: string[]; onToggleFav: (s: string) => void;
}) {
  const tools = slugs.map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean) as Tool[];
  return (
    <section className="mt-6">
      <h2 className="text-lg font-extrabold">{icon} {title}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((t) => (
          <Link
            key={t.slug}
            href={`/cong-cu/${t.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
          >
            <span className="text-2xl">{t.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">{t.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{t.category}</p>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(t.slug); }}
              className="shrink-0 text-lg opacity-40 transition hover:opacity-100"
              title={favorites.includes(t.slug) ? "Bỏ yêu thích" : "Yêu thích"}
            >
              {favorites.includes(t.slug) ? "⭐" : "☆"}
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomeClient({ q0 = "", cat0 = "" }: { q0?: string; cat0?: string }) {
  const [q, setQ] = useState(q0);
  const [cat, setCat] = useState(cat0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { enabledTools } = useSite();

  useEffect(() => { setFavorites(getFavorites()); }, []);

  const handleToggleFav = useCallback((slug: string) => {
    const next = toggleFavorite(slug);
    setFavorites([...next]);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return enabledTools.filter((t) => {
      if (cat && t.category !== cat) return false;
      if (!s) return true;
      return (
        t.name.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.keywords.some((k) => k.toLowerCase().includes(s))
      );
    });
  }, [q, cat, enabledTools]);

  const grouped = useMemo(() => {
    if (cat || q.trim()) return null;
    const m = new Map<string, Tool[]>();
    for (const t of filtered) {
      if (!m.has(t.category)) m.set(t.category, []);
      m.get(t.category)!.push(t);
    }
    return [...m.entries()];
  }, [filtered, cat, q]);

  const favTools = useMemo(
    () => enabledTools.filter((t) => favorites.includes(t.slug)).slice(0, 8),
    [enabledTools, favorites]
  );

  const isSearching = q.trim() || cat;

  return (
    <div>
      {/* Hero — compact */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-violet-600 px-5 py-8 text-white sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
            ⚡ 100+ công cụ online miễn phí
          </h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">
            Học tập, công việc & developer — chạy ngay trên trình duyệt, không cần đăng nhập.
          </p>

          {/* Search */}
          <div className="mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-1.5 shadow-lg">
            <span className="pl-2 text-lg">🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Tìm trong ${enabledTools.length} công cụ... (vd: qr, bmi, json)`}
              className="h-10 w-full bg-transparent text-sm text-slate-900 outline-none"
              aria-label="Tìm công cụ"
            />
            {q && (
              <button onClick={() => setQ("")} className="shrink-0 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                Xoá
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-blue-200">
            <span>🔧 100+ Tools</span>
            <span>•</span>
            <span>🆓 Miễn phí 100%</span>
            <span>•</span>
            <span>🔒 Không cần đăng nhập</span>
            <span>•</span>
            <span>⚡ Chạy trên trình duyệt</span>
          </div>

          {/* Category pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            <button
              onClick={() => setCat("")}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${!cat ? "bg-white text-blue-700" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              Tất cả
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setCat(cat === c.name ? "" : c.name)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${cat === c.name ? "bg-white text-blue-700" : "bg-white/20 text-white hover:bg-white/30"}`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search results */}
      {isSearching ? (
        <section className="mt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tìm thấy <b className="text-slate-900 dark:text-slate-100">{filtered.length}</b> công cụ {q && <>cho &ldquo;{q}&rdquo;</>} {cat && <>• {cat}</>}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-slate-500">
              Không tìm thấy. Thử từ khoá khác như &ldquo;qr&rdquo;, &ldquo;bmi&rdquo;, &ldquo;json&rdquo;.
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Favorites */}
          {favTools.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-extrabold">❤️ Công cụ bạn thường dùng</h2>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {favTools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          )}

          {/* Hot */}
          <QuickLinks title="Đang hot" icon="🔥" slugs={HOT_SLUGS} favorites={favorites} onToggleFav={handleToggleFav} />

          {/* Trending */}
          <QuickLinks title="Công cụ được yêu thích" icon="⭐" slugs={TRENDING_SLUGS} favorites={favorites} onToggleFav={handleToggleFav} />

          {/* New */}
          <QuickLinks title="Mới thêm" icon="🆕" slugs={NEW_SLUGS} favorites={favorites} onToggleFav={handleToggleFav} />

          {/* Ad */}
          <AdSlot zone="in-content" />

          {/* All categories */}
          {grouped?.map(([cname, tools]) => {
            const meta = CATEGORIES.find((c) => c.name === cname);
            return (
              <section key={cname} className="mt-8">
                <h2 className="text-lg font-extrabold">{meta?.icon} {cname} <span className="ml-1 text-sm font-medium text-slate-400">({tools.length})</span></h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{meta?.desc}</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {tools.map((t) => (
                    <ToolCard key={t.slug} tool={t} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}

      {/* SEO intro */}
      <section className="mt-12 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">⚡ Tốc độ & riêng tư</h3>
          <p className="mt-1">Mọi xử lý chạy client-side (Web Crypto, Canvas). Dữ liệu không gửi lên server, build tĩnh deploy Vercel/Cloudflare trong 1 phút.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">🔗 Mỗi tool 1 URL riêng</h3>
          <p className="mt-1">Ví dụ /cong-cu/dem-tu, /cong-cu/tao-ma-qr... có sitemap.xml, metadata, JSON-LD chuẩn SEO, dễ chia sẻ.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100">📢 Quảng cáo văn minh</h3>
          <p className="mt-1">Chỉ banner cố định đầu/giữa/cuối trang, có nhãn rõ ràng, cách xa nút chức năng, responsive mobile, tắt/mở trong Admin.</p>
        </div>
      </section>
    </div>
  );
}
