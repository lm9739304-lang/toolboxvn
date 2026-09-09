import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, getTool, getRelated } from "@/lib/tools";
import ToolClient from "./ToolClient";
import ToolActions from "./ToolActions";
import AdSlot from "@/components/AdSlot";
import ToolDetailText, { ToolGuide, ToolRelated, ToolSidebar } from "./ToolDetailText";
import ToolHeader from "./ToolHeader";

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

      <ToolDetailText tool={tool} />

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <article>
          <ToolHeader tool={tool} />
          <ToolActions slug={tool.slug} />

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
