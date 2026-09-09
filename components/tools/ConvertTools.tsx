"use client";

import React, { useMemo, useState } from "react";
import { CopyBtn, Field, ResultBox, inputCls } from "./ui";

export function NumberBase() {
  const [dec, setDec] = useState("255");
  const n = useMemo(() => { const v = parseInt(dec, 10); return isNaN(v) ? null : v; }, [dec]);
  const [fromBase, setFromBase] = useState("10");
  const [fromVal, setFromVal] = useState("ff");
  const conv = useMemo(() => { try { return parseInt(fromVal, parseInt(fromBase)); } catch { return NaN; } }, [fromVal, fromBase]);
  return (
    <div className="space-y-4">
      <Field label="Số thập phân"><input value={dec} onChange={(e) => setDec(e.target.value)} className={inputCls} inputMode="numeric" /></Field>
      {n !== null && (
        <div className="grid gap-2 sm:grid-cols-2">
          {[["BIN (2)", n.toString(2)], ["OCT (8)", n.toString(8)], ["DEC (10)", n.toString(10)], ["HEX (16)", n.toString(16).toUpperCase()]].map(([l, v]) => (
            <div key={l} className="flex items-center gap-2 rounded-xl border bg-[var(--bg-elevated)] p-2.5"><span className="text-xs font-bold text-[var(--fg-muted)]">{l}</span><code className="flex-1 break-all font-mono text-sm font-bold">{v}</code><CopyBtn text={v} label="Copy" /></div>
          ))}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <Field label="Từ hệ"><select value={fromBase} onChange={(e) => setFromBase(e.target.value)} className={inputCls}><option value="2">Bin</option><option value="8">Oct</option><option value="10">Dec</option><option value="16">Hex</option></select></Field>
        <Field label="Giá trị"><input value={fromVal} onChange={(e) => setFromVal(e.target.value)} className={`${inputCls} font-mono`} /></Field>
      </div>
      <ResultBox>{isNaN(conv) ? "Không hợp lệ" : `DEC: ${conv}`}</ResultBox>
    </div>
  );
}

const ROMAN: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
export function Roman() {
  const [num, setNum] = useState("2026");
  const [roman, setRoman] = useState("MMXXVI");
  const toRoman = (n: number) => { let s = ""; for (const [v, r] of ROMAN) while (n >= v) { s += r; n -= v; } return s; };
  const fromRoman = (s: string) => {
    const m: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let t = 0, prev = 0;
    for (let i = s.toUpperCase().length - 1; i >= 0; i--) { const v = m[s.toUpperCase()[i]] ?? 0; t += v < prev ? -v : v; prev = v; }
    return t;
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Số Ả Rập → La Mã"><input value={num} onChange={(e) => setNum(e.target.value)} className={inputCls} /><p className="mt-2 font-mono text-2xl font-extrabold">{toRoman(Math.max(1, Math.min(3999, +num || 0)))}</p></Field>
      <Field label="La Mã → Số"><input value={roman} onChange={(e) => setRoman(e.target.value)} className={`${inputCls} font-mono uppercase`} /><p className="mt-2 font-mono text-2xl font-extrabold">{fromRoman(roman)}</p></Field>
    </div>
  );
}

const VI_NUM = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
function readVi(n: number): string {
  if (n === 0) return "không";
  if (n < 10) return VI_NUM[n];
  if (n < 20) return n === 10 ? "mười" : n === 15 ? "mười lăm" : "mười " + VI_NUM[n % 10];
  if (n < 100) { const c = Math.floor(n / 10), l = n % 10; return VI_NUM[c] + " mươi" + (l === 0 ? "" : l === 1 ? " mốt" : l === 5 ? " lăm" : " " + VI_NUM[l]); }
  if (n < 1000) { const t = Math.floor(n / 100), r = n % 100; return VI_NUM[t] + " trăm" + (r === 0 ? "" : r < 10 ? " lẻ " + VI_NUM[r] : " " + readVi(r)); }
  if (n < 1e6) { const th = Math.floor(n / 1000), r = n % 1000; return readVi(th) + " nghìn" + (r ? " " + readVi(r) : ""); }
  if (n < 1e9) { const m = Math.floor(n / 1e6), r = n % 1e6; return readVi(m) + " triệu" + (r ? " " + readVi(r) : ""); }
  const b = Math.floor(n / 1e9), r = n % 1e9;
  return readVi(b) + " tỷ" + (r ? " " + readVi(r) : "");
}
export function NumberWords() {
  const [n, setN] = useState("1234567");
  const v = parseInt(n.replace(/\D/g, "")) || 0;
  return (
    <div className="space-y-3">
      <Field label="Nhập số"><input value={n} onChange={(e) => setN(e.target.value)} className={`${inputCls} font-mono`} inputMode="numeric" /></Field>
      <ResultBox>{readVi(Math.min(v, 999999999999))}</ResultBox>
      <ResultBox><span suppressHydrationWarning>{v.toLocaleString("en-US")}</span></ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={readVi(v)} /></div>
    </div>
  );
}

type Unit = { label: string; toBase: number };
function UnitConverter({ units, baseLabel }: { units: Unit[]; baseLabel: string }) {
  const [val, setVal] = useState("1");
  const [from, setFrom] = useState(0);
  const v = parseFloat(val) || 0;
  const base = v * units[from].toBase;
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={`Giá trị (${baseLabel})`}><input value={val} onChange={(e) => setVal(e.target.value)} className={`${inputCls} font-mono`} inputMode="decimal" /></Field>
        <Field label="Từ đơn vị"><select value={from} onChange={(e) => setFrom(+e.target.value)} className={inputCls}>{units.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}</select></Field>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {units.map((u) => {
          const c = base / u.toBase;
          const disp = Math.abs(c) >= 1e9 || (Math.abs(c) < 1e-6 && c !== 0) ? c.toExponential(4) : String(Math.round(c * 1e6) / 1e6);
          return <div key={u.label} className="flex items-center gap-2 rounded-xl border bg-[var(--bg-elevated)] p-2.5"><span className="w-24 text-xs font-bold text-[var(--fg-muted)]">{u.label}</span><code className="flex-1 font-mono text-sm font-bold">{disp}</code><CopyBtn text={disp} label="Copy" /></div>;
        })}
      </div>
    </div>
  );
}

export const UnitLength = () => <UnitConverter baseLabel="độ dài" units={[{ label: "mm", toBase: 0.001 }, { label: "cm", toBase: 0.01 }, { label: "m", toBase: 1 }, { label: "km", toBase: 1000 }, { label: "inch", toBase: 0.0254 }, { label: "feet", toBase: 0.3048 }, { label: "yard", toBase: 0.9144 }, { label: "mile", toBase: 1609.344 }]} />;
export const UnitWeight = () => <UnitConverter baseLabel="khối lượng" units={[{ label: "mg", toBase: 1e-6 }, { label: "g", toBase: 0.001 }, { label: "kg", toBase: 1 }, { label: "tấn", toBase: 1000 }, { label: "ounce (oz)", toBase: 0.0283495 }, { label: "pound (lb)", toBase: 0.453592 }]} />;
export const UnitArea = () => <UnitConverter baseLabel="diện tích" units={[{ label: "cm²", toBase: 0.0001 }, { label: "m²", toBase: 1 }, { label: "ha", toBase: 10000 }, { label: "km²", toBase: 1e6 }, { label: "sào (Bắc)", toBase: 360 }, { label: "mẫu", toBase: 3600 }, { label: "acre", toBase: 4046.86 }, { label: "feet²", toBase: 0.092903 }]} />;
export const UnitVolume = () => <UnitConverter baseLabel="thể tích" units={[{ label: "ml", toBase: 0.001 }, { label: "lít", toBase: 1 }, { label: "m³", toBase: 1000 }, { label: "gallon (US)", toBase: 3.78541 }, { label: "cup", toBase: 0.24 }, { label: "fl oz", toBase: 0.0295735 }]} />;
export const UnitSpeed = () => <UnitConverter baseLabel="tốc độ" units={[{ label: "m/s", toBase: 1 }, { label: "km/h", toBase: 1 / 3.6 }, { label: "mph", toBase: 0.44704 }, { label: "knot", toBase: 0.514444 }, { label: "Mach", toBase: 343 }]} />;
export const UnitData = () => <UnitConverter baseLabel="lưu trữ" units={[{ label: "bit", toBase: 0.125 }, { label: "Byte", toBase: 1 }, { label: "KB", toBase: 1000 }, { label: "MB", toBase: 1e6 }, { label: "GB", toBase: 1e9 }, { label: "TB", toBase: 1e12 }, { label: "KiB", toBase: 1024 }, { label: "MiB", toBase: 1048576 }, { label: "GiB", toBase: 1073741824 }]} />;
export const UnitTime = () => <UnitConverter baseLabel="thời gian" units={[{ label: "ms", toBase: 0.001 }, { label: "giây", toBase: 1 }, { label: "phút", toBase: 60 }, { label: "giờ", toBase: 3600 }, { label: "ngày", toBase: 86400 }, { label: "tuần", toBase: 604800 }, { label: "năm", toBase: 31557600 }]} />;
export const UnitPressure = () => <UnitConverter baseLabel="áp suất" units={[{ label: "Pa", toBase: 1 }, { label: "kPa", toBase: 1000 }, { label: "bar", toBase: 100000 }, { label: "psi", toBase: 6894.76 }, { label: "atm", toBase: 101325 }, { label: "mmHg", toBase: 133.322 }]} />;

export function UnitTemp() {
  const [v, setV] = useState("25");
  const [from, setFrom] = useState("C");
  const n = parseFloat(v) || 0;
  const c = from === "C" ? n : from === "F" ? ((n - 32) * 5) / 9 : n - 273.15;
  const f = (c * 9) / 5 + 32, k = c + 273.15;
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Giá trị"><input value={v} onChange={(e) => setV(e.target.value)} className={inputCls} inputMode="decimal" /></Field>
        <Field label="Từ"><select value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls}><option value="C">°C</option><option value="F">°F</option><option value="K">K</option></select></Field>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {[["°C", c] as const, ["°F", f] as const, ["K", k] as const].map(([l, x]) => (
          <div key={l} className="rounded-xl border bg-[var(--bg-elevated)] p-3 text-center"><p className="text-2xl font-extrabold">{Math.round(x * 100) / 100} {l}</p></div>
        ))}
      </div>
    </div>
  );
}

const RATES: Record<string, number> = { VND: 1, USD: 25450, EUR: 27600, JPY: 168, CNY: 3510, KRW: 18.5, GBP: 32200, AUD: 16700, SGD: 18900, THB: 740 };
export function Currency() {
  const [v, setV] = useState("100");
  const [from, setFrom] = useState("USD");
  const n = parseFloat(v) || 0;
  const vnd = n * (RATES[from] ?? 1);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Số tiền"><input value={v} onChange={(e) => setV(e.target.value)} className={inputCls} inputMode="decimal" /></Field>
        <Field label="Từ"><select value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls}>{Object.keys(RATES).map((k) => <option key={k} value={k}>{k}</option>)}</select></Field>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(RATES).map(([k, r]) => (
          <div key={k} className="flex items-center gap-2 rounded-xl border bg-[var(--bg-elevated)] p-2.5"><span className="w-14 text-xs font-bold">{k}</span><code className="flex-1 font-mono text-sm font-bold" suppressHydrationWarning>{(vnd / r).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}</code></div>
        ))}
      </div>
      <p className="text-xs text-[var(--fg-muted)]">Tỉ giá tham khảo (VND), cập nhật tay — không dùng cho giao dịch thực.</p>
    </div>
  );
}
