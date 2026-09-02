"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Satellite,
  Plus,
  MessageSquare,
  GitMerge,
  Layers,
  Cpu,
  BarChart3,
  Compass,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

export function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  activeChatId,
  onSelectChat,
  theme = "dark",
  onToggleTheme,
}) {
  const pathname = usePathname();

  const chatHistory = [
    {
      group: "Recent Queries",
      items: [
        { id: "chat-1", title: "Visakhapatnam Port Harbor VQA", date: "Today" },
        { id: "chat-2", title: "Urban Building Grounding", date: "Today" },
        { id: "chat-3", title: "Punjab Agricultural Field Analysis", date: "Yesterday" },
      ],
    },
    {
      group: "Previous 30 Days",
      items: [
        { id: "chat-4", title: "Sundarbans Coastal Change Detection", date: "2026-04" },
        { id: "chat-5", title: "Sentinel-1 SAR Radar Fusion", date: "2026-03" },
        { id: "chat-6", title: "ISRO Cartosat-2S High-Res Test", date: "2026-03" },
        { id: "chat-7", title: "BigEarthNet QLoRA Verification", date: "2026-02" },
      ],
    },
  ];

  const tools = [
    { name: "Change Detection", href: "/change-detection", icon: GitMerge },
    { name: "Optical + SAR Fusion", href: "/fusion", icon: Layers },
    { name: "Agent Flow", href: "/agent-flow", icon: Cpu },
    { name: "Benchmarks", href: "/benchmarks", icon: BarChart3 },
    { name: "Roadmap & Kaggle", href: "/roadmap", icon: Compass },
  ];

  const isDark = theme === "dark";

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 border-r flex flex-col justify-between transition-all duration-300 ${
        isDark
          ? "bg-[#121316] border-[#22242a] text-slate-100"
          : "bg-white border-slate-200 text-slate-900"
      } ${isOpen ? "w-64" : "w-16"}`}
    >
      {/* Top Header & Logo */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20">
              <Satellite className="w-4 h-4" />
            </div>
            {isOpen && (
              <span className={`font-bold text-base tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                SatQuery <span className="text-cyan-500 font-mono text-xs">AI</span>
              </span>
            )}
          </Link>

          <button
            onClick={onToggle}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              isDark ? "hover:bg-[#1e2026] text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            }`}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className={`w-full h-10 rounded-xl border flex items-center gap-2 px-3 text-xs font-semibold transition-all shadow-sm ${
            isDark
              ? "bg-[#1e2026] hover:bg-[#282a32] text-slate-200 hover:text-white border-[#2b2d35]"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          } ${!isOpen && "justify-center px-0"}`}
        >
          <Plus className="w-4 h-4 text-cyan-500 shrink-0" />
          {isOpen && <span>New chat</span>}
        </button>
      </div>

      {/* Navigation & History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Main Tools Nav */}
        <div className="space-y-1">
          {isOpen && (
            <p className={`px-2 text-[10px] font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Modules
            </p>
          )}
          {tools.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isOpen ? item.name : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? isDark
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold"
                      : "bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold"
                    : isDark
                    ? "text-slate-400 hover:text-slate-200 hover:bg-[#1e2026]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                } ${!isOpen && "justify-center"}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-500" : "text-slate-400"}`} />
                {isOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Chat History */}
        {isOpen && (
          <div className={`space-y-3 pt-2 border-t ${isDark ? "border-[#22242a]" : "border-slate-200"}`}>
            {chatHistory.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <p className={`px-2 text-[10px] font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  {group.group}
                </p>
                {group.items.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 group ${
                      activeChatId === chat.id
                        ? isDark
                          ? "bg-[#1e2026] text-white font-medium"
                          : "bg-slate-200 text-slate-900 font-semibold"
                        : isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-[#181a1f]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 shrink-0" />
                    <span className="truncate flex-1">{chat.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer User Profile & Theme Toggle */}
      <div className={`p-3 border-t ${isDark ? "border-[#22242a]" : "border-slate-200"}`}>
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl border flex-1 min-w-0 ${
              isDark ? "bg-[#181a1f] border-[#22242a]" : "bg-slate-100 border-slate-200"
            } ${!isOpen && "justify-center px-0"}`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
              S
            </div>
            {isOpen && (
              <div className="flex-1 truncate">
                <p className={`font-semibold text-xs truncate ${isDark ? "text-slate-200" : "text-slate-900"}`}>
                  SatQuery User
                </p>
                <p className="text-[10px] text-cyan-500 font-mono">GeoChat-7B QLoRA</p>
              </div>
            )}
          </div>

          {/* Theme Switcher Button (Sun / Moon) */}
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              isDark
                ? "bg-[#181a1f] border-[#22242a] text-amber-400 hover:bg-[#22242b]"
                : "bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
