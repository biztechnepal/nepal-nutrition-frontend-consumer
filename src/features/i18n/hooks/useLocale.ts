import { useTranslation } from "react-i18next";
import { SupportedLocale } from "@/types/i18n.types";

export function useLocale() {
  const { i18n } = useTranslation();

  const locale = (i18n.language as SupportedLocale) || "en";

  const switchLocale = (newLocale: SupportedLocale) => {
    i18n.changeLanguage(newLocale);
    localStorage.setItem("locale", newLocale);
    // TanStack Query auto-refetches because locale is in query keys
  };

  return { locale, switchLocale };
}
