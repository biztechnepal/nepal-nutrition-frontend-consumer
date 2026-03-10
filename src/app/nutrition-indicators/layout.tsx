import React, { Suspense } from "react";
import { NutritionSidebar } from "@/features/NutritionIndicators/components/NutritionSidebar";

export default function NutritionIndicatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-[calc(100vh-112px)]">
      <div className="w-full flex flex-col lg:flex-row">
        <NutritionSidebar />
        <main className="flex-1 flex flex-col min-w-0 py-10 px-4 sm:px-6 lg:px-12">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
