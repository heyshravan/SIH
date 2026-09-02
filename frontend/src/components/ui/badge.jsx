import React from "react";

export function Badge({ className = "", variant = "default", children, ...props }) {
  const base = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-all";

  const variants = {
    default: "bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm",
    success: "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm",
    warning: "bg-amber-950/80 text-amber-300 border border-amber-800/60 shadow-sm",
    indigo: "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 shadow-sm",
    purple: "bg-purple-950/80 text-purple-300 border border-purple-800/60 shadow-sm",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700",
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
}
