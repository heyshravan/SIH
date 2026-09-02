"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Satellite,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

export function SuperhumanHeader({ theme = "dark", onToggleTheme }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Documentation", href: "/agent-flow" },
    { name: "Solutions", href: "/solutions" },
    { name: "Benchmarks", href: "/benchmarks" },
    { name: "Roadmap", href: "/roadmap" },
  ];

  return (
    <header className="w-full z-50 transition-colors duration-300 relative">
      {/* Top Announcement Banner */}
      <div className="pt-3 px-4 max-w-4xl mx-auto">
        <div
          className={`rounded-full py-2 px-5 flex items-center justify-between text-xs sm:text-sm text-white shadow-lg transition-all ${
            isDark
              ? "bg-gradient-to-r from-[#2d2242] via-[#3b2d56] to-[#2d2242] border border-violet-500/30 shadow-violet-950/40"
              : "bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 shadow-indigo-500/20"
          }`}
        >
          <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold tracking-wide truncate">
              SatQuery AI Remote Sensing Documentation & Agent Roadmap
            </span>
          </div>

          <Link
            href="/agent-flow"
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all shrink-0 group"
          >
            <span>Read Docs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main Clean Minimalist Documentation Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Satellite className="w-5 h-5" />
          </div>
          <span className={`font-extrabold text-xl tracking-tight whitespace-nowrap ${isDark ? "text-white" : "text-slate-900"}`}>
            SatQuery <span className="text-violet-500 font-mono text-sm font-bold">Docs</span>
          </span>
        </Link>

        {/* Desktop Documentation Nav Links (Increased Font Size text-sm sm:text-base) */}
        <nav className="hidden md:flex items-center gap-8 text-sm sm:text-base font-extrabold tracking-wide">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-violet-500 font-extrabold scale-105"
                    : isDark
                    ? "text-slate-200 hover:text-white"
                    : "text-slate-800 hover:text-indigo-600"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${
              isDark
                ? "bg-white/10 border-white/20 text-amber-300 hover:bg-white/20"
                : "bg-white border-slate-300 text-indigo-600 hover:bg-slate-100"
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Documentation CTA Pill (Increased Font Size text-sm) */}
          <Link
            href="/agent-flow"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap group"
          >
            <span>Explore Docs</span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </Link>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl border flex items-center justify-center text-slate-400 hover:text-white border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className={`p-4 rounded-2xl border shadow-2xl space-y-2 backdrop-blur-xl ${
            isDark ? "bg-[#161828] border-violet-500/30 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-extrabold ${
                  pathname === item.href
                    ? "text-violet-400 bg-violet-500/10"
                    : isDark ? "text-slate-200 hover:text-white" : "text-slate-800 hover:text-slate-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
