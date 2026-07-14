"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Minimize2, Maximize2, Keyboard } from "lucide-react";
import type { Landmark } from "./useKeyboardNav";

interface KeyboardNavTooltipProps {
  landmarks: Landmark[];
  minimized: boolean;
  onToggleMinimized: () => void;
}

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

export default function KeyboardNavTooltip({ landmarks, minimized, onToggleMinimized }: KeyboardNavTooltipProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  if (!isMounted) return null;

  const mac = isMac();
  const hasLandmarks = landmarks.length > 0;
  const groupedLabels = landmarks.map((l) => `${l.index}: ${l.label}`).join(" · ");
  const hints = [
    hasLandmarks ? `${mac ? "⌥" : "Alt+"}1-9: ${groupedLabels}` : null,
    "↑↓←→: Within sections",
    mac ? "⌘A: Accessibility panel" : "Alt+A: Accessibility panel",
    "Esc: Dismiss",
  ].filter(Boolean) as string[];

  return createPortal(
    <div
      className="fixed bottom-24 left-4 z-[9999] flex flex-col gap-1 transition-all duration-200"
      role="status"
      aria-live="polite"
    >
      {minimized ? (
        <button
          type="button"
          onClick={onToggleMinimized}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-lg cursor-pointer border"
          style={{
            backgroundColor: "var(--access-contrast-color, #e53935)",
            color: "#fff",
            borderColor: "rgba(255,255,255,0.3)",
          }}
          aria-label="Show keyboard navigation hints"
        >
          <Keyboard className="size-4" />
          <span>KB</span>
          <Maximize2 className="size-3" />
        </button>
      ) : (
        <div
          className="rounded-lg shadow-xl border p-3 min-w-[200px] max-w-[320px]"
          style={{
            backgroundColor: "var(--access-contrast-color, #e53935)",
            color: "#fff",
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Keyboard Navigation
            </span>
            <button
              type="button"
              onClick={onToggleMinimized}
              className="opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Minimize keyboard navigation hints"
            >
              <Minimize2 className="size-3.5" />
            </button>
          </div>
          <ul className="flex flex-col gap-1.5">
            {hints.map((hint) => (
              <li key={hint} className="text-xs leading-relaxed opacity-90">
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>,
    document.body,
  );
}
