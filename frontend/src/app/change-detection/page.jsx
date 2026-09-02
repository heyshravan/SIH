"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangeDetectionPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect /change-detection to /chat
    router.replace("/chat");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070810] text-slate-100 flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-12 h-12 rounded-full bg-violet-600/30 text-violet-400 border border-violet-500/40 flex items-center justify-center mx-auto animate-pulse">
          🔄
        </div>
        <h2 className="text-xl font-bold">Redirecting to SatQuery AI Chat...</h2>
        <p className="text-xs text-slate-400">
          Change Detection is integrated as a native add-on feature directly inside SatQuery AI Chat.
        </p>
      </div>
    </div>
  );
}
