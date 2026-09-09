import type React from "react";
import type { Tool } from "@/lib/tools";

/* Deterministic pseudo-random from a seed string — same on server & client. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rnd(seed: number, i: number): number {
  const x = Math.sin(seed % 100000 + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* ── Artifacts ─────────────────────────────────────────────── */

function QrArtifact({ seed }: { seed: number }) {
  const cells: React.JSX.Element[] = [];
  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= 14 && y < 7) || (x < 7 && y >= 14);
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      if (inFinder(x, y)) continue;
      if (rnd(seed, y * 21 + x) > 0.52) {
        cells.push(<rect key={`${x}-${y}`} x={x * 5 + 4} y={y * 5 + 4} width={4} height={4} rx={0.5} />);
      }
    }
  }
  const finder = (fx: number, fy: number) => (
    <g key={`f-${fx}-${fy}`}>
      <rect x={fx * 5 + 2} y={fy * 5 + 2} width={33} height={33} rx={3} fill="none" stroke="currentColor" strokeWidth={4} />
      <rect x={fx * 5 + 12} y={fy * 5 + 12} width={13} height={13} rx={1.5} fill="var(--accent)" stroke="none" />
    </g>
  );
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full text-[var(--fg)]" aria-hidden="true" fill="currentColor">
      {cells}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </svg>
  );
}

function JsonArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <text x={10} y={26} fontFamily="var(--font-mono)" fontSize={13} fill="var(--accent)">{`{`}</text>
      <text x={24} y={44} fontFamily="var(--font-mono)" fontSize={9} fill="var(--fg)">"name":</text>
      <text x={66} y={44} fontFamily="var(--font-mono)" fontSize={9} fill="var(--fg-muted)">"ToolBox"</text>
      <rect x={24} y={54} width={30} height={7} rx={2} fill="var(--fg-muted)" opacity={0.5} />
      <rect x={24} y={67} width={44} height={7} rx={2} fill="var(--fg-muted)" opacity={0.3} />
      <rect x={24} y={80} width={22} height={7} rx={2} fill="var(--fg-muted)" opacity={0.4} />
      <text x={10} y={100} fontFamily="var(--font-mono)" fontSize={13} fill="var(--accent)">{`}`}</text>
    </svg>
  );
}

function PaletteArtifact() {
  const colors = ["#1d4ed8", "#0e7490", "#3f6212", "#b45309", "#9f1239"];
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      {colors.map((c, i) => (
        <rect key={c} x={6 + i * 21} y={i % 2 === 0 ? 22 : 34} width={18} height={54} rx={4} fill={c} />
      ))}
    </svg>
  );
}

function PasswordArtifact({ seed }: { seed: number }) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let shown = "";
  for (let i = 0; i < 6; i++) shown += chars[Math.floor(rnd(seed, i) * chars.length)];
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <text x={8} y={54} fontFamily="var(--font-mono)" fontSize={16} fontWeight={700} fill="var(--fg)">{shown}</text>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={74 + i * 12} cy={49} r={4.5} fill="var(--fg-muted)" />
      ))}
      <rect x={8} y={70} width={96} height={5} rx={2.5} fill="var(--border)" />
      <rect x={8} y={70} width={78} height={5} rx={2.5} fill="var(--accent)" />
    </svg>
  );
}

function BmiArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <text x={8} y={34} fontFamily="var(--font-mono)" fontSize={22} fontWeight={800} fill="var(--fg)">22.1</text>
      <text x={8} y={50} fontFamily="var(--font-mono)" fontSize={8} fill="var(--fg-muted)">NORMAL</text>
      <rect x={8} y={72} width={32} height={7} rx={2} fill="var(--fg-muted)" opacity={0.35} />
      <rect x={42} y={72} width={32} height={7} rx={2} fill="var(--accent)" />
      <rect x={76} y={72} width={28} height={7} rx={2} fill="var(--fg-muted)" opacity={0.35} />
      <circle cx={52} cy={75.5} r={5.5} fill="none" stroke="var(--fg)" strokeWidth={2.5} />
    </svg>
  );
}

function CalculatorArtifact() {
  const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      {keys.map((k) => {
        const col = k % 4, row = Math.floor(k / 4);
        const isOp = col === 3 || k === 11;
        return (
          <rect
            key={k}
            x={8 + col * 25}
            y={14 + row * 28}
            width={21}
            height={22}
            rx={5}
            fill={k === 11 ? "var(--accent)" : "var(--fg-muted)"}
            opacity={k === 11 ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}

function WordsArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={8} y={16 + i * 13} width={[86, 70, 94, 54][i]} height={6} rx={3} fill="var(--fg-muted)" opacity={0.55 - i * 0.08} />
      ))}
      <line x1={8} y1={68} x2={104} y2={68} stroke="var(--border)" strokeWidth={1.5} />
      <text x={8} y={92} fontFamily="var(--font-mono)" fontSize={17} fontWeight={800} fill="var(--fg)">128</text>
      <text x={44} y={92} fontFamily="var(--font-mono)" fontSize={9} fill="var(--fg-muted)">WORDS</text>
    </svg>
  );
}

function Base64Artifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <text x={10} y={34} fontFamily="var(--font-mono)" fontSize={11} fill="var(--fg)">ToolBoxVN</text>
      <path d="M56 42 v18 m-6 -6 l6 6 l6 -6" stroke="var(--accent)" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={10} y={84} fontFamily="var(--font-mono)" fontSize={10.5} fill="var(--fg-muted)">VG9vbEJveFZO</text>
    </svg>
  );
}

function CurrencyArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <text x={10} y={30} fontFamily="var(--font-mono)" fontSize={10} fill="var(--fg-muted)">USD</text>
      <rect x={40} y={22} width={58} height={13} rx={3} fill="var(--fg-muted)" opacity={0.3} />
      <text x={10} y={52} fontFamily="var(--font-mono)" fontSize={10} fill="var(--fg-muted)">EUR</text>
      <rect x={40} y={44} width={44} height={13} rx={3} fill="var(--fg-muted)" opacity={0.3} />
      <text x={10} y={74} fontFamily="var(--font-mono)" fontSize={10} fill="var(--accent)">VND</text>
      <rect x={40} y={66} width={92} height={13} rx={3} fill="var(--accent)" opacity={0.25} />
      <text x={10} y={98} fontFamily="var(--font-mono)" fontSize={9} fill="var(--fg-muted)">× 25,450</text>
    </svg>
  );
}

function ImageArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <rect x={8} y={18} width={66} height={66} rx={7} fill="none" stroke="var(--fg-muted)" strokeWidth={2.5} />
      <rect x={42} y={34} width={62} height={62} rx={7} fill="var(--accent)" opacity={0.18} stroke="var(--accent)" strokeWidth={2.5} />
      <text x={52} y={72} fontFamily="var(--font-mono)" fontSize={9} fontWeight={700} fill="var(--accent)">−82%</text>
    </svg>
  );
}

function DiceArtifact({ seed }: { seed: number }) {
  const pips: Record<number, [number, number][]> = {
    1: [[27, 27]],
    2: [[16, 16], [38, 38]],
    3: [[16, 16], [27, 27], [38, 38]],
    4: [[16, 16], [38, 16], [16, 38], [38, 38]],
    5: [[16, 16], [38, 16], [27, 27], [16, 38], [38, 38]],
    6: [[16, 16], [38, 16], [16, 27], [38, 27], [16, 38], [38, 38]],
  };
  const v1 = 1 + Math.floor(rnd(seed, 1) * 6);
  const v2 = 1 + Math.floor(rnd(seed, 2) * 6);
  const die = (n: number, x: number, y: number) => (
    <g key={`${n}-${x}`}>
      <rect x={x} y={y} width={48} height={48} rx={10} fill="none" stroke="var(--fg-muted)" strokeWidth={2.5} />
      {pips[n].map(([px, py], i) => (
        <circle key={i} cx={x + px} cy={y + py} r={4} fill="var(--accent)" />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      {die(v1, 10, 14)}
      {die(v2, 56, 52)}
    </svg>
  );
}

function TrendArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <polyline
        points="10,88 30,72 48,78 68,50 88,56 104,26"
        fill="none"
        stroke="var(--accent)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={104} cy={26} r={5} fill="var(--accent)" />
      <line x1={10} y1={98} x2={104} y2={98} stroke="var(--border)" strokeWidth={2} />
    </svg>
  );
}

function ClockArtifact({ seed }: { seed: number }) {
  const h = Math.floor(rnd(seed, 3) * 12);
  const m = Math.floor(rnd(seed, 4) * 12) * 5;
  const ha = ((h % 12) + m / 60) * 30 - 90;
  const ma = m * 6 - 90;
  const hr = 28 * (Math.PI / 180);
  const mr = 36 * (Math.PI / 180);
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <circle cx={56} cy={56} r={44} fill="none" stroke="var(--fg-muted)" strokeWidth={3} />
      <line x1={56} y1={56} x2={56 + Math.cos(ha) * 20} y2={56 + Math.sin(ha) * 20} stroke="var(--fg)" strokeWidth={4} strokeLinecap="round" />
      <line x1={56} y1={56} x2={56 + Math.cos(ma) * 30} y2={56 + Math.sin(ma) * 30} stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={56} cy={56} r={3.5} fill="var(--fg)" />
    </svg>
  );
}

function DevArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <path d="M38 38 L22 56 L38 74 M74 38 L90 56 L74 74" fill="none" stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <line x1={60} y1={34} x2={52} y2={78} stroke="var(--fg-muted)" strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  );
}

function TextArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={10} y={20 + i * 16} width={[92, 78, 88, 60, 96][i]} height={7} rx={3.5} fill="var(--fg-muted)" opacity={0.5 - i * 0.06} />
      ))}
    </svg>
  );
}

function SeoArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      <circle cx={48} cy={48} r={30} fill="none" stroke="var(--fg-muted)" strokeWidth={4} />
      <line x1={70} y1={70} x2={96} y2={96} stroke="var(--fg-muted)" strokeWidth={4} strokeLinecap="round" />
      <rect x={10} y={82} width={40} height={7} rx={3.5} fill="var(--accent)" />
      <rect x={10} y={94} width={26} height={7} rx={3.5} fill="var(--fg-muted)" opacity={0.4} />
    </svg>
  );
}

function GridArtifact() {
  return (
    <svg viewBox="0 0 112 112" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={34 + (i % 2) * 44} cy={34 + Math.floor(i / 2) * 44} r={9} fill={i === 0 ? "var(--accent)" : "var(--fg-muted)"} opacity={i === 0 ? 1 : 0.45} />
      ))}
    </svg>
  );
}

/* ── Routing: slug → artifact, then category fallback ─────── */

const SLUG_ARTIFACTS: Record<string, (seed: number) => React.JSX.Element> = {
  "tao-ma-qr": (s) => <QrArtifact seed={s} />,
  "tao-ma-vach-qr-wifi": (s) => <QrArtifact seed={s} />,
  "tao-ma-barcode": (s) => <QrArtifact seed={s} />,
  "json-formatter": () => <JsonArtifact />,
  "csv-sang-json": () => <JsonArtifact />,
  "json-sang-csv": () => <JsonArtifact />,
  "tao-mat-khau": (s) => <PasswordArtifact seed={s} />,
  "tao-ma-pin": (s) => <PasswordArtifact seed={s} />,
  "tinh-bmi": () => <BmiArtifact />,
  "may-tinh": () => <CalculatorArtifact />,
  "tinh-phan-tram": () => <CalculatorArtifact />,
  "dem-tu": () => <WordsArtifact />,
  "dem-ky-tu": () => <WordsArtifact />,
  "dem-cau": () => <WordsArtifact />,
  "ma-hoa-base64": () => <Base64Artifact />,
  "giai-ma-base64": () => <Base64Artifact />,
  "doi-tien-te": () => <CurrencyArtifact />,
  "nen-anh": () => <ImageArtifact />,
  "doi-size-anh": () => <ImageArtifact />,
  "anh-sang-base64": () => <ImageArtifact />,
  "tao-favicon": () => <ImageArtifact />,
  "xoay-lat-anh": () => <ImageArtifact />,
  "hex-sang-rgb": () => <PaletteArtifact />,
  "rgb-sang-hex": () => <PaletteArtifact />,
  "bang-mau": () => <PaletteArtifact />,
  "chon-mau": () => <PaletteArtifact />,
  "kiem-tra-tuong-phan": () => <PaletteArtifact />,
  "tao-gradient": () => <PaletteArtifact />,
  "tung-xuc-xac": (s) => <DiceArtifact seed={s} />,
  "tinh-lai-kep": () => <TrendArtifact />,
  "tinh-lai-vay": () => <TrendArtifact />,
  "doi-timestamp": (s) => <ClockArtifact seed={s} />,
  "dem-nguoc": (s) => <ClockArtifact seed={s} />,
  "bam-gio": (s) => <ClockArtifact seed={s} />,
  "tinh-tuoi": (s) => <ClockArtifact seed={s} />,
  "xem-truoc-serp": () => <SeoArtifact />,
  "tao-meta-tags": () => <SeoArtifact />,
};

const CATEGORY_ARTIFACTS: Record<string, (seed: number) => React.JSX.Element> = {
  "Văn bản": () => <TextArtifact />,
  "Mã hoá & Dev": () => <DevArtifact />,
  "Màu sắc": () => <PaletteArtifact />,
  "Ngẫu nhiên": (s) => <DiceArtifact seed={s} />,
  "Chuyển đổi": () => <TrendArtifact />,
  "Tài chính": () => <CurrencyArtifact />,
  "Sức khoẻ": () => <BmiArtifact />,
  "Thời gian": (s) => <ClockArtifact seed={s} />,
  "SEO & Marketing": () => <SeoArtifact />,
  "Hình ảnh": () => <ImageArtifact />,
  "Tiện ích": () => <GridArtifact />,
};

export default function ToolPreview({
  tool,
  className = "",
  label,
}: {
  tool: Tool;
  className?: string;
  label?: string;
}) {
  const seed = hash(tool.slug);
  const render = SLUG_ARTIFACTS[tool.slug] ?? CATEGORY_ARTIFACTS[tool.category] ?? (() => <GridArtifact />);
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--bg-recessed)] p-6 ${className}`}
      role="img"
      aria-label={label ?? `${tool.name} preview`}
    >
      <div className="aspect-square w-full max-w-[150px]">{render(seed)}</div>
    </div>
  );
}
