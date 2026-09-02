"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Compass,
  CheckCircle2,
  Clock,
  Circle,
  Zap,
  Cpu,
  Database,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";

export default function RoadmapPage() {
  const phases = [
    { num: 1, title: "GeoChat Baseline", status: "complete", detail: "GeoChat-7B 4-bit NF4 local baseline verified with step1_results.json" },
    { num: 2, title: "VRSBench Baseline", status: "complete", detail: "VQA, Captioning, and Grounding baseline evaluations recorded" },
    { num: 3, title: "BigEarthNet Dataset Analysis", status: "complete", detail: "464k patch dataset analyzed; 5,000 sample subset created (1.5k VQA, 1k MCQ, 1k Cap, 1.5k Ground)" },
    { num: 4, title: "Real Satellite Imagery Verification", status: "complete", detail: "Derived Sentinel-1/2 co-registered GeoTIFF samples verified" },
    { num: 5, title: "Local QLoRA Feasibility", status: "complete", detail: "4.98M trainable parameters (0.13%) configured on GeoChat-7B" },
    { num: 6, title: "Kaggle QLoRA Single-Step Test", status: "current", detail: "Kaggle T4 GPU single-forward/backward pass verification in progress" },
    { num: 7, title: "5,000 BigEarthNet Sample Training", status: "pending", detail: "Full training run across VQA, MCQ, Captioning & Grounding" },
    { num: 8, title: "Adapted GeoChat Evaluation", status: "pending", detail: "Comparative benchmarks against baseline" },
    { num: 9, title: "Bi-Temporal Specialist (CDVQA)", status: "pending", detail: "Two-image change detection model integration" },
    { num: 10, title: "Optical + SAR Specialist", status: "pending", detail: "Sentinel-1 + Sentinel-2 multi-modal cross-attention fusion" },
    { num: 11, title: "Agentic Controller Routing", status: "pending", detail: "Query classification & automatic tool/specialist selection" },
    { num: 12, title: "Response Integration & Explainability", status: "pending", detail: "Unified response synthesis with bounding boxes and confidence score" },
    { num: 13, title: "Web GUI Implementation", status: "complete", detail: "Interactive SatQuery AI Next.js frontend built" },
    { num: 14, title: "Final Benchmark Evaluation", status: "pending", detail: "Comprehensive test across VRSBench, RSVQA, CDVQA" },
    { num: 15, title: "ISRO / SAC Imagery Evaluation", status: "pending", detail: "Cartosat-2S & RISAT validation" },
    { num: 16, title: "Research Findings & Report", status: "pending", detail: "Final research documentation & analysis" },
  ];

  const qloraParams = {
    model: "GeoChat-7B",
    quantization: "4-bit NF4",
    loraRank: 8,
    loraAlpha: 16,
    targetModules: ["q_proj", "v_proj"],
    trainableParams: "4,980,736",
    totalParams: "3,750,000,000",
    trainableRatio: "0.13%",
    imageResolution: "224 x 224",
    visualTokens: 256,
    kaggleGPU: "NVIDIA Tesla T4 (16GB)",
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning">
              <Zap className="w-3 h-3 text-amber-300" />
              Phase 6 Active: Kaggle T4 QLoRA
            </Badge>
            <Badge variant="default">16-Phase Master Plan</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Project Roadmap & Kaggle QLoRA Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track progress from baseline evaluation to Kaggle GPU QLoRA fine-tuning and agentic deployment.
          </p>
        </div>
      </div>

      {/* Kaggle T4 QLoRA Status Monitor */}
      <Card className="border-slate-800 mb-8 p-6 bg-slate-900/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              CURRENT IMMEDIATE GOAL — PHASE 6
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              Kaggle T4 Single-Step QLoRA Verification
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Verifying Internet → T4 GPU → Model 4-bit load → LoRA attachment → 1 forward pass → 1 backward pass → 1 optimizer step on Kaggle.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Target GPU</p>
              <p className="text-sm font-bold text-cyan-300 font-mono">{qloraParams.kaggleGPU}</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <p className="text-xs text-slate-400">Trainable Params</p>
              <p className="text-sm font-bold text-emerald-400 font-mono">
                {qloraParams.trainableParams} ({qloraParams.trainableRatio})
              </p>
            </div>
          </div>
        </div>

        {/* QLoRA Hyperparameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-6 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block mb-1">Quantization</span>
            <span className="font-mono font-semibold text-cyan-300">{qloraParams.quantization}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block mb-1">LoRA Rank / Alpha</span>
            <span className="font-mono font-semibold text-cyan-300">
              r={qloraParams.loraRank}, α={qloraParams.loraAlpha}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block mb-1">Target Modules</span>
            <span className="font-mono font-semibold text-indigo-300">q_proj, v_proj</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block mb-1">Image Resolution</span>
            <span className="font-mono font-semibold text-purple-300">{qloraParams.imageResolution}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block mb-1">Visual Tokens</span>
            <span className="font-mono font-semibold text-emerald-300">{qloraParams.visualTokens}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block mb-1">Dataset Subset</span>
            <span className="font-mono font-semibold text-amber-300">5,000 Samples</span>
          </div>
        </div>
      </Card>

      {/* 16-Phase Roadmap Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-cyan-400" />
          Master 16-Phase Roadmap Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => (
            <Card
              key={phase.num}
              className={`p-4 border transition-all ${
                phase.status === "complete"
                  ? "bg-slate-900/60 border-slate-800"
                  : phase.status === "current"
                  ? "bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/20"
                  : "bg-slate-950/40 border-slate-900 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      phase.status === "complete"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : phase.status === "current"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {phase.num}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{phase.title}</h4>
                </div>

                {phase.status === "complete" && <Badge variant="success">Completed</Badge>}
                {phase.status === "current" && <Badge variant="warning">In Progress</Badge>}
                {phase.status === "pending" && <Badge variant="secondary">Upcoming</Badge>}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pl-8">{phase.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
