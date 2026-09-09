import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, getTool, getRelated } from "@/lib/tools";
import ToolClient from "./ToolClient";
import ToolActions from "./ToolActions";
import AdSlot from "@/components/AdSlot";
import Icon from "@/components/Icon";
import ToolDetailText, { ToolGuide, ToolRelated, ToolSidebar } from "./ToolDetailText";

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

      <ToolDetailText slug={tool.name} category={tool.category} />

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <article>
          <header>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-recessed)] text-[var(--fg-muted)]">
                <Icon name={tool.icon} className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h1 className="text-[20px] font-bold tracking-tight sm:text-[24px]">{tool.name}</h1>
                <p className="mt-0.5 text-[13px] text-[var(--fg-secondary)]">{tool.description}</p>
              </div>
            </div>
            <ToolActions slug={tool.slug} />
          </header>

          <section className="tool-action-area mt-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 sm:p-6" aria-label={`Use ${tool.name}`}>
            <ToolClient tool={tool} />
          </section>

          <AdSlot zone="tool-mid" />

          <ToolGuide guide={tool.guide} />

          <ToolRelated related={related} />
        </article>

        <ToolSidebar category={tool.category} related={related} />
      </div>
    </div>
  );
}
