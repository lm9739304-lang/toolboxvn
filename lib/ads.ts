export type AdZoneId =
  | "header-top"
  | "in-content"
  | "footer-bottom"
  | "sidebar"
  | "tool-mid";

export type AdZone = {
  id: AdZoneId;
  name: string;
  desc: string;
  enabled: boolean;
  /** HTML/Adsense code do admin dán vào. Mặc định là placeholder an toàn. */
  customHtml: string;
  /** Kích thước gợi ý */
  sizes: string;
};

export const DEFAULT_AD_ZONES: AdZone[] = [
  {
    id: "header-top",
    name: "Đầu trang (Header)",
    desc: "Banner ngang dưới menu, full-width. Hiển thị mọi trang. Cách nội dung ≥24px.",
    enabled: true,
    customHtml: "",
    sizes: "970×250 / 728×90 / 320×100 responsive",
  },
  {
    id: "in-content",
    name: "Giữa nội dung (Homepage)",
    desc: "Nằm giữa lưới công cụ trên trang chủ, sau dòng 1. Không chèn giữa các nút.",
    enabled: true,
    customHtml: "",
    sizes: "970×250 / 336×280 responsive",
  },
  {
    id: "tool-mid",
    name: "Giữa trang công cụ",
    desc: "Nằm DƯỚI vùng thao tác chính của tool (cách nút ≥40px), TRÊN phần hướng dẫn.",
    enabled: true,
    customHtml: "",
    sizes: "728×90 / 336×280 responsive",
  },
  {
    id: "footer-bottom",
    name: "Cuối trang (Footer)",
    desc: "Banner trên footer, full-width. An toàn, không sticky.",
    enabled: true,
    customHtml: "",
    sizes: "970×90 / 320×100 responsive",
  },
  {
    id: "sidebar",
    name: "Cột bên (Desktop)",
    desc: "Chỉ hiện ≥lg, sticky nhẹ trong giới hạn cột, không che nội dung.",
    enabled: false,
    customHtml: "",
    sizes: "300×600 / 300×250",
  },
];

/**
 * NGUYÊN TẮC QUẢNG CÁO AN TOÀN của toolboxvn:
 * - Không popup, không interstitial che nội dung, không sticky bottom che nút.
 * - Không đặt sát nút chức năng (<24px). AdSlot luôn có margin ≥32px với tool-action-area.
 * - Có nhãn "Quảng cáo" rõ ràng, không giả dạng nút Tải/Copy/Tiếp tục.
 * - Responsive: mobile chỉ banner co giãn, không tràn ngang.
 */
export const ADS_POLICY = `Quảng cáo hiển thị ở vị trí cố định (đầu/giữa/cuối trang), có nhãn rõ ràng, không che nội dung, không đặt sát nút chức năng, không dùng định dạng gây click nhầm.`;

/** Render customHtml một cách an toàn (chỉ cho phép admin dán Adsense). */
export function sanitizeAdHtml(html: string): string {
  // Cho phép script/iframe/ins của Google AdSense + thẻ cơ bản. Chặn on* handlers.
  return html.replace(/\son\w+\s*=/gi, " data-blocked=");
}
