"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { NutritionBarChart } from "@/features/NutritionIndicators/components/NutritionBarChart";
import { ALL_PROVINCES_DATA } from "@/data/nutritionData";

export default function NutritionOverviewPage() {
  const searchParams = useSearchParams();
  const selectedProvince = searchParams.get("province");

  // Filter based on selected province, or show all provinces
  const filteredData = selectedProvince
    ? ALL_PROVINCES_DATA.filter((d) => d.province === selectedProvince)
    : ALL_PROVINCES_DATA;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-[14px] font-black uppercase tracking-[0.25em] text-secondary">
            Quick Snapshot
          </h2>
        </div>

        <NutritionBarChart
          title="Overview of Key Indicators by Province"
          data={filteredData}
          keys={["stunting", "wasting", "underweight", "lowBirthWeight"]}
        />
      </div>
    </div>
  );
}
