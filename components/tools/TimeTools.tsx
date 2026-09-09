"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CopyBtn, Field, ResultBox, Stat, inputCls, textareaCls } from "./ui";

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(0);
  useEffect(() => { setNow(Date.now()); const iv = setInterval(() => setNow(Date.now()), intervalMs); return () => clearInterval(iv); }, [intervalMs]);
  return now;
}

function todayStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function nowDateTimeLocal() { const d = new Date(); return `${todayStr()}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; }
function nowTs() { return String(Math.floor(Date.now() / 1000)); }

export function Countdown() {
  const [target, setTarget] = useState("");
  const [mounted, setMounted] = useState(false);
  const now = useNow(1000);
  useEffect(() => { if (!mounted) { const d = new Date(); d.setDate(d.getDate() + 7); setTarget(d.toISOString().slice(0, 16)); setMounted(true); } }, [mounted]);
  const diff = Math.max(0, new Date(target || nowDateTimeLocal()).getTime() - (now || Date.now()));
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  return (
    <div className="space-y-4">
      <Field label="Thời điểm đích"><input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} className={inputCls} /></Field>
      <div className="grid grid-cols-4 gap-3 text-center">
        {[[d, "Ngày"] as const, [h, "Giờ"] as const, [m, "Phút"] as const, [s, "Giây"] as const].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-slate-900 p-4 text-white"><p className="font-mono text-4xl font-extrabold">{String(v).padStart(2, "0")}</p><p className="text-xs opacity-70">{l}</p></div>
        ))}
      </div>
      {diff === 0 && <p className="text-center font-bold text-emerald-600">🎉 Đã đến giờ!</p>}
    </div>
  );
}

export function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef(0);
  const [clock, setClock] = useState("00:00:00.00");
  useEffect(() => { const iv = setInterval(() => setClock(new Date().toLocaleTimeString("vi-VN")), 1000); return () => clearInterval(iv); }, []);
  useEffect(() => {
    if (!running) return;
    const t0 = Date.now() - ms;
    const iv = setInterval(() => setMs(Date.now() - t0), 31);
    return () => clearInterval(iv);
  }, [running]);
  const f = (v: number, p = 2) => String(v).padStart(p, "0");
  return (
    <div className="space-y-4 text-center">
      <p className="font-mono text-6xl font-extrabold">{f(Math.floor(ms / 6e4))}:{f(Math.floor(ms / 1e3) % 60)}<span className="text-2xl text-slate-400">.{f(Math.floor(ms / 10) % 100)}</span></p>
      <p className="font-mono text-2xl" suppressHydrationWarning>{clock}</p>
      <div className="tool-action-area flex justify-center gap-2">
        <button onClick={() => setRunning(!running)} className={`rounded-xl px-6 py-2.5 font-bold text-white ${running ? "bg-amber-500" : "bg-emerald-600"}`}>{running ? "⏸ Dừng" : "▶ Chạy"}</button>
        <button onClick={() => { setRunning(false); setMs(0); }} className="rounded-xl border px-4">Reset</button>
      </div>
    </div>
  );
}

export function Timestamp() {
  const [ts, setTs] = useState(nowTs);
  const [date, setDate] = useState(nowDateTimeLocal);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (!mounted) { setTs(nowTs()); setDate(nowDateTimeLocal()); setMounted(true); } }, [mounted]);
  const fromTs = useMemo(() => { const d = new Date((+ts || 0) * 1000); return isNaN(d.getTime()) ? "Không hợp lệ" : d.toLocaleString("vi-VN") + " (GMT+7)"; }, [ts]);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Field label="Unix timestamp → ngày"><input value={ts} onChange={(e) => setTs(e.target.value)} className={`${inputCls} font-mono`} /></Field>
        <ResultBox><span suppressHydrationWarning>{fromTs}</span></ResultBox>
        <button onClick={() => setTs(String(Math.floor(Date.now() / 1000)))} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold">Dùng hiện tại</button>
      </div>
      <div className="space-y-2">
        <Field label="Ngày → timestamp"><input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></Field>
        <ResultBox>{String(Math.floor(new Date(date).getTime() / 1000))}</ResultBox>
      </div>
    </div>
  );
}

export function DateAdd() {
  const [date, setDate] = useState(todayStr);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (!mounted) { setDate(todayStr()); setMounted(true); } }, [mounted]);
  const [n, setN] = useState("30");
  const [mode, setMode] = useState<"add" | "sub">("add");
  const res = useMemo(() => {
    const d = new Date(date);
    d.setDate(d.getDate() + (mode === "add" ? +n || 0 : -(+n || 0)));
    return d;
  }, [date, n, mode]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Mốc"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></Field>
        <Field label="Số ngày"><input type="number" value={n} onChange={(e) => setN(e.target.value)} className={inputCls} /></Field>
        <Field label="Phép"><select value={mode} onChange={(e) => setMode(e.target.value as any)} className={inputCls}><option value="add">Cộng thêm</option><option value="sub">Trừ đi</option></select></Field>
      </div>
      <p className="text-center text-2xl font-extrabold" suppressHydrationWarning>{res.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</p>
    </div>
  );
}

export function DateDiff() {
  const [a, setA] = useState("2026-01-01");
  const [b, setB] = useState(todayStr);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (!mounted) { setB(todayStr()); setMounted(true); } }, [mounted]);
  const days = Math.abs(Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5));
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Từ ngày"><input type="date" value={a} onChange={(e) => setA(e.target.value)} className={inputCls} /></Field>
        <Field label="Đến ngày"><input type="date" value={b} onChange={(e) => setB(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Ngày" value={days} /><Stat label="Tuần" value={(days / 7).toFixed(1)} /><Stat label="Tháng ≈" value={(days / 30.44).toFixed(1)} />
      </div>
    </div>
  );
}

export function LeapYear() {
  const [y, setY] = useState("2026");
  const n = +y || 0;
  const leap = (n % 4 === 0 && n % 100 !== 0) || n % 400 === 0;
  return (
    <div className="space-y-3 text-center">
      <Field label="Năm"><input value={y} onChange={(e) => setY(e.target.value.replace(/\D/g, ""))} className={`${inputCls} text-center font-mono text-2xl`} /></Field>
      <p className="text-3xl font-extrabold">{leap ? "✅ Năm nhuận (366 ngày)" : "❌ Năm thường (365 ngày)"}</p>
    </div>
  );
}

export function Weekday() {
  const [d, setD] = useState(todayStr);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (!mounted) { setD(todayStr()); setMounted(true); } }, [mounted]);
  const wd = new Date(d).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="space-y-3 text-center">
      <Field label="Chọn ngày"><input type="date" value={d} onChange={(e) => setD(e.target.value)} className={inputCls} /></Field>
      <p className="text-3xl font-extrabold capitalize" suppressHydrationWarning>{wd}</p>
    </div>
  );
}

const CITIES = [["Hà Nội", "Asia/Ho_Chi_Minh"], ["Tokyo", "Asia/Tokyo"], ["London", "Europe/London"], ["New York", "America/New_York"], ["Sydney", "Australia/Sydney"], ["Paris", "Europe/Paris"]];
export function WorldClock() {
  const now = useNow(1000);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {CITIES.map(([name, tz]) => (
        <div key={tz} className="rounded-xl border bg-white p-3 text-center">
          <p className="text-xs font-bold text-slate-500">{name}</p>
          <p className="font-mono text-2xl font-extrabold" suppressHydrationWarning>{now ? new Date(now).toLocaleTimeString("vi-VN", { timeZone: tz, hour12: false }) : "--:--:--"}</p>
          <p className="text-xs text-slate-400" suppressHydrationWarning>{now ? new Date(now).toLocaleDateString("vi-VN", { timeZone: tz }) : "—"}</p>
        </div>
      ))}
    </div>
  );
}

function nextTet(nowMs: number): Date {
  const tets = ["2026-02-17", "2027-02-06", "2028-01-26", "2029-02-13", "2030-02-03"];
  for (const t of tets) { const d = new Date(t + "T00:00:00"); if (d.getTime() > nowMs) return d; }
  return new Date("2027-02-06T00:00:00");
}
export function TetCountdown() {
  const now = useNow(1000);
  const tet = useMemo(() => nextTet(now || Date.now()), [now]);
  const diff = Math.max(0, tet.getTime() - (now || Date.now()));
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  return (
    <div className="space-y-3 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 p-6 text-center text-white">
      <p className="text-4xl">🧧</p>
      <p className="font-bold" suppressHydrationWarning>Đếm ngược Tết {tet.getFullYear()} ({tet.toLocaleDateString("vi-VN")})</p>
      <p className="font-mono text-4xl font-extrabold">{d} ngày {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</p>
      <p className="text-sm opacity-80">Chúc mừng năm mới — An khang thịnh vượng!</p>
    </div>
  );
}

const ZODIAC = [["Bạch Dương", "21/3-19/4", "♈"], ["Kim Ngưu", "20/4-20/5", "♉"], ["Song Tử", "21/5-20/6", "♊"], ["Cự Giải", "21/6-22/7", "♋"], ["Sư Tử", "23/7-22/8", "♌"], ["Xử Nữ", "23/8-22/9", "♍"], ["Thiên Bình", "23/9-22/10", "♎"], ["Bọ Cạp", "23/10-21/11", "♏"], ["Nhân Mã", "22/11-21/12", "♐"], ["Ma Kết", "22/12-19/1", "♑"], ["Bảo Bình", "20/1-18/2", "♒"], ["Song Ngư", "19/2-20/3", "♓"]];
export function Zodiac() {
  const [dob, setDob] = useState("2000-08-15");
  const z = useMemo(() => {
    const d = new Date(dob); const m = d.getMonth() + 1, day = d.getDate();
    const idx = m === 1 ? (day < 20 ? 9 : 10) : m === 2 ? (day < 19 ? 10 : 11) : m === 3 ? (day < 21 ? 11 : 0) : m === 4 ? (day < 20 ? 0 : 1) : m === 5 ? (day < 21 ? 1 : 2) : m === 6 ? (day < 21 ? 2 : 3) : m === 7 ? (day < 23 ? 3 : 4) : m === 8 ? (day < 23 ? 4 : 5) : m === 9 ? (day < 23 ? 5 : 6) : m === 10 ? (day < 23 ? 6 : 7) : m === 11 ? (day < 22 ? 7 : 8) : (day < 22 ? 8 : 9);
    return ZODIAC[idx];
  }, [dob]);
  return (
    <div className="space-y-3 text-center">
      <Field label="Ngày sinh"><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} /></Field>
      <p className="text-6xl">{z[2]}</p>
      <p className="text-2xl font-extrabold">{z[0]}</p>
      <p className="text-sm text-slate-500">{z[1]} • Tham khảo vui</p>
    </div>
  );
}

const STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const MENH: Record<string, string> = { "Giáp Tý": "Hải Trung Kim", "Ất Sửu": "Hải Trung Kim" };
export function CanChi() {
  const [year, setYear] = useState("2026");
  const y = +year || 2026;
  const can = STEMS[(y - 4) % 10], chi = BRANCHES[(y - 4) % 12];
  return (
    <div className="space-y-3 text-center">
      <Field label="Năm dương lịch"><input value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))} className={`${inputCls} text-center font-mono text-xl`} /></Field>
      <p className="text-4xl font-extrabold">{can} {chi}</p>
      <p className="text-sm text-slate-500">Năm {y} • {(MENH[`${can} ${chi}`] ?? "Tra mệnh chi tiết theo ngũ hành nạp âm")} (tham khảo)</p>
      <ResultBox>{`Can: ${can} | Chi: ${chi}\nCon giáp: ${chi}\nNăm ${y} ${((y - 4) % 12) % 2 === 0 ? "— năm con giáp mạnh mẽ" : ""}`}</ResultBox>
    </div>
  );
}

export function Typing() {
  const SAMPLE = "trăng lên đỉnh núi trăng tà bạn ơi hãy đến quê ta mà xem công cụ toolbox việt nam miễn phí nhanh và tiện lợi";
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const words = SAMPLE.split(" ");
  const typed = input.trim().split(/\s+/).filter(Boolean);
  const wpm = start && input ? Math.round((typed.length / ((Date.now() - start) / 60000)) * 10) / 10 : 0;
  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-white p-4 leading-8">
        {words.map((w, i) => {
          const t = typed[i];
          const cls = t === undefined ? "text-slate-700" : t === w ? "text-emerald-600 font-bold" : "bg-red-100 text-red-700 rounded";
          return <span key={i} className={`${cls} mr-2`}>{w}</span>;
        })}
      </div>
      <textarea value={input} onChange={(e) => { if (start === null) setStart(Date.now()); setInput(e.target.value); if (e.target.value.trim() === SAMPLE) setDone(true); }} rows={3} className={textareaCls} placeholder="Gõ lại đoạn trên..." />
      <div className="flex items-center gap-4">
        <Stat label="WPM" value={wpm} />
        <Stat label="Đúng" value={`${typed.filter((t, i) => t === words[i]).length}/${typed.length}`} />
        <button onClick={() => { setInput(""); setStart(null); setDone(false); }} className="rounded-xl border px-4 py-2 text-sm font-bold">Làm lại</button>
      </div>
      {done && <p className="font-bold text-emerald-600">🎉 Xuất sắc! {wpm} từ/phút.</p>}
    </div>
  );
}

export function Notepad() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => { try { setText(localStorage.getItem("toolboxvn:notepad") ?? ""); } catch {} }, []);
  useEffect(() => {
    const iv = setTimeout(() => { try { localStorage.setItem("toolboxvn:notepad", text); setSaved(true); setTimeout(() => setSaved(false), 1000); } catch {} }, 600);
    return () => clearTimeout(iv);
  }, [text]);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{text.length} ký tự • {(text.trim().match(/\S+/g) || []).length} từ {saved && "• ✓ Đã lưu"}</span>
        <div className="tool-action-area flex gap-2">
          <CopyBtn text={text} />
          <button onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); a.download = "ghi-chu.txt"; a.click(); }} className="rounded-xl border px-3 py-1.5 font-bold">Tải .txt</button>
          <button onClick={() => setText("")} className="rounded-xl border px-3 py-1.5">Xoá</button>
        </div>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={14} className={textareaCls} placeholder="Ghi chú tự lưu vào máy bạn..." />
    </div>
  );
}
