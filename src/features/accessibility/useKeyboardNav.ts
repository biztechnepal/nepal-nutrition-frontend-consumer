"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface Landmark {
  index: number;
  element: HTMLElement;
  label: string;
}

const LANDMARK_SELECTORS = [
  'nav[aria-label], nav:not([aria-label])',
  'main, [role="main"]',
  'aside, [role="complementary"]',
  'footer, [role="contentinfo"]',
  'header, [role="banner"]',
  'section[aria-label], section[aria-labelledby]',
  'form[aria-label], form[aria-labelledby]',
  '[role="search"]',
];

function getLabel(el: HTMLElement): string {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria;
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const labelEl = document.getElementById(labelledby);
    if (labelEl) return labelEl.textContent?.trim() || labelTag(el);
  }
  return labelTag(el);
}

function labelTag(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const labels: Record<string, string> = {
    nav: "Navigation",
    main: "Main Content",
    aside: "Sidebar",
    footer: "Footer",
    header: "Header",
    section: "Section",
    form: "Form",
  };
  return labels[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
}

function scanLandmarks(): Landmark[] {
  const seen = new Set<HTMLElement>();
  const landmarks: Landmark[] = [];
  let index = 0;

  for (const selector of LANDMARK_SELECTORS) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    for (const el of elements) {
      if (seen.has(el) || index >= 9) continue;
      seen.add(el);
      landmarks.push({ index: index + 1, element: el, label: getLabel(el) });
      index++;
    }
  }

  return landmarks;
}

function getFocusableElements(parent: HTMLElement): HTMLElement[] {
  return Array.from(
    parent.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => {
    if (el instanceof HTMLInputElement && el.type === "hidden") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

function findNavigationGroup(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    if (["nav", "main", "aside", "footer", "header", "section", "article", "form"].includes(tag)) return current;
    const role = current.getAttribute("role");
    if (["navigation", "main", "complementary", "contentinfo", "banner", "region", "search", "form"].includes(role || "")) return current;
    current = current.parentElement;
  }
  const parent = el.parentElement;
  if (parent && parent !== document.body) return parent;
  return null;
}

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

const NAV_TOOLTIP_KEY = "keyboard-nav-tooltip-minimized";

function getTooltipMinimized(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(NAV_TOOLTIP_KEY) === "true";
  } catch {
    return false;
  }
}

function setTooltipMinimized(minimized: boolean) {
  try {
    localStorage.setItem(NAV_TOOLTIP_KEY, minimized ? "true" : "false");
  } catch {}
}

type FocusedLandmark = { index: number; label: string; element: HTMLElement } | null;

interface UseKeyboardNavResult {
  landmarks: Landmark[];
  focusedLandmark: FocusedLandmark;
  tooltipMinimized: boolean;
  setTooltipMinimized: (v: boolean) => void;
}

export function useKeyboardNav(
  enabled: boolean,
  onOpenAccessibility: () => void,
): UseKeyboardNavResult {
  const landmarksRef = useRef<Landmark[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [focusedLandmark, setFocusedLandmark] = useState<FocusedLandmark>(null);
  const [tooltipMinimized, setTooltipMin] = useState(getTooltipMinimized);
  const activeLandmarkIndex = useRef<number>(-1);

  const scan = useCallback(() => {
    const found = scanLandmarks();
    landmarksRef.current = found;
    setLandmarks(found);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setFocusedLandmark(null);
      activeLandmarkIndex.current = -1;
      return;
    }
    scan();
  }, [enabled, scan]);

  useEffect(() => {
    if (!enabled) return;

    let scrollTimer: ReturnType<typeof setTimeout>;
    function onScroll() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(scan, 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scan);

    const observer = new MutationObserver(() => {
      scan();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scan);
      observer.disconnect();
      clearTimeout(scrollTimer);
    };
  }, [enabled, scan]);

  useEffect(() => {
    function handleAltA(e: KeyboardEvent) {
      if (e.code === "KeyA" && (e.altKey || (isMac() && e.metaKey))) {
        e.preventDefault();
        onOpenAccessibility();
      }
    }
    window.addEventListener("keydown", handleAltA);
    return () => window.removeEventListener("keydown", handleAltA);
  }, [onOpenAccessibility]);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey) {
        const match = e.code.match(/^Digit([1-9])$/);
        if (!match) return;
        e.preventDefault();
        const num = parseInt(match[1], 10);
        const landmark = landmarksRef.current.find((l) => l.index === num);
        if (landmark) {
          const firstFocusable = getFocusableElements(landmark.element)[0];
          if (firstFocusable) {
            firstFocusable.focus();
            setFocusedLandmark({ index: landmark.index, label: landmark.label, element: landmark.element });
            activeLandmarkIndex.current = landmark.index;
          }
        }
        return;
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const target = document.activeElement as HTMLElement | null;
        if (!target || target === document.body) return;

        const group = findNavigationGroup(target);
        if (!group) return;

        const focusable = getFocusableElements(group);
        const currentIdx = focusable.indexOf(target);
        if (currentIdx === -1) return;

        let nextIdx = currentIdx;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          nextIdx = currentIdx + 1;
        } else {
          nextIdx = currentIdx - 1;
        }

        if (nextIdx >= 0 && nextIdx < focusable.length) {
          e.preventDefault();
          focusable[nextIdx].focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onOpenAccessibility]);

  const handleSetTooltipMinimized = useCallback((v: boolean) => {
    setTooltipMin(v);
    setTooltipMinimized(v);
  }, [setTooltipMin]);

  return { landmarks, focusedLandmark, tooltipMinimized, setTooltipMinimized: handleSetTooltipMinimized };

}
