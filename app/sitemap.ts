import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.vn";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/admin`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    ...TOOLS.map((t) => ({
      url: `${SITE_URL}/cong-cu/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
