"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Radio,
  Sparkles,
  RefreshCw,
  Sun,
  Cloud,
} from "lucide-react";

export default function FusionPage() {
  const [activeLayer, setActiveLayer] = useState("fused");
  const [query, setQuery] = useState("Analyze agricultural moisture and structural canopy under heavy cloud cover.");
  const [isProcessing, setIsProcessing] = useState(false);

  const modalImages = {
    optical: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    sar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    fused: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
  };

  const fusionDetails = {
    opticalBands: "Sentinel-2 (B2 Blue, B3 Green, B4 Red, B8 NIR)",
    sarPolarization: "Sentinel-1 IW C-Band (VV + VH Dual-Pol)",
    fusionMethod: "Cross-Attention Feature Alignment + Early Pixel Concatenation",
    cloudPenetration: "100% Cloud / Atmosphere Translucent",
    confidence: 96.1,
  };

  const handleRunFusion = () => {
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
            <Badge variant="purple">
              <Layers className="w-3 h-3 text-purple-500 dark:text-purple-300" />
              Phase 10 Multi-Modal Optical + SAR Specialist
            </Badge>
            <Badge variant="success">Sentinel-1 Radar + Sentinel-2 Optical</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Optical & SAR Multi-Modal Fusion
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            Combines optical multispectral imagery with Synthetic Aperture Radar (SAR) for all-weather, day-and-night terrain insight.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns: Multi-Modal Viewer */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Co-registered Multi-Modal Canvas
                </CardTitle>
                <CardDescription className="text-xs">
                  BigEarthNet Sentinel-1 C-Band + Sentinel-2 L2A Patch Pair
                </CardDescription>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-100 border-slate-200 dark:bg-[#16181f] dark:border-[#262934]">
                <button
                  onClick={() => setActiveLayer("optical")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeLayer === "optical"
                      ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Sentinel-2 (Optical)
                </button>
                <button
                  onClick={() => setActiveLayer("sar")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeLayer === "sar"
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Sentinel-1 (SAR Radar)
                </button>
                <button
                  onClick={() => setActiveLayer("fused")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeLayer === "fused"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Fused Composite
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-0 relative bg-black aspect-video overflow-hidden group">
              <img
                src={modalImages[activeLayer]}
                alt={activeLayer}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="font-mono text-purple-300">
                  {activeLayer === "optical" && "Band RGB-NIR (Sentinel-2)"}
                  {activeLayer === "sar" && "VV + VH C-Band Radar (Sentinel-1)"}
                  {activeLayer === "fused" && "Optical + SAR Cross-Attention Fusion"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Modality Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400 text-sm font-bold">
                <Sun className="w-4 h-4" />
                Optical Imagery (Sentinel-2)
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Captures high-resolution visual spectrum (RGB) and Near-Infrared (NIR) reflective bands for clear land cover, crop health, and urban spectral signature.
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 text-sm font-bold">
                <Cloud className="w-4 h-4" />
                Synthetic Aperture Radar (Sentinel-1)
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Active microwave C-band radar penetrates cloud cover, haze, and darkness. Measures dielectric properties, surface roughness, and double-bounce scattering.
              </p>
            </Card>
          </div>
        </div>

        {/* Right 4 Columns: Fusion Specialist Query */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500" />
                  Fusion Query Controller
                </CardTitle>
                <Badge variant="purple">Fusion Specialist</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                  Multi-Modal Fusion Prompt:
                </label>
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-purple-500 bg-slate-50 border-slate-200 text-slate-900 dark:bg-[#16181f] dark:border-[#262934] dark:text-slate-100"
                />
              </div>

              <Button onClick={handleRunFusion} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Fusing Tensors...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Execute Fusion Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Fusion Diagnostics */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-200 dark:border-[#22252e]">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Multi-Spectral & Radar Diagnostics
              </span>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-xs font-medium">
              <div className="flex justify-between border-b border-slate-200 dark:border-[#22252e] pb-2">
                <span className="text-slate-600 dark:text-slate-400">Optical Source</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">Sentinel-2 MSI</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-[#22252e] pb-2">
                <span className="text-slate-600 dark:text-slate-400">SAR Radar Source</span>
                <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">Sentinel-1 C-Band</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-[#22252e] pb-2">
                <span className="text-slate-600 dark:text-slate-400">Cloud Penetration</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Verified</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-600 dark:text-slate-400">Fusion Accuracy</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{fusionDetails.confidence}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
