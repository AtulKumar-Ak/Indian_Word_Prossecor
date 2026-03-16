"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const handleClick = () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }

    setTheme(isDark ? "light" : "dark");
    setExpanded(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border border-border shadow-md",
        "bg-card text-foreground transition-all duration-300 hover:shadow-lg"
      )}
    >
      {/* Rotating Icon */}
      <div
        className={cn(
          "transition-transform duration-500 ease-in-out",
          isDark ? "rotate-180" : "rotate-0"
        )}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-yellow-400" />
        ) : (
          <Sun className="w-4 h-4 text-orange-500" />
        )}
      </div>

      {/* Text */}
      <span className="text-sm font-medium">
        {expanded
          ? isDark
            ? "Switch to Light"
            : "Switch to Dark"
          : isDark
          ? "Dark"
          : "Light"}
      </span>
    </button>
  );
}