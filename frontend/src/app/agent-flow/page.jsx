"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Target,
  GitMerge,
  Layers,
  HelpCircle,
  Zap,
} from "lucide-react";

export default function AgentFlowPage() {
  const [testQuery, setTestQuery] = useState("What changed between these two images taken in 2024 and 2026?");
  const [testInputs, setTestInputs] = useState(["image_t1.tif", "image_t2.tif"]);
  const [activeRoute, setActiveRoute] = useState({
    task: "Bi-Temporal Change Understanding",
    selectedModel: "Change Specialist Model",
    confidence: "98.4%",
    routeReason: "Detected two temporal image inputs (T1 + T2) and temporal query keywords ('changed', 'between').",
  });

  const presetQueries = [
    {
      label: "Grounding Query",
      prompt: "Where are the cargo ships located in this harbor image?",
      inputs: ["sentinel2_optical.tif"],
      expectedTask: "Single Image Grounding",
      expectedModel: "Adapted GeoChat-7B (Grounding Specialist)",
      reason: "Single optical image provided with spatial location query ('Where are').",
    },
    {
      label: "Bi-Temporal Query",
      prompt: "What changed between these two images taken in 2024 and 2026?",
      inputs: ["image_t1.tif", "image_t2.tif"],
      expectedTask: "Bi-Temporal Change Understanding",
      expectedModel: "Change Specialist Model",
      reason: "Detected two temporal image inputs (T1 + T2) and temporal query keywords ('changed', 'between').",
    },
    {
      label: "Optical + SAR Query",
      prompt: "Analyze vegetation and soil moisture using both Sentinel-1 radar and Sentinel-2 optical.",
      inputs: ["sentinel1_sar.tif", "sentinel2_optical.tif"],
      expectedTask: "Optical + SAR Fusion Analysis",
      expectedModel: "Multi-Modal Fusion Specialist",
      reason: "Detected multi-spectral optical + Synthetic Aperture Radar inputs.",
    },
    {
      label: "Captioning Query",
      prompt: "Describe the entire land scene in detailed natural language.",
      inputs: ["satellite_patch.tif"],
      expectedTask: "Image Captioning",
      expectedModel: "Adapted GeoChat-7B (Captioning)",
      reason: "Descriptive query with single satellite input.",
    },
  ];

  const handleSelectPreset = (item) => {
    setTestQuery(item.prompt);
    setTestInputs(item.inputs);
    setActiveRoute({
      task: item.expectedTask,
      selectedModel: item.expectedModel,
      confidence: "97.8%",
      routeReason: item.reason,
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple">
              <Cpu className="w-3 h-3 text-purple-400" />
              Phase 11 Agentic Controller
            </Badge>
            <Badge variant="success">Automatic Tool & Specialist Selection</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
            Agentic Controller Routing Flow
          </h1>
          <p className="text-sm font-medium dark:text-slate-400 text-slate-600 mt-1">
            Visual breakdown of how the Agentic Controller inspects inputs, identifies task intent, and routes to specialist AI models.
          </p>
        </div>
      </div>

      {/* Visual Agentic Architecture Graph */}
      <Card className="mb-8 p-6">
        <div className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider mb-6">
          Architectural Routing Diagram
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Node 1: Input Processing */}
          <div className="p-4 rounded-xl border text-center space-y-2 dark:bg-[#181a20] dark:border-[#282b35] bg-slate-50 border-slate-200">
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="text-sm font-bold dark:text-white text-slate-900">User & GUI Input</h4>
            <p className="text-[11px] font-medium dark:text-slate-400 text-slate-600">
              Query prompt + Image inputs (Single / T1-T2 / Optical+SAR)
            </p>
          </div>

          {/* Node 2: Agentic Controller */}
          <div className="p-4 rounded-xl border text-center space-y-2 shadow-md dark:bg-indigo-950/40 dark:border-indigo-500/40 dark:text-indigo-200 bg-indigo-50 border-indigo-200 text-indigo-950">
            <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
              2
            </div>
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Agent Controller</h4>
            <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
              Intent classifier, visual token length parser & modality routing
            </p>
          </div>

          {/* Node 3: Specialist Selection */}
          <div className="p-4 rounded-xl border text-center space-y-2 dark:bg-[#181a20] dark:border-[#282b35] bg-slate-50 border-slate-200">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="text-sm font-bold dark:text-white text-slate-900">Specialist Execution</h4>
            <p className="text-[11px] font-medium dark:text-slate-400 text-slate-600">
              Adapted GeoChat-7B / Change Model / Optical+SAR Fusion
            </p>
          </div>

          {/* Node 4: Response Integration */}
          <div className="p-4 rounded-xl border text-center space-y-2 dark:bg-[#181a20] dark:border-[#282b35] bg-slate-50 border-slate-200">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="text-sm font-bold dark:text-white text-slate-900">Response Integration</h4>
            <p className="text-[11px] font-medium dark:text-slate-400 text-slate-600">
              Answer + Confidence + Bounding Boxes + Explainability log
            </p>
          </div>
        </div>
      </Card>

      {/* Live Interactive Routing Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preset Selector */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">
                Interactive Routing Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Select a preset query to test how the Agentic Controller classifies intent and selects the model:
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {presetQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(item)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    testQuery === item.prompt
                      ? "dark:bg-indigo-950/50 dark:border-indigo-500/50 dark:text-indigo-200 bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold shadow-sm"
                      : "dark:bg-[#181a20] dark:border-[#282b35] dark:text-slate-300 dark:hover:bg-[#20232b] bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{item.label}</span>
                    <Badge variant="default" className="text-[10px]">
                      {item.inputs.length} Input(s)
                    </Badge>
                  </div>
                  <p className="text-xs dark:text-slate-400 text-slate-600 line-clamp-2">"{item.prompt}"</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Output Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b dark:border-[#22252e]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-500 uppercase tracking-wider">
                  Agent Controller Decision Log
                </span>
                <Badge variant="success">Confidence: {activeRoute.confidence}</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="p-4 rounded-xl border space-y-2 dark:bg-[#16181f] dark:border-[#262934] bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold dark:text-slate-400 text-slate-600">Classified Task:</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{activeRoute.task}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold dark:text-slate-400 text-slate-600">Selected Specialist:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{activeRoute.selectedModel}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold dark:text-slate-300 text-slate-700 mb-1">Routing Rationale:</p>
                <div className="p-3.5 rounded-xl border text-xs font-mono leading-relaxed dark:bg-[#16181f] dark:border-[#262934] dark:text-slate-200 bg-slate-50 border-slate-200 text-slate-800">
                  {activeRoute.routeReason}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
