export type SupportedLocale = "en" | "ne";
export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "ne"] as const;
export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  ne: "नेपाली",
};
export interface LocalizedField {
  en: string;
  ne: string;
}
