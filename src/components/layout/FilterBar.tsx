"use client";

import React, { useTransition } from "react";
import {
  ChevronDown,
  Filter,
  CalendarDays,
  MapPin,
  Activity,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PROVINCE_COLORS } from "@/constants/provinces";

const YEARS = ["2026", "2025", "2024", "2023", "2022"];
const PROVINCES = Object.keys(PROVINCE_COLORS);

export const FilterBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className="w-full border-b border-border/60 sticky top-[44px] z-40 shadow-sm backdrop-blur-md bg-background/80 mt-[52px]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: INIMS Full Form */}
        <div className="flex items-center gap-2 text-sm text-left">
          <div className="text-primary font-black">
            <span className="tracking-tight text-[13px]">
              Integrated Nutrition Information Management System
            </span>
          </div>
          {isPending && (
            <div className="ml-2 w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          )}
        </div>

        {/* Right Side: Action Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 border-r border-border/50 pr-3 shrink-0">
            <Filter size={14} className="text-muted-foreground" />
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Filters
            </span>
          </div>

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
                Select Year
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
                  {currentProvince ? currentProvince : "Province"}
                </span>
                <ChevronDown size={14} className="text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 max-h-[300px] overflow-y-auto"
            >
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">
                Select Province
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateQueryParams("province", null)}
                className="flex items-center justify-between"
              >
                <span
                  className={!currentProvince ? "font-bold text-primary" : ""}
                >
                  All Provinces
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
        </div>
      </div>
    </div>
  );
};
