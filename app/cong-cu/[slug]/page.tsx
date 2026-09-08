import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, getTool, getRelated } from "@/lib/tools";
import ToolClient from "./ToolClient";
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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 py-4 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span>/</span>
        <Link href={`/?cat=${encodeURIComponent(tool.category)}`} className="hover:text-blue-600">{tool.category}</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{tool.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <article>
          <header className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-3xl">{tool.icon}</span>
              <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">{tool.name} miễn phí</h1>
                <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
              </div>
            </div>
          </header>

          {/* Vùng thao tác chính — quảng cáo KHÔNG được đặt trong/sát vùng này */}
          <section className="tool-action-area mt-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6" aria-label={`Sử dụng ${tool.name}`}>
            <ToolClient tool={tool} />
          </section>

          {/* Quảng cáo giữa trang tool: nằm DƯỚI tool, TRÊN hướng dẫn — cách nút ≥40px */}
          <AdSlot zone="tool-mid" />

          {/* Hướng dẫn */}
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="font-extrabold">📖 Cách dùng {tool.name}</h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
              {(tool.guide.length ? tool.guide : ["Nhập dữ liệu vào ô phía trên.", "Kết quả hiện ngay theo thời gian thực.", "Bấm Sao chép / Tải về để sử dụng."]).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ol>
            <h3 className="mt-5 font-bold">❓ Câu hỏi thường gặp</h3>
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              <details className="rounded-xl bg-slate-50 p-3"><summary className="cursor-pointer font-semibold">Có miễn phí không?</summary><p className="mt-1">Có, 100% miễn phí, không giới hạn, không cần tài khoản.</p></details>
              <details className="rounded-xl bg-slate-50 p-3"><summary className="cursor-pointer font-semibold">Dữ liệu có an toàn?</summary><p className="mt-1">Mọi xử lý chạy trên trình duyệt của bạn (client-side), không gửi lên máy chủ.</p></details>
              <details className="rounded-xl bg-slate-50 p-3"><summary className="cursor-pointer font-semibold">Dùng trên điện thoại được không?</summary><p className="mt-1">Có, giao diện responsive, banner quảng cáo tự co giãn, không che nút.</p></details>
            </div>
          </section>

          {/* Related */}
          <section className="mt-6">
            <h2 className="font-extrabold">🧰 Công cụ liên quan</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:border-blue-300 hover:shadow">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl">{r.icon}</span>
                  <span><span className="block text-sm font-bold">{r.name}</span><span className="block text-xs text-slate-500">{r.category}</span></span>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-extrabold">📌 {tool.category}</p>
              <div className="mt-2 space-y-1">
                {related.slice(0, 5).map((r) => (
                  <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="block truncate rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
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
