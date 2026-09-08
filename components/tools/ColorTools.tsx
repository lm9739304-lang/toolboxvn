"use client";

import React, { useMemo, useState } from "react";
import { CopyBtn, Field, ResultBox, inputCls } from "./ui";

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
function luminance(r: number, g: number, b: number) {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function HexToRgb() {
  const [hex, setHex] = useState("#2563eb");
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input type="color" value={/#[0-9a-f]{6}/i.test(hex) ? hex : "#000000"} onChange={(e) => setHex(e.target.value)} className="h-11 w-16 cursor-pointer rounded border" />
        <Field label="Mã HEX"><input value={hex} onChange={(e) => setHex(e.target.value)} className={inputCls} /></Field>
      </div>
      {rgb ? (<>
        <div className="h-20 rounded-xl border" style={{ background: `rgb(${rgb.join(",")})` }} />
        <ResultBox>{`rgb(${rgb.join(", ")})\nhsl(...) xem preview\nHEX: ${hex}`}</ResultBox>
        <div className="tool-action-area flex gap-2"><CopyBtn text={`rgb(${rgb.join(", ")})`} /></div>
      </>) : <p className="text-sm text-red-600">HEX không hợp lệ.</p>}
    </div>
  );
}

export function RgbToHex() {
  const [r, setR] = useState(37); const [g, setG] = useState(99); const [b, setB] = useState(235);
  const hex = rgbToHex(r, g, b);
  return (
    <div className="space-y-3">
      {[["R", r, setR] as const, ["G", g, setG] as const, ["B", b, setB] as const].map(([l, v, set]) => (
        <Field key={l} label={`${l} (0-255)`}>
          <input type="range" min={0} max={255} value={v} onChange={(e) => set(+e.target.value)} className="w-full" />
          <input type="number" min={0} max={255} value={v} onChange={(e) => set(+e.target.value)} className={inputCls} />
        </Field>
      ))}
      <div className="h-20 rounded-xl border" style={{ background: hex }} />
      <ResultBox>{hex}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={hex} /></div>
    </div>
  );
}

export function Palette() {
  const [colors, setColors] = useState(["#2563eb", "#7c3aed", "#db2777", "#f59e0b", "#10b981"]);
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const random = () => setColors(colors.map((c, i) => locked[i] ? c : rgbToHex(Math.random() * 255, Math.random() * 255, Math.random() * 255)));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2 overflow-hidden rounded-2xl">
        {colors.map((c, i) => (
          <button key={i} onClick={() => { const l = [...locked]; l[i] = !l[i]; setLocked(l); }} className="flex h-40 flex-col justify-end p-2 text-xs font-bold text-white" style={{ background: c }} title={locked[i] ? "Đã khoá" : "Bấm để khoá"}>
            {locked[i] ? "🔒" : ""}{c}
          </button>
        ))}
      </div>
      <div className="tool-action-area flex gap-2">
        <button onClick={random} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">🎲 Random (Space)</button>
        <CopyBtn text={colors.join(", ")} label="Copy palette" />
      </div>
    </div>
  );
}

export function Contrast() {
  const [fg, setFg] = useState("#ffffff"); const [bg, setBg] = useState("#2563eb");
  const ratio = useMemo(() => {
    const a = hexToRgb(fg), b = hexToRgb(bg);
    if (!a || !b) return 0;
    const l1 = luminance(...a), l2 = luminance(...b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }, [fg, bg]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Màu chữ"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-11 w-full cursor-pointer" /><input value={fg} onChange={(e) => setFg(e.target.value)} className={inputCls} /></Field>
        <Field label="Màu nền"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-full cursor-pointer" /><input value={bg} onChange={(e) => setBg(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="rounded-xl p-6 text-center text-2xl font-bold" style={{ color: fg, background: bg }}>Aa Xin chào ToolBox</div>
      <p className="text-center text-3xl font-extrabold">{ratio.toFixed(2)}:1</p>
      <p className="text-center text-sm">{ratio >= 7 ? "✅ AAA (tuyệt vời)" : ratio >= 4.5 ? "✅ AA (đạt)" : ratio >= 3 ? "⚠️ Chỉ dùng cho chữ lớn" : "❌ Không đạt"}</p>
    </div>
  );
}

export function Gradient() {
  const [c1, setC1] = useState("#2563eb"); const [c2, setC2] = useState("#db2777"); const [ang, setAng] = useState(135);
  const css = `background: linear-gradient(${ang}deg, ${c1}, ${c2});`;
  return (
    <div className="space-y-3">
      <div className="h-48 rounded-2xl border" style={{ background: `linear-gradient(${ang}deg, ${c1}, ${c2})` }} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Màu 1"><input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-11 w-full" /></Field>
        <Field label="Màu 2"><input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-11 w-full" /></Field>
        <Field label={`Góc ${ang}°`}><input type="range" min={0} max={360} value={ang} onChange={(e) => setAng(+e.target.value)} className="w-full" /></Field>
      </div>
      <ResultBox>{css}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={css} /></div>
    </div>
  );
}

export function ColorPicker() {
  const [c, setC] = useState("#2563eb");
  const rgb = hexToRgb(c);
  return (
    <div className="space-y-3">
      <input type="color" value={c} onChange={(e) => setC(e.target.value)} className="h-24 w-full cursor-pointer rounded-xl border" />
      <ResultBox>{`HEX: ${c}\nRGB: ${rgb ? `rgb(${rgb.join(", ")})` : "?"}`}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={c} /></div>
    </div>
  );
}
