"use client";

import { useMemo, useState } from "react";
import ToolCard from "./ToolCard";
import AdSlot from "./AdSlot";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { useSite } from "@/lib/site-config";

export default function HomeClient({ q0 = "", cat0 = "" }: { q0?: string; cat0?: string }) {
  const [q, setQ] = useState(q0);
  const [cat, setCat] = useState(cat0);
  const { enabledTools, config } = useSite();

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

  const featured = useMemo(
    () => enabledTools.filter((t) => config.featuredTools.includes(t.slug)).slice(0, 8),
    [enabledTools, config.featuredTools]
  );

  const grouped = useMemo(() => {
    if (cat || q.trim()) return null;
    const m = new Map<string, typeof TOOLS>();
    for (const t of filtered) {
      if (!m.has(t.category)) m.set(t.category, []);
      m.get(t.category)!.push(t);
    }
    return [...m.entries()];
  }, [filtered, cat, q]);

  return (
    <div>
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-violet-600 p-8 text-white sm:p-12">
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
          100+ công cụ online miễn phí, siêu nhanh
        </h1>
        <p className="mt-3 max-w-2xl text-blue-100">
          Đếm từ, tạo QR, format JSON, tính BMI, đổi tiền tệ... Chạy 100% trên trình duyệt — không cần đăng nhập,
          mỗi công cụ có URL riêng chuẩn SEO.
        </p>
        <div className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2">
          <span className="pl-2">🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Tìm trong ${enabledTools.length} công cụ... (vd: qr, bmi, json)`}
            className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none dark:text-slate-100"
            aria-label="Tìm công cụ"
          />
          {q && (
            <button onClick={() => setQ("")} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
              Xoá
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCat("")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${!cat ? "bg-white text-blue-700" : "bg-white/20 text-white hover:bg-white/30"}`}
          >
            Tất cả
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setCat(cat === c.name ? "" : c.name)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${cat === c.name ? "bg-white text-blue-700" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      {!q && !cat && featured.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold">⭐ Được dùng nhiều nhất</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* In-content ad: sau hero / trước lưới chính */}
      <AdSlot zone="in-content" />

      {/* Results */}
      {q || cat ? (
        <section className="mt-4">
          <p className="text-sm text-slate-500">
            Tìm thấy <b className="text-slate-900">{filtered.length}</b> công cụ {q && <>cho “{q}”</>} {cat && <>• {cat}</>}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-slate-500">
              Không tìm thấy. Thử từ khoá khác như “qr”, “bmi”, “json”.
            </div>
          )}
        </section>
      ) : (
        grouped?.map(([cname, tools]) => {
          const meta = CATEGORIES.find((c) => c.name === cname);
          return (
            <section key={cname} className="mt-8">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-extrabold">
                  {meta?.icon} {cname} <span className="ml-1 text-sm font-medium text-slate-400">({tools.length})</span>
                </h2>
              </div>
              <p className="text-sm text-slate-500">{meta?.desc}</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* SEO intro */}
      <section className="mt-12 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <div>
          <h3 className="font-bold text-slate-900">⚡ Tốc độ & riêng tư</h3>
          <p className="mt-1">Mọi xử lý chạy client-side (Web Crypto, Canvas). Dữ liệu không gửi lên server, build tĩnh deploy Vercel/Cloudflare trong 1 phút.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">🔗 Mỗi tool 1 URL riêng</h3>
          <p className="mt-1">Ví dụ /cong-cu/dem-tu, /cong-cu/tao-ma-qr... có sitemap.xml, metadata, JSON-LD chuẩn SEO, dễ chia sẻ.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">📢 Quảng cáo văn minh</h3>
          <p className="mt-1">Chỉ banner cố định đầu/giữa/cuối trang, có nhãn rõ ràng, cách xa nút chức năng, responsive mobile, tắt/mở trong Admin.</p>
        </div>
      </section>
    </div>
  );
}
