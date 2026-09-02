import React from "react";

export function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

  const variants = {
    default:
      "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 rounded-xl",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 rounded-xl",
    outline:
      "border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 rounded-xl",
    ghost:
      "hover:bg-slate-800/80 text-slate-300 hover:text-white rounded-xl",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl shadow-lg shadow-rose-500/20",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0 rounded-xl",
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.default} ${
    sizes[size] || sizes.default
  } ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
