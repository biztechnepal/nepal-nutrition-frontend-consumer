"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItem {
  href: string;
  label: string;
}

const MENU_ITEMS: SidebarItem[] = [
  { href: "/nutrition-indicators/overview", label: "Nutrition Overview" },
  {
    href: "/nutrition-indicators/demographic",
    label: "Demographic Breakdowns",
  },
  {
    href: "/nutrition-indicators/social-protection",
    label: "Social Protection",
  },
  { href: "/nutrition-indicators/bmi-weight", label: "BMI & Body Weight" },
];

export const NutritionSidebar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Attached Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-white border-r border-gray-100 h-[calc(100vh-112px)] sticky top-[112px] overflow-y-auto no-scrollbar">
        <div className="flex flex-col py-6">
          <div className="px-6 mb-4">
            <h3 className="text-[11px] font-black text-muted-foreground/60">
              Indicators
            </h3>
          </div>
          <nav className="flex flex-col">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center px-6 py-4 text-[13px] font-bold transition-all duration-300",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-secondary/60 hover:text-primary hover:bg-gray-50/50",
                  )}
                >
                  {/* Active Indicator Bar */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-transform duration-300 origin-left",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />

                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Sticky Tab Bar */}
      <div className="lg:hidden sticky top-[112px] z-40 w-full bg-[#FAFAFA]/80 backdrop-blur-md border-b border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
        <div className="flex overflow-x-auto no-scrollbar py-3 gap-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap px-4 py-2 text-[12px] font-black rounded-full transition-all duration-300",
                  isActive
                    ? "bg-secondary text-white shadow-sm"
                    : "text-secondary/50 hover:text-secondary hover:bg-gray-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
