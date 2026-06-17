"use client";

import { Globe } from "lucide-react";
import { useLocale } from "../hooks/useLocale";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const { locale, switchLocale } = useLocale();

  const handleToggle = () => {
    switchLocale(locale === "en" ? "ne" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 text-slate-600 hover:text-secondary hover:bg-slate-50 transition-all font-semibold"
      onClick={handleToggle}
    >
      <Globe className="h-4 w-4" />
      <span className="min-w-[40px] text-left">
        {locale === "en" ? "NE" : "EN"}
      </span>
    </Button>
  );
}
