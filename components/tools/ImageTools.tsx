"use client";

import React, { useRef, useState } from "react";
import { CopyBtn, Field, ResultBox, inputCls } from "./ui";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

export function ImageCompress() {
  const [q, setQ] = useState(0.8);
  const [info, setInfo] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const onFile = async (f: File) => {
    const img = await loadImage(f);
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    cv.getContext("2d")!.drawImage(img, 0, 0);
    const url = cv.toDataURL("image/jpeg", q);
    setOutUrl(url);
    setInfo(`Gốc: ${(f.size / 1024).toFixed(1)} KB (${img.width}×${img.height}) → Nén: ${(url.length * 0.75 / 1024).toFixed(1)} KB`);
  };
  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="w-full rounded-xl border border-dashed p-4 text-sm" />
      <Field label={`Chất lượng ${Math.round(q * 100)}%`}><input type="range" min={0.1} max={1} step={0.05} value={q} onChange={(e) => setQ(+e.target.value)} className="w-full" /></Field>
      {info && <p className="text-sm font-semibold text-emerald-700">{info}</p>}
      {outUrl && (<><img src={outUrl} alt="compressed" className="max-h-80 rounded-xl border" /><a href={outUrl} download="nen-anh.jpg" className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">⬇ Tải ảnh nén</a></>)}
    </div>
  );
}

export function ImageResize() {
  const [w, setW] = useState("800");
  const [keep, setKeep] = useState(true);
  const [outUrl, setOutUrl] = useState("");
  const [ratio, setRatio] = useState(1);
  const onFile = async (f: File) => {
    const img = await loadImage(f);
    setRatio(img.height / img.width);
    const cv = document.createElement("canvas");
    const nw = +w || img.width;
    cv.width = nw; cv.height = keep ? Math.round(nw * (img.height / img.width)) : img.height;
    cv.getContext("2d")!.drawImage(img, 0, 0, cv.width, cv.height);
    setOutUrl(cv.toDataURL("image/png"));
  };
  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="w-full rounded-xl border border-dashed p-4 text-sm" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Rộng (px)"><input value={w} onChange={(e) => setW(e.target.value.replace(/\D/g, ""))} className={inputCls} /></Field>
        <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />Giữ tỉ lệ (≈ {ratio.toFixed(2)})</label>
      </div>
      {outUrl && (<><img src={outUrl} alt="resized" className="max-h-80 rounded-xl border" /><a href={outUrl} download="resize.png" className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">⬇ Tải ảnh</a></>)}
    </div>
  );
}

export function ImageBase64() {
  const [out, setOut] = useState("");
  const onFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => setOut(String(r.result));
    r.readAsDataURL(f);
  };
  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="w-full rounded-xl border border-dashed p-4 text-sm" />
      {out && (<><img src={out} alt="preview" className="max-h-48 rounded-xl border" /><ResultBox>{out.slice(0, 500) + "..."}</ResultBox><div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div></>)}
    </div>
  );
}

export function FaviconGen() {
  const [text, setText] = useState("🚀");
  const [bg, setBg] = useState("#2563eb");
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = () => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = bg;
    const r = 12;
    ctx.beginPath(); ctx.roundRect(0, 0, 64, 64, r); ctx.fill();
    ctx.font = "36px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, 32, 36);
  };
  React.useEffect(() => { draw(); });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ký tự / emoji"><input value={text} onChange={(e) => setText(e.target.value)} className={inputCls} maxLength={4} /></Field>
        <Field label="Màu nền"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-full" /></Field>
      </div>
      <canvas ref={ref} width={64} height={64} className="h-24 w-24 rounded-xl border" />
      <button onClick={() => { const a = document.createElement("a"); a.download = "favicon.png"; a.href = ref.current!.toDataURL(); a.click(); }} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">⬇ Tải favicon.png</button>
    </div>
  );
}

export function ImageRotate() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [flip, setFlip] = useState<"none" | "h" | "v">("none");
  const ref = useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!img) return;
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const rad = (angle * Math.PI) / 180;
    const swap = angle % 180 !== 0;
    cv.width = swap ? img.height : img.width;
    cv.height = swap ? img.width : img.height;
    ctx.save();
    ctx.translate(cv.width / 2, cv.height / 2);
    ctx.rotate(rad);
    ctx.scale(flip === "h" ? -1 : 1, flip === "v" ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [img, angle, flip]);
  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setImg(await loadImage(f)); }} className="w-full rounded-xl border border-dashed p-4 text-sm" />
      <div className="tool-action-area flex flex-wrap gap-2">
        <button onClick={() => setAngle((a) => (a + 90) % 360)} className="rounded-lg bg-[var(--bg)] px-3 py-2 text-sm font-bold text-white">↻ 90°</button>
        <button onClick={() => setFlip(flip === "h" ? "none" : "h")} className="rounded-lg bg-[var(--bg-recessed)] px-3 py-2 text-sm font-bold">⇋ Lật ngang</button>
        <button onClick={() => setFlip(flip === "v" ? "none" : "v")} className="rounded-lg bg-[var(--bg-recessed)] px-3 py-2 text-sm font-bold">⇅ Lật dọc</button>
        {img && <button onClick={() => { const a = document.createElement("a"); a.download = "anh-xoay.png"; a.href = ref.current!.toDataURL(); a.click(); }} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white">⬇ Tải</button>}
      </div>
      <canvas ref={ref} className="max-h-96 w-full rounded-xl border bg-[var(--bg-elevated)]" />
    </div>
  );
}
