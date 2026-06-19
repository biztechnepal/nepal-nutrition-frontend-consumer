"use client";

import React from "react";
import { Minus, Plus, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "./accessibility-context";
import { FONT_SIZE_STEPS, PRESET_COLORS } from "./types";

function FontSizeControl() {
  const { settings, increaseFontSize, decreaseFontSize } = useAccessibility();

  const canDecrease = FONT_SIZE_STEPS.indexOf(settings.fontSize as (typeof FONT_SIZE_STEPS)[number]) > 0;
  const canIncrease = FONT_SIZE_STEPS.indexOf(settings.fontSize as (typeof FONT_SIZE_STEPS)[number]) < FONT_SIZE_STEPS.length - 1;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Text Size</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseFontSize}
          disabled={!canDecrease}
          aria-label="Decrease text size"
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-12 text-center text-sm font-semibold tabular-nums">
          {settings.fontSize}%
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={increaseFontSize}
          disabled={!canIncrease}
          aria-label="Increase text size"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

function ColorSwatches() {
  const { settings, setContrastColor } = useAccessibility();

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">Border Color</span>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setContrastColor(color)}
            aria-label={`Select color ${color}`}
            className={cn(
              "size-7 rounded-full border-2 transition-all cursor-pointer",
              settings.contrastColor === color
                ? "border-foreground scale-110"
                : "border-transparent hover:scale-110",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AccessibilitySidebar() {
  const {
    settings,
    toggleHighContrast,
    toggleLinkHighlight,
    toggleImageGrayscale,
    resetSettings,
  } = useAccessibility();

  const isDefault =
    settings.fontSize === 100 &&
    !settings.highContrast &&
    !settings.linkHighlight &&
    !settings.imageGrayscale;

  return (
    <SheetContent side="right" className="w-96 sm:max-w-md" hideClose={settings.highContrast}>
      <SheetHeader>
        <SheetTitle>Accessibility</SheetTitle>
        <SheetDescription>
          Customize your viewing experience
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-6 px-6 py-4">
        <FontSizeControl />

        <Separator />

        <div className="flex flex-col gap-4">
          <ToggleRow
            label="High Contrast"
            checked={settings.highContrast}
            onToggle={toggleHighContrast}
          />
          {settings.highContrast && <ColorSwatches />}
          <ToggleRow
            label="Link Highlight"
            checked={settings.linkHighlight}
            onToggle={toggleLinkHighlight}
          />
          <ToggleRow
            label="Image Grayscale"
            checked={settings.imageGrayscale}
            onToggle={toggleImageGrayscale}
          />
        </div>

        <Separator />

        <Button
          variant="outline"
          size="lg"
          onClick={resetSettings}
          disabled={isDefault}
          className="w-full gap-2"
        >
          <RefreshCcw className="size-4" />
          Reset Settings
        </Button>
      </div>
    </SheetContent>
  );
}
