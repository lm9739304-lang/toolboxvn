import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-6xl">🧰</p>
      <h1 className="mt-4 text-3xl font-extrabold">Không tìm thấy trang</h1>
      <p className="mt-2 text-slate-500">Công cụ bạn tìm có thể đã đổi tên hoặc bị tắt trong Admin.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white">
        ← Về trang chủ
      </Link>
    </div>
  );
}
