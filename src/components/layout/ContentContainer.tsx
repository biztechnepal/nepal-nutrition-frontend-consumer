"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ContentContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNutritionPage = pathname.startsWith("/nutrition-indicators");

  return (
    <main
      className={cn("w-full", isNutritionPage ? "p-0" : "p-4 sm:p-6 lg:p-8")}
    >
      {children}
    </main>
  );
}
