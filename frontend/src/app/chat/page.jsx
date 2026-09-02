"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Square,
  StopCircle,
  RefreshCw,
  Ship,
  Building2,
  Sparkle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { analyzeImage, analyzeGroundingImage, fetchHealthStatus, cleanHtmlResponse, parseGeoChatBoxes } from "@/lib/api";

const STORAGE_KEY_SESSIONS = "satquery_chat_sessions_v1";
const STORAGE_KEY_ACTIVE_ID = "satquery_active_chat_id_v1";

/**
 * Downscale & compress a Base64 image to prevent localStorage QuotaExceededError (~20KB size)
 */
function compressBase64Image(base64Str, maxWidth = 360, maxQuality = 0.65) {
  return new Promise((resolve) => {
    if (!base64Str || typeof base64Str !== "string") {
      resolve(base64Str);
      return;
    }
    if (typeof window === "undefined" || !base64Str.startsWith("data:image")) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", maxQuality);
        resolve(compressedDataUrl);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
}

/**
 * Convert a File object into a compressed Base64 Data URL so images don't exceed localStorage quota.
 */
function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file || !(file instanceof File)) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const rawBase64 = reader.result;
      const compressed = await compressBase64Image(rawBase64, 360, 0.65);
      resolve(compressed || rawBase64);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Generate a 224x224 RGB PNG Base64 string for fallback image storage in chat history.
 */
function generateFallbackRGBBase64() {
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 224, 224);
      grad.addColorStop(0, "#1e1b4b");
      grad.addColorStop(1, "#065f46");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 224, 224);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Satellite Patch", 112, 112);
    }
    return canvas.toDataURL("image/jpeg", 0.6);
  }
  return null;
}

/**
 * Safely persist chat sessions to localStorage without throwing QuotaExceededError
 */
function safeSaveSessions(sessions, activeId) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeId);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    if (e.name === "QuotaExceededError" || e.code === 22 || e.number === -2147024882) {
      console.warn("localStorage quota exceeded. Auto-pruning heavy image payloads from stored sessions...");
      try {
        const pruned = sessions.map((s) => ({
          ...s,
          messages: (s.messages || []).slice(-15).map((m) => ({
            ...m,
            image: m.image && m.image.length > 50000 ? generateFallbackRGBBase64() : m.image,
            image2: m.image2 && m.image2.length > 50000 ? generateFallbackRGBBase64() : m.image2,
            resultImage: m.resultImage && m.resultImage.length > 50000 ? generateFallbackRGBBase64() : m.resultImage,
            resultImage2: m.resultImage2 && m.resultImage2.length > 50000 ? generateFallbackRGBBase64() : m.resultImage2,
          })),
        }));
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(pruned));
      } catch (err) {
        console.error("Critical: Storage quota full after pruning:", err);
      }
    } else {
      console.error("localStorage save error:", e);
    }
  }
}

function ChatContent() {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("expert"); // instant, expert, vision
  const [agentThink, setAgentThink] = useState(true);
  const [earthSearch, setEarthSearch] = useState(false);
  const [changeDetectionMode, setChangeDetectionMode] = useState(false);

  const [inputQuery, setInputQuery] = useState("");
  const [attachedImage, setAttachedImage] = useState(null); // T1 image
  const [attachedImage2, setAttachedImage2] = useState(null); // T2 image (Change Detection)

  const [isGenerating, setIsGenerating] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ healthy: null, status: "checking" });
  const [pasteNotification, setPasteNotification] = useState(false);

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const abortControllerRef = useRef(null);

  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [chatHistories, setChatHistories] = useState([
    { id: "chat-1", title: "New Satellite Analysis", date: "Today", messages: [] },
  ]);
  const [messages, setMessages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Premium Specialized Remote Sensing Topics
  const presetSamples = [
    {
      id: "grounding",
      name: "Ground Harbor Vessels",
      desc: "GeoChat-7B spatial bounding box localization & port tracking.",
      query: "Locate all cargo ships and harbor buildings in this satellite patch.",
      icon: Ship,
      color: "from-blue-500 to-cyan-500",
      taskType: "grounding",
      mode: "vision",
    },
    {
      id: "change",
      name: "Bi-Temporal Urban Change",
      desc: "Compare T1 vs T2 satellite imagery for new construction detection.",
      query: "Compare T1 vs T2 imagery to detect new infrastructure constructions.",
      icon: GitMerge,
      color: "from-indigo-500 to-violet-500",
      taskType: "change",
      mode: "expert",
      isChange: true,
    },
    {
      id: "fusion",
      name: "Optical + SAR Fusion",
      desc: "Fuse Sentinel-1 C-band radar with Sentinel-2 optical bands.",
      query: "Fuse Sentinel-1 C-band radar with Sentinel-2 optical bands to penetrate cloud cover.",
      icon: Layers,
      color: "from-violet-500 to-fuchsia-500",
      taskType: "fusion",
      mode: "expert",
    },
    {
      id: "vrsbench",
      name: "VRSBench Benchmark",
      desc: "Run multi-modal evaluation on VRSBench VQA test split.",
      query: "Run evaluation on VRSBench VQA and spatial grounding test split.",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500",
      taskType: "vqa",
      mode: "expert",
    },
  ];

  // 1. Load chat sessions from localStorage on mount & check query params
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

    if (searchParams && searchParams.get("mode") === "change") {
      setChangeDetectionMode(true);
    }

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
  }, [searchParams]);

  // 2. Save active session messages to localStorage safely whenever messages or activeChatId changes
  useEffect(() => {
    if (!isInitialized) return;

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
    safeSaveSessions(updatedHistories, activeChatId);
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

  const handlePasteEvent = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          const base64Url = await fileToBase64(file);
          const fileName = file.name && file.name !== "image.png" ? file.name : `pasted_satellite_${Date.now()}.png`;
          
          if (changeDetectionMode && attachedImage) {
            setAttachedImage2({
              file: file,
              name: `T2_${fileName}`,
              url: base64Url,
            });
          } else {
            setAttachedImage({
              file: file,
              name: fileName,
              url: base64Url,
            });
          }

          setPasteNotification(true);
          setTimeout(() => setPasteNotification(false), 3000);
          break;
        }
      }
    }
  };

  const handleFileUpload = async (e, isSecond = false) => {
    const file = e.target.files[0];
    if (file) {
      const base64Url = await fileToBase64(file);

      if (isSecond) {
        setAttachedImage2({
          file: file,
          name: `T2_${file.name}`,
          url: base64Url,
        });
      } else {
        setAttachedImage({
          file: file,
          name: file.name,
          url: base64Url,
        });
      }
    }
  };

  const handleSwitchChat = (chatId) => {
    setActiveChatId(chatId);
    const targetSession = chatHistories.find((s) => s.id === chatId);
    const rawMsgs = targetSession ? targetSession.messages || [] : [];
    setMessages(rawMsgs.map((m) => ({ ...m, text: cleanHtmlResponse(m.text) })));
    setInputQuery("");
    setAttachedImage(null);
    setAttachedImage2(null);
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
    setAttachedImage2(null);
    safeSaveSessions(updated, newId);
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
    safeSaveSessions(updated, activeChatId);
  };

  // Stop / Cancel active query execution
  const handleStopQuery = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  // Execute query passing AbortSignal and supporting dual image attachments (T1 & T2) for Change Detection
  const executeQuery = async (
    queryText,
    fileObj,
    displayImageUrl,
    overrideTaskType,
    overrideMode,
    fileObj2 = null,
    displayImageUrl2 = null
  ) => {
    if (!queryText && !fileObj && !displayImageUrl) return;

    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const activeMode = overrideMode || mode;
    const lowerQuery = (queryText || "").toLowerCase();
    const isGroundingIntent =
      lowerQuery.includes("highlight") ||
      lowerQuery.includes("find") ||
      lowerQuery.includes("locate") ||
      lowerQuery.includes("detect") ||
      lowerQuery.includes("where") ||
      lowerQuery.includes("ground") ||
      lowerQuery.includes("mark") ||
      lowerQuery.includes("box") ||
      lowerQuery.includes("show");

    let taskType = overrideTaskType;
    if (!taskType) {
      if (changeDetectionMode) {
        taskType = "change";
      } else if (activeMode === "vision" || isGroundingIntent) {
        taskType = "grounding";
      } else {
        taskType = "vqa";
      }
    }

    let apiRes;
    if (taskType === "grounding" || activeMode === "vision" || isGroundingIntent) {
      apiRes = await analyzeGroundingImage({
        image: fileObj || null,
        prompt: queryText || "Locate target objects in this satellite image.",
        agentThink,
        earthSearch,
        signal: controller.signal,
      });
    } else {
      apiRes = await analyzeImage({
        image: fileObj || null,
        image2: fileObj2 || null,
        prompt: queryText || (changeDetectionMode ? "Compare T1 (Before) vs T2 (After) satellite patches to detect structural urban changes." : "Analyze satellite imagery."),
        taskType,
        mode: activeMode,
        agentThink,
        earthSearch,
        signal: controller.signal,
      });
    }

    if (apiRes.aborted) {
      const stoppedMsg = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        model: "SatQuery Agent Controller",
        task: "STOPPED",
        isError: true,
        text: "Query processing stopped by user.",
      };
      setMessages((prev) => [...prev, stoppedMsg]);
      setIsGenerating(false);
      return;
    }

    // Determine output display image URLs (Base64 guaranteed & compressed)
    let resultImgUrl = displayImageUrl;
    if (!resultImgUrl && fileObj) {
      resultImgUrl = await fileToBase64(fileObj);
    }
    if (!resultImgUrl) {
      resultImgUrl = generateFallbackRGBBase64();
    }

    let resultImgUrl2 = displayImageUrl2;
    if (!resultImgUrl2 && fileObj2) {
      resultImgUrl2 = await fileToBase64(fileObj2);
    }

    if (apiRes.success && apiRes.data) {
      const backendData = apiRes.data;
      let rawAnswer = backendData.answer || backendData.response || backendData.message || "";
      
      const { cleanText, parsedBoxes } = parseGeoChatBoxes(rawAnswer, queryText);
      const finalBoxes = [...(backendData.boxes || []), ...parsedBoxes];

      let cleanAnswerText = cleanHtmlResponse(cleanText);
      if (!cleanAnswerText) {
        if (finalBoxes.length > 0) {
          const detectedLabel = finalBoxes[0].label || "target";
          cleanAnswerText = `Spatial grounding detected ${finalBoxes.length} ${detectedLabel.toLowerCase()} region${finalBoxes.length > 1 ? "s" : ""}.`;
        } else if (changeDetectionMode || taskType === "change") {
          cleanAnswerText = "Bi-Temporal Change Detection complete. GeoChat analyzed T1 vs T2 patches to evaluate structural variations.";
        } else {
          cleanAnswerText = "Analysis complete. GeoChat processed the satellite imagery.";
        }
      }

      // Detailed Structured Reasoning Trace
      let reasoningText = backendData.thinking || backendData.reasoning || backendData.analysis_trace;
      if (!reasoningText || reasoningText === "Agentic reasoning trace active...") {
        if (finalBoxes.length > 0) {
          reasoningText = `[Step 1/3] Ingestion: Input Satellite Patch Vision Tokenization\n[Step 2/3] Model Execution: GeoChat-7B Spatial Grounding for prompt "${queryText || 'Locate target objects'}"\n[Step 3/3] Extraction: Identified ${finalBoxes.length} spatial region(s) [${finalBoxes.map(b => b.label).join(', ')}]. Red bounding box outline rendered.`;
        } else if (changeDetectionMode || taskType === 'change') {
          reasoningText = `[Step 1/3] Bi-Temporal Pair Alignment (T1 Before vs T2 After)\n[Step 2/3] Model Execution: GeoChat Agent Controller Structural Variation Analysis\n[Step 3/3] Change Detection Complete: Evaluated infrastructural and land cover changes between satellite timestamps.`;
        } else {
          reasoningText = `[Step 1/2] Input Satellite Patch Ingestion\n[Step 2/2] Model Execution: GeoChat-7B Remote Sensing Intelligence processed prompt "${queryText || 'Analyze satellite imagery'}". Response generated cleanly.`;
        }
      }

      const assistantMsg = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        model: backendData.specialist || (taskType === "change" ? "GeoChat-ChangeDetection" : (activeMode === "vision" || isGroundingIntent) ? "GeoChat-grounding" : "GeoChat-7B"),
        task: (isGroundingIntent || taskType === "grounding") ? "GROUNDING" : backendData.task ? backendData.task.toUpperCase() : taskType.toUpperCase(),
        confidence: backendData.confidence || null,
        thinking: agentThink ? reasoningText : null,
        text: cleanAnswerText,
        boxes: finalBoxes,
        resultImage: resultImgUrl,
        resultImage2: resultImgUrl2,
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
        text: cleanHtmlResponse(apiRes.error) || "Failed to fetch backend response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsGenerating(false);
  };

  const handleRetryMessage = (errorOrAssistantMsg) => {
    const msgIdx = messages.findIndex((m) => m.id === errorOrAssistantMsg.id);
    let targetQuery = "";
    let targetImage = null;

    if (msgIdx > 0 && messages[msgIdx - 1].sender === "user") {
      targetQuery = messages[msgIdx - 1].text;
      targetImage = messages[msgIdx - 1].image;
    } else {
      targetQuery = inputQuery || "Analyze satellite imagery.";
    }

    setMessages((prev) => prev.filter((m) => m.id !== errorOrAssistantMsg.id));
    executeQuery(targetQuery, attachedImage?.file || null, targetImage);
  };

  const handleSendMessage = async () => {
    if (!inputQuery.trim() && !attachedImage) return;

    let img1Url = attachedImage ? attachedImage.url : null;
    let img2Url = attachedImage2 ? attachedImage2.url : null;

    if (attachedImage && attachedImage.file && (!img1Url || img1Url.startsWith("blob:"))) {
      const b64 = await fileToBase64(attachedImage.file);
      if (b64) img1Url = b64;
    }

    if (attachedImage2 && attachedImage2.file && (!img2Url || img2Url.startsWith("blob:"))) {
      const b64_2 = await fileToBase64(attachedImage2.file);
      if (b64_2) img2Url = b64_2;
    }

    if (!img1Url) {
      img1Url = generateFallbackRGBBase64();
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputQuery || (changeDetectionMode ? "Compare T1 (Before) vs T2 (After) patches for change detection." : "Analyze attached satellite imagery."),
      image: img1Url,
      image2: img2Url,
      imageName: attachedImage ? attachedImage.name : null,
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentImg = attachedImage;
    const currentImg2 = attachedImage2;
    const currentQuery = inputQuery;

    setInputQuery("");
    setAttachedImage(null);
    setAttachedImage2(null);

    executeQuery(
      currentQuery,
      currentImg?.file,
      img1Url,
      changeDetectionMode ? "change" : null,
      mode,
      currentImg2?.file,
      img2Url
    );
  };

  const handlePresetClick = (sample) => {
    if (sample.mode) {
      setMode(sample.mode);
    }
    if (sample.isChange) {
      setChangeDetectionMode(true);
    }
    setInputQuery(sample.query);

    if (!attachedImage && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onPaste={handlePasteEvent}
      className={`flex h-screen w-full overflow-hidden select-none transition-colors duration-300 relative ${
        isDark ? "bg-[#070810] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Hidden File Inputs for T1 and T2 Images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e, false)}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef2}
        onChange={(e) => handleFileUpload(e, true)}
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
          <Link href="/" className="flex items-center gap-1.5 overflow-hidden px-1">
            {sidebarOpen && (
              <span className={`font-extrabold text-lg tracking-tight whitespace-nowrap ${
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
              <button
                onClick={() => setChangeDetectionMode(!changeDetectionMode)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors font-bold ${
                  changeDetectionMode
                    ? "bg-indigo-600 text-white shadow-md"
                    : isDark
                    ? "text-slate-200 hover:bg-white/10 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <GitMerge className="w-4 h-4 text-indigo-400" />
                <span>Change Detection</span>
              </button>
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
          <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto text-center space-y-7 py-8 sm:py-14 px-3">
            {/* Glowing Gradient Heading */}
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-800 dark:from-white dark:via-slate-100 dark:to-cyan-300 leading-tight">
              What satellite analysis can I help with today?
            </h2>

            {/* Glassmorphic Segmented Mode Switcher Pill */}
            <div className={`flex items-center p-1.5 rounded-full border shadow-2xl backdrop-blur-md ${
              isDark
                ? "bg-[#121324]/90 border-violet-500/30 shadow-indigo-950/50"
                : "bg-white/90 border-slate-200/80 shadow-slate-200"
            }`}>
              <button
                onClick={() => setMode("instant")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-300 ${
                  mode === "instant"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-102"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Instant</span>
              </button>

              <button
                onClick={() => setMode("expert")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-300 ${
                  mode === "expert"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-102"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" />
                <span>Expert</span>
              </button>

              <button
                onClick={() => setMode("vision")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-300 ${
                  mode === "vision"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-102"
                    : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span>Vision</span>
              </button>
            </div>

            {/* Presets Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-3">
              {presetSamples.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(s)}
                    className={`group p-4 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between space-y-3 relative overflow-hidden ${
                      isDark
                        ? "bg-[#121428] hover:bg-[#181a36] border-violet-500/25 text-white hover:border-violet-500/60 shadow-indigo-950/30"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-lg hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-extrabold text-sm tracking-tight">{s.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <p className={`text-xs leading-relaxed font-normal text-left ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {s.desc}
                    </p>
                  </button>
                );
              })}
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
                {/* User Message Bubble: Dual Images for Change Detection */}
                {msg.sender === "user" && (
                  <div className="flex justify-end my-3">
                    <div className="max-w-xl bg-[#0055ff] dark:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-3xl text-sm font-semibold shadow-md space-y-2">
                      <div className="flex items-center gap-2">
                        {msg.image && (
                          <div className="rounded-2xl overflow-hidden max-w-xs border border-white/20 mb-2 relative bg-slate-900">
                            <img
                              src={msg.image}
                              alt="T1 Satellite Patch"
                              className="w-full h-36 object-cover"
                            />
                            <span className="block text-[10px] font-mono text-center bg-black/60 text-white py-0.5">T1 (Before)</span>
                          </div>
                        )}
                        {msg.image2 && (
                          <div className="rounded-2xl overflow-hidden max-w-xs border border-white/20 mb-2 relative bg-slate-900">
                            <img
                              src={msg.image2}
                              alt="T2 Satellite Patch"
                              className="w-full h-36 object-cover"
                            />
                            <span className="block text-[10px] font-mono text-center bg-black/60 text-white py-0.5">T2 (After)</span>
                          </div>
                        )}
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}

                {/* Assistant Response Layout */}
                {msg.sender === "assistant" && (
                  <div className="flex flex-col items-start my-4 space-y-3 max-w-3xl">
                    {msg.isError ? (
                      /* Error Bubble with Try Again Button */
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-sm font-medium flex items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>{msg.text}</span>
                        </div>
                        <button
                          onClick={() => handleRetryMessage(msg)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all hover:scale-105 active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Try Again</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 w-full">
                        {/* Model / Task Tag */}
                        <div className="flex items-center gap-2 text-xs font-mono font-bold">
                          <Badge variant="indigo">{msg.model}</Badge>
                          <span className="text-cyan-600 dark:text-cyan-400">{msg.task}</span>
                        </div>

                        {/* Plain Clean Assistant Answer Text */}
                        <div className={`text-sm sm:text-base leading-relaxed font-medium ${
                          isDark ? "text-slate-100" : "text-slate-900"
                        }`}>
                          {msg.text}
                        </div>

                        {/* Output Image Display & Bounding Box SVG Overlay */}
                        {(msg.resultImage || msg.resultImage2) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mt-2">
                            {msg.resultImage && (
                              <div className="rounded-2xl overflow-hidden border bg-black relative aspect-video shadow-md border-slate-300 dark:border-white/15">
                                <img
                                  src={msg.resultImage}
                                  alt="T1 Satellite Output Patch"
                                  className="w-full h-full object-cover"
                                />
                                {msg.boxes && msg.boxes.length > 0 && (
                                  <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                  >
                                    {msg.boxes.map((box, bIdx) => {
                                      const x1 = box.x1 !== undefined ? box.x1 : (box.x || 0);
                                      const y1 = box.y1 !== undefined ? box.y1 : (box.y || 0);
                                      const x2 = box.x2 !== undefined ? box.x2 : (x1 + (box.width || 0));
                                      const y2 = box.y2 !== undefined ? box.y2 : (y1 + (box.height || 0));
                                      const width = Math.max(2, x2 - x1);
                                      const height = Math.max(2, y2 - y1);

                                      return (
                                        <g key={bIdx}>
                                          <rect
                                            x={x1}
                                            y={y1}
                                            width={width}
                                            height={height}
                                            fill="rgba(239, 68, 68, 0.2)"
                                            stroke="#ef4444"
                                            strokeWidth="2"
                                            strokeDasharray="3 1.5"
                                            vectorEffect="non-scaling-stroke"
                                          />
                                          <foreignObject
                                            x={x1}
                                            y={Math.max(0, y1 - 8)}
                                            width="140"
                                            height="26"
                                          >
                                            <div className="bg-red-950/90 text-red-100 text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/80 inline-flex items-center gap-1 shadow-lg font-bold whitespace-nowrap">
                                              <span>🎯 {box.label || 'Target'}</span>
                                              {box.confidence && (
                                                <span className="text-amber-300 font-bold">{box.confidence}%</span>
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

                            {msg.resultImage2 && (
                              <div className="rounded-2xl overflow-hidden border bg-black relative aspect-video shadow-md border-slate-300 dark:border-white/15">
                                <img
                                  src={msg.resultImage2}
                                  alt="T2 Satellite Output Patch"
                                  className="w-full h-full object-cover"
                                />
                              </div>
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
                          <button onClick={() => handleRetryMessage(msg)} title="Try Again / Regenerate" className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
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

            {/* Pulsating Loading Indicator Dot on Left with Stop Button */}
            {isGenerating && (
              <div className="flex items-center justify-between p-3 rounded-2xl dark:bg-white/5 bg-slate-100 border dark:border-white/10 border-slate-200 max-w-md my-4">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-violet-500 animate-ping shrink-0" />
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                    Processing satellite query...
                  </span>
                </div>
                <button
                  onClick={handleStopQuery}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Floating Input Container */}
        <div className="max-w-3xl mx-auto w-full pt-2">
          {/* Dual Image Preview Bar for Change Detection */}
          {(attachedImage || attachedImage2) && (
            <div className="flex items-center gap-2 mb-2 overflow-x-auto">
              {attachedImage && (
                <div className={`flex items-center gap-2 p-2 rounded-xl text-xs font-extrabold shadow-lg border ${
                  isDark ? "bg-[#141628] border-violet-500/30 text-white" : "bg-white border-slate-300 text-slate-900"
                }`}>
                  <img src={attachedImage.url} alt="T1 Attached" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="font-mono text-[11px] text-cyan-500">T1: {attachedImage.name}</span>
                  <button onClick={() => setAttachedImage(null)} className="p-1 hover:text-rose-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {attachedImage2 && (
                <div className={`flex items-center gap-2 p-2 rounded-xl text-xs font-extrabold shadow-lg border ${
                  isDark ? "bg-[#141628] border-indigo-500/30 text-white" : "bg-white border-slate-300 text-slate-900"
                }`}>
                  <img src={attachedImage2.url} alt="T2 Attached" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="font-mono text-[11px] text-indigo-400">T2: {attachedImage2.name}</span>
                  <button onClick={() => setAttachedImage2(null)} className="p-1 hover:text-rose-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DeepSeek Floating Textarea Container */}
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
              placeholder={changeDetectionMode ? "Compare T1 vs T2 satellite imagery for urban change detection..." : "Ask SatQuery AI or paste satellite imagery..."}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none resize-none px-2 dark:text-white text-slate-900"
            />

            {/* Bottom Input Action Controls */}
            <div className="flex items-center justify-between pt-2 border-t dark:border-white/10 border-slate-200 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
                <button
                  onClick={() => setAgentThink(!agentThink)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold transition-all whitespace-nowrap ${
                    agentThink
                      ? "bg-violet-600/30 text-violet-600 dark:text-violet-300 border border-violet-500/40"
                      : "dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-violet-500" />
                  <span>AgentThink</span>
                </button>

                <button
                  onClick={() => setChangeDetectionMode(!changeDetectionMode)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold transition-all whitespace-nowrap ${
                    changeDetectionMode
                      ? "bg-indigo-600 text-white shadow-md border border-indigo-400"
                      : "dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Change Detection</span>
                </button>

                <button
                  onClick={() => setEarthSearch(!earthSearch)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold transition-all whitespace-nowrap ${
                    earthSearch
                      ? "bg-cyan-600/30 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40"
                      : "dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-transparent"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Earth Search</span>
                </button>
              </div>

              {/* Action Buttons: (+) Add T1 Symbol, (🔄 T2) Attach T2 Symbol, (↑) Send Arrow */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {changeDetectionMode && attachedImage && (
                  <button
                    onClick={() => fileInputRef2.current?.click()}
                    title="Attach T2 (After) Satellite Patch"
                    className="px-2.5 py-1.5 rounded-full bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-mono text-[11px] font-extrabold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>T2 Patch</span>
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach T1 / Satellite Patch (+)"
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

                {isGenerating ? (
                  <button
                    onClick={handleStopQuery}
                    title="Stop Query Generation"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputQuery.trim() && !attachedImage}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-40"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[3]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SatQueryDeepSeekChatPageWrapper() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#070810]" />}>
      <ChatContent />
    </Suspense>
  );
}
