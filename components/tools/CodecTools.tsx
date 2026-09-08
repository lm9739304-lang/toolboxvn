"use client";

import React, { useMemo, useState } from "react";
import { CopyBtn, DownloadBtn, Field, ResultBox, inputCls, textareaCls } from "./ui";

const te = () => new TextEncoder();
const td = () => new TextDecoder();

export function Base64Tool({ decode = false }: { decode?: boolean }) {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (enc: boolean) => {
    setErr("");
    try {
      if (enc) {
        const bytes = te().encode(input);
        let bin = "";
        bytes.forEach((b) => (bin += String.fromCharCode(b)));
        setOut(btoa(bin));
      } else {
        const bin = atob(input.trim());
        const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
        setOut(td().decode(bytes));
      }
    } catch { setErr("Dữ liệu không hợp lệ."); setOut(""); }
  };
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className={textareaCls} placeholder={decode ? "Dán Base64..." : "Nhập văn bản..."} />
      <div className="tool-action-area flex gap-2">
        <button onClick={() => run(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Mã hoá →</button>
        <button onClick={() => run(false)} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white">← Giải mã</button>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function UrlCodec() {
  const [input, setInput] = useState("https://toolbox.vn/công cụ?ten=mật khẩu");
  const enc = useMemo(() => { try { return encodeURIComponent(input); } catch { return ""; } }, [input]);
  const encAll = useMemo(() => { try { return encodeURI(input); } catch { return ""; } }, [input]);
  const [decIn, setDecIn] = useState("");
  const dec = useMemo(() => { try { return decodeURIComponent(decIn); } catch { return "Lỗi decode"; } }, [decIn]);
  return (
    <div className="space-y-4">
      <Field label="Encode"><input value={input} onChange={(e) => setInput(e.target.value)} className={inputCls} /></Field>
      <ResultBox>{enc}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={enc} /></div>
      <p className="text-xs text-slate-500">encodeURI (giữ :/?#): {encAll}</p>
      <Field label="Decode"><input value={decIn} onChange={(e) => setDecIn(e.target.value)} className={inputCls} placeholder="Dán chuỗi %..." /></Field>
      <ResultBox>{dec}</ResultBox>
    </div>
  );
}

export function HtmlEntities() {
  const [input, setInput] = useState('<div class="hi">Xin chào & hẹn gặp</div>');
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const out = useMemo(() => {
    if (mode === "enc") return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    // decode đơn giản
    return input.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  }, [input, mode]);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setMode("enc")} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${mode === "enc" ? "bg-blue-600 text-white" : "bg-slate-100"}`}>Encode</button>
        <button onClick={() => setMode("dec")} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${mode === "dec" ? "bg-blue-600 text-white" : "bg-slate-100"}`}>Decode</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className={textareaCls} />
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

async function sha(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, te().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function Sha256() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className={textareaCls} placeholder="Nhập chuỗi..." />
      <div className="tool-action-area"><button onClick={async () => setOut(await sha("SHA-256", input))} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Băm SHA-256</button></div>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function ShaMulti() {
  const [input, setInput] = useState("");
  const [outs, setOuts] = useState<Record<string, string>>({});
  const run = async () => {
    const r: Record<string, string> = {};
    for (const a of ["SHA-1", "SHA-384", "SHA-512"]) r[a] = await sha(a, input);
    setOuts(r);
  };
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className={textareaCls} />
      <div className="tool-action-area"><button onClick={run} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Băm tất cả</button></div>
      {Object.entries(outs).map(([k, v]) => (
        <div key={k}><p className="text-xs font-bold text-slate-500">{k}</p><ResultBox>{v}</ResultBox></div>
      ))}
    </div>
  );
}

// MD5 thuần JS (không gửi server)
function fullMd5(input: string): string {
  // Paul Johnston style compact
  const hc = "0123456789abcdef";
  function rh(n: number) { let j, s = ""; for (j = 0; j < 4; j++) s += hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f); return s; }
  function ad(x: number, y: number) { const l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
  function rl(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
  function cm(q: number, a: number, b: number, x: number, s: number, t: number) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(c ^ (b | ~d), a, b, x, s, t); }
  function sb(s: string) {
    s = unescape(encodeURIComponent(s));
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    const len = (((n + 8) >>> 6) + 1) * 16;
    const x = new Array(len).fill(0);
    for (i = 0; i < n; i++) x[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    x[i >> 2] |= 0x80 << ((i % 4) << 3);
    x[len - 2] = n * 8;
    let a = state[0], b = state[1], c = state[2], d = state[3];
    for (i = 0; i < len; i += 16) {
      const oa = a, ob = b, oc = c, od = d;
      a = ff(a, b, c, d, x[i], 7, -680876936); d = ff(d, a, b, c, x[i + 1], 12, -389564586); c = ff(c, d, a, b, x[i + 2], 17, 606105819); b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = ff(a, b, c, d, x[i + 4], 7, -176418897); d = ff(d, a, b, c, x[i + 5], 12, 1200080426); c = ff(c, d, a, b, x[i + 6], 17, -1473231341); b = ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = ff(a, b, c, d, x[i + 8], 7, 1770035416); d = ff(d, a, b, c, x[i + 9], 12, -1958414417); c = ff(c, d, a, b, x[i + 10], 17, -42063); b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = ff(a, b, c, d, x[i + 12], 7, 1804603682); d = ff(d, a, b, c, x[i + 13], 12, -40341101); c = ff(c, d, a, b, x[i + 14], 17, -1502002290); b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = gg(a, b, c, d, x[i + 1], 5, -165796510); d = gg(d, a, b, c, x[i + 6], 9, -1069501632); c = gg(c, d, a, b, x[i + 11], 14, 643717713); b = gg(b, c, d, a, x[i], 20, -373897302);
      a = gg(a, b, c, d, x[i + 5], 5, -701558691); d = gg(d, a, b, c, x[i + 10], 9, 38016083); c = gg(c, d, a, b, x[i + 15], 14, -660478335); b = gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = gg(a, b, c, d, x[i + 9], 5, 568446438); d = gg(d, a, b, c, x[i + 14], 9, -1019803690); c = gg(c, d, a, b, x[i + 3], 14, -187363961); b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = gg(a, b, c, d, x[i + 13], 5, -1444681467); d = gg(d, a, b, c, x[i + 2], 9, -51403784); c = gg(c, d, a, b, x[i + 7], 14, 1735328473); b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = hh(a, b, c, d, x[i + 5], 4, -378558); d = hh(d, a, b, c, x[i + 8], 11, -2022574463); c = hh(c, d, a, b, x[i + 11], 16, 1839030562); b = hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = hh(a, b, c, d, x[i + 1], 4, -1530992060); d = hh(d, a, b, c, x[i + 4], 11, 1272893353); c = hh(c, d, a, b, x[i + 7], 16, -155497632); b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = hh(a, b, c, d, x[i + 13], 4, 681279174); d = hh(d, a, b, c, x[i], 11, -358537222); c = hh(c, d, a, b, x[i + 3], 16, -722521979); b = hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = hh(a, b, c, d, x[i + 9], 4, -640364487); d = hh(d, a, b, c, x[i + 12], 11, -421815835); c = hh(c, d, a, b, x[i + 15], 16, 530742520); b = hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = ii(a, b, c, d, x[i], 6, -198630844); d = ii(d, a, b, c, x[i + 7], 10, 1126891415); c = ii(c, d, a, b, x[i + 14], 15, -1416354905); b = ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = ii(a, b, c, d, x[i + 12], 6, 1700485571); d = ii(d, a, b, c, x[i + 3], 10, -1894986606); c = ii(c, d, a, b, x[i + 10], 15, -1051523); b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = ii(a, b, c, d, x[i + 8], 6, 1873313359); d = ii(d, a, b, c, x[i + 15], 10, -30611744); c = ii(c, d, a, b, x[i + 6], 15, -1560198380); b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = ii(a, b, c, d, x[i + 4], 6, -145523070); d = ii(d, a, b, c, x[i + 11], 10, -1120210379); c = ii(c, d, a, b, x[i + 2], 15, 718787259); b = ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = ad(a, oa); b = ad(b, ob); c = ad(c, oc); d = ad(d, od);
    }
    return rh(a) + rh(b) + rh(c) + rh(d);
  }
  return sb(input);
}

export function Md5Tool() {
  const [input, setInput] = useState("");
  const out = useMemo(() => (input ? fullMd5(input) : ""), [input]);
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className={textareaCls} placeholder="Nhập chuỗi..." />
      <ResultBox>{out || "Hash MD5..."}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
      <p className="text-xs text-slate-500">MD5 không nên dùng cho mật khẩu. Hãy dùng SHA-256 + salt.</p>
    </div>
  );
}

export function JwtDecoder() {
  const [input, setInput] = useState("");
  type JwtResult = { header: Record<string, unknown>; payload: Record<string, unknown> } | { error: boolean } | null;
  const parsed: JwtResult = useMemo(() => {
    try {
      const parts = input.trim().split(".");
      if (parts.length < 2) return null;
      const dec = (s: string) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))));
      const header = dec(parts[0]);
      const payload = dec(parts[1]);
      return { header, payload };
    } catch { return { error: true }; }
  }, [input]);
  const ok = parsed && !("error" in parsed);
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className={textareaCls} placeholder="Dán JWT (xxx.yyy.zzz)..." />
      {ok ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div><p className="text-sm font-bold">Header</p><ResultBox>{JSON.stringify(parsed.header, null, 2)}</ResultBox></div>
          <div><p className="text-sm font-bold">Payload</p><ResultBox>{JSON.stringify(parsed.payload, null, 2)}</ResultBox>
            {typeof parsed.payload.exp === "number" && <p className="mt-1 text-xs" suppressHydrationWarning>Hết hạn: {new Date(parsed.payload.exp * 1000).toLocaleString("vi-VN")}</p>}
          </div>
        </div>
      ) : input ? <p className="text-sm text-red-600">JWT không hợp lệ.</p> : null}
    </div>
  );
}

const MORSE: Record<string, string> = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", " ": "/" };
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export function MorseTool() {
  const [input, setInput] = useState("SOS");
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const out = useMemo(() => {
    if (mode === "enc") return input.toUpperCase().split("").map((c) => MORSE[c] ?? c).join(" ");
    return input.split(" ").map((c) => MORSE_REV[c] ?? c).join("").replace(/\//g, " ");
  }, [input, mode]);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setMode("enc")} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${mode === "enc" ? "bg-blue-600 text-white" : "bg-slate-100"}`}>Chữ → Morse</button>
        <button onClick={() => setMode("dec")} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${mode === "dec" ? "bg-blue-600 text-white" : "bg-slate-100"}`}>Morse → Chữ</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className={textareaCls} />
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Liên hệ admin@toolbox.vn hoặc support@gmail.com nhé!");
  const matches = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      return [...text.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))].map((m) => m[0]);
    } catch { return ["Regex lỗi"]; }
  }, [pattern, flags, text]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <Field label="Pattern"><input value={pattern} onChange={(e) => setPattern(e.target.value)} className={`${inputCls} font-mono`} /></Field>
        <Field label="Flags"><input value={flags} onChange={(e) => setFlags(e.target.value)} className={inputCls} /></Field>
      </div>
      <Field label="Văn bản test"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className={textareaCls} /></Field>
      <p className="text-sm">Tìm thấy <b>{matches.length}</b> kết quả: {matches.slice(0, 20).map((m, i) => <mark key={i} className="mx-0.5 rounded bg-yellow-200 px-1">{m}</mark>)}</p>
    </div>
  );
}

export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"ToolBox","tools":100,"free":true}');
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const fmt = (space: number | undefined) => {
    try { setOut(JSON.stringify(JSON.parse(input), null, space)); setErr(""); }
    catch (e: unknown) { setErr("JSON lỗi: " + (e instanceof Error ? e.message : String(e))); }
  };
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className={textareaCls} spellCheck={false} />
      <div className="tool-action-area flex flex-wrap gap-2">
        <button onClick={() => fmt(2)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Làm đẹp</button>
        <button onClick={() => fmt(0)} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white">Thu gọn</button>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /><DownloadBtn text={out} filename="data.json" mime="application/json" /></div>
    </div>
  );
}

export function CsvToJson() {
  const [input, setInput] = useState("name,age\nAn,25\nBình,30");
  const [delim, setDelim] = useState(",");
  const out = useMemo(() => {
    try {
      const lines = input.trim().split("\n");
      const head = lines[0].split(delim).map((s) => s.trim());
      const rows = lines.slice(1).map((l) => { const c = l.split(delim); return Object.fromEntries(head.map((h, i) => [h, (c[i] ?? "").trim()])); });
      return JSON.stringify(rows, null, 2);
    } catch { return "Lỗi parse"; }
  }, [input, delim]);
  return (
    <div className="space-y-3">
      <Field label="Dấu phân cách"><input value={delim} onChange={(e) => setDelim(e.target.value)} className={inputCls} maxLength={1} /></Field>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className={textareaCls} />
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function JsonToCsv() {
  const [input, setInput] = useState('[{"name":"An","age":25},{"name":"Bình","age":30}]');
  const out = useMemo(() => {
    try {
      const arr = JSON.parse(input);
      if (!Array.isArray(arr) || !arr.length) return "Cần mảng JSON.";
      const head = Object.keys(arr[0]);
      return [head.join(","), ...arr.map((r: Record<string, unknown>) => head.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    } catch { return "JSON lỗi"; }
  }, [input]);
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className={textareaCls} />
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /><DownloadBtn text={out} filename="data.csv" mime="text/csv" /></div>
    </div>
  );
}

export function HtmlPreview() {
  const [code, setCode] = useState('<h1 style="color:blue">Xin chào ToolBox!</h1>\n<button onclick="alert(\'Hi\')">Bấm thử</button>');
  return (
    <div className="space-y-3">
      <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={7} className={textareaCls} spellCheck={false} />
      <p className="text-xs text-slate-500">Preview chạy trong iframe sandbox an toàn.</p>
      <iframe title="preview" sandbox="allow-scripts" srcDoc={code} className="h-64 w-full rounded-xl border border-slate-300 bg-white" />
    </div>
  );
}

export function MarkdownPreview() {
  const [md, setMd] = useState("# Xin chào\n\n- **Đậm** và *nghiêng*\n- [Link](https://example.com)\n\n`code` mẫu");
  const html = useMemo(() => {
    let h = md.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    h = h.replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/^## (.*)$/gm, "<h2>$1</h2>").replace(/^# (.*)$/gm, "<h1>$1</h1>");
    h = h.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>").replace(/`(.+?)`/g, "<code>$1</code>");
    h = h.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
    h = h.replace(/^- (.*)$/gm, "<li>$1</li>");
    h = h.replace(/\n/g, "<br/>");
    return h;
  }, [md]);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <textarea value={md} onChange={(e) => setMd(e.target.value)} rows={12} className={textareaCls} />
      <div className="prose-sm rounded-xl border border-slate-200 bg-white p-4 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function Minifier() {
  const [input, setInput] = useState("/* comment */\nbody {\n  color: red;\n  margin: 0;\n}");
  const out = useMemo(() => input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim(), [input]);
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className={textareaCls} />
      <p className="text-xs text-slate-500">Giảm {(input.length - out.length)} ký tự ({input.length ? Math.round((input.length - out.length) / input.length * 100) : 0}%).</p>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function StringEscape() {
  const [input, setInput] = useState('Xin chào "ToolBox" \n xuống dòng');
  const esc = useMemo(() => JSON.stringify(input).slice(1, -1), [input]);
  const uni = useMemo(() => [...input].map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join(""), [input]);
  return (
    <div className="space-y-3">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className={textareaCls} />
      <p className="text-xs font-bold">JSON escaped</p><ResultBox>{esc}</ResultBox>
      <p className="text-xs font-bold">Unicode escaped</p><ResultBox>{uni}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={esc} /></div>
    </div>
  );
}

export function MyIp() {
  const [ip, setIp] = useState("...");
  const [info, setInfo] = useState<{ ua: string; lang: string; cores: number | string; mem: string; screen: string; tz: string } | null>(null);
  React.useEffect(() => {
    fetch("https://api.ipify.org?format=json").then((r) => r.json()).then((j) => setIp(j.ip)).catch(() => setIp("Không lấy được (offline)"));
    const data = {
      ua: navigator.userAgent, lang: navigator.language, cores: navigator.hardwareConcurrency ?? "?",
      mem: "deviceMemory" in navigator ? String((navigator as { deviceMemory?: number }).deviceMemory) + " GB" : "?",
      screen: `${window.screen.width}×${window.screen.height}`, tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    requestAnimationFrame(() => setInfo(data));
  }, []);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-center text-white">
        <p className="text-sm opacity-80">IP công cộng của bạn</p>
        <p className="mt-1 font-mono text-3xl font-extrabold">{ip}</p>
      </div>
      {info && <ResultBox>{`User-Agent: ${info.ua}\nNgôn ngữ: ${info.lang}\nCPU: ${info.cores} cores | RAM: ${info.mem}\nMàn hình: ${info.screen}\nMúi giờ: ${info.tz}`}</ResultBox>}
    </div>
  );
}

export function SerpPreview() {
  const [title, setTitle] = useState("toolboxvn – 100+ công cụ online miễn phí");
  const [url, setUrl] = useState("https://toolbox.vn/");
  const [desc, setDesc] = useState("Tổng hợp 100+ công cụ online miễn phí: đếm từ, tạo QR, tính BMI, format JSON... Nhanh, chuẩn SEO, responsive.");
  return (
    <div className="space-y-4">
      <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} /></Field>
      <Field label="URL"><input value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} /></Field>
      <Field label="Description"><textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className={textareaCls} /></Field>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500">{url}</p>
        <p className="text-xl text-[#1a0dab] hover:underline">{title.slice(0, 60)}</p>
        <p className="text-sm text-slate-600">{desc.slice(0, 160)}</p>
      </div>
    </div>
  );
}

export function RobotsGen() {
  const [domain, setDomain] = useState("https://toolbox.vn");
  const [sitemap, setSitemap] = useState(true);
  const out = `User-agent: *\nAllow: /\n\nSitemap: ${domain.replace(/\/$/, "")}/sitemap.xml`;
  void sitemap;
  return (
    <div className="space-y-3">
      <Field label="Domain"><input value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sitemap} onChange={(e) => setSitemap(e.target.checked)} /> Khai báo Sitemap</label>
      <ResultBox>{sitemap ? out : "User-agent: *\nAllow: /"}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /><DownloadBtn text={out} filename="robots.txt" /></div>
    </div>
  );
}

export function SitemapGen() {
  const [urls, setUrls] = useState("https://toolbox.vn/\nhttps://toolbox.vn/cong-cu/dem-tu");
  const out = useMemo(() => {
    const list = urls.split("\n").map((s) => s.trim()).filter(Boolean);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n")}\n</urlset>`;
  }, [urls]);
  return (
    <div className="space-y-3">
      <textarea value={urls} onChange={(e) => setUrls(e.target.value)} rows={6} className={textareaCls} />
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /><DownloadBtn text={out} filename="sitemap.xml" mime="application/xml" /></div>
    </div>
  );
}

export function MetaGen() {
  const [title, setTitle] = useState("toolboxvn");
  const [desc, setDesc] = useState("100+ công cụ online miễn phí");
  const [url, setUrl] = useState("https://toolbox.vn/");
  const out = `<title>${title}</title>\n<meta name="description" content="${desc}" />\n<link rel="canonical" href="${url}" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:type" content="website" />\n<meta name="twitter:card" content="summary_large_image" />`;
  return (
    <div className="space-y-3">
      <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} /></Field>
      <Field label="Description"><input value={desc} onChange={(e) => setDesc(e.target.value)} className={inputCls} /></Field>
      <Field label="URL"><input value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} /></Field>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function UtmBuilder() {
  const [base, setBase] = useState("https://toolbox.vn/cong-cu/dem-tu");
  const [src, setSrc] = useState("facebook");
  const [med, setMed] = useState("cpc");
  const [camp, setCamp] = useState("launch");
  const out = `${base}${base.includes("?") ? "&" : "?"}utm_source=${encodeURIComponent(src)}&utm_medium=${encodeURIComponent(med)}&utm_campaign=${encodeURIComponent(camp)}`;
  return (
    <div className="space-y-3">
      <Field label="URL gốc"><input value={base} onChange={(e) => setBase(e.target.value)} className={inputCls} /></Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Source"><input value={src} onChange={(e) => setSrc(e.target.value)} className={inputCls} /></Field>
        <Field label="Medium"><input value={med} onChange={(e) => setMed(e.target.value)} className={inputCls} /></Field>
        <Field label="Campaign"><input value={camp} onChange={(e) => setCamp(e.target.value)} className={inputCls} /></Field>
      </div>
      <ResultBox>{out}</ResultBox>
      <div className="tool-action-area flex gap-2"><CopyBtn text={out} /></div>
    </div>
  );
}

export function PingTest() {
  const [url, setUrl] = useState("https://www.google.com/generate_204");
  const [ms, setMs] = useState<number | null>(null);
  const [run, setRun] = useState(false);
  const test = async () => {
    setRun(true);
    const t0 = performance.now();
    try { await fetch(url, { mode: "no-cors", cache: "no-store" }); } catch {}
    setMs(Math.round(performance.now() - t0));
    setRun(false);
  };
  return (
    <div className="space-y-3">
      <Field label="URL test"><input value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} /></Field>
      <div className="tool-action-area"><button onClick={test} disabled={run} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{run ? "Đang đo..." : "Đo ping"}</button></div>
      {ms !== null && <p className="text-2xl font-extrabold">{ms} ms</p>}
      <p className="text-xs text-slate-500">Đo thời gian fetch từ trình duyệt bạn tới server (tham khảo, chịu ảnh hưởng mạng).</p>
    </div>
  );
}
