import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { SiteProvider } from "@/lib/site-config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "toolboxvn – 100+ công cụ online miễn phí",
    template: "%s | toolboxvn",
  },
  description:
    "Tổng hợp 100+ công cụ online miễn phí: đếm từ, tạo QR, format JSON, tính BMI, đổi tiền tệ, SEO... Chạy 100% trên trình duyệt, nhanh, responsive, chuẩn SEO.",
  keywords: ["công cụ online", "toolbox vn", "đếm từ", "tạo qr", "format json", "tính bmi", "đổi tiền"],
  authors: [{ name: "toolboxvn" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "toolboxvn",
    title: "toolboxvn – 100+ công cụ online miễn phí",
    description: "100+ tools miễn phí, tốc độ cao, mỗi tool có URL riêng.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "toolboxvn",
    url: SITE_URL,
    description: "100+ công cụ online miễn phí",
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html lang="vi" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){if(typeof MutationObserver==="undefined")return;var badAttrs=["bis_skin_checked","data-adblock","data-abp","data-block","data-adblockrule"];new MutationObserver(function(muts){for(var i=0;i<muts.length;i++){var m=muts[i];if(m.type==="attributes"&&badAttrs.indexOf(m.attributeName)!==-1){m.target.removeAttribute(m.attributeName)}}}).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:badAttrs})}();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SiteProvider>
          <Header />
          <AdSlot zone="header-top" />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4">{children}</main>
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
