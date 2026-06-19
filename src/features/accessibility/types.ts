export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  contrastColor: string;
  linkHighlight: boolean;
  imageGrayscale: boolean;
}

export const FONT_SIZE_STEPS = [75, 100, 125, 150, 175, 200] as const;
export type FontSizeStep = (typeof FONT_SIZE_STEPS)[number];

export const PRESET_COLORS = [
  "#e53935",
  "#fb8c00",
  "#fdd835",
  "#43a047",
  "#1e88e5",
  "#3949ab",
  "#8e24aa",
  "#d81b60",
  "#00acc1",
  "#000000",
  "#ffffff",
  "#f4511e",
] as const;

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  contrastColor: "#e53935",
  linkHighlight: false,
  imageGrayscale: false,
};
