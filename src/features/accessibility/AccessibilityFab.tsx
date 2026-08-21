"use client";

import React, { useState } from "react";
import { Command } from "lucide-react";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "./accessibility-context";
import AccessibilitySidebar from "./AccessibilitySidebar";

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

function PersonArmsSpreadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </svg>
  );
}

export default function AccessibilityFab() {
  const { isAccessibilityOpen, setAccessibilityOpen } = useAccessibility();
  const [shortcutLabel] = useState(() => (isMac() ? "⌘A" : "Alt+A"));

  return (
    <Sheet open={isAccessibilityOpen} onOpenChange={setAccessibilityOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="xl"
          className="fixed bottom-6 right-6 z-[100] size-14 rounded-full shadow-lg"
          aria-label={`Open accessibility settings (${shortcutLabel})`}
        >
          <PersonArmsSpreadIcon className="size-7" />
          <span
            className="absolute -top-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-md pointer-events-none"
            style={{
              backgroundColor: "var(--access-contrast-color, #e53935)",
              color: "#fff",
            }}
          >
            <Command className="size-2.5" />
            <span>A</span>
          </span>
        </Button>
      </SheetTrigger>
      <AccessibilitySidebar />
    </Sheet>
  );
}
