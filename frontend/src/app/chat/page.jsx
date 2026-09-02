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
  Menu,
  AlertCircle,
  Activity,
  ClipboardCheck,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { analyzeImage, analyzeGroundingImage, fetchHealthStatus, cleanHtmlResponse, parseGeoChatBoxes } from "@/lib/api";

const STORAGE_KEY_SESSIONS = "satquery_chat_sessions_v1";
const STORAGE_KEY_ACTIVE_ID = "satquery_active_chat_id_v1";

export default function SatQueryDeepSeekChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("expert"); // instant, expert, vision
  const [agentThink, setAgentThink] = useState(true);
  const [earthSearch, setEarthSearch] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ healthy: null, status: "checking" });
  const [pasteNotification, setPasteNotification] = useState(false);

  const fileInputRef = useRef(null);
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [chatHistories, setChatHistories] = useState([
    { id: "chat-1", title: "New Satellite Analysis", date: "Today", messages: [] },
  ]);
  const [messages, setMessages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Specialized Model & Remote Sensing Topics
  const presetSamples = [
    {
      id: "grounding",
      name: "🚢 Ground Harbor Vessels",
      query: "Locate all cargo ships and harbor buildings in this satellite patch.",
      image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
      taskType: "grounding",
      mode: "vision",
    },
    {
      id: "change",
      name: "🔄 Bi-Temporal Urban Change",
      query: "Compare T1 vs T2 imagery to detect new infrastructure constructions.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      taskType: "change",
      mode: "expert",
    },
    {
      id: "fusion",
      name: "🛰️ Optical + SAR Fusion",
      query: "Fuse Sentinel-1 C-band radar with Sentinel-2 optical bands to penetrate cloud cover.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      taskType: "fusion",
      mode: "expert",
    },
    {
      id: "vrsbench",
      name: "📊 VRSBench Benchmark",
      query: "Run evaluation on VRSBench VQA and spatial grounding test split.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      taskType: "vqa",
      mode: "expert",
    },
  ];

  // 1. Load chat sessions from localStorage on mount
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    const isDarkClass = document.documentElement.classList.contains("dark");
    setTheme(isDarkClass ? "dark" : "light");

    const checkHealth = async () => {
      const res = await fetchHealthStatus();
      setBackendHealth(res);
    };
    checkHealth();

    try {
      const savedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);
      const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);

      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        if (Array.isArray(parsedSessions) && parsedSessions.length > 0) {
          setChatHistories(parsedSessions);
          const targetId = savedActiveId && parsedSessions.some((s) => s.id === savedActiveId)
            ? savedActiveId
            : parsedSessions[0].id;
          setActiveChatId(targetId);
          const activeSession = parsedSessions.find((s) => s.id === targetId);
          if (activeSession) {
            const cleanedMsgs = (activeSession.messages || []).map((m) => ({
              ...m,
              text: cleanHtmlResponse(m.text),
            }));
            setMessages(cleanedMsgs);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load chat sessions from localStorage:", e);
    }
    setIsInitialized(true);

    window.addEventListener("paste", handlePasteEvent);
    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, []);

  // 2. Save active session messages to localStorage whenever messages or activeChatId changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      const updatedHistories = chatHistories.map((h) => {
        if (h.id === activeChatId) {
          let updatedTitle = h.title;
          if (messages.length > 0 && messages[0].sender === "user") {
            const firstText = cleanHtmlResponse(messages[0].text);
            updatedTitle = firstText.length > 30 ? firstText.substring(0, 30) + "..." : firstText;
          }
          return { ...h, title: updatedTitle, messages };
        }
        return h;
      });

      setChatHistories(updatedHistories);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updatedHistories));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeChatId);
    } catch (e) {
      console.error("Failed to save chat sessions to localStorage:", e);
    }
  }, [messages, activeChatId, isInitialized]);

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

  const handlePasteEvent = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          const imageUrl = URL.createObjectURL(file);
          const fileName = file.name && file.name !== "image.png" ? file.name : `pasted_satellite_${Date.now()}.png`;
          setAttachedImage({
            file: file,
            name: fileName,
            url: imageUrl,
          });
          setPasteNotification(true);
          setTimeout(() => setPasteNotification(false), 3000);
          break;
        }
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAttachedImage({
        file: file,
        name: file.name,
        url: imageUrl,
      });
    }
  };

  const handleSwitchChat = (chatId) => {
    setActiveChatId(chatId);
    const targetSession = chatHistories.find((s) => s.id === chatId);
    const rawMsgs = targetSession ? targetSession.messages || [] : [];
    setMessages(rawMsgs.map((m) => ({ ...m, text: cleanHtmlResponse(m.text) })));
    setInputQuery("");
    setAttachedImage(null);
  };

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Satellite Analysis",
      date: "Today",
      messages: [],
    };
    const updated = [newSession, ...chatHistories];
    setChatHistories(updated);
    setActiveChatId(newId);
    setMessages([]);
    setInputQuery("");
    setAttachedImage(null);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, newId);
    } catch (e) {
      console.error("Failed to save new chat to localStorage:", e);
    }
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    const updated = chatHistories.filter((h) => h.id !== chatId);
    if (updated.length === 0) {
      handleNewChat();
      return;
    }
    setChatHistories(updated);
    if (activeChatId === chatId) {
      setActiveChatId(updated[0].id);
      setMessages((updated[0].messages || []).map((m) => ({ ...m, text: cleanHtmlResponse(m.text) })));
    }
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Execute query with GeoChat Coordinate Token Parsing
  const executeQuery = async (queryText, fileObj, sampleImage, overrideTaskType, overrideMode) => {
    if (!queryText && !fileObj) return;

    setIsGenerating(true);

    const activeMode = overrideMode || mode;
    let taskType = overrideTaskType;
    if (!taskType) {
      if (activeMode === "vision") {
        taskType = "grounding";
      } else if (activeMode === "expert") {
        taskType = "vqa";
      } else {
        taskType = "vqa";
      }
    }

    let apiRes;
    if (taskType === "grounding" || activeMode === "vision") {
      apiRes = await analyzeGroundingImage({
        image: fileObj || null,
        prompt: queryText || "Locate the agricultural land in this satellite image.",
      });
    } else {
      apiRes = await analyzeImage({
        image: fileObj || null,
        prompt: queryText || "Analyze satellite imagery.",
        taskType,
        mode: activeMode,
      });
    }

    if (apiRes.success && apiRes.data) {
      const backendData = apiRes.data;
      let rawAnswer = backendData.answer || backendData.response || backendData.message || "";
      
      // Parse raw GeoChat coordinate tokens like {<40><55><52><59>|<90>}
      const { cleanText, parsedBoxes } = parseGeoChatBoxes(rawAnswer);

      // Combine backend boxes with parsed coordinate token boxes
      const finalBoxes = [...(backendData.boxes || []), ...parsedBoxes];

      let cleanAnswerText = cleanHtmlResponse(cleanText);
      if (!cleanAnswerText) {
        if (finalBoxes.length > 0) {
          cleanAnswerText = `Spatial grounding detected ${finalBoxes.length} target region${finalBoxes.length > 1 ? "s" : ""}.`;
        } else {
          cleanAnswerText = "No grounded region was detected.";
        }
      }

      const assistantMsg = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        model: backendData.specialist || (activeMode === "vision" || taskType === "grounding" ? "GeoChat-grounding" : "GeoChat-7B"),
        task: backendData.task ? backendData.task.toUpperCase() : taskType.toUpperCase(),
        confidence: backendData.confidence || null,
        thinking: backendData.thinking || backendData.reasoning || null,
        text: cleanAnswerText,
        boxes: finalBoxes, // Parsed & Backend boxes
        resultImage: sampleImage || (fileObj ? URL.createObjectURL(fileObj) : null),
        status: backendData.status || null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } else {
      const errorMsg = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        model: "SatQuery Agent Controller",
        task: "ERROR",
        isError: true,
        text: cleanHtmlResponse(apiRes.error) || "SatQuery AI backend is currently unavailable. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsGenerating(false);
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
    const currentImg = attachedImage;
    const currentQuery = inputQuery;
    setInputQuery("");
    setAttachedImage(null);

    executeQuery(currentQuery, currentImg?.file, currentImg?.url);
  };

  const handlePresetClick = (sample) => {
    if (sample.mode) {
      setMode(sample.mode);
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: sample.query,
      image: sample.image,
      imageName: sample.name,
    };

    setMessages((prev) => [...prev, userMsg]);
    executeQuery(sample.query, null, sample.image, sample.taskType, sample.mode || mode);
  };

  return (
    <div
      onPaste={handlePasteEvent}
      className={`flex h-screen w-full overflow-hidden select-none transition-colors duration-300 relative ${
        isDark ? "bg-[#070810] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Clipboard Image Paste Notification Toast */}
      {pasteNotification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <ClipboardCheck className="w-4 h-4 text-white" />
          <span>Satellite image pasted from clipboard!</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-xs"
        />
      )}

      {/* Left Collapsible Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        } transition-all duration-300 flex flex-col border-r ${
          isDark
            ? "bg-[#0c0d18] border-white/10 text-slate-100"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        } fixed md:static inset-y-0 left-0 z-40 shrink-0`}
      >
        {/* Toggle Collapse Button (Desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute -right-3 top-6 w-6 h-6 rounded-full bg-violet-600 text-white items-center justify-center shadow-lg border border-violet-400 z-30 hover:scale-110 transition-transform"
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

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top + New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              handleNewChat();
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
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

        {/* Grouped Persistent Chat History List */}
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
                        <div key={h.id} className="relative group/item flex items-center">
                          <button
                            onClick={() => {
                              handleSwitchChat(h.id);
                              if (window.innerWidth < 768) setSidebarOpen(false);
                            }}
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
                            <span className="truncate flex-1">{h.title}</span>
                          </button>
                          {chatHistories.length > 1 && (
                            <button
                              onClick={(e) => handleDeleteChat(e, h.id)}
                              title="Delete chat"
                              className="opacity-0 group-hover/item:opacity-100 absolute right-2 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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
                  onClick={() => handleSwitchChat(h.id)}
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

        {/* Live Backend Health Status Badge */}
        {sidebarOpen && (
          <div className="px-3 py-2 border-t dark:border-white/10 border-slate-200">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth.healthy ? "bg-emerald-400 animate-ping" : "bg-rose-500"
                }`}
              />
              <span className={backendHealth.healthy ? "text-emerald-500" : "text-rose-400"}>
                {backendHealth.healthy ? "FastAPI Backend Online" : "Backend Offline"}
              </span>
            </div>
          </div>
        )}

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
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-3 sm:p-6 space-y-6 relative">
        {/* Mobile Header Bar with Hamburger Button */}
        <div className="md:hidden flex items-center justify-between pb-3 border-b dark:border-white/10 border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl border dark:bg-white/10 dark:border-white/20 bg-white border-slate-300 text-slate-800 dark:text-white shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow">
              <Satellite className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight dark:text-white text-slate-900">
              SatQuery <span className="text-violet-500 font-mono text-xs">AI</span>
            </span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border dark:bg-white/10 dark:border-white/20 bg-white border-slate-300 text-slate-800 dark:text-white shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>

        {/* Welcome Empty State Header */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-6 py-6 sm:py-12 px-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40">
              <Satellite className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
            </div>

            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-sans ${
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
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === "instant"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Instant</span>
              </button>

              <button
                onClick={() => setMode("expert")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === "expert"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" />
                <span>Expert</span>
              </button>

              <button
                onClick={() => setMode("vision")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-extrabold transition-all ${
                  mode === "vision"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span>Vision</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2 sm:pt-4">
              {presetSamples.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(s)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left text-xs font-extrabold transition-all hover:scale-102 flex items-center justify-between shadow-lg ${
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
          <div className="flex-1 space-y-4 sm:space-y-6 max-w-4xl mx-auto w-full">
            {/* Mode Switcher Banner */}
            <div className="flex justify-center pb-2">
              <div className={`flex items-center p-1 rounded-full border shadow-md ${
                isDark ? "bg-[#141628] border-violet-500/30" : "bg-white border-slate-300"
              }`}>
                <button
                  onClick={() => setMode("instant")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
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
                {/* User Message Bubble: Rounded Blue Pill on Right */}
                {msg.sender === "user" && (
                  <div className="flex justify-end my-3">
                    <div className="max-w-xl bg-[#0055ff] dark:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-3xl text-sm font-semibold shadow-md space-y-2">
                      {msg.image && (
                        <div className="rounded-2xl overflow-hidden max-w-xs border border-white/20 mb-2">
                          <img src={msg.image} alt="Input Patch" className="w-full h-36 object-cover" />
                        </div>
                      )}
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}

                {/* Assistant Response Layout */}
                {msg.sender === "assistant" && (
                  <div className="flex flex-col items-start my-4 space-y-3 max-w-3xl">
                    {msg.isError ? (
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-sm font-medium">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="space-y-3 w-full">
                        {/* Model / Task Tag */}
                        <div className="flex items-center gap-2 text-xs font-mono font-bold">
                          <Badge variant="indigo">{msg.model}</Badge>
                          <span className="text-cyan-600 dark:text-cyan-400">{msg.task}</span>
                        </div>

                        {/* Reasoning Log */}
                        {msg.thinking && (
                          <div className={`p-3.5 rounded-2xl border text-xs font-mono space-y-1.5 ${
                            isDark ? "bg-black/40 border-white/10 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                          }`}>
                            <p className="text-violet-500 font-extrabold flex items-center gap-2">
                              <Brain className="w-4 h-4" /> Agent Controller Reasoning
                            </p>
                            <pre className="whitespace-pre-wrap leading-relaxed">{msg.thinking}</pre>
                          </div>
                        )}

                        {/* Plain Clean Assistant Answer Text */}
                        <div className={`text-sm sm:text-base leading-relaxed font-normal ${
                          isDark ? "text-slate-100" : "text-slate-900"
                        }`}>
                          {msg.text}
                        </div>

                        {/* Real GeoChat-7B Grounding Bounding Box SVG Overlay */}
                        {((msg.boxes && msg.boxes.length > 0) || msg.resultImage) && (
                          <div className="rounded-2xl overflow-hidden border bg-black relative aspect-video shadow-md max-w-2xl mt-2 border-slate-300 dark:border-white/15">
                            <img
                              src={msg.resultImage || msg.image || "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80"}
                              alt="Grounded Output Patch"
                              className="w-full h-full object-cover"
                            />

                            {msg.boxes && msg.boxes.length > 0 && (
                              <svg
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                              >
                                {msg.boxes.map((box, bIdx) => {
                                  const x1 = box.x1 !== undefined ? box.x1 : (box.x || 0);
                                  const y1 = box.y1 !== undefined ? box.y1 : (box.y || 0);
                                  const x2 = box.x2 !== undefined ? box.x2 : (x1 + (box.width || 0));
                                  const y2 = box.y2 !== undefined ? box.y2 : (y1 + (box.height || 0));
                                  const width = Math.max(1, x2 - x1);
                                  const height = Math.max(1, y2 - y1);

                                  return (
                                    <g key={bIdx}>
                                      <rect
                                        x={x1}
                                        y={y1}
                                        width={width}
                                        height={height}
                                        fill="rgba(59, 130, 246, 0.25)"
                                        stroke="#3b82f6"
                                        strokeWidth="2.5"
                                        strokeDasharray="4 2"
                                      />
                                      <foreignObject
                                        x={x1}
                                        y={Math.max(0, y1 - 8)}
                                        width="130"
                                        height="30"
                                      >
                                        <div className="bg-blue-950/90 text-blue-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-400/50 inline-flex items-center gap-1 shadow-lg font-bold">
                                          <span>{box.label || "Grounded Region"}</span>
                                          {box.confidence && (
                                            <span className="text-cyan-300 font-bold">{box.confidence}%</span>
                                          )}
                                        </div>
                                      </foreignObject>
                                    </g>
                                  );
                                })}
                              </svg>
                            )}
                          </div>
                        )}

                        {/* Action Icons Row */}
                        <div className="flex items-center gap-3 pt-1 text-slate-400 dark:text-slate-500">
                          <button onClick={() => navigator.clipboard.writeText(msg.text)} title="Copy" className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button title="Thumbs Up" className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button title="Thumbs Down" className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button title="Regenerate" className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button title="Share" className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button title="More" className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Pulsating Loading Indicator Dot on Left */}
            {isGenerating && (
              <div className="flex items-center gap-3 my-4 pl-1">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping shrink-0" />
                <span className="text-xs font-mono font-bold text-slate-400">Processing satellite query...</span>
              </div>
            )}
          </div>
        )}

        {/* Floating Input Container */}
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

          {/* DeepSeek Floating Textarea Container with Clipboard Paste Handler */}
          <div className={`rounded-3xl p-3 sm:p-4 shadow-2xl border transition-colors space-y-3 ${
            isDark
              ? "bg-[#141628] border-violet-500/40 text-white"
              : "bg-white border-slate-300 text-slate-900"
          }`}>
            <textarea
              rows={2}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onPaste={handlePasteEvent}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isGenerating) handleSendMessage();
                }
              }}
              placeholder="Message SatQuery AI or paste a satellite image from clipboard (Ctrl + V)..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none resize-none px-2 dark:text-white text-slate-900"
            />

            {/* Bottom Input Action Controls */}
            <div className="flex items-center justify-between pt-2 border-t dark:border-white/10 border-slate-200 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setAgentThink(!agentThink)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold transition-all ${
                    agentThink
                      ? "bg-violet-600/30 text-violet-600 dark:text-violet-300 border border-violet-500/40"
                      : "dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-violet-500" />
                  <span>AgentThink</span>
                </button>

                <button
                  onClick={() => setEarthSearch(!earthSearch)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold transition-all ${
                    earthSearch
                      ? "bg-cyan-600/30 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40"
                      : "dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Earth Search</span>
                </button>
              </div>

              {/* Action Buttons: (+) Plus Add Symbol, (📎) Paperclip Attachment, (↑) Send Arrow */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Add Satellite Imagery / Patch (+)"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-500 dark:text-cyan-400 stroke-[3]" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach File or Paste from Clipboard"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full dark:bg-white/10 dark:hover:bg-white/20 dark:text-white bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <Paperclip className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={isGenerating || (!inputQuery.trim() && !attachedImage)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-40"
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
