"use client";

import { useEffect, useRef, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const stored = localStorage.getItem("theme");
    const prefersDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    if (!initRef.current) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return (
    <button
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label={dark ? "Chế độ sáng" : "Chế độ tối"}
      title={dark ? "Chế độ sáng" : "Chế độ tối"}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
