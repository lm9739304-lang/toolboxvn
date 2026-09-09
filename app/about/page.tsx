import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.vn";

export const metadata: Metadata = {
  title: "About",
  description: "About ToolboxVN — a small, independent set of fast, private browser utilities.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return <InfoPage titleKey="aboutTitle" leadKey="aboutLead" bodyKey="aboutBody" />;
}
