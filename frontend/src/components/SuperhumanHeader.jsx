"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
      {/* Main Clean Minimalist Documentation Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
        {/* Left Brand Title Text without logo icon */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <span
              className={`font-black text-xl sm:text-2xl tracking-tight transition-colors ${
                isDark ? "text-white group-hover:text-cyan-400" : "text-slate-900 group-hover:text-violet-600"
              }`}
            >
              SatQuery <span className="text-violet-500 font-mono text-base">AI</span>
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full border dark:border-white/10 dark:bg-white/5 border-slate-200 bg-slate-100/80 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-102"
                    : isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Launch Chat App CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shrink-0 ${
              isDark
                ? "bg-white/10 hover:bg-white/20 text-amber-300 border-white/20"
                : "bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/chat"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Launch Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border dark:bg-white/10 dark:border-white/20 bg-white border-slate-300 text-slate-800 dark:text-white shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border dark:bg-white/10 dark:border-white/20 bg-white border-slate-300 text-slate-800 dark:text-white shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pt-2 pb-6 border-b transition-all ${
          isDark ? "bg-[#0b0c16] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}>
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md"
                      : isDark
                      ? "text-slate-300 hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Launch Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
