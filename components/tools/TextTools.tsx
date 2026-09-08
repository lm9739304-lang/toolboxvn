"use client";

import React, { useMemo, useState } from "react";
import { CopyBtn, DownloadBtn, Field, ResultBox, Stat, inputCls, removeAccents, textareaCls, toSlug } from "./ui";

export function TextStats({ mode }: { mode: string }) {
  const [text, setText] = useState("");
  const s = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = (text.trim().match(/\S+/g) || []).length;
    const sentences = (text.match(/[^.!?…]+[.!?…]+/g) || []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.split(/\n+/).filter((x) => x.trim()).length;
    const lines = text ? text.split("\n").length : 0;
    const bytes = new Blob([text]).size;
    const readMin = words / 200;
    return { chars, charsNoSpace, words, sentences, paragraphs, lines, bytes, readMin };
  }, [text]);
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Dán văn bản vào đây..." className={textareaCls} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Từ" value={s.words} />
        <Stat label="Ký tự" value={s.chars} />
        <Stat label="Không space" value={s.charsNoSpace} />
        <Stat label="Câu" value={text.trim() ? s.sentences : 0} />
        <Stat label="Đoạn" value={s.paragraphs} />
        <Stat label="Dòng" value={s.lines} />
        <Stat label="Bytes" value={s.bytes} />
        <Stat label="Phút đọc" value={s.readMin.toFixed(1)} />
      </div>
      <div className="tool-action-area flex flex-wrap gap-2">
        <CopyBtn text={`Từ: ${s.words}, Ký tự: ${s.chars}, Câu: ${s.sentences}, Đoạn: ${s.paragraphs}`} />
        <button onClick={() => setText("")} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Xoá</button>
      </div>
      {mode === "word-freq" && <WordFreq text={text} />}
    </div>
  );
}

export function WordFreq({ text }: { text: string }) {
  const rows = useMemo(() => {
    const m = new Map<string, number>();
    (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).forEach((w) => m.set(w, (m.get(w) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50);
  }, [text]);
  if (!rows.length) return <p className="text-sm text-slate-500">Nhập văn bản để xem tần suất từ.</p>;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50"><tr><th className="p-2 text-left">Từ</th><th className="p-2 text-right">Số lần</th></tr></thead>
        <tbody>{rows.map(([w, c]) => <tr key={w} className="border-t border-slate-100"><td className="p-2">{w}</td><td className="p-2 text-right font-bold">{c}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function CaseConverter() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const conv = (fn: (s: string) => string) => setOut(fn(text));
  return (
    <div className="space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Nhập văn bản..." className={textareaCls} />
      <div className="tool-action-area flex flex-wrap gap-2">
        <button onClick={() => conv((s) => s.toUpperCase())} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">UPPERCASE</button>
        <button onClick={() => conv((s) => s.toLowerCase())} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">lowercase</button>
        <button onClick={() => conv((s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()))} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">Title Case</button>
        <button onClick={() => conv((s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()))} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">Sentence case</button>
        <button onClick={() => conv((s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join(""))} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">aLtErNaTiNg</button>
        <button onClick={() => conv((s) => [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join(""))} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">iNVERSE</button>
      </div>
      <ResultBox>{out || "Kết quả..."}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /><DownloadBtn text={out} filename="converted.txt" /></div>
    </div>
  );
}

export function ReverseText() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("all");
  const out = useMemo(() => {
    if (mode === "all") return [...text].reverse().join("");
    if (mode === "words") return text.split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? w : [...w].reverse().join(""))).join("");
    return text.split("\n").reverse().join("\n");
  }, [text, mode]);
  return (
    <div className="space-y-3">
      <div className="flex gap-2 text-sm">
        {[["all", "Đảo tất cả"], ["words", "Đảo từng từ"], ["lines", "Đảo dòng"]].map(([v, l]) => (
          <button key={v} onClick={() => setMode(v)} className={`rounded-lg px-3 py-1.5 font-semibold ${mode === v ? "bg-blue-600 text-white" : "bg-slate-100"}`}>{l}</button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={textareaCls} placeholder="Nhập..." />
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function RemoveAccents() {
  const [text, setText] = useState("Tiếng Việt có dấu thật đẹp!");
  const out = useMemo(() => removeAccents(text), [text]);
  return (
    <div className="space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={textareaCls} />
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /><button onClick={() => setText(out)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Dùng kết quả</button></div>
    </div>
  );
}

export function SlugGenerator() {
  const [text, setText] = useState("ToolBox VN: 100+ công cụ online miễn phí!");
  const [sep, setSep] = useState("-");
  const out = useMemo(() => toSlug(text).replace(/-/g, sep || "-"), [text, sep]);
  return (
    <div className="space-y-3">
      <Field label="Tiêu đề bài viết"><input value={text} onChange={(e) => setText(e.target.value)} className={inputCls} /></Field>
      <Field label="Ký tự phân cách"><input value={sep} onChange={(e) => setSep(e.target.value)} className={inputCls} maxLength={1} /></Field>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function CleanSpaces() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  return (
    <div className="space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={textareaCls} placeholder="Văn bản lộn xộn..." />
      <div className="tool-action-area flex flex-wrap gap-2">
        <button onClick={() => setOut(text.replace(/[ \t]+/g, " ").replace(/^[ \t]+|[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim())} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Chuẩn hoá</button>
        <button onClick={() => setOut(text.trim())} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold">Trim 2 đầu</button>
      </div>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function RemoveLinebreaks() {
  const [text, setText] = useState("");
  const [join, setJoin] = useState(" ");
  const out = useMemo(() => text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join(join), [text, join]);
  return (
    <div className="space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={textareaCls} />
      <Field label="Nối bằng"><input value={join} onChange={(e) => setJoin(e.target.value)} className={inputCls} /></Field>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function LineTools({ mode }: { mode: string }) {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const run = () => {
    let lines = text.split("\n");
    if (mode === "sort-lines") lines = [...lines].sort((a, b) => a.localeCompare(b, "vi"));
    if (mode === "sort-lines-desc") lines = [...lines].sort((a, b) => b.localeCompare(a, "vi"));
    if (mode === "dedupe-lines") lines = [...new Set(lines.map((l) => l))].filter((l, i, a) => a.indexOf(l) === i);
    if (mode === "shuffle-lines") lines = [...lines].sort(() => Math.random() - 0.5);
    if (mode === "number-lines") lines = lines.map((l, i) => `${i + 1}. ${l}`);
    if (mode === "reverse-lines") lines = lines.reverse();
    setOut(lines.join("\n"));
  };
  return (
    <div className="space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} className={textareaCls} placeholder="Mỗi dòng một mục..." />
      <div className="tool-action-area flex flex-wrap gap-2">
        <button onClick={run} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Thực hiện</button>
        {mode === "sort-lines" && (<>
          <button onClick={() => setOut([...text.split("\n")].sort((a, b) => a.localeCompare(b, "vi")).join("\n"))} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">A→Z</button>
          <button onClick={() => setOut([...text.split("\n")].sort((a, b) => b.localeCompare(a, "vi")).join("\n"))} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">Z→A</button>
          <button onClick={() => setOut([...text.split("\n")].sort((a, b) => a.length - b.length).join("\n"))} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold">Ngắn→Dài</button>
        </>)}
      </div>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /><DownloadBtn text={out} filename="lines.txt" /></div>
    </div>
  );
}

export function TextDiff() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const diff = useMemo(() => {
    const la = a.split("\n"), lb = b.split("\n");
    const setB = new Set(lb);
    const setA = new Set(la);
    const onlyA = la.filter((l) => !setB.has(l)).length;
    const onlyB = lb.filter((l) => !setA.has(l)).length;
    const same = la.filter((l) => setB.has(l)).length;
    return { onlyA, onlyB, same, totalA: la.filter(Boolean).length, totalB: lb.filter(Boolean).length };
  }, [a, b]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <textarea value={a} onChange={(e) => setA(e.target.value)} rows={8} className={textareaCls} placeholder="Văn bản A..." />
        <textarea value={b} onChange={(e) => setB(e.target.value)} rows={8} className={textareaCls} placeholder="Văn bản B..." />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Dòng giống" value={diff.same} />
        <Stat label="Chỉ có ở A" value={diff.onlyA} />
        <Stat label="Chỉ có ở B" value={diff.onlyB} />
      </div>
      <p className="text-sm text-slate-600">Độ giống: <b>{diff.totalA + diff.totalB ? Math.round((2 * diff.same) / (diff.totalA + diff.totalB) * 100) : 0}%</b> (so theo dòng chính xác).</p>
    </div>
  );
}

export function LoremGen() {
  const [n, setN] = useState(3);
  const [lang, setLang] = useState("vi");
  const paras = [
    "Công cụ online miễn phí giúp bạn làm việc nhanh hơn mỗi ngày. Chỉ cần dán nội dung, kết quả hiện ngay mà không cần đăng nhập.",
    "ToolBox VN chạy hoàn toàn trên trình duyệt nên dữ liệu của bạn không bao giờ rời khỏi máy. Tốc độ nhanh, bảo mật và tối ưu cho mobile.",
    "Từ đếm từ, tạo QR, tính BMI đến format JSON — mọi thứ gói gọn trong một website nhẹ, chuẩn SEO, deploy dễ dàng trên Vercel.",
    "Hãy thử các công cụ văn bản, chuyển đổi đơn vị và tiện ích tài chính. Mỗi công cụ có URL riêng để chia sẻ và lưu bookmark.",
    "Nếu thấy hữu ích, hãy chia sẻ ToolBox VN tới bạn bè. Mọi góp ý giúp chúng tôi cải thiện tốc độ và thêm công cụ mới.",
  ];
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const out = useMemo(() => Array.from({ length: Math.min(20, Math.max(1, n)) }, (_, i) => lang === "vi" ? paras[i % paras.length] : lorem).join("\n\n"), [n, lang]);
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Field label="Số đoạn"><input type="number" value={n} min={1} max={20} onChange={(e) => setN(+e.target.value)} className={inputCls} /></Field>
        <Field label="Ngôn ngữ">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className={inputCls}>
            <option value="vi">Tiếng Việt mẫu</option>
            <option value="en">Lorem Ipsum</option>
          </select>
        </Field>
      </div>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

const FANCY = [
  (s: string) => s.replace(/[a-z]/gi, (c) => String.fromCodePoint(c.toLowerCase().charCodeAt(0) - 97 + 0x1d4d0)),
  (s: string) => `ⓑⓞⓝⓖ ${s}`,
  (s: string) => [...s].join(" "),
  (s: string) => `☆彡${s}彡☆`,
];
export function FancyText() {
  const [text, setText] = useState("ToolBox VN");
  const outs = useMemo(() => {
    try {
      const bold = text.replace(/[A-Za-z]/g, (c) => {
        const base = c <= "Z" ? 0x1d400 : 0x1d41a;
        return String.fromCodePoint(c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + base);
      });
      return [bold, [...text].map((c) => c + "̶").join(""), text.split("").join(" "), `✨ ${text} ✨`, text.toUpperCase().split("").join(" ")];
    } catch { return [text]; }
  }, [text]);
  return (
    <div className="space-y-3">
      <input value={text} onChange={(e) => setText(e.target.value)} className={inputCls} placeholder="Nhập chữ..." />
      {outs.map((o, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
          <span className="flex-1 break-all text-sm">{o}</span>
          <CopyBtn text={o} label="Copy" />
        </div>
      ))}
      <span className="hidden">{FANCY.length}</span>
    </div>
  );
}

export function SeoTrim() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const td = title.length, dd = desc.length;
  return (
    <div className="space-y-3">
      <Field label={`Title (${td}/60 ký tự)'} `}><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Tiêu đề SEO..." /></Field>
      <div className="h-2 overflow-hidden rounded bg-slate-100"><div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (td / 60) * 100)}%` }} /></div>
      <Field label={`Description (${dd}/160 ký tự)`}><textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className={textareaCls} /></Field>
      <div className="h-2 overflow-hidden rounded bg-slate-100"><div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (dd / 160) * 100)}%` }} /></div>
      <div className="tool-action-area flex gap-2"><CopyBtn text={title} label="Copy title" /><CopyBtn text={desc} label="Copy desc" /></div>
    </div>
  );
}

export function KeywordDensity() {
  const [text, setText] = useState("");
  const rows = useMemo(() => {
    const words = (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
    const total = words.length || 1;
    const m = new Map<string, number>();
    words.forEach((w) => { if (w.length > 2) m.set(w, (m.get(w) ?? 0) + 1); });
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([w, c]) => ({ w, c, d: (c / total * 100).toFixed(2) }));
  }, [text]);
  return (
    <div className="space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} className={textareaCls} placeholder="Dán bài viết..." />
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Từ khoá</th><th className="p-2">Số lần</th><th className="p-2">Mật độ</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.w} className="border-t"><td className="p-2">{r.w}</td><td className="p-2 text-center">{r.c}</td><td className="p-2 text-center font-bold">{r.d}%</td></tr>)}</tbody></table>
      </div>
      <p className="text-xs text-slate-500">Mật độ lý tưởng cho từ khoá chính: 1–2%.</p>
    </div>
  );
}
