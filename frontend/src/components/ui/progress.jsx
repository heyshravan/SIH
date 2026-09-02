import React from "react";

export function Progress({ value = 0, className = "", color = "bg-cyan-500" }) {
  return (
    <div className={`w-full bg-slate-800 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      ></div>
    </div>
  );
}
