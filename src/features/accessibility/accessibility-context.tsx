"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { AccessibilitySettings } from "./types";
import { DEFAULT_SETTINGS, FONT_SIZE_STEPS } from "./types";

const STORAGE_KEY = "accessibility-settings";

function applyDataAttributes(settings: AccessibilitySettings) {
  const root = document.documentElement;
  root.setAttribute("data-accessibility-font-size", String(settings.fontSize));
  root.setAttribute("data-accessibility-contrast", String(settings.highContrast));
  root.style.setProperty("--access-contrast-color", settings.contrastColor);
  root.setAttribute("data-accessibility-links", String(settings.linkHighlight));
  root.setAttribute("data-accessibility-grayscale", String(settings.imageGrayscale));
  root.setAttribute("data-accessibility-keyboard-nav", String(settings.keyboardNavigation));
}

function initializeSettings(): AccessibilitySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  setContrastColor: (color: string) => void;
  toggleLinkHighlight: () => void;
  toggleImageGrayscale: () => void;
  toggleKeyboardNavigation: () => void;
  resetSettings: () => void;
  isAccessibilityOpen: boolean;
  setAccessibilityOpen: (open: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(initializeSettings);
  const [isAccessibilityOpen, setAccessibilityOpen] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    applyDataAttributes(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    applyDataAttributes(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setFontSize = useCallback((size: number) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  }, []);

  const increaseFontSize = useCallback(() => {
    setSettings((prev) => {
      const idx = FONT_SIZE_STEPS.indexOf(prev.fontSize as (typeof FONT_SIZE_STEPS)[number]);
      if (idx < FONT_SIZE_STEPS.length - 1) {
        return { ...prev, fontSize: FONT_SIZE_STEPS[idx + 1] };
      }
      return prev;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setSettings((prev) => {
      const idx = FONT_SIZE_STEPS.indexOf(prev.fontSize as (typeof FONT_SIZE_STEPS)[number]);
      if (idx > 0) {
        return { ...prev, fontSize: FONT_SIZE_STEPS[idx - 1] };
      }
      return prev;
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const setContrastColor = useCallback((color: string) => {
    setSettings((prev) => ({ ...prev, contrastColor: color }));
  }, []);

  const toggleLinkHighlight = useCallback(() => {
    setSettings((prev) => ({ ...prev, linkHighlight: !prev.linkHighlight }));
  }, []);

  const toggleImageGrayscale = useCallback(() => {
    setSettings((prev) => ({ ...prev, imageGrayscale: !prev.imageGrayscale }));
  }, []);

  const toggleKeyboardNavigation = useCallback(() => {
    setSettings((prev) => ({ ...prev, keyboardNavigation: !prev.keyboardNavigation }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        toggleHighContrast,
        setContrastColor,
        toggleLinkHighlight,
        toggleImageGrayscale,
        toggleKeyboardNavigation,
        resetSettings,
        isAccessibilityOpen,
        setAccessibilityOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return ctx;
}
