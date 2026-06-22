"use client";

import React, { useEffect, useState } from "react";
import { Accessibility, Command } from "lucide-react";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "./accessibility-context";
import AccessibilitySidebar from "./AccessibilitySidebar";

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

export default function AccessibilityFab() {
  const { isAccessibilityOpen, setAccessibilityOpen } = useAccessibility();
  const [shortcutLabel, setShortcutLabel] = useState("Alt+A");

  useEffect(() => {
    setShortcutLabel(isMac() ? "⌘A" : "Alt+A");
  }, []);

  return (
    <Sheet open={isAccessibilityOpen} onOpenChange={setAccessibilityOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="xl"
          className="fixed bottom-6 right-6 z-[100] size-14 rounded-full shadow-lg"
          aria-label={`Open accessibility settings (${shortcutLabel})`}
        >
          <Accessibility className="size-6" />
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
