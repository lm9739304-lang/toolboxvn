import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, getTool, getRelated } from "@/lib/tools";
import ToolClient from "./ToolClient";
import ToolActions from "./ToolActions";
import AdSlot from "@/components/AdSlot";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.vn";

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "Không tìm thấy" };
  const title = `${tool.name} miễn phí online`;
  const description = `${tool.description} Dùng ngay trên toolboxvn — nhanh, miễn phí, không cần đăng nhập.`;
  return {
    title,
    description,
    keywords: [tool.name, ...tool.keywords, tool.category],
    alternates: { canonical: `${SITE_URL}/cong-cu/${tool.slug}` },
    openGraph: {
      title: `${tool.name} | toolboxvn`,
      description,
      url: `${SITE_URL}/cong-cu/${tool.slug}`,
      type: "article",
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const related = getRelated(tool, 8);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${tool.name} có miễn phí không?`,
        acceptedAnswer: { "@type": "Answer", text: "Có, hoàn toàn miễn phí, không cần đăng nhập, chạy trực tiếp trên trình duyệt." },
      },
      {
        "@type": "Question",
        name: "Dữ liệu của tôi có bị tải lên server?",
        acceptedAnswer: { "@type": "Answer", text: "Không. Mọi xử lý chạy client-side bằng JavaScript/Web Crypto/Canvas." },
      },
    ],
  };

  return (
    <div className="animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Back + header */}
      <nav className="flex items-center gap-2 py-4 text-sm">
        <Link href="/" className="flex items-center gap-1 text-slate-500 transition hover:text-blue-600 dark:text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Quay lại
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <article>
          {/* Tool header */}
          <header className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl dark:bg-blue-900/20">{tool.icon}</span>
              <div className="flex-1">
                <h1 className="text-xl font-extrabold sm:text-2xl">{tool.name}</h1>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
              </div>
            </div>
            <ToolActions slug={tool.slug} />
          </header>

          {/* Tool workspace */}
          <section className="tool-action-area mt-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:p-6" aria-label={`Sử dụng ${tool.name}`}>
            <ToolClient tool={tool} />
          </section>

          <AdSlot zone="tool-mid" />

          {/* Guide */}
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="font-extrabold">📖 Cách dùng</h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {(tool.guide.length ? tool.guide : ["Nhập dữ liệu vào ô phía trên.", "Kết quả hiện ngay theo thời gian thực.", "Bấm Sao chép / Tải về để sử dụng."]).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ol>

            <h3 className="mt-5 font-bold">❓ Câu hỏi thường gặp</h3>
            <div className="mt-2 space-y-2 text-sm">
              <details className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><summary className="cursor-pointer font-semibold">Có miễn phí không?</summary><p className="mt-1 text-slate-600 dark:text-slate-400">Có, 100% miễn phí, không giới hạn, không cần tài khoản.</p></details>
              <details className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><summary className="cursor-pointer font-semibold">Dữ liệu có an toàn?</summary><p className="mt-1 text-slate-600 dark:text-slate-400">Mọi xử lý chạy trên trình duyệt của bạn (client-side), không gửi lên máy chủ.</p></details>
              <details className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><summary className="cursor-pointer font-semibold">Dùng trên điện thoại được không?</summary><p className="mt-1 text-slate-600 dark:text-slate-400">Có, giao diện responsive, banner quảng cáo tự co giãn, không che nút.</p></details>
            </div>
          </section>

          {/* Related */}
          <section className="mt-6">
            <h2 className="font-extrabold">🧰 Công cụ liên quan</h2>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="tool-card flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">{r.icon}</span>
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-bold">{r.name}</span>
                    <span className="block text-xs text-slate-500">{r.category}</span>
                  </div>
                  <svg className="tool-arrow ml-auto h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-sm font-extrabold">📌 {tool.category}</p>
              <div className="mt-2 space-y-0.5">
                {related.slice(0, 6).map((r) => (
                  <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="block truncate rounded-lg px-2 py-1.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    {r.icon} {r.name}
                  </Link>
                ))}
              </div>
            </div>
            <AdSlot zone="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
