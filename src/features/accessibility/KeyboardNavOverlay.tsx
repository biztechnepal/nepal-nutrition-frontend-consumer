"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import type { Landmark } from "./useKeyboardNav";

interface BadgePosition {
  index: number;
  label: string;
  top: number;
  left: number;
}

interface KeyboardNavOverlayProps {
  landmarks: Landmark[];
}

export default function KeyboardNavOverlay({ landmarks }: KeyboardNavOverlayProps) {
  const [positions, setPositions] = useState<BadgePosition[]>([]);
  const rafRef = useRef(0);

  const updatePositions = useCallback(() => {
    const next: BadgePosition[] = [];
    for (const l of landmarks) {
      const rect = l.element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      next.push({
        index: l.index,
        label: l.label,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setPositions(next);
  }, [landmarks]);

  const handleViewportChange = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updatePositions);
  }, [updatePositions]);

  useEffect(() => {
    updatePositions();
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);
    return () => {
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleViewportChange]);

  if (positions.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {positions.map((p) => (
        <div
          key={p.index}
          className="absolute flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold shadow-lg"
          style={{
            top: p.top - 28,
            left: p.left + 4,
            backgroundColor: "var(--access-contrast-color, #e53935)",
            color: "#fff",
          }}
        >
          <span className="flex items-center justify-center size-5 rounded-full bg-white/30 text-[11px] font-bold">
            {p.index}
          </span>
          <span className="whitespace-nowrap">{p.label}</span>
        </div>
      ))}
    </div>,
    document.body,
  );
}
