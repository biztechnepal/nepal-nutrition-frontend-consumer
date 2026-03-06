"use client";

import React from "react";
import NepalMap from "@/components/d3/NepalMap";
import { DistrictSidebar } from "./components/DistrictSidebar";
import { ProvinceTable } from "./components/ProvinceTable";
import { IndicatorCard } from "./components/IndicatorCard";
import { DashboardHeader } from "./components/DashboardHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Baby, Accessibility, User2, Milk, Info } from "lucide-react";
import { useState } from "react";

export const DashboardView = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pt-20 pb-12 overflow-y-auto">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col gap-6">
        <DashboardHeader />

        {/* 1. Hero Visualization Row: Overview, Map, and Selectors */}
        <div className="grid grid-cols-12 gap-8 items-stretch h-full lg:max-h-[480px]">
          {/* Strategic Overview */}
          <div className="col-span-12 lg:col-span-3 h-full lg:max-h-[480px]">
            <Card className="h-full bg-white border-border/40 shadow-xl rounded-2xl flex flex-col border-t-2 border-t-primary">
              <CardHeader className="border-b border-border/50 flex flex-row items-center bg-muted/5 space-y-0 text-left">
                <Info size={14} className="text-primary" />
                <CardTitle className="text-[10px] font-black text-secondary uppercase tracking-widest">
                  Strategic Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto p-0">
                <div className="p-5 text-[11px] leading-7 text-foreground/70 font-medium text-justify space-y-4">
                  <p>
                    Nepal is actively addressing the persistent malnutrition
                    challenges through the implementation of the{" "}
                    <span className="text-secondary font-bold text-[13px]">
                      MSNP III
                    </span>
                    . This third iteration represents a sophisticated,
                    data-driven approach.
                  </p>
                  <p>
                    The goal is to attain optimal nutritional status for all
                    citizens by 2030, aligning with Global Sustainable
                    Development Goals. The plan focuses on increasing financial
                    investment and fostering cross-sectoral research.
                  </p>
                  <p>
                    Strategic efforts focus on diversifying food production with
                    nutrient-rich options and promoting climate-smart
                    technologies. By empowering local health volunteers, Nepal
                    aims to break the intergenerational cycle of malnutrition.
                  </p>
                  <div className="bg-secondary/5 rounded-xl border border-secondary/10 mt-2 p-2">
                    <span className="block text-[10px] font-black text-secondary uppercase mb-2 tracking-wider">
                      Targets for 2030
                    </span>
                    <ul className="list-disc list-inside space-y-2 text-[10px] font-bold">
                      <li className="text-secondary/80">
                        Reduce Stunting to 15%
                      </li>
                      <li className="text-secondary/80">
                        Reduce Wasting to &lt; 4%
                      </li>
                      <li className="text-secondary/80">
                        Universal Access to Iron-Folate
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nepal Map Centerpiece */}
          <div className="col-span-12 lg:col-span-6 h-full lg:max-h-[480px]">
            <Card className="h-full bg-white border border-border/20 rounded-lg p-2 flex items-center justify-center relative shadow-inner">
              <div className="w-full h-full relative z-10 flex items-center justify-center min-h-[300px]">
                <NepalMap
                  selectedProvince={selectedProvince}
                  onReset={() => setSelectedProvince(null)}
                />
              </div>
            </Card>
          </div>

          {/* Right Side Selectors Explorer - Side by Side */}
          <div className="col-span-12 lg:col-span-3 grid grid-cols-2 gap-2 h-full lg:max-h-[480px]">
            <div className="h-full min-h-0">
              <DistrictSidebar />
            </div>
            <div className="h-full min-h-0">
              <ProvinceTable
                selectedProvince={selectedProvince}
                onProvinceClick={setSelectedProvince}
              />
            </div>
          </div>
        </div>

        {/* 2. Key Performance Indicators Section */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <IndicatorCard
              title="Stunting"
              value="24.5"
              status="error"
              icon={<Baby size={16} />}
            />
            <IndicatorCard
              title="Wasting"
              value="8.1"
              secondaryLabel="Mod. cases"
              secondaryValue="2.1"
              status="success"
              icon={<Accessibility size={16} />}
            />
            <IndicatorCard
              title="Children Anemia"
              value="43.2"
              status="warning"
              icon={<Baby size={16} />}
            />
            <IndicatorCard
              title="Women Anemia"
              value="34.2"
              status="error"
              icon={<User2 size={16} />}
            />
            <IndicatorCard
              title="BreastFeeding"
              value="62.1"
              status="success"
              icon={<Milk size={16} />}
            />
          </div>
        </div>

        {/* 3. System Footer Area */}
        <div className="w-full flex flex-col items-center gap-4 pt-12 pb-8 border-t border-dashed border-border/60">
          <div className="flex gap-6 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-secondary/30 animate-pulse delay-75" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-pulse delay-150" />
          </div>
          <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
            MSNP III Progressive Visualization System &bull; Active Data Feed
          </p>
        </div>
      </div>
    </div>
  );
};
