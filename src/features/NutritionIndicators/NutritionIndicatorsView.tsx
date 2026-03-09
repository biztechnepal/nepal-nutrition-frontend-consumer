"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { IndicatorDetailHeader } from "./components/IndicatorDetailHeader";
import { NutritionBarChart } from "./components/NutritionBarChart";

const CHILD_NUTRITION_DATA = [
  {
    province: "Koshi",
    wasted: 8,
    stunted: 45,
    childrenWasted: 15,
    anaemia: 55,
  },
  {
    province: "Madhesh",
    wasted: 6,
    stunted: 38,
    childrenWasted: 12,
    anaemia: 58,
  },
  {
    province: "Bagmati",
    wasted: 5,
    stunted: 28,
    childrenWasted: 10,
    anaemia: 52,
  },
  {
    province: "Gandaki",
    wasted: 9,
    stunted: 42,
    childrenWasted: 18,
    anaemia: 56,
  },
  {
    province: "Lumbini",
    wasted: 7,
    stunted: 35,
    childrenWasted: 14,
    anaemia: 54,
  },
  {
    province: "Karnali",
    wasted: 4,
    stunted: 25,
    childrenWasted: 8,
    anaemia: 50,
  },
  {
    province: "Sudurpashchim",
    wasted: 6,
    stunted: 30,
    childrenWasted: 11,
    anaemia: 53,
  },
];

const WOMAN_NUTRITION_DATA = [
  {
    province: "Koshi",
    anaemia: 65,
    birthIron: 52,
    pregnancyBirth: 15,
    birthPastFive: 48,
  },
  {
    province: "Madhesh",
    anaemia: 58,
    birthIron: 48,
    pregnancyBirth: 12,
    birthPastFive: 42,
  },
  {
    province: "Bagmati",
    anaemia: 62,
    birthIron: 55,
    pregnancyBirth: 18,
    birthPastFive: 50,
  },
  {
    province: "Gandaki",
    anaemia: 60,
    birthIron: 50,
    pregnancyBirth: 14,
    birthPastFive: 45,
  },
  {
    province: "Lumbini",
    anaemia: 55,
    birthIron: 45,
    pregnancyBirth: 10,
    birthPastFive: 40,
  },
  {
    province: "Karnali",
    anaemia: 68,
    birthIron: 58,
    pregnancyBirth: 20,
    birthPastFive: 52,
  },
  {
    province: "Sudurpashchim",
    anaemia: 63,
    birthIron: 53,
    pregnancyBirth: 17,
    birthPastFive: 49,
  },
];

export const NutritionIndicatorsView = () => {
  const searchParams = useSearchParams();
  const selectedProvince = searchParams.get("province");

  const filteredChildData = selectedProvince
    ? CHILD_NUTRITION_DATA.filter((d) => d.province === selectedProvince)
    : CHILD_NUTRITION_DATA;

  const filteredWomanData = selectedProvince
    ? WOMAN_NUTRITION_DATA.filter((d) => d.province === selectedProvince)
    : WOMAN_NUTRITION_DATA;

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8">
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
                  data={filteredChildData}
                  keys={["wasted", "stunted", "childrenWasted", "anaemia"]}
                />

                <NutritionBarChart
                  title="Woman Nutrition Status by Province"
                  data={filteredWomanData}
                  keys={[
                    "anaemia",
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
                data={filteredChildData}
                keys={["wasted", "stunted", "childrenWasted", "anaemia"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
