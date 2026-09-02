import React from "react";

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 border dark:bg-[#16182a]/90 dark:border-violet-500/20 dark:text-slate-100 bg-white border-slate-200 text-slate-900 shadow-xl dark:shadow-indigo-950/50 shadow-slate-200/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }) {
  return (
    <div className={`p-6 border-b dark:border-white/10 border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3 className={`text-xl font-extrabold tracking-tight dark:text-white text-slate-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }) {
  return (
    <p className={`text-sm font-semibold dark:text-slate-300 text-slate-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }) {
  return (
    <div className={`p-6 border-t dark:border-white/10 border-slate-100 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
