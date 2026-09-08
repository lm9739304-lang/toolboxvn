import Link from "next/link";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/cong-cu/${tool.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-blue-50">
          {tool.icon}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-bold text-[15px] text-slate-900 group-hover:text-blue-700">{tool.name}</h3>
          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {tool.category}
          </span>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{tool.description}</p>
    </Link>
  );
}
