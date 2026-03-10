"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { NutritionBarChart } from "./components/NutritionBarChart";
import { ALL_PROVINCES_DATA } from "@/data/nutritionData";

export const NutritionIndicatorsView = () => {
  const searchParams = useSearchParams();
  const selectedProvince = searchParams.get("province");

  // Filter based on selected province, or show all provinces
  const filteredData = selectedProvince
    ? ALL_PROVINCES_DATA.filter((d) => d.province === selectedProvince)
    : ALL_PROVINCES_DATA;

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen">
      <div className="w-full">
        <div className="flex flex-col gap-8">
          {/* Main Visualizations List */}
          <div className="w-full flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-[14px] font-black uppercase tracking-[0.25em] text-secondary">
                  Demographic Breakdowns
                </h2>
              </div>

              <div className="space-y-6">
                <NutritionBarChart
                  title="Child Nutrition Status by Province"
                  data={filteredData}
                  keys={[
                    "wasting",
                    "stunting",
                    "childrenWasted",
                    "childAnaemia",
                  ]}
                />

                <NutritionBarChart
                  title="Woman Nutrition Status by Province"
                  data={filteredData}
                  keys={[
                    "womenAnaemia",
                    "birthIron",
                    "pregnancyBirth",
                    "birthPastFive",
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-[14px] font-black uppercase tracking-[0.25em] text-secondary">
                  Social Protection Coverage
                </h2>
              </div>

              <NutritionBarChart
                title="Protection Status by Province"
                data={filteredData}
                keys={["wasting", "stunting", "childrenWasted", "childAnaemia"]}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h2 className="text-[14px] font-black uppercase tracking-[0.25em] text-secondary">
                  BMI & Body Weight Status
                </h2>
              </div>

              <NutritionBarChart
                title="BMI and Weight by Province"
                data={filteredData}
                keys={[
                  "birthWeightLess25",
                  "childOverweight",
                  "childOverweightAge",
                  "womenMildlyThin",
                  "womenModeratelyThin",
                  "womenObese",
                  "womenOverweight",
                  "womenOverweightObese",
                  "womenThin",
                  "womenNormalBMI",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
