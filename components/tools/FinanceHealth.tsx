"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CopyBtn, Field, ResultBox, Stat, inputCls } from "./ui";

const fmtVND = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";

export function Compound() {
  const [p, setP] = useState("100000000"); const [rate, setRate] = useState("6"); const [years, setYears] = useState("10"); const [monthly, setMonthly] = useState("2000000");
  const r = useMemo(() => {
    const P = +p || 0, m = +monthly || 0, y = +years || 0, rt = (+rate || 0) / 100;
    let total = P;
    for (let i = 0; i < y * 12; i++) total = total * (1 + rt / 12) + m;
    const invested = P + m * y * 12;
    return { total, invested, profit: total - invested };
  }, [p, rate, years, monthly]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Vốn ban đầu (VND)"><input value={p} onChange={(e) => setP(e.target.value.replace(/\D/g, ""))} className={inputCls} inputMode="numeric" /></Field>
        <Field label="Lãi suất %/năm"><input value={rate} onChange={(e) => setRate(e.target.value)} className={inputCls} inputMode="decimal" /></Field>
        <Field label="Số năm"><input value={years} onChange={(e) => setYears(e.target.value)} className={inputCls} inputMode="numeric" /></Field>
        <Field label="Gửi thêm /tháng"><input value={monthly} onChange={(e) => setMonthly(e.target.value.replace(/\D/g, ""))} className={inputCls} inputMode="numeric" /></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Tổng nhận" value={fmtVND(r.total)} />
        <Stat label="Đã gửi" value={fmtVND(r.invested)} />
        <Stat label="Lãi" value={fmtVND(r.profit)} />
      </div>
    </div>
  );
}

export function Loan() {
  const [amount, setAmount] = useState("500000000"); const [rate, setRate] = useState("10"); const [months, setMonths] = useState("60");
  const r = useMemo(() => {
    const P = +amount || 0, rm = (+rate || 0) / 100 / 12, n = +months || 1;
    const pay = rm ? (P * rm * Math.pow(1 + rm, n)) / (Math.pow(1 + rm, n) - 1) : P / n;
    return { pay, total: pay * n, interest: pay * n - P };
  }, [amount, rate, months]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Số tiền vay"><input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} className={inputCls} /></Field>
        <Field label="Lãi %/năm"><input value={rate} onChange={(e) => setRate(e.target.value)} className={inputCls} /></Field>
        <Field label="Số tháng"><input value={months} onChange={(e) => setMonths(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Trả /tháng" value={fmtVND(r.pay)} />
        <Stat label="Tổng trả" value={fmtVND(r.total)} />
        <Stat label="Tiền lãi" value={fmtVND(r.interest)} />
      </div>
    </div>
  );
}

export function Vat() {
  const [v, setV] = useState("1000000"); const [rate, setRate] = useState("10"); const [mode, setMode] = useState<"add" | "sub">("add");
  const n = +v || 0, rt = (+rate || 0) / 100;
  const res = mode === "add" ? { pre: n, vat: n * rt, post: n * (1 + rt) } : { pre: n / (1 + rt), vat: n - n / (1 + rt), post: n };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setMode("add")} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${mode === "add" ? "bg-blue-600 text-white" : "bg-[var(--bg-recessed)]"}`}>Giá chưa VAT → có VAT</button>
        <button onClick={() => setMode("sub")} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${mode === "sub" ? "bg-blue-600 text-white" : "bg-[var(--bg-recessed)]"}`}>Đã gồm VAT → tách</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Số tiền"><input value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} className={inputCls} /></Field>
        <Field label="Thuế suất %"><select value={rate} onChange={(e) => setRate(e.target.value)} className={inputCls}><option value="8">8%</option><option value="10">10%</option><option value="5">5%</option><option value="0">0%</option></select></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Trước thuế" value={fmtVND(res.pre)} />
        <Stat label="VAT" value={fmtVND(res.vat)} />
        <Stat label="Sau thuế" value={fmtVND(res.post)} />
      </div>
    </div>
  );
}

export function Discount() {
  const [price, setPrice] = useState("500000"); const [pct, setPct] = useState("20");
  const n = +price || 0, p = Math.min(100, Math.max(0, +pct || 0));
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Giá gốc"><input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className={inputCls} /></Field>
        <Field label={`Giảm ${p}%`}><input type="range" min={0} max={90} value={p} onChange={(e) => setPct(e.target.value)} className="w-full" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Tiết kiệm" value={fmtVND(n * p / 100)} />
        <Stat label="Phải trả" value={fmtVND(n * (1 - p / 100))} />
      </div>
    </div>
  );
}

export function Salary() {
  const [gross, setGross] = useState("20000000");
  const n = +gross || 0;
  const bhxh = Math.min(n * 0.08, 2384000);
  const bhyt = Math.min(n * 0.015, 1000000);
  const bhtn = Math.min(n * 0.01, 1000000);
  const taxable = Math.max(0, n - bhxh - bhyt - bhtn - 11000000);
  let tax = 0;
  const brackets: [number, number][] = [[5000000, 0.05], [5000000, 0.1], [8000000, 0.15], [14000000, 0.2], [20000000, 0.25], [28000000, 0.3], [1e15, 0.35]];
  let rem = taxable;
  for (const [lim, r2] of brackets) { const t = Math.min(rem, lim); tax += t * r2; rem -= t; if (rem <= 0) break; }
  const net = n - bhxh - bhyt - bhtn - tax;
  return (
    <div className="space-y-3">
      <Field label="Lương Gross (VND)"><input value={gross} onChange={(e) => setGross(e.target.value.replace(/\D/g, ""))} className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="BHXH 8%" value={fmtVND(bhxh)} />
        <Stat label="BHYT 1.5%" value={fmtVND(bhyt)} />
        <Stat label="Thuế TNCN" value={fmtVND(tax)} />
        <Stat label="NET nhận" value={fmtVND(net)} />
      </div>
      <p className="text-xs text-[var(--fg-muted)]">Ước tính tham khảo (giảm trừ bản thân 11tr, chưa tính người phụ thuộc).</p>
    </div>
  );
}

export function Tip() {
  const [bill, setBill] = useState("1000000"); const [tip, setTip] = useState("10"); const [people, setPeople] = useState("4");
  const b = +bill || 0, t = (+tip || 0) / 100, p = Math.max(1, +people || 1);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Hoá đơn"><input value={bill} onChange={(e) => setBill(e.target.value.replace(/\D/g, ""))} className={inputCls} /></Field>
        <Field label={`Tip ${tip}%`}><input type="range" min={0} max={30} value={tip} onChange={(e) => setTip(e.target.value)} className="w-full" /></Field>
        <Field label="Số người"><input type="number" value={people} min={1} onChange={(e) => setPeople(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Tiền tip" value={fmtVND(b * t)} />
        <Stat label="Tổng" value={fmtVND(b * (1 + t))} />
        <Stat label="Mỗi người" value={fmtVND(b * (1 + t) / p)} />
      </div>
    </div>
  );
}

export function Percent() {
  const [a, setA] = useState("25"); const [b, setB] = useState("200");
  const n1 = (+a || 0) * (+b || 0) / 100;
  const [c, setC] = useState("50"); const [d, setD] = useState("200");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-3">
        <p className="text-sm font-bold">25% của 200 = ?</p>
        <div className="mt-2 grid grid-cols-[1fr_1fr_auto] gap-2">
          <input value={a} onChange={(e) => setA(e.target.value)} className={inputCls} /><input value={b} onChange={(e) => setB(e.target.value)} className={inputCls} />
          <span className="grid place-items-center rounded-xl bg-blue-600 px-4 font-bold text-white">= {n1}</span>
        </div>
      </div>
      <div className="rounded-xl border p-3">
        <p className="text-sm font-bold">50 là bao nhiêu % của 200?</p>
        <div className="mt-2 grid grid-cols-[1fr_1fr_auto] gap-2">
          <input value={c} onChange={(e) => setC(e.target.value)} className={inputCls} /><input value={d} onChange={(e) => setD(e.target.value)} className={inputCls} />
          <span className="grid place-items-center rounded-xl bg-emerald-600 px-4 font-bold text-white">= {(+d ? (+c / +d) * 100 : 0).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}

export function Calculator() {
  const [expr, setExpr] = useState("");
  const [res, setRes] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const calc = () => {
    try {
      if (!/^[0-9+\-*/.%\s()]+$/.test(expr)) { setRes("Ký tự không hợp lệ"); return; }
      const v = Function(`"use strict";return(${expr})`)();
      setRes(String(Math.round(v * 1e10) / 1e10));
      setHist((h) => [`${expr} = ${v}`, ...h].slice(0, 10));
    } catch { setRes("Lỗi"); }
  };
  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+"];
  return (
    <div className="space-y-3">
      <input value={expr} onChange={(e) => setExpr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && calc()} className={`${inputCls} font-mono text-xl`} placeholder="2*(3+4)/5" />
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => <button key={k} onClick={() => setExpr(expr + k)} className="rounded-xl border bg-[var(--bg-elevated)] py-3 font-mono text-lg font-bold hover:bg-[var(--bg-recessed)]">{k}</button>)}
      </div>
      <div className="tool-action-area flex gap-2">
        <button onClick={calc} className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white">= Tính</button>
        <button onClick={() => { setExpr(""); setRes(""); }} className="rounded-xl border px-4">C</button>
      </div>
      {res && <p className="text-center font-mono text-3xl font-extrabold">{res}</p>}
      {hist.length > 0 && <ResultBox>{hist.join("\n")}</ResultBox>}
    </div>
  );
}

export function Bmi() {
  const [h, setH] = useState("165"); const [w, setW] = useState("60");
  const bmi = (+w || 0) / Math.pow((+h || 1) / 100, 2);
  const cls = bmi < 18.5 ? "Thiếu cân" : bmi < 23 ? "Bình thường" : bmi < 25 ? "Thừa cân" : bmi < 30 ? "Béo phì I" : "Béo phì II+";
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Chiều cao (cm)"><input value={h} onChange={(e) => setH(e.target.value)} className={inputCls} inputMode="decimal" /></Field>
        <Field label="Cân nặng (kg)"><input value={w} onChange={(e) => setW(e.target.value)} className={inputCls} inputMode="decimal" /></Field>
      </div>
      <p className="text-center text-5xl font-extrabold">{bmi.toFixed(1)}</p>
      <p className="text-center font-bold text-blue-700">{cls}</p>
    </div>
  );
}

export function Bmr() {
  const [h, setH] = useState("165"); const [w, setW] = useState("60"); const [age, setAge] = useState("28"); const [sex, setSex] = useState("nam");
  const bmr = 10 * (+w || 0) + 6.25 * (+h || 0) - 5 * (+age || 0) + (sex === "nam" ? 5 : -161);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setSex("nam")} className={`rounded-lg px-4 py-2 text-sm font-bold ${sex === "nam" ? "bg-blue-600 text-white" : "bg-[var(--bg-recessed)]"}`}>Nam</button>
        <button onClick={() => setSex("nu")} className={`rounded-lg px-4 py-2 text-sm font-bold ${sex === "nu" ? "bg-pink-600 text-white" : "bg-[var(--bg-recessed)]"}`}>Nữ</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Cao (cm)"><input value={h} onChange={(e) => setH(e.target.value)} className={inputCls} /></Field>
        <Field label="Nặng (kg)"><input value={w} onChange={(e) => setW(e.target.value)} className={inputCls} /></Field>
        <Field label="Tuổi"><input value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} /></Field>
      </div>
      <p className="text-center text-4xl font-extrabold">{Math.round(bmr)} kcal/ngày</p>
      <p className="text-center text-sm text-[var(--fg-muted)]">Năng lượng khi nghỉ ngơi hoàn toàn.</p>
    </div>
  );
}

export function Tdee() {
  const [bmr, setBmr] = useState("1500"); const [act, setAct] = useState("1.55");
  const t = (+bmr || 0) * (+act || 0);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="BMR"><input value={bmr} onChange={(e) => setBmr(e.target.value)} className={inputCls} /></Field>
        <Field label="Mức vận động"><select value={act} onChange={(e) => setAct(e.target.value)} className={inputCls}>
          <option value="1.2">Ít vận động</option><option value="1.375">Nhẹ (1-3 buổi/tuần)</option><option value="1.55">Vừa (3-5 buổi)</option><option value="1.725">Nặng (6-7 buổi)</option><option value="1.9">Rất nặng</option>
        </select></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="TDEE giữ cân" value={`${Math.round(t)} kcal`} />
        <Stat label="Giảm cân" value={`${Math.round(t - 500)} kcal`} />
        <Stat label="Tăng cân" value={`${Math.round(t + 500)} kcal`} />
      </div>
    </div>
  );
}

export function Water() {
  const [w, setW] = useState("60"); const [sport, setSport] = useState("30");
  const ml = (+w || 0) * 35 + (+sport || 0) * 12;
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Cân nặng (kg)"><input value={w} onChange={(e) => setW(e.target.value)} className={inputCls} /></Field>
        <Field label="Tập luyện (phút/ngày)"><input value={sport} onChange={(e) => setSport(e.target.value)} className={inputCls} /></Field>
      </div>
      <p className="text-center text-4xl font-extrabold text-blue-600">{(ml / 1000).toFixed(1)} lít/ngày</p>
      <p className="text-center text-sm">≈ {Math.round(ml / 250)} cốc 250ml</p>
    </div>
  );
}

export function IdealWeight() {
  const [h, setH] = useState("165"); const [sex, setSex] = useState("nam");
  const inch = (+h || 0) / 2.54;
  const devine = sex === "nam" ? 50 + 2.3 * (inch - 60) : 45.5 + 2.3 * (inch - 60);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setSex("nam")} className={`rounded-lg px-4 py-2 text-sm font-bold ${sex === "nam" ? "bg-blue-600 text-white" : "bg-[var(--bg-recessed)]"}`}>Nam</button>
        <button onClick={() => setSex("nu")} className={`rounded-lg px-4 py-2 text-sm font-bold ${sex === "nu" ? "bg-pink-600 text-white" : "bg-[var(--bg-recessed)]"}`}>Nữ</button>
      </div>
      <Field label="Chiều cao (cm)"><input value={h} onChange={(e) => setH(e.target.value)} className={inputCls} /></Field>
      <p className="text-center text-4xl font-extrabold">{devine.toFixed(1)} kg</p>
      <p className="text-center text-sm text-[var(--fg-muted)]">Khoảng lý tưởng: {(devine * 0.95).toFixed(1)} – {(devine * 1.05).toFixed(1)} kg</p>
    </div>
  );
}

export function DueDate() {
  const [lmp, setLmp] = useState("2026-01-01");
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => { const iv = setInterval(() => setNowMs(Date.now()), 60000); return () => clearInterval(iv); }, []);
  const due = useMemo(() => { const d = new Date(lmp); d.setDate(d.getDate() + 280); return d; }, [lmp]);
  const weeks = useMemo(() => Math.max(0, Math.floor((nowMs - new Date(lmp).getTime()) / 6048e5)), [lmp, nowMs]);
  return (
    <div className="space-y-3">
      <Field label="Ngày đầu kỳ kinh cuối"><input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Ngày dự sinh" value={<span suppressHydrationWarning>{due.toLocaleDateString("vi-VN")}</span>} />
        <Stat label="Tuần thai" value={`${weeks} tuần`} />
      </div>
    </div>
  );
}

export function HeartRate() {
  const [age, setAge] = useState("30"); const [rest, setRest] = useState("65");
  const max = 220 - (+age || 0);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tuổi"><input value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} /></Field>
        <Field label="Nhịp nghỉ"><input value={rest} onChange={(e) => setRest(e.target.value)} className={inputCls} /></Field>
      </div>
      <ResultBox>{`Nhịp tối đa: ${max} bpm\nĐốt mỡ (60-70%): ${Math.round(max * 0.6)}–${Math.round(max * 0.7)} bpm\nCardio (70-85%): ${Math.round(max * 0.7)}–${Math.round(max * 0.85)} bpm`}</ResultBox>
    </div>
  );
}

export function AgeCalc() {
  const [dob, setDob] = useState("2000-01-01");
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => { const iv = setInterval(() => setNowMs(Date.now()), 60000); return () => clearInterval(iv); }, []);
  const r = useMemo(() => {
    const b = new Date(dob), now = new Date(nowMs || Date.now());
    let y = now.getFullYear() - b.getFullYear(), m = now.getMonth() - b.getMonth(), d = now.getDate() - b.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor(((nowMs || Date.now()) - b.getTime()) / 864e5);
    return { y, m, d, days };
  }, [dob, nowMs]);
  return (
    <div className="space-y-3">
      <Field label="Ngày sinh"><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} /></Field>
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Năm" value={r.y} /><Stat label="Tháng" value={r.m} /><Stat label="Ngày" value={r.d} />        <Stat label="Tổng ngày" value={<span suppressHydrationWarning>{r.days.toLocaleString("vi-VN")}</span>} />
      </div>
    </div>
  );
}

export function Gpa() {
  const [input, setInput] = useState("8.5\n7.0\n9.0");
  const r = useMemo(() => {
    const arr = input.split(/[\n,;]+/).map((s) => parseFloat(s)).filter((n) => !isNaN(n));
    if (!arr.length) return null;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const g4 = avg >= 8.5 ? 4 : avg >= 8 ? 3.5 : avg >= 7 ? 3 : avg >= 6.5 ? 2.5 : avg >= 5.5 ? 2 : avg >= 5 ? 1.5 : avg >= 4 ? 1 : 0;
    const letter = avg >= 8.5 ? "A" : avg >= 8 ? "B+" : avg >= 7 ? "B" : avg >= 6.5 ? "C+" : avg >= 5.5 ? "C" : avg >= 5 ? "D+" : avg >= 4 ? "D" : "F";
    return { avg, g4, letter, n: arr.length };
  }, [input]);
  return (
    <div className="space-y-3">
      <Field label="Nhập các điểm (mỗi dòng 1 điểm)"><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className={inputCls} /></Field>
      {r && <div className="grid grid-cols-3 gap-3"><Stat label="TB hệ 10" value={r.avg.toFixed(2)} /><Stat label="Hệ 4" value={r.g4} /><Stat label="Chữ" value={r.letter} /></div>}
    </div>
  );
}

export function Signature() {
  const [name, setName] = useState("Nguyễn Văn An"); const [role, setRole] = useState("Marketing Manager"); const [phone, setPhone] = useState("0901 234 567");
  const html = `<div style="font-family:Arial"><b>${name}</b><br/><span style="color:#555">${role}</span><br/>📞 ${phone} | 🌐 toolbox.vn</div>`;
  return (
    <div className="space-y-3">
      <Field label="Họ tên"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
      <Field label="Chức danh"><input value={role} onChange={(e) => setRole(e.target.value)} className={inputCls} /></Field>
      <Field label="SĐT"><input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} /></Field>
      <div className="rounded-xl border bg-[var(--bg-elevated)] p-4" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="tool-action-area flex gap-2"><CopyBtn text={html} label="Copy HTML" /></div>
    </div>
  );
}
