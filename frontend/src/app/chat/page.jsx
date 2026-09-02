"use client";

import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Satellite,
  Paperclip,
  ArrowUp,
  Zap,
  Sparkles,
  Eye,
  Brain,
  Globe,
  Copy,
  RotateCcw,
  Download,
  Image as ImageIcon,
  X,
  Send,
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  GitMerge,
  Layers,
  Cpu,
  BarChart3,
  Compass,
  ArrowLeft,
  Search,
  Sun,
  Moon,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function SatQueryDeepSeekChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Default theme set to "light"
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("expert"); // instant, expert, vision
  const [agentThink, setAgentThink] = useState(true);
  const [earthSearch, setEarthSearch] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fileInputRef = useRef(null);
  const [activeChatId, setActiveChatId] = useState("chat-1");

  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains("dark");
    setTheme(isDarkClass ? "dark" : "light");
  }, []);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === "dark") {
      setTheme("light");
      root.classList.add("light");
      root.classList.remove("dark");
      body.classList.add("light");
      body.classList.remove("dark");
    } else {
      setTheme("dark");
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
    }
  };

  const chatHistories = [
    { id: "chat-1", title: "Visakhapatnam Ship Grounding", date: "Today" },
    { id: "chat-2", title: "Punjab Crop Density VQA", date: "Today" },
    { id: "chat-3", title: "Kakinada SEZ Change Analysis", date: "Yesterday" },
    { id: "chat-4", title: "Sentinel-1/2 SAR Fusion Test", date: "Yesterday" },
    { id: "chat-5", title: "ISRO Cartosat-2S Verification", date: "Previous 30 Days" },
    { id: "chat-6", title: "VRSBench Baseline Benchmark", date: "Previous 30 Days" },
  ];

  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      sender: "user",
      text: "Locate all cargo vessels and commercial port infrastructure in this Visakhapatnam satellite patch.",
      image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
      imageName: "visakhapatnam_sentinel2_optical.tif",
    },
    {
      id: "msg-2",
      sender: "assistant",
      model: "Adapted GeoChat-7B (BigEarthNet QLoRA)",
      task: "Object Grounding & Spatial VQA",
      confidence: 95.8,
      thinking:
        "1. Inspected 10m Sentinel-2 optical image.\n2. Agent Controller routed query to GeoChat-7B Grounding Specialist.\n3. Identified 4 cargo vessels and 6 port buildings with coordinate bounding boxes.\n4. Verified against ISRO Cartosat spatial baseline.",
      text: "Identified 4 commercial cargo vessels docked in the bay and 6 warehouse buildings along the eastern container terminal.",
      boxes: [
        { label: "Building 1", x: 120, y: 80, width: 90, height: 60, score: "96%" },
        { label: "Vessel 1", x: 260, y: 190, width: 110, height: 45, score: "95%" },
        { label: "Vessel 2", x: 410, y: 220, width: 85, height: 40, score: "93%" },
        { label: "Building 2", x: 150, y: 290, width: 100, height: 75, score: "94%" },
      ],
      resultImage: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
    },
  ]);

  const presetSamples = [
    {
      name: "🚢 Ground Harbor Vessels",
      query: "Locate all cargo ships and harbor buildings in this satellite patch.",
      image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "🔄 Bi-Temporal Urban Change",
      query: "Compare T1 vs T2 imagery to detect new infrastructure constructions.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "🛰️ Optical + SAR Fusion",
      query: "Fuse Sentinel-1 C-band radar with Sentinel-2 optical bands to penetrate cloud cover.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "📊 VRSBench Benchmark",
      query: "Run evaluation on VRSBench VQA and spatial grounding test split.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAttachedImage({
        name: file.name,
        url: imageUrl,
      });
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputQuery("");
    setAttachedImage(null);
    setActiveChatId(`chat-${Date.now()}`);
  };

  const handleSendMessage = () => {
    if (!inputQuery.trim() && !attachedImage) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputQuery || "Analyze attached satellite imagery.",
      image: attachedImage ? attachedImage.url : null,
      imageName: attachedImage ? attachedImage.name : null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    const currentImg = attachedImage;
    setAttachedImage(null);
    setIsGenerating(true);

    setTimeout(() => {
      const assistantMsg = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        model:
          mode === "vision"
            ? "GeoChat Grounding Specialist"
            : mode === "expert"
            ? "Adapted GeoChat-7B (BigEarthNet QLoRA)"
            : "SatQuery Instant VQA Model",
        task: mode === "vision" ? "Object Grounding" : "Satellite Remote Sensing VQA",
        confidence: 95.4,
        thinking: `1. Agent Controller analyzed query: "${userMsg.text}".\n2. Modality selected: ${mode.toUpperCase()} mode.\n3. Applied 4-bit NF4 quantized tensor weights.\n4. Grounded spatial features and generated response synthesis.`,
        text: `Analysis complete for: "${userMsg.text}". Detected key features with strong spatial confidence across the satellite band.`,
        boxes: currentImg
          ? [
              { label: "Target Structure 1", x: 130, y: 90, width: 110, height: 70, score: "95%" },
              { label: "Target Structure 2", x: 310, y: 190, width: 95, height: 60, score: "93%" },
            ]
          : [],
        resultImage: currentImg ? currentImg.url : presetSamples[0].image,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden select-none transition-colors duration-300 ${
      isDark ? "bg-[#070810] text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Left Collapsible Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 flex flex-col border-r ${
          isDark
            ? "bg-[#0c0d18] border-white/10 text-slate-100"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        } relative shrink-0 z-20`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg border border-violet-400 z-30 hover:scale-110 transition-transform"
        >
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Brand Header inside Sidebar */}
        <div className={`p-3 border-b ${isDark ? "border-white/10" : "border-slate-200"} flex items-center justify-between`}>
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
              <Satellite className="w-4.5 h-4.5" />
            </div>
            {sidebarOpen && (
              <span className={`font-extrabold text-base tracking-tight whitespace-nowrap ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                SatQuery <span className="text-violet-500 text-xs font-mono font-bold">AI</span>
              </span>
            )}
          </Link>
        </div>

        {/* Top + New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className={`w-full py-3 px-3 rounded-xl border flex items-center gap-2.5 font-extrabold text-xs tracking-wide transition-all shadow-md ${
              sidebarOpen ? "justify-start" : "justify-center px-0"
            } ${
              isDark
                ? "bg-white/15 hover:bg-white/25 border-white/20 text-white"
                : "bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-700"
            }`}
          >
            <Plus className="w-4.5 h-4.5 text-violet-500 shrink-0 stroke-[3]" />
            {sidebarOpen && <span>New chat</span>}
          </button>
        </div>

        {/* Grouped Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {sidebarOpen ? (
            <>
              {["Today", "Yesterday", "Previous 30 Days"].map((groupDate) => {
                const items = chatHistories.filter((h) => h.date === groupDate);
                if (items.length === 0) return null;
                return (
                  <div key={groupDate} className="space-y-1.5">
                    <p className={`text-[11px] font-mono font-bold px-2 uppercase tracking-wider ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {groupDate}
                    </p>
                    {items.map((h) => {
                      const isActive = activeChatId === h.id;
                      return (
                        <button
                          key={h.id}
                          onClick={() => setActiveChatId(h.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold truncate transition-all flex items-center gap-2.5 ${
                            isActive
                              ? isDark
                                ? "bg-violet-600/40 text-white border border-violet-500/50 shadow-md"
                                : "bg-violet-100 text-violet-900 border border-violet-300 shadow-sm"
                              : isDark
                              ? "text-slate-200 hover:bg-white/10 hover:text-white"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <MessageSquare className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-violet-600" : isDark ? "text-violet-400" : "text-slate-500"
                          }`} />
                          <span className="truncate">{h.title}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {chatHistories.slice(0, 5).map((h) => (
                <button
                  key={h.id}
                  onClick={() => setActiveChatId(h.id)}
                  title={h.title}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    activeChatId === h.id
                      ? "bg-violet-600 text-white shadow-lg"
                      : isDark
                      ? "bg-white/10 text-slate-300 hover:bg-white/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation Links + Profile Pill & Theme Toggle */}
        <div className={`p-3 border-t ${isDark ? "border-white/10" : "border-slate-200"} space-y-2`}>
          {sidebarOpen && (
            <div className="space-y-1 text-xs font-bold">
              <Link
                href="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  isDark
                    ? "text-slate-200 hover:bg-white/10 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Home className="w-4 h-4 text-cyan-500" />
                <span>Return to Home</span>
              </Link>
              <Link
                href="/change-detection"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  isDark
                    ? "text-slate-200 hover:bg-white/10 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <GitMerge className="w-4 h-4 text-indigo-500" />
                <span>Change Detection</span>
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-md">
                SQ
              </div>
              {sidebarOpen && (
                <div className="truncate">
                  <p className={`text-xs font-extrabold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                    SatQuery AI User
                  </p>
                  <p className="text-[10px] font-mono text-cyan-500 font-bold truncate">Agentic QLoRA</p>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border shrink-0 ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-amber-300 border-white/20"
                  : "bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300"
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Right Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 sm:p-6 space-y-6 relative">
        {/* Welcome Empty State Header */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-6 py-12">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40">
              <Satellite className="w-8 h-8 animate-pulse" />
            </div>

            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              What satellite analysis can I help with today?
            </h2>

            {/* Segmented Mode Switcher Pill */}
            <div className={`flex items-center p-1 rounded-full border shadow-xl ${
              isDark ? "bg-[#141628] border-violet-500/30" : "bg-white border-slate-300"
            }`}>
              <button
                onClick={() => setMode("instant")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === "instant"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant</span>
              </button>

              <button
                onClick={() => setMode("expert")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === "expert"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Brain className="w-4 h-4 text-violet-400" />
                <span>Expert</span>
              </button>

              <button
                onClick={() => setMode("vision")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === "vision"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Vision</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
              {presetSamples.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(s.query);
                    setAttachedImage({ name: s.name, url: s.image });
                  }}
                  className={`p-4 rounded-2xl border text-left text-xs font-extrabold transition-all hover:scale-102 flex items-center justify-between shadow-lg ${
                    isDark
                      ? "bg-[#141628] hover:bg-[#1e213b] border-violet-500/30 text-white"
                      : "bg-white hover:bg-slate-100 border-slate-300 text-slate-900"
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <ArrowUp className="w-4 h-4 text-violet-500 rotate-45 shrink-0 stroke-[3]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Thread */}
        {messages.length > 0 && (
          <div className="flex-1 space-y-6 max-w-4xl mx-auto w-full">
            {/* Mode Switcher Banner */}
            <div className="flex justify-center pb-2">
              <div className={`flex items-center p-1 rounded-full border shadow-md ${
                isDark ? "bg-[#141628] border-violet-500/30" : "bg-white border-slate-300"
              }`}>
                <button
                  onClick={() => setMode("instant")}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold transition-all ${
                    mode === "instant"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                      : isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant</span>
                </button>
                <button
                  onClick={() => setMode("expert")}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold transition-all ${
                    mode === "expert"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                      : isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-violet-400" />
                  <span>Expert</span>
                </button>
                <button
                  onClick={() => setMode("vision")}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold transition-all ${
                    mode === "vision"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                      : isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vision</span>
                </button>
              </div>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === "user" && (
                  <div className="flex justify-end">
                    <div className="max-w-xl border rounded-3xl p-4.5 text-sm font-semibold space-y-3 shadow-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 text-white">
                      {msg.image && (
                        <div className="rounded-2xl overflow-hidden max-w-xs border border-white/20">
                          <img src={msg.image} alt="Input" className="w-full h-36 object-cover" />
                          <div className="bg-black/40 px-3 py-1 text-[11px] font-mono text-cyan-200 truncate font-bold">
                            📎 {msg.imageName || "Satellite Patch Input"}
                          </div>
                        </div>
                      )}
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}

                {msg.sender === "assistant" && (
                  <div className={`rounded-3xl border p-6 space-y-4 shadow-xl ${
                    isDark
                      ? "bg-[#141628] border-violet-500/30 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between border-b dark:border-white/10 border-slate-200 pb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="indigo">{msg.model}</Badge>
                        <Badge variant="success">{msg.confidence}% Confidence</Badge>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {msg.task}
                      </span>
                    </div>

                    {msg.thinking && (
                      <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                        isDark
                          ? "bg-black/40 border-white/10 text-slate-200"
                          : "bg-slate-100 border-slate-300 text-slate-800"
                      }`}>
                        <p className="text-violet-600 dark:text-violet-300 font-extrabold flex items-center gap-2">
                          <Brain className="w-4 h-4 text-violet-500" />
                          Agent Controller Reasoning
                        </p>
                        <pre className="whitespace-pre-wrap leading-relaxed font-semibold">{msg.thinking}</pre>
                      </div>
                    )}

                    <p className={`text-sm leading-relaxed font-semibold p-4 rounded-2xl border ${
                      isDark
                        ? "bg-white/5 border-white/10 text-slate-100"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}>
                      {msg.text}
                    </p>

                    {msg.boxes && msg.boxes.length > 0 && (
                      <div className="rounded-2xl overflow-hidden border bg-black relative aspect-video shadow-md dark:border-white/15 border-slate-300">
                        <img src={msg.resultImage} alt="Satellite Output" className="w-full h-full object-cover" />

                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {msg.boxes.map((box, bIdx) => (
                            <g key={bIdx}>
                              <rect
                                x={`${(box.x / 600) * 100}%`}
                                y={`${(box.y / 400) * 100}%`}
                                width={`${(box.width / 600) * 100}%`}
                                height={`${(box.height / 400) * 100}%`}
                                fill="rgba(139, 92, 246, 0.25)"
                                stroke="#a78bfa"
                                strokeWidth="2.5"
                                strokeDasharray="4 2"
                              />
                              <foreignObject
                                x={`${(box.x / 600) * 100}%`}
                                y={`${Math.max(0, (box.y / 400) * 100 - 8)}%`}
                                width="120"
                                height="30"
                              >
                                <div className="bg-violet-950/90 text-violet-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-violet-400/50 inline-flex items-center gap-1 shadow-lg">
                                  <span>{box.label}</span>
                                  <span className="text-cyan-300 font-bold">{box.score}</span>
                                </div>
                              </foreignObject>
                            </g>
                          ))}
                        </svg>

                        <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                          Detected {msg.boxes.length} Bounding Box Coordinates
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Floating Input Container with [+] Symbol & Paperclip Buttons */}
        <div className="max-w-3xl mx-auto w-full pt-2">
          {attachedImage && (
            <div className={`flex items-center gap-2 p-2.5 rounded-xl max-w-xs text-xs font-extrabold shadow-lg border mb-2 ${
              isDark
                ? "bg-[#141628] border-violet-500/30 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}>
              <img src={attachedImage.url} alt="Attached" className="w-8 h-8 rounded-lg object-cover" />
              <span className="truncate flex-1 font-mono text-[11px] text-cyan-500 dark:text-cyan-400">
                {attachedImage.name}
              </span>
              <button
                onClick={() => setAttachedImage(null)}
                className="w-5 h-5 rounded-full hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* DeepSeek Floating Textarea Container */}
          <div className={`rounded-3xl p-4 shadow-2xl border transition-colors space-y-3 ${
            isDark
              ? "bg-[#141628] border-violet-500/40 text-white"
              : "bg-white border-slate-300 text-slate-900"
          }`}>
            <textarea
              rows={2}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message SatQuery AI (e.g. 'Ground all ships in Visakhapatnam port', 'Compare T1 vs T2 change')..."
              className="w-full bg-transparent text-sm font-semibold placeholder-slate-400 focus:outline-none resize-none px-2 dark:text-white text-slate-900"
            />

            {/* Bottom Input Action Controls: [ AgentThink ] [ Earth Search ] ... [+] 📎 [ Send ↑ ] */}
            <div className="flex items-center justify-between pt-2 border-t dark:border-white/10 border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAgentThink(!agentThink)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    agentThink
                      ? "bg-violet-600/30 text-violet-600 dark:text-violet-300 border border-violet-500/40"
                      : "dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  <Brain className="w-4 h-4 text-violet-500" />
                  <span>AgentThink</span>
                </button>

                <button
                  onClick={() => setEarthSearch(!earthSearch)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    earthSearch
                      ? "bg-cyan-600/30 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40"
                      : "dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <span>Earth Search</span>
                </button>
              </div>

              {/* Action Buttons: (+) Plus Add Symbol, (📎) Paperclip Attachment, (↑) Send Arrow */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Add Satellite Imagery / Patch (+)"
                  className="w-9 h-9 rounded-full border dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Plus className="w-4.5 h-4.5 text-cyan-500 dark:text-cyan-400 stroke-[3]" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach File"
                  className="w-9 h-9 rounded-full dark:bg-white/10 dark:hover:bg-white/20 dark:text-white bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={isGenerating || (!inputQuery.trim() && !attachedImage)}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-40"
                >
                  {isGenerating ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4 stroke-[3]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
