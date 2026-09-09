import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.vn";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy at ToolboxVN — every tool runs locally in your browser. Your data never leaves your device.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return <InfoPage titleKey="privacyTitle" leadKey="privacyLead" bodyKey="privacyBody" />;
}
