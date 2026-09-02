"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Satellite,
  ArrowRight,
  GitMerge,
  Layers,
  Cpu,
  BarChart3,
  Compass,
  CheckCircle2,
  Terminal,
  Sparkles,
  ShieldCheck,
  Eye,
  Radio,
  Building2,
  TreePine,
  Waves,
  MessageSquare,
  ArrowDown,
  Activity,
  Check,
  Clock,
  Zap,
  Globe2,
  Sliders,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function SatQueryStackryzeHome() {
  const animatedCapabilities = [
    "Single Satellite Image VQA & Captioning",
    "Spatial Object & Region Grounding [x1, y1, x2, y2]",
    "Bi-Temporal Change Detection & Understanding",
    "Optical + SAR Radar All-Weather Fusion",
    "ISRO / SAC Cartosat-2S & RISAT Evaluation",
  ];

  const [capIndex, setCapIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeText(false);
      setTimeout(() => {
        setCapIndex((prev) => (prev + 1) % animatedCapabilities.length);
        setFadeText(true);
      }, 300);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const projectPhases = [
    { id: "P1", name: "GeoChat 4-bit Baseline", status: "complete", tag: "Phase 1" },
    { id: "P2", name: "VRSBench Benchmark", status: "complete", tag: "Phase 2" },
    { id: "P3", name: "BigEarthNet Analysis", status: "complete", tag: "Phase 3" },
    { id: "P4", name: "Real Sentinel Imagery", status: "complete", tag: "Phase 4" },
    { id: "P5", name: "Local QLoRA Feasibility", status: "complete", tag: "Phase 5" },
    { id: "P6", name: "Kaggle T4 QLoRA Test", status: "current", tag: "Phase 6 — CURRENT" },
    { id: "P7", name: "5,000 Sample Training", status: "upcoming", tag: "Phase 7" },
    { id: "P8", name: "Adapted GeoChat Eval", status: "upcoming", tag: "Phase 8" },
    { id: "P9", name: "Bi-Temporal Specialist", status: "upcoming", tag: "Phase 9" },
    { id: "P10", name: "Optical + SAR Fusion", status: "upcoming", tag: "Phase 10" },
    { id: "P11", name: "Agentic Controller Router", status: "upcoming", tag: "Phase 11" },
    { id: "P12", name: "Response Integration", status: "upcoming", tag: "Phase 12" },
    { id: "P13", name: "Web Application GUI", status: "upcoming", tag: "Phase 13" },
    { id: "P14", name: "ISRO/SAC Benchmark Eval", status: "upcoming", tag: "Phase 14" },
  ];

  const activeAnalysis = {
    prompt: "Locate all cargo vessels and commercial port buildings in this satellite patch.",
    model: "Adapted GeoChat-7B (BigEarthNet QLoRA)",
    confidence: 95.8,
    boxes: [
      { label: "Building 1", x: 120, y: 80, width: 90, height: 60, score: "96%" },
      { label: "Vessel 1", x: 260, y: 190, width: 110, height: 45, score: "95%" },
      { label: "Vessel 2", x: 410, y: 220, width: 85, height: 40, score: "93%" },
      { label: "Building 2", x: 150, y: 290, width: 100, height: 75, score: "94%" },
    ],
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
  };

  const systemMetrics = [
    { label: "Grounding Accuracy", val: "95.8%", sub: "GeoChat-7B Spatial QLoRA" },
    { label: "Model Quantization", val: "4-Bit NF4", sub: "LoRA Rank 8 (0.13% Trainable)" },
    { label: "Specialist Agents", val: "3 Neural Models", sub: "VQA, Change & SAR Fusion" },
    { label: "Agency Compatibility", val: "ISRO / SAC", sub: "Cartosat-2S & Sentinel-1/2" },
  ];

  return (
    <main className="py-8 sm:py-16 space-y-16 sm:space-y-24 relative overflow-hidden px-3 sm:px-6 max-w-7xl mx-auto">
      {/* 1. Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 pt-2 sm:pt-6 relative">
        {/* Main Stackryze Style Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white font-sans">
          Agentic AI system <br className="hidden sm:inline" />
          for{" "}
          <span className="font-serif italic text-[#f97316] underline underline-offset-8 decoration-[#f97316]/50 font-normal">
            remote sensing queries.
          </span>
        </h1>

        {/* Animated Capability Rotator */}
        <div className="h-8 flex items-center justify-center">
          <span
            className={`text-xs sm:text-base font-extrabold font-mono transition-all duration-300 ${
              fadeText ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
            } bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent`}
          >
            ⚡ {animatedCapabilities[capIndex]}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-2">
          An autonomous agentic intelligence framework that routes satellite queries to specialized fine-tuned models for spatial visual question answering, change detection, and SAR radar fusion.
        </p>

        {/* Primary Stackryze Button Styling (Matching https://stackryze.com/) */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 pt-2 max-w-xs sm:max-w-none mx-auto">
          {/* Primary Button: Solid Crisp White Rectangle with Dark Text & Arrow */}
          <Link
            href="/chat"
            className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm tracking-tight shadow-xl transition-all flex items-center justify-center gap-2.5 border border-slate-300 group"
          >
            <span>Launch SatQuery Chat Studio</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary Button: Dark Translucent Rectangle with Subtle Light Border */}
          <Link
            href="/agent-flow"
            className="px-6 py-3 rounded-lg bg-slate-900/90 dark:bg-black/70 hover:bg-slate-800 dark:hover:bg-white/10 text-white font-extrabold text-sm tracking-tight shadow-xl border border-slate-700 dark:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-slate-300" />
            <span>View Architecture Docs</span>
          </Link>
        </div>
      </div>

      {/* 2. Professional System Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {systemMetrics.map((m, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-[#141628] border border-slate-200 dark:border-violet-500/30 shadow-lg text-center space-y-1"
          >
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {m.val}
            </p>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{m.label}</p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* 3. Phase 0 System Architecture Pipeline Diagram */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="purple" className="mx-auto">Phase 0 — System Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
            Autonomous Agentic Model Selection Pipeline
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            The Agent Controller dynamically inspects query intent and routes to specialized remote sensing models.
          </p>
        </div>

        {/* Architecture Flow Box */}
        <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-[#141628] border border-slate-300 dark:border-violet-500/30 shadow-2xl space-y-6">
          {/* Step 1: User Input */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-center space-y-1">
            <span className="text-[11px] font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              1. User Multi-Modal Input
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Single Satellite Image + Question | Bi-Temporal Pair (T1 & T2) | Sentinel-1 SAR + Sentinel-2 Optical
            </h4>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
          </div>

          {/* Step 2: Agentic Controller */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white text-center space-y-2 shadow-xl">
            <div className="flex items-center justify-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-300" />
              <span className="font-extrabold text-base tracking-tight">Agentic Controller Router</span>
            </div>
            <p className="text-xs font-medium text-slate-100 max-w-xl mx-auto">
              Understands natural language query intent ➔ Classifies remote sensing task ➔ Selects specialist neural model
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
          </div>

          {/* Step 3: Three Specialist Models */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white space-y-2 text-center">
              <Eye className="w-5 h-5 text-amber-500 mx-auto" />
              <h5 className="text-xs font-extrabold">GeoChat-7B QLoRA Specialist</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                Single Image VQA • Image Captioning • Spatial Bounding Boxes `[x1, y1, x2, y2]`
              </p>
            </div>

            <div className="p-4 rounded-2xl border bg-indigo-500/10 border-indigo-500/30 text-slate-900 dark:text-white space-y-2 text-center">
              <GitMerge className="w-5 h-5 text-indigo-500 mx-auto" />
              <h5 className="text-xs font-extrabold">Bi-Temporal Change Specialist</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                CDVQA Standard • Compares T1 Before vs T2 After satellite passes
              </p>
            </div>

            <div className="p-4 rounded-2xl border bg-cyan-500/10 border-cyan-500/30 text-slate-900 dark:text-white space-y-2 text-center">
              <Layers className="w-5 h-5 text-cyan-500 mx-auto" />
              <h5 className="text-xs font-extrabold">Optical + SAR Radar Specialist</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                Sentinel-1 C-Band Microwave Radar + Sentinel-2 Optical All-Weather Vision
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
          </div>

          {/* Step 4: Response Integration */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-900 dark:text-white text-center space-y-1">
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              4. Explainable Response Integration
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold">
              Synthesized Natural Language Answer • 95.8% Confidence Metric • Coordinate Bounding Boxes • Agent Reasoning Log
            </h4>
          </div>
        </div>
      </section>

      {/* 4. Visual Grounding Canvas */}
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
            Live Spatial Grounding Capability Demo
          </span>
          <Badge variant="success">95.8% Confidence</Badge>
        </div>

        <div className="rounded-3xl p-2 sm:p-3 shadow-2xl border bg-white dark:bg-[#141628] border-slate-300 dark:border-violet-500/30">
          <div className="rounded-2xl overflow-hidden bg-black relative aspect-video shadow-md">
            <img
              src={activeAnalysis.image}
              alt="Satellite Terrain Grounding Preview"
              className="w-full h-full object-cover"
            />

            {/* SVG Grounding Overlays */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {activeAnalysis.boxes.map((box, bIdx) => (
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
                    className="animate-pulse"
                  />
                  <foreignObject
                    x={`${(box.x / 600) * 100}%`}
                    y={`${Math.max(0, (box.y / 400) * 100 - 8)}%`}
                    width="120"
                    height="30"
                  >
                    <div className="bg-violet-950/90 text-violet-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-violet-400/50 inline-flex items-center gap-1 shadow-lg font-bold">
                      <span>{box.label}</span>
                      <span className="text-cyan-300">{box.score}</span>
                    </div>
                  </foreignObject>
                </g>
              ))}
            </svg>

            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 backdrop-blur-xl bg-black/80 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full border border-white/20 text-[10px] sm:text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="truncate">GeoChat-7B Coordinate Grounding Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Project Development Status Roadmap (Phase 1 to 14 Tracker) */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="warning">Development Execution Roadmap</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Phase-by-Phase Progress Tracker
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30">
            <Activity className="w-4 h-4 animate-pulse text-amber-500" />
            <span>PHASE 6: Kaggle T4 QLoRA Test (ACTIVE)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {projectPhases.map((phase) => {
            const isComplete = phase.status === "complete";
            const isCurrent = phase.status === "current";
            return (
              <div
                key={phase.id}
                className={`p-3.5 rounded-2xl border space-y-1.5 transition-all ${
                  isCurrent
                    ? "bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/50 shadow-lg"
                    : isComplete
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                    : "bg-white dark:bg-[#141628] border-slate-200 dark:border-white/10 text-slate-500 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold">{phase.tag}</span>
                  {isComplete && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                  {isCurrent && <Activity className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                </div>
                <h5 className="text-xs font-extrabold truncate">{phase.name}</h5>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
