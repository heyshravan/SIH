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

  return (
    <main className="py-8 sm:py-16 space-y-16 sm:space-y-24 relative overflow-hidden px-3 sm:px-6 max-w-7xl mx-auto">
      {/* 1. Hero Section */}
      <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 pt-2 sm:pt-6 relative">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white font-sans">
          Agentic AI system <br className="hidden sm:inline" />
          for{" "}
          <span className="font-serif italic text-[#f97316] underline underline-offset-8 decoration-[#f97316]/50 font-normal">
            remote sensing queries.
          </span>
        </h1>

        {/* Animated Capability Rotator */}
        <div className="h-10 flex items-center justify-center">
          <span
            className={`text-sm sm:text-lg md:text-xl font-extrabold font-mono transition-all duration-300 ${
              fadeText ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
            } bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent`}
          >
            ⚡ {animatedCapabilities[capIndex]}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl font-semibold text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed px-2">
          An autonomous agentic intelligence framework that routes satellite queries to specialized fine-tuned models for spatial visual question answering, change detection, and SAR radar fusion.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 pt-3 max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/chat"
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-base tracking-tight shadow-2xl transition-all flex items-center justify-center gap-3 border border-slate-300 group"
          >
            <span>Launch SatQuery Chat Studio</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/agent-flow"
            className="px-7 py-3.5 rounded-xl bg-slate-900/90 dark:bg-black/70 hover:bg-slate-800 dark:hover:bg-white/10 text-white font-black text-base tracking-tight shadow-2xl border border-slate-700 dark:border-white/20 transition-all flex items-center justify-center gap-2.5"
          >
            <BookOpen className="w-5 h-5 text-slate-300" />
            <span>View Architecture Docs</span>
          </Link>
        </div>
      </div>

      {/* 2. Phase 0 System Architecture Pipeline Diagram (Enlarged & High Visibility) */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="purple" className="mx-auto text-xs px-3.5 py-1">Phase 0 — System Architecture</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            Autonomous Agentic Model Selection Pipeline
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            The Agent Controller dynamically inspects query intent and routes to specialized remote sensing models.
          </p>
        </div>

        {/* Architecture Flow Box (Increased Width & Padding) */}
        <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-white dark:bg-[#141628] border-2 border-slate-300 dark:border-violet-500/40 shadow-2xl space-y-8">
          {/* Step 1: User Input */}
          <div className="p-5 sm:p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border-2 border-slate-200 dark:border-white/15 text-center space-y-2">
            <span className="text-xs sm:text-sm font-mono font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">
              1. User Multi-Modal Input
            </span>
            <h4 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Single Satellite Image + Question &nbsp;|&nbsp; Bi-Temporal Pair (T1 & T2) &nbsp;|&nbsp; Sentinel-1 SAR + Sentinel-2 Optical
            </h4>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-7 h-7 text-indigo-500 animate-bounce stroke-[3]" />
          </div>

          {/* Step 2: Agentic Controller */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white text-center space-y-3 shadow-2xl border border-white/20">
            <div className="flex items-center justify-center gap-3">
              <Cpu className="w-7 h-7 text-cyan-300 shrink-0" />
              <span className="font-black text-xl sm:text-2xl md:text-3xl tracking-tight">Agentic Controller Router</span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-extrabold text-slate-100 max-w-2xl mx-auto leading-relaxed">
              Understands natural language query intent ➔ Classifies remote sensing task ➔ Selects specialist neural model
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-7 h-7 text-indigo-500 animate-bounce stroke-[3]" />
          </div>

          {/* Step 3: Three Specialist Models */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 sm:p-6 rounded-2xl border-2 bg-amber-500/10 border-amber-500/40 text-slate-900 dark:text-white space-y-3 text-center shadow-lg">
              <Eye className="w-7 h-7 text-amber-500 mx-auto" />
              <h5 className="text-base sm:text-lg font-black tracking-tight">GeoChat-7B QLoRA Specialist</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bold leading-relaxed">
                Single image VQA & Spatial Grounding `[y1, x1, y2, x2]` coordinates
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border-2 bg-indigo-500/10 border-indigo-500/40 text-slate-900 dark:text-white space-y-3 text-center shadow-lg">
              <GitMerge className="w-7 h-7 text-indigo-400 mx-auto" />
              <h5 className="text-base sm:text-lg font-black tracking-tight">Bi-Temporal Change Detection</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bold leading-relaxed">
                Compare T1 (Before) vs T2 (After) patches for structural urban evolution
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border-2 bg-cyan-500/10 border-cyan-500/40 text-slate-900 dark:text-white space-y-3 text-center shadow-lg">
              <Layers className="w-7 h-7 text-cyan-400 mx-auto" />
              <h5 className="text-base sm:text-lg font-black tracking-tight">Optical + SAR Radar Fusion</h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bold leading-relaxed">
                Fuse Sentinel-1 C-band SAR radar with Sentinel-2 optical bands for cloud penetration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Project Implementation Roadmap (14 Phases Grid) */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="cyan" className="mx-auto text-xs px-3.5 py-1">Project Roadmap</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            Complete 14-Phase Technical Roadmap
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-600 dark:text-slate-300">
            From 4-bit GeoChat baseline evaluation to multi-agent deployment on ISRO / SAC datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projectPhases.map((phase) => (
            <div
              key={phase.id}
              className={`p-5 rounded-2xl border-2 flex flex-col justify-between space-y-2 transition-all ${
                phase.status === "current"
                  ? "bg-violet-600/20 border-violet-500 shadow-xl shadow-violet-950/30 scale-102"
                  : phase.status === "complete"
                  ? "bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/20"
                  : "bg-white dark:bg-[#141628] border-slate-200 dark:border-white/15 opacity-90"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-slate-400">
                  {phase.tag}
                </span>
                {phase.status === "complete" && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {phase.status === "current" && (
                  <div className="w-3 h-3 rounded-full bg-violet-500 animate-ping" />
                )}
              </div>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                {phase.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
