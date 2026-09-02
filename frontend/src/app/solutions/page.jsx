"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Satellite,
  GitMerge,
  Layers,
  ShieldCheck,
  Building,
  TreePine,
  Waves,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const solutions = [
    {
      title: "ISRO / SAC Cartosat-2S & RISAT Analysis",
      subtitle: "High-Resolution National Satellite Earth Observation",
      description: "Customized for ISRO Space Applications Centre (SAC) imagery, supporting sub-meter optical Cartosat-2S and C-band radar RISAT analysis.",
      icon: Satellite,
      badge: "ISRO SAC Ready",
      link: "/benchmarks",
    },
    {
      title: "Urban Infrastructure & Port Grounding",
      subtitle: "Real-Time Structural & Vessel Tracking",
      description: "Detect commercial port facilities, building footprints, container yards, and maritime vessel bounding coordinates.",
      icon: Building,
      badge: "Spatial Grounding",
      link: "/",
    },
    {
      title: "Bi-Temporal Disaster & Change Detection",
      subtitle: "Pre-vs-Post Disaster Impact Assessment",
      description: "Compare satellite passes across two timestamps (T1 vs T2) to quantify flood extent, infrastructure damage, and urban expansion.",
      icon: GitMerge,
      badge: "CDVQA Specialist",
      link: "/change-detection",
    },
    {
      title: "All-Weather Optical + SAR Fusion",
      subtitle: "Synthetic Aperture Radar Cloud Translucency",
      description: "Fuses Sentinel-1 C-band radar with Sentinel-2 optical bands to penetrate heavy cloud cover, smoke, and nocturnal darkness.",
      icon: Layers,
      badge: "Cross-Attention Fusion",
      link: "/fusion",
    },
  ];

  return (
    <main className="py-12 space-y-12">
      {/* Top Banner Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="indigo" className="mx-auto">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Enterprise & Defense Remote Sensing Solutions
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight dark:text-white text-slate-900">
          Solutions for Satellite Intelligence
        </h1>

        <p className="text-base font-medium dark:text-slate-300 text-slate-600 leading-relaxed">
          Tailored satellite visual reasoning architectures for Earth Observation, ISRO Space Applications Centre, and environmental monitoring.
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {solutions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-6 space-y-4 superhuman-glass">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant="purple">{item.badge}</Badge>
              </div>

              <div>
                <h3 className="text-xl font-extrabold dark:text-white text-slate-900">{item.title}</h3>
                <p className="text-xs font-mono font-semibold text-violet-400 mt-0.5">{item.subtitle}</p>
              </div>

              <p className="text-xs font-medium dark:text-slate-300 text-slate-600 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2">
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Explore Solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
