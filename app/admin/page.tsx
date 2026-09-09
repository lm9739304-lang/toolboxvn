"use client";

import { useMemo, useState } from "react";
import { TOOLS, CATEGORIES, TOOL_COUNT } from "@/lib/tools";
import { useSite, KEY, DEFAULT_CONFIG } from "@/lib/site-config";
import type { AdZoneId } from "@/lib/ads";

export default function AdminPage() {
  const { config, setConfig, update, reset } = useSite();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState<"tools" | "ads" | "settings">("tools");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  const login = () => {
    if (pass === config.adminPass) {
      setAuthed(true);
      setMsg("");
    } else setMsg("Sai mật khẩu.");
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TOOLS;
    return TOOLS.filter((t) => t.name.toLowerCase().includes(s) || t.slug.includes(s) || t.category.toLowerCase().includes(s));
  }, [q]);

  const toggleTool = (slug: string) => {
    const has = config.disabledTools.includes(slug);
    update({ disabledTools: has ? config.disabledTools.filter((s) => s !== slug) : [...config.disabledTools, slug] });
  };

  const toggleFeature = (slug: string) => {
    const has = config.featuredTools.includes(slug);
    update({ featuredTools: has ? config.featuredTools.filter((s) => s !== slug) : [...config.featuredTools, slug].slice(0, 8) });
  };

  const setZone = (id: AdZoneId, patch: Partial<(typeof config.adZones)[number]>) => {
    update({ adZones: config.adZones.map((z) => (z.id === id ? { ...z, ...patch } : z)) });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "toolboxvn-config.json";
    a.click();
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-md py-16">
        <div className="rounded-3xl border bg-white p-8 text-center">
          <p className="text-4xl">🔐</p>
          <h1 className="mt-2 text-xl font-extrabold">Trang quản trị toolboxvn</h1>
          <p className="mt-1 text-sm text-slate-500">Mặc định: <code className="rounded bg-slate-100 px-1 font-mono">admin123</code> (đổi trong tab Cài đặt)</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Nhập mật khẩu admin"
            className="mt-4 h-11 w-full rounded-xl border px-4 text-sm outline-none focus:border-blue-500"
          />
          {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
          <button onClick={login} className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 font-bold text-white">Đăng nhập</button>
        </div>
      </div>
    );
  }

  const enabledCount = TOOL_COUNT - config.disabledTools.length;

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold">⚙️ Admin — Quản lý toolboxvn</h1>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">{enabledCount}/{TOOL_COUNT} tools đang bật</span>
        <button onClick={() => setAuthed(false)} className="ml-auto rounded-xl border px-3 py-1.5 text-sm font-bold dark:border-slate-600 dark:text-slate-300">Đăng xuất</button>
      </div>

      <div className="mt-4 flex gap-2">
        {([["tools", "🧰 Công cụ"], ["ads", "📢 Quảng cáo"], ["settings", "⚙️ Cài đặt"]] as const).map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === v ? "bg-slate-900 text-white" : "bg-white border"}`}>{l}</button>
        ))}
      </div>

      {tab === "tools" && (
        <div className="mt-4 rounded-3xl border bg-white p-5">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Lọc: qr, bmi, json..." className="h-11 w-full max-w-md rounded-xl border bg-slate-50 px-4 text-sm outline-none focus:border-blue-500" />
          <div className="mt-2 flex gap-2 text-xs">
            <button onClick={() => update({ disabledTools: [] })} className="rounded-lg bg-emerald-100 px-3 py-1.5 font-bold text-emerald-700">Bật tất cả</button>
            <button onClick={() => { if (confirm("Tắt toàn bộ?")) update({ disabledTools: TOOLS.map((t) => t.slug) }); }} className="rounded-lg bg-red-100 px-3 py-1.5 font-bold text-red-700">Tắt tất cả</button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="border-b text-left text-xs uppercase text-slate-400"><th className="p-2">Công cụ</th><th className="p-2">Danh mục</th><th className="p-2">Nổi bật</th><th className="p-2">Hiển thị</th></tr></thead>
              <tbody>
                {filtered.map((t) => {
                  const off = config.disabledTools.includes(t.slug);
                  const feat = config.featuredTools.includes(t.slug);
                  return (
                    <tr key={t.slug} className={`border-b last:border-0 ${off ? "opacity-50" : ""}`}>
                      <td className="p-2"><span className="mr-2">{t.icon}</span><b>{t.name}</b><br /><span className="font-mono text-xs text-slate-400">/cong-cu/{t.slug}</span></td>
                      <td className="p-2">{t.category}</td>
                      <td className="p-2"><button onClick={() => toggleFeature(t.slug)} className={`rounded-lg px-2 py-1 text-xs font-bold ${feat ? "bg-amber-400 text-white" : "bg-slate-100"}`}>{feat ? "★" : "☆"}</button></td>
                      <td className="p-2">
                        <button onClick={() => toggleTool(t.slug)} className={`relative h-6 w-11 rounded-full transition ${off ? "bg-slate-300" : "bg-emerald-500"}`}>
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${off ? "left-0.5" : "left-[22px]"}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">Danh mục: {CATEGORIES.map((c) => c.name).join(" • ")}</p>
        </div>
      )}

      {tab === "ads" && (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <b>Chính sách an toàn:</b> chỉ banner cố định đầu/giữa/cuối trang, có nhãn “Quảng cáo”, cách nút chức năng ≥32px, không popup/không che nội dung/không giả nút. Mobile tự responsive.
          </div>
          {config.adZones.map((z) => (
            <div key={z.id} className="rounded-3xl border bg-white p-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setZone(z.id, { enabled: !z.enabled })} className={`relative h-6 w-11 rounded-full transition ${z.enabled ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${z.enabled ? "left-[22px]" : "left-0.5"}`} />
                </button>
                <div>
                  <p className="font-extrabold">{z.name} {z.enabled ? <span className="ml-1 rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">ĐANG BẬT</span> : <span className="ml-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">ĐANG TẮT</span>}</p>
                  <p className="text-xs text-slate-500">{z.desc} • Gợi ý: {z.sizes}</p>
                </div>
              </div>
              <label className="mt-3 block text-xs font-bold text-slate-500">Mã quảng cáo — dán only thẻ &lt;ins&gt; (KHÔNG dán &lt;script&gt;):</label>
              <textarea
                value={z.customHtml}
                onChange={(e) => setZone(z.id, { customHtml: e.target.value })}
                rows={3}
                placeholder='<ins class="adsbygoogle" data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto" data-full-width-responsive="true"></ins>'
                className="mt-1 w-full rounded-xl border bg-slate-50 p-3 font-mono text-xs outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">Chỉ dán thẻ <code>&lt;ins class=&quot;adsbygoogle&quot;&gt;</code>, KHÔNG dán <code>&lt;script&gt;</code>. Script AdSense đã load tự động.</p>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-5">
            <h3 className="font-extrabold">Cấu hình chung</h3>
            <label className="mt-3 block text-sm font-bold">Tên site<input value={config.siteName} onChange={(e) => update({ siteName: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3 text-sm font-normal" /></label>
            <label className="mt-3 block text-sm font-bold">Mật khẩu admin<input value={config.adminPass} onChange={(e) => update({ adminPass: e.target.value })} className="mt-1 h-10 w-full rounded-xl border px-3 font-mono text-sm font-normal" /></label>
            <p className="mt-2 text-xs text-slate-400">Lưu trữ: localStorage key <code className="font-mono">{KEY}</code>. Deploy tĩnh nên mỗi trình duyệt lưu riêng.</p>
          </div>
          <div className="rounded-3xl border bg-white p-5">
            <h3 className="font-extrabold">Sao lưu & khôi phục</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={exportJson} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">⬇ Xuất JSON</button>
              <label className="cursor-pointer rounded-xl border px-4 py-2 text-sm font-bold">⬆ Nhập JSON<input type="file" accept=".json" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = () => { try { setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(String(r.result)) }); setMsg("Đã nhập cấu hình."); } catch { setMsg("File lỗi."); } };
                r.readAsText(f);
              }} /></label>
              <button onClick={() => { if (confirm("Reset về mặc định?")) reset(); }} className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700">Reset mặc định</button>
            </div>
            {msg && <p className="mt-2 text-sm text-emerald-600">{msg}</p>}
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs">
              <p><b>Deploy Vercel:</b> <code className="font-mono">npm i && npm run build</code> → upload. Output tĩnh trong <code className="font-mono">out/</code>.</p>
              <p className="mt-1"><b>Cloudflare Pages:</b> Build command <code className="font-mono">npm run build</code>, output <code className="font-mono">out</code>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
