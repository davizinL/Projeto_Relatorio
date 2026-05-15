"use client";

import { useEffect, useState } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Desativar tema escuro" : "Ativar tema escuro"}
      className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
    >
      {dark ? <LightbulbOff className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
    </button>
  );
}
