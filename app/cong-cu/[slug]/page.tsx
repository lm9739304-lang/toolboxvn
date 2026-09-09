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
  if (!tool) return { title: "Not found" };
  const title = `${tool.name} — free online tool`;
  const description = `${tool.description} Use it on toolboxvn — fast, free, no login required.`;
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
        name: `Is ${tool.name} free?`,
        acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. No login, no limits, runs directly in your browser." },
      },
      {
        "@type": "Question",
        name: "Is my data uploaded to a server?",
        acceptedAnswer: { "@type": "Answer", text: "No. All processing runs client-side using JavaScript, Web Crypto, or Canvas." },
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 py-4 text-[12px] text-[var(--fg-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="transition-default hover:text-[var(--fg)]">Home</Link>
        <span>/</span>
        <Link href={`/?cat=${encodeURIComponent(tool.category)}`} className="transition-default hover:text-[var(--fg)]">{tool.category}</Link>
        <span>/</span>
        <span className="font-medium text-[var(--fg)]">{tool.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <article>
          {/* Tool header */}
          <header>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-recessed)] text-2xl">{tool.icon}</span>
              <div className="flex-1">
                <h1 className="text-[20px] font-bold tracking-tight sm:text-[24px]">{tool.name}</h1>
                <p className="mt-0.5 text-[13px] text-[var(--fg-secondary)]">{tool.description}</p>
              </div>
            </div>
            <ToolActions slug={tool.slug} />
          </header>

          {/* Tool workspace */}
          <section className="tool-action-area mt-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 sm:p-6" aria-label={`Use ${tool.name}`}>
            <ToolClient tool={tool} />
          </section>

          <AdSlot zone="tool-mid" />

          {/* Guide */}
          <section className="mt-6">
            <h2 className="text-[14px] font-semibold text-[var(--fg)]">How to use</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-[var(--fg-secondary)]">
              {(tool.guide.length ? tool.guide : ["Enter your data in the field above.", "Results update in real time.", "Copy or download the output."]).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ol>

            <h3 className="mt-6 text-[14px] font-semibold text-[var(--fg)]">FAQ</h3>
            <div className="mt-2 space-y-1 text-[13px]">
              <details className="rounded-lg bg-[var(--bg-recessed)] p-3"><summary className="cursor-pointer font-medium text-[var(--fg)]">Is it free?</summary><p className="mt-1 text-[var(--fg-secondary)]">Yes, 100% free. No limits, no account needed.</p></details>
              <details className="rounded-lg bg-[var(--bg-recessed)] p-3"><summary className="cursor-pointer font-medium text-[var(--fg)]">Is my data safe?</summary><p className="mt-1 text-[var(--fg-secondary)]">Everything runs on your browser (client-side). Nothing is sent to any server.</p></details>
              <details className="rounded-lg bg-[var(--bg-recessed)] p-3"><summary className="cursor-pointer font-medium text-[var(--fg)]">Does it work on mobile?</summary><p className="mt-1 text-[var(--fg-secondary)]">Yes. Responsive layout, ads resize to avoid blocking content.</p></details>
            </div>
          </section>

          {/* Related */}
          <section className="mt-8">
            <h2 className="text-[14px] font-semibold text-[var(--fg)]">Related tools</h2>
            <div className="mt-3 space-y-1">
              {related.map((r) => (
                <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="tool-row">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--bg-recessed)] text-base">{r.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">{r.name}</span>
                    <span className="block text-[11px] text-[var(--fg-muted)]">{r.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-16 space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{tool.category}</p>
              <div className="mt-2 space-y-0.5">
                {related.slice(0, 6).map((r) => (
                  <Link key={r.slug} href={`/cong-cu/${r.slug}`} className="block truncate rounded-md px-2 py-1.5 text-[13px] text-[var(--fg-secondary)] transition-default hover:bg-[var(--bg-recessed)] hover:text-[var(--fg)]">
                    {r.name}
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
