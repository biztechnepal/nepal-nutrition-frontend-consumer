import React, { Suspense } from "react";
import { NutritionIndicatorsView } from "@/features/NutritionIndicators/NutritionIndicatorsView";

export default function NutritionIndicatorsPage() {
  return (
    <Suspense fallback={null}>
      <NutritionIndicatorsView />
    </Suspense>
  );
}
