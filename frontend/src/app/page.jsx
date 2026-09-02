"use client";

import React from "react";
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
} from "lucide-react";
import Link from "next/link";

export default function StackryzeSatQueryHome() {
  const supportedPlatforms = [
    { name: "ISRO / SAC Space Applications", icon: Satellite },
    { name: "Sentinel-2 MSI Optical", icon: Eye },
    { name: "Sentinel-1 C-Band SAR", icon: Radio },
    { name: "BigEarthNet 464k Patches", icon: Layers },
    { name: "CDVQA Change Benchmark", icon: GitMerge },
    { name: "VRSBench Spatial Split", icon: BarChart3 },
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

  return (
    <main className="py-12 space-y-24 relative overflow-hidden">
      {/* 1. Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8 pt-6 relative">
        {/* Top Centered Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>SatQuery AI Remote Sensing System</span>
        </div>

        {/* Main Stackryze Headline (Playfair Display Serif Mix) */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
          Agentic AI infrastructure <br className="hidden sm:inline" />
          for the{" "}
          <span className="font-serif italic text-[#f97316] underline underline-offset-8 decoration-[#f97316]/50 font-normal">
            remote sensing.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An agentic AI system that understands satellite imagery, automatically selecting GeoChat-7B QLoRA, Change Detection, and Optical-SAR fusion tools to answer complex remote-sensing queries.
        </p>

        {/* Primary Home Page CTA Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
          {/* Primary Featured CTA: Launch AI Chat Studio */}
          <Link
            href="/chat"
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm tracking-wide shadow-2xl shadow-indigo-500/30 transition-all transform hover:scale-105 flex items-center gap-2.5 group"
          >
            <MessageSquare className="w-4.5 h-4.5 text-cyan-300" />
            <span>Launch Satellite AI Chat</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </Link>

          {/* Secondary Button: Explore Documentation */}
          <Link
            href="/agent-flow"
            className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm tracking-wide shadow-xl border border-slate-300 transition-all flex items-center gap-2"
          >
            <span>Explore documentation</span>
          </Link>
        </div>
      </div>

      {/* 2. Visual Satellite Grounding Showcase Card */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl p-3 shadow-2xl border bg-white dark:bg-[#141628] border-slate-300 dark:border-violet-500/30">
          <div className="rounded-2xl overflow-hidden bg-black relative aspect-video shadow-md">
            <img
              src={activeAnalysis.image}
              alt="Satellite Terrain Grounding Preview"
              className="w-full h-full object-cover"
            />

            {/* Grounding SVG */}
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

            <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-black/80 px-4 py-2 rounded-full border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Adapted GeoChat-7B Bounding Box Grounding Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Supported Datasets & Agency Benchmarks Row */}
      <div className="max-w-5xl mx-auto space-y-6 pt-4 text-center">
        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
          Our open source benchmarks & datasets are supported by
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-90">
          {supportedPlatforms.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4 text-amber-500" />
                <span className="font-mono">{platform.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Three Pillars System Grid (Clear & Easy to Understand) */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Three Core Satellite AI Specialists
          </h2>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            SatQuery AI routes queries to specialized multi-modal models built for remote sensing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#141628] border border-slate-200 dark:border-violet-500/30 text-slate-900 dark:text-white shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold">1. Single Image VQA & Grounding</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
              GeoChat-7B 4-bit NF4 QLoRA model trained on BigEarthNet annotations to output precise bounding box coordinates `[x1, y1, x2, y2]`.
            </p>
            <Link href="/benchmarks" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:underline">
              <span>View benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#141628] border border-slate-200 dark:border-violet-500/30 text-slate-900 dark:text-white shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GitMerge className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold">2. Bi-Temporal Change Detection</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
              CDVQA change specialist compares two satellite passes (T1 Before vs T2 After) to detect and quantify structural expansion.
            </p>
            <Link href="/change-detection" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
              <span>Test change model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#141628] border border-slate-200 dark:border-violet-500/30 text-slate-900 dark:text-white shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold">3. Optical + SAR Radar Fusion</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
              Combines Sentinel-1 C-Band microwave radar with Sentinel-2 MSI optical bands for all-weather, cloud-penetrating vision.
            </p>
            <Link href="/fusion" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-cyan-600 dark:text-cyan-400 hover:underline">
              <span>Explore fusion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. How It Works Step-by-Step Flow */}
      <section className="max-w-4xl mx-auto space-y-8 pt-6">
        <div className="text-center space-y-2">
          <Badge variant="purple" className="mx-auto">Explainable Agent Pipeline</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How SatQuery AI Processes Satellite Queries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-6 rounded-2xl border bg-white dark:bg-[#141628] border-slate-200 dark:border-violet-500/20 space-y-2">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto">1</div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Input Query</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Upload optical image patch or bi-temporal satellite pair.</p>
          </div>

          <div className="p-6 rounded-2xl border bg-white dark:bg-[#141628] border-slate-200 dark:border-violet-500/20 space-y-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto">2</div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Agentic Controller</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Classifies task intent & routes to the best specialist model.</p>
          </div>

          <div className="p-6 rounded-2xl border bg-white dark:bg-[#141628] border-slate-200 dark:border-violet-500/20 space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto">3</div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Grounded Output</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Returns answer, confidence score, and bounding boxes.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
