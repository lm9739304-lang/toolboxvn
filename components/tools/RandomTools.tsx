"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useMemo, useState } from "react";
import { CopyBtn, Field, ResultBox, inputCls } from "./ui";

export function PasswordGen() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [noAmbig, setNoAmbig] = useState(true);
  const [pwd, setPwd] = useState("");
  const gen = () => {
    let pool = "";
    if (lower) pool += "abcdefghjkmnpqrstuvwxyz";
    if (upper) pool += noAmbig ? "ABCDEFGHJKMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (nums) pool += noAmbig ? "23456789" : "0123456789";
    if (syms) pool += "!@#$%^&*()-_=+[]{}";
    if (!lower && !upper) pool += "abcdefghjkmnpqrstuvwxyz";
    if (!pool) pool = "abcdefghjkmnpqrstuvwxyz";
    if (!noAmbig && lower) pool += "ilo";
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    setPwd([...arr].map((n) => pool[n % pool.length]).join(""));
  };
  useEffect(() => { gen(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-slate-900 p-4 text-center font-mono text-xl text-emerald-300 break-all">{pwd || "..."}</div>
      <Field label={`Độ dài: ${len}`}><input type="range" min={4} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full" /></Field>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {[["Chữ hoa", upper, setUpper] as const, ["Chữ thường", lower, setLower] as const, ["Số", nums, setNums] as const, ["Ký hiệu", syms, setSyms] as const].map(([l, v, s]) => (
          <label key={l} className="flex items-center gap-2 rounded-lg border p-2"><input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} />{l}</label>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noAmbig} onChange={(e) => setNoAmbig(e.target.checked)} />Loại trừ ký tự dễ nhầm (0/O, 1/l)</label>
      <div className="tool-action-area flex gap-2">
        <button onClick={gen} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">🎲 Tạo mới</button>
        <CopyBtn text={pwd} />
      </div>
    </div>
  );
}

export function PasswordStrength() {
  const [pwd, setPwd] = useState("");
  const r = useMemo(() => {
    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 20;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
    if (/\d/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    const label = score >= 80 ? "Rất mạnh" : score >= 60 ? "Mạnh" : score >= 40 ? "Trung bình" : score >= 20 ? "Yếu" : "Rất yếu";
    return { score: Math.min(100, score), label };
  }, [pwd]);
  return (
    <div className="space-y-3">
      <Field label="Nhập mật khẩu"><input type="text" value={pwd} onChange={(e) => setPwd(e.target.value)} className={inputCls} /></Field>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full transition-all ${r.score >= 80 ? "bg-emerald-500" : r.score >= 60 ? "bg-blue-500" : r.score >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${r.score}%` }} /></div>
      <p className="text-xl font-extrabold">{r.score}/100 — {r.label}</p>
    </div>
  );
}

export function UuidGen() {
  const [n, setN] = useState(5);
  const [upper, setUpper] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const gen = () => {
    const arr = Array.from({ length: Math.min(100, Math.max(1, n)) }, () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
    );
    setList(upper ? arr.map((s) => s.toUpperCase()) : arr);
  };
  useEffect(() => { gen(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Field label="Số lượng"><input type="number" value={n} min={1} max={100} onChange={(e) => setN(+e.target.value)} className={inputCls} /></Field>
        <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />UPPERCASE</label>
      </div>
      <div className="tool-action-area"><button onClick={gen} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Tạo UUID</button></div>
      <ResultBox>{list.join("\n")}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={list.join("\n")} /></div>
    </div>
  );
}

export function QrGen({ wifi = false }: { wifi?: boolean }) {
  const [text, setText] = useState(wifi ? "" : "https://toolbox.vn");
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");
  const [size, setSize] = useState(220);
  const data = wifi ? `WIFI:T:WPA;S:${ssid};P:${pass};;` : text;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data || " ") }`;
  return (
    <div className="space-y-3">
      {wifi ? (<>
        <Field label="Tên WiFi (SSID)"><input value={ssid} onChange={(e) => setSsid(e.target.value)} className={inputCls} /></Field>
        <Field label="Mật khẩu"><input value={pass} onChange={(e) => setPass(e.target.value)} className={inputCls} /></Field>
      </>) : (
        <Field label="Nội dung QR"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className={inputCls} /></Field>
      )}
      <Field label={`Kích thước ${size}px`}><input type="range" min={120} max={500} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full" /></Field>
      <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="QR code" width={size} height={size} loading="lazy" />
      </div>
      <div className="tool-action-area flex justify-center gap-2">
        <a href={url} download="qr.png" target="_blank" rel="noreferrer" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">⬇ Tải PNG</a>
        <CopyBtn text={data} />
      </div>
    </div>
  );
}

export function BarcodeGen() {
  const [text, setText] = useState("123456789");
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#000";
    let x = 20;
    const s = text || "0";
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      for (let b = 0; b < 8; b++) {
        const w = ((code >> b) & 1) ? 4 : 2;
        if ((code >> b) & 1) ctx.fillRect(x, 20, w, 100);
        x += w + 2;
      }
      x += 6;
    }
    ctx.font = "20px monospace"; ctx.textAlign = "center";
    ctx.fillText(s, cv.width / 2, 145);
  }, [text]);
  return (
    <div className="space-y-3">
      <Field label="Nội dung barcode"><input value={text} onChange={(e) => setText(e.target.value)} className={inputCls} /></Field>
      <canvas ref={ref} width={600} height={160} className="w-full rounded-xl border bg-white" />
      <div className="tool-action-area"><button onClick={() => { const a = document.createElement("a"); a.download = "barcode.png"; a.href = ref.current!.toDataURL(); a.click(); }} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">⬇ Tải PNG</button></div>
    </div>
  );
}

export function PinGen() {
  const [len, setLen] = useState(6);
  const [pin, setPin] = useState("");
  const gen = () => { const a = new Uint32Array(len); crypto.getRandomValues(a); setPin([...a].map((n) => String(n % 10)).join("")); };
  useEffect(() => { gen(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-3 text-center">
      <p className="font-mono text-5xl font-extrabold tracking-[0.3em]">{pin}</p>
      <Field label="Số chữ số"><input type="number" value={len} min={4} max={12} onChange={(e) => setLen(+e.target.value)} className={inputCls} /></Field>
      <div className="tool-action-area flex justify-center gap-2"><button onClick={gen} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Tạo PIN</button><CopyBtn text={pin} /></div>
    </div>
  );
}

export function Dice() {
  const [count, setCount] = useState(2);
  const [vals, setVals] = useState<number[]>([3, 5]);
  const [hist, setHist] = useState<number[][]>([]);
  const roll = () => {
    const v = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
    setVals(v); setHist((h) => [v, ...h].slice(0, 10));
  };
  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center gap-3 text-6xl">{vals.map((v, i) => <span key={i}>{"⚀⚁⚂⚃⚄⚅"[v - 1]}</span>)}</div>
      <p className="text-xl font-extrabold">Tổng: {vals.reduce((a, b) => a + b, 0)}</p>
      <Field label="Số viên"><input type="number" value={count} min={1} max={6} onChange={(e) => setCount(+e.target.value)} className={inputCls} /></Field>
      <div className="tool-action-area"><button onClick={roll} className="rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white">🎲 Gieo!</button></div>
      {hist.length > 0 && <p className="text-xs text-slate-500">Lịch sử: {hist.map((h, i) => <span key={i} className="mx-1">[{h.join(",")}]</span>)}</p>}
    </div>
  );
}

export function Coin() {
  const [r, setR] = useState<"Sấp" | "Ngửa">("Ngửa");
  const [flip, setFlip] = useState(false);
  const [stat, setStat] = useState({ S: 0, N: 0 });
  const go = () => {
    setFlip(true);
    setTimeout(() => {
      const v = Math.random() < 0.5 ? "Sấp" as const : "Ngửa" as const;
      setR(v); setFlip(false);
      setStat((s) => ({ S: s.S + (v === "Sấp" ? 1 : 0), N: s.N + (v === "Ngửa" ? 1 : 0) }));
    }, 500);
  };
  return (
    <div className="space-y-4 text-center">
      <div className={`mx-auto grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-5xl shadow-lg transition-transform ${flip ? "scale-110 animate-spin" : ""}`}>{r === "Ngửa" ? "🪙" : "🌙"}</div>
      <p className="text-2xl font-extrabold">{flip ? "..." : r}</p>
      <div className="tool-action-area"><button onClick={go} className="rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white">Tung!</button></div>
      <p className="text-sm text-slate-500">Sấp: {stat.S} • Ngửa: {stat.N}</p>
    </div>
  );
}

export function RandomNumber() {
  const [min, setMin] = useState(1); const [max, setMax] = useState(100); const [n, setN] = useState(1);
  const [out, setOut] = useState<number[]>([]);
  const go = () => {
    const arr = new Set<number>();
    while (arr.size < Math.min(n, max - min + 1)) arr.add(min + Math.floor(Math.random() * (max - min + 1)));
    setOut([...arr].sort((a, b) => a - b));
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Min"><input type="number" value={min} onChange={(e) => setMin(+e.target.value)} className={inputCls} /></Field>
        <Field label="Max"><input type="number" value={max} onChange={(e) => setMax(+e.target.value)} className={inputCls} /></Field>
        <Field label="Số lượng"><input type="number" value={n} min={1} max={50} onChange={(e) => setN(+e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="tool-action-area"><button onClick={go} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Random</button></div>
      <div className="flex flex-wrap gap-2">{out.map((v) => <span key={v} className="rounded-xl bg-slate-900 px-3 py-1.5 font-mono font-bold text-white">{v}</span>)}</div>
    </div>
  );
}

const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng"];
const DEM_NAM = ["Văn", "Hữu", "Đức", "Minh", "Quốc", "Anh", "Tuấn", "Hải"];
const DEM_NU = ["Thị", "Thu", "Ngọc", " Lan", "Hồng", "Mai", "Phương"];
const TEN_NAM = ["An", "Bình", "Cường", "Dũng", "Huy", "Khang", "Long", "Nam", "Phúc", "Quân"];
const TEN_NU = ["An", "Chi", "Dung", "Hà", "Hương", "Linh", "Ngọc", "Thảo", "Trang", "Yến"];

export function RandomName() {
  const [sex, setSex] = useState("nam");
  const [name, setName] = useState("");
  const gen = () => {
    const h = HO[Math.floor(Math.random() * HO.length)];
    const d = sex === "nam" ? DEM_NAM[Math.floor(Math.random() * DEM_NAM.length)] : DEM_NU[Math.floor(Math.random() * DEM_NU.length)];
    const t = sex === "nam" ? TEN_NAM[Math.floor(Math.random() * TEN_NAM.length)] : TEN_NU[Math.floor(Math.random() * TEN_NU.length)];
    setName(`${h} ${d} ${t}`.replace(/\s+/g, " "));
  };
  useEffect(() => { gen(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-3 text-center">
      <div className="flex justify-center gap-2">
        <button onClick={() => setSex("nam")} className={`rounded-lg px-4 py-2 text-sm font-bold ${sex === "nam" ? "bg-blue-600 text-white" : "bg-slate-100"}`}>Nam</button>
        <button onClick={() => setSex("nu")} className={`rounded-lg px-4 py-2 text-sm font-bold ${sex === "nu" ? "bg-pink-600 text-white" : "bg-slate-100"}`}>Nữ</button>
      </div>
      <p className="text-3xl font-extrabold">{name}</p>
      <div className="tool-action-area flex justify-center gap-2"><button onClick={gen} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Tên khác</button><CopyBtn text={name} /></div>
    </div>
  );
}

export function Wheel() {
  const [input, setInput] = useState("An\nBình\nChi\nDũng");
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);
  const spin = () => {
    const items = input.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!items.length) return;
    setSpinning(true);
    let i = 0;
    const iv = setInterval(() => {
      setWinner(items[Math.floor(Math.random() * items.length)]);
      if (++i > 12) { clearInterval(iv); setSpinning(false); }
    }, 100);
  };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className={inputCls} placeholder="Mỗi dòng 1 tên..." />
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-gradient-to-br from-violet-50 to-blue-50 p-6 text-center">
        <p className="text-sm text-slate-500">Kết quả</p>
        <p className="my-2 text-3xl font-extrabold">{spinning ? "🌀..." : winner || "?"}</p>
        <button onClick={spin} disabled={spinning} className="rounded-xl bg-violet-600 px-6 py-2.5 font-bold text-white disabled:opacity-50">🎡 QUAY!</button>
      </div>
    </div>
  );
}
