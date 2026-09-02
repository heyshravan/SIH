"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SuperhumanHeader } from "./SuperhumanHeader";

export function AppShell({ children }) {
  // Light Mode is now the DEFAULT theme
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();

  const isChatPage = pathname === "/chat";

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      body.classList.add("light");
      body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative ${
        theme === "dark"
          ? "stackryze-grid-dark text-slate-100"
          : "stackryze-grid-light text-slate-900"
      } flex flex-col`}
    >
      {/* Stackryze Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none stackryze-glow-amber -z-10"></div>

      {/* Render header on all pages EXCEPT /chat */}
      {!isChatPage && <SuperhumanHeader theme={theme} onToggleTheme={toggleTheme} />}

      <div className={isChatPage ? "flex-1 w-full flex flex-col" : "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6"}>
        {children}
      </div>
    </div>
  );
}
