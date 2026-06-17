"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Menu, ChevronDown, CalendarDays, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PROVINCE_COLORS } from "@/constants/provinces";
import { useTranslation } from "react-i18next";
import { LocaleSwitcher } from "@/features/i18n/components/LocaleSwitcher";

const YEARS = ["2026", "2025", "2024", "2023", "2022"];
const PROVINCES = Object.keys(PROVINCE_COLORS);

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation("header");

  const currentYear = searchParams.get("year") || "2026";
  const currentProvince = searchParams.get("province") || null;

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("nutritionIndicators"), href: "/nutrition-indicators" },
    { name: t("contactUs"), href: "/contact" },
  ];

  return (
    <header className="w-full py-2">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-7 h-7 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/emblem-of-nepal-seeklogo.svg"
              alt="Emblem of Nepal"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-black tracking-tight text-secondary">
            <span className="hidden sm:inline">
              {t("appName")}
            </span>
            <span className="sm:hidden">{t("appNameShort")}</span>
          </span>
        </Link>

        {/* Filter Dropdowns + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Year Filter */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 bg-white shrink-0 border-border/60 hover:bg-muted/50 transition-colors"
              >
                <CalendarDays size={14} className="text-primary" />
                <span className="font-bold text-secondary">{currentYear}</span>
                <ChevronDown size={14} className="text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">
                {t("selectYear")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {YEARS.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => updateQueryParams("year", year)}
                  className="flex items-center justify-between"
                >
                  <span
                    className={
                      currentYear === year ? "font-bold text-primary" : ""
                    }
                  >
                    {year}
                  </span>
                  {currentYear === year && (
                    <Check size={14} className="text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Province Filter */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 bg-white shrink-0 border-border/60 hover:bg-muted/50 transition-colors"
              >
                <MapPin
                  size={14}
                  className={
                    currentProvince ? "text-primary" : "text-muted-foreground"
                  }
                />
                <span className="font-bold text-secondary">
                  {currentProvince ? currentProvince : t("province")}
                </span>
                <ChevronDown size={14} className="text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 max-h-[300px] overflow-y-auto"
            >
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">
                {t("selectProvince")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateQueryParams("province", null)}
                className="flex items-center justify-between"
              >
                <span
                  className={!currentProvince ? "font-bold text-primary" : ""}
                >
                  {t("allProvinces")}
                </span>
                {!currentProvince && (
                  <Check size={14} className="text-primary" />
                )}
              </DropdownMenuItem>
              {PROVINCES.map((prov) => (
                <DropdownMenuItem
                  key={prov}
                  onClick={() => updateQueryParams("province", prov)}
                  className="flex items-center justify-between"
                >
                  <span
                    className={
                      currentProvince === prov ? "font-bold text-primary" : ""
                    }
                  >
                    {prov}
                  </span>
                  {currentProvince === prov && (
                    <Check size={14} className="text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <LocaleSwitcher />

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-sm p-0 border-l-border/40"
              >
                <SheetTitle className="sr-only">{t("navigationMenu")}</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Drawer Header */}
                  <div className="px-8 pt-10 pb-6 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="relative w-6 h-6">
                        <Image
                          src="/images/emblem-of-nepal-seeklogo.svg"
                          alt="Emblem of Nepal"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-lg font-bold tracking-tight text-secondary leading-tight mt-1">
                        {t("appNameShort")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mt-2">
                      {t("tagline")}
                    </p>
                  </div>

                  {/* Drawer Links */}
                  <div className="grow overflow-y-auto px-4 py-8">
                    <nav className="flex flex-col space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            "px-4 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-between group",
                            pathname === link.href
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          {link.name}
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                              pathname === link.href
                                ? "bg-primary text-white"
                                : "bg-muted group-hover:bg-primary/20 group-hover:text-primary",
                            )}
                          >
                            <span className="text-xl">→</span>
                          </div>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
