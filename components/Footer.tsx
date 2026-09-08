"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/tools";
import AdSlot from "./AdSlot";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <AdSlot zone="footer-bottom" />
        <div className="grid gap-8 py-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                🧰
              </span>
              toolboxvn
            </div>
            <p className="mt-3 text-sm text-slate-600">
              100+ công cụ online miễn phí: văn bản, dev, chuyển đổi, tài chính, sức khoẻ, SEO... Chạy 100% trên
              trình duyệt, không tải lên server, tốc độ cao.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase text-slate-500">Danh mục</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.name}>
                  <Link href={`/?cat=${encodeURIComponent(c.name)}`} className="text-slate-700 hover:text-blue-600">
                    {c.icon} {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase text-slate-500">Công cụ nổi bật</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="hover:text-blue-600" href="/cong-cu/dem-tu">Đếm từ online</Link></li>
              <li><Link className="hover:text-blue-600" href="/cong-cu/tao-mat-khau">Tạo mật khẩu</Link></li>
              <li><Link className="hover:text-blue-600" href="/cong-cu/json-formatter">Format JSON</Link></li>
              <li><Link className="hover:text-blue-600" href="/cong-cu/tao-ma-qr">Tạo mã QR</Link></li>
              <li><Link className="hover:text-blue-600" href="/cong-cu/tinh-bmi">Tính BMI</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase text-slate-500">Thông tin</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="hover:text-blue-600" href="/admin">Quản trị (Admin)</Link></li>
              <li><Link className="hover:text-blue-600" href="/">Tất cả công cụ</Link></li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Quảng cáo hiển thị ở vị trí cố định, có nhãn rõ ràng, không che nội dung, không đặt sát nút chức năng.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 py-5 text-xs text-slate-500 sm:flex-row">
          <span>© 2026 toolboxvn — Made for speed. Deploy: Vercel / Cloudflare Pages.</span>
          <span>Tốc độ • SEO • Responsive • 100% client-side</span>
        </div>
      </div>
    </footer>
  );
}
