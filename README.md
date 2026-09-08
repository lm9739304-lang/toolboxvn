# ToolBox VN — 100+ công cụ online miễn phí

Next.js 16 (App Router) + Tailwind, **static export** (`out/`) → deploy 1-click lên **Vercel** hoặc **Cloudflare Pages**.

## Tính năng
- **110 công cụ** (vượt yêu cầu 100+), mỗi tool 1 URL riêng `/cong-cu/[slug]`, có `generateMetadata`, sitemap.xml, robots.txt, JSON-LD.
- Chạy **100% client-side** (Web Crypto, Canvas): nhanh, riêng tư, không cần backend.
- **Quảng cáo an toàn**: 5 zone cố định — `header-top`, `in-content`, `tool-mid`, `footer-bottom`, `sidebar`.
  - Có nhãn “Quảng cáo”, margin ≥32px cách nút chức năng, không popup/sticky che nội dung, không giả nút.
  - Responsive mobile (banner co giãn), ẩn khi in.
- **Trang Admin** (`/admin`, pass mặc định `admin123`):
  - Bật/tắt từng tool, ghim nổi bật (tối đa 8).
  - Bật/tắt từng zone quảng cáo + dán mã AdSense riêng.
  - Xuất/nhập JSON cấu hình, reset mặc định. Lưu `localStorage toolboxvn:v1`.

## Chạy local
```bash
npm install
npm run dev
```

## Build + Deploy
```bash
npm run build   # → thư mục out/
```

- **Vercel**: Import repo → Framework Next.js → Build `npm run build`, Output `out` (đã có `vercel.json`).
- **Cloudflare Pages**: Build command `npm run build`, Build output directory `out`, Node 20+.
- Đổi domain: set env `NEXT_PUBLIC_SITE_URL=https://domain-cua-ban` rồi build lại (canonical + sitemap + JSON-LD).

## Cấu trúc
- `lib/tools.ts` — 110 định nghĩa tool + categories + SEO keywords
- `components/ToolRunner.tsx` + `components/tools/*` — implementations
- `components/AdSlot.tsx` — slot quảng cáo an toàn
- `lib/site-config.tsx` — config + localStorage provider
- `app/cong-cu/[slug]/page.tsx` — trang tool (SSG 110 trang)
- `app/admin/page.tsx` — quản trị
- `next.config.ts` — `output: export`, `images.unoptimized`

## Lưu ý Next.js 16 (breaking changes đã xử lý)
- `params`/`searchParams` là **Promise** → `await params` trong `[slug]/page.tsx` + `generateMetadata`.
- Trang chủ dùng `useSearchParams` + `Suspense` (không `await searchParams` trên server) để tương thích `output: export`.
- `sitemap.ts`/`robots.ts` có `export const dynamic = "force-static"`.
- `images.unoptimized`, không dùng Server Actions/cookies/headers (không hỗ trợ static export).
