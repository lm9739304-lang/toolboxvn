import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.vn";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for ToolboxVN — free tools, provided as-is.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return <InfoPage titleKey="termsTitle" leadKey="termsLead" bodyKey="termsBody" />;
}
