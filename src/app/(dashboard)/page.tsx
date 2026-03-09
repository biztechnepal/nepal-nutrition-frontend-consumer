import React, { Suspense } from "react";
import { DashboardView } from "@/features/Dashboard/DashboardView";

export const metadata = {
  title: "Dashboard | Nepal Nutrition",
  description:
    "Comprehensive nutrition data visualizations for Nepal provinces.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardView />
    </Suspense>
  );
}
