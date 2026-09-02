"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitMerge,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  Eye,
  RefreshCw,
} from "lucide-react";

export default function ChangeDetectionPage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [showMask, setShowMask] = useState(true);
  const [query, setQuery] = useState("What architectural and infrastructure changes occurred between T1 and T2?");
  const [isProcessing, setIsProcessing] = useState(false);

  const scenarioData = {
    title: "Urban Industrial Development — Bi-Temporal Change",
    location: "Kakinada SEZ Zone, Andhra Pradesh",
    t1Date: "March 2024 (T1)",
    t2Date: "August 2026 (T2)",
    t1Image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    t2Image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
    changeSummary:
      "A new industrial warehouse complex (approx. 45,000 sq. m) was constructed in the central sector. Additional paved access roads were paved extending toward the eastern perimeter.",
    confidence: 93.4,
    changeAreaSqKm: "0.48 km²",
    changesDetected: [
      { type: "New Structure", description: "Industrial Facility Complex", location: "Central Sector" },
      { type: "Paved Road", description: "Access Roadway Addition", location: "Eastern Border" },
    ],
  };

  const handleAnalyze = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">
              <GitMerge className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              Phase 9 Bi-Temporal Change Specialist
            </Badge>
            <Badge variant="warning">CDVQA Dataset Standard</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bi-Temporal Satellite Change Analysis
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            Compare satellite imagery captured at two timestamps (T1 vs T2) to detect structural, environmental, or land-use changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMask(!showMask)}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            {showMask ? "Hide Change Mask" : "Highlight Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns: Interactive Dual Image Comparison Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  {scenarioData.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {scenarioData.location} • {scenarioData.t1Date} ➔ {scenarioData.t2Date}
                </CardDescription>
              </div>
              <Badge variant="default">{scenarioData.changeAreaSqKm} Changed</Badge>
            </CardHeader>

            <CardContent className="p-0 relative bg-black aspect-video overflow-hidden group select-none">
              {/* T2 Image (Base Layer) */}
              <img
                src={scenarioData.t2Image}
                alt="T2 After"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* T1 Image (Clipped Layer by Slider) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={scenarioData.t1Image}
                  alt="T1 Before"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute top-3 left-3 bg-slate-950/90 text-cyan-300 text-xs px-2.5 py-1 rounded-lg border border-cyan-500/40 font-mono">
                  BEFORE: {scenarioData.t1Date}
                </div>
              </div>

              {/* T2 Badge Label */}
              <div className="absolute top-3 right-3 bg-slate-950/90 text-indigo-300 text-xs px-2.5 py-1 rounded-lg border border-indigo-500/40 font-mono">
                AFTER: {scenarioData.t2Date}
              </div>

              {/* Highlighted Change Mask Box */}
              {showMask && (
                <div
                  className="absolute border-2 border-dashed border-rose-500 bg-rose-500/20 rounded-lg animate-pulse pointer-events-none"
                  style={{ top: "25%", left: "35%", width: "25%", height: "35%" }}
                >
                  <span className="bg-rose-950 text-rose-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-rose-500/50 absolute -top-5 left-0">
                    Detected Change Zone
                  </span>
                </div>
              )}

              {/* Slider Split Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize shadow-[0_0_10px_#06b6d4]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>
            </CardContent>

            {/* Range Slider Control */}
            <div className="p-4 border-t bg-slate-50 border-slate-200 dark:bg-[#16181f] dark:border-[#22252e] space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>T1 (Before)</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">Swipe Split: {sliderPos}%</span>
                <span>T2 (After)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </Card>
        </div>

        {/* Right 4 Columns: CDVQA Change Specialist Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-indigo-500" />
                  CDVQA Change Query
                </CardTitle>
                <Badge variant="indigo">Bi-Temporal Specialist</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                  Bi-Temporal Question:
                </label>
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-indigo-500 bg-slate-50 border-slate-200 text-slate-900 dark:bg-[#16181f] dark:border-[#262934] dark:text-slate-100"
                />
              </div>

              <Button onClick={handleAnalyze} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Differences...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Detect Changes (CDVQA)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Change Analysis Results */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-200 dark:border-[#22252e]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Change Intelligence Report
                </span>
                <Badge variant="success">{scenarioData.confidence}% Confidence</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Detailed Change Description:</p>
                <p className="text-xs font-medium leading-relaxed p-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-800 dark:bg-[#16181f] dark:border-[#262934] dark:text-slate-200">
                  {scenarioData.changeSummary}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-400 mb-2">Detected Feature Modifications:</p>
                <div className="space-y-2">
                  {scenarioData.changesDetected.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border flex items-center justify-between text-xs bg-slate-50 border-slate-200 text-slate-900 dark:bg-[#16181f] dark:border-[#262934] dark:text-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{item.type}</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{item.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
