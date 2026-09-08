"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HomeClient from "@/components/HomeClient";

function HomeInner() {
  const sp = useSearchParams();
  return <HomeClient q0={sp.get("q") ?? ""} cat0={sp.get("cat") ?? ""} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Đang tải công cụ...</div>}>
      <HomeInner />
    </Suspense>
  );
}
