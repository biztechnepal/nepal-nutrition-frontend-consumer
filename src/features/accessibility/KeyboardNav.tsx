"use client";

import React from "react";
import { useAccessibility } from "./accessibility-context";
import { useKeyboardNav } from "./useKeyboardNav";
import KeyboardNavOverlay from "./KeyboardNavOverlay";
import KeyboardNavTooltip from "./KeyboardNavTooltip";

export default function KeyboardNav() {
  const { settings, setAccessibilityOpen } = useAccessibility();

  const { landmarks, tooltipMinimized, setTooltipMinimized } = useKeyboardNav(
    settings.keyboardNavigation,
    () => setAccessibilityOpen(true),
  );

  if (!settings.keyboardNavigation) return null;

  return (
    <>
      <KeyboardNavOverlay landmarks={landmarks} />
      <KeyboardNavTooltip
        landmarks={landmarks}
        minimized={tooltipMinimized}
        onToggleMinimized={() => setTooltipMinimized(!tooltipMinimized)}
      />
    </>
  );
}
