"use client";

import { IndicatorCard } from "./components/IndicatorCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Info,
  Baby,
  Accessibility,
  Scale,
  User2,
  Activity,
  Droplets,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import NepalMap from "@/components/d3/NepalMap";
import { ProvinceTable } from "./components/ProvinceTable";
import { NUTRITION_DATA } from "@/data/nutritionData";

export const DashboardView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedProvince = searchParams.get("province");
  const data = selectedProvince
    ? NUTRITION_DATA[selectedProvince]
    : NUTRITION_DATA.National;

  const handleProvinceClick = (province: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (province) {
      params.set("province", province);
    } else {
      params.delete("province");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("province");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen">
      <div className="w-full flex flex-col gap-8">
        {/* 1. Hero Visualization Row: Map, Overview, and Selectors */}
        <div className="grid grid-cols-12 gap-6 items-stretch h-full lg:max-h-[560px]">
          {/* Strategic Overview */}
          <div className="col-span-12 lg:col-span-3 h-full lg:max-h-[560px]">
            <Card className="h-full bg-white border-border/40 shadow-xl rounded-2xl flex flex-col border-t-2 border-t-primary">
              <CardHeader className="border-b border-border/50 flex flex-row items-center bg-muted/5 space-y-0 text-left">
                <Info size={14} className="text-primary" />
                <CardTitle className="text-[10px] font-black text-secondary uppercase tracking-widest ml-2">
                  Strategic Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto p-0 grow">
                <div className="p-5 text-[11px] leading-7 text-foreground/70 font-medium text-justify space-y-4">
                  <p>
                    Nepal is actively addressing the persistent malnutrition
                    challenges through the implementation of the{" "}
                    <span className="text-secondary font-bold text-[13px]">
                      MSNP III
                    </span>
                    .{" "}
                    {selectedProvince
                      ? `Showing deep-dive analysis for ${selectedProvince}.`
                      : "Overviewing national benchmarks and strategic targets."}
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
                  <div className="bg-secondary/5 rounded-xl border border-secondary/10 mt-2 p-3">
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
          <div className="col-span-12 lg:col-span-6 h-full lg:max-h-[560px]">
            <Card className="h-full bg-white border border-border/20 rounded-2xl p-2 flex items-center justify-center relative shadow-inner">
              <div className="w-full h-full relative z-10 flex items-center justify-center min-h-[300px]">
                <NepalMap
                  selectedProvince={selectedProvince}
                  onReset={handleReset}
                />
              </div>
            </Card>
          </div>

          {/* Right Side Selectors Explorer */}
          <div className="col-span-12 lg:col-span-3 h-fit lg:max-h-[560px]">
            <div className="h-fit min-h-0 text-left">
              <ProvinceTable
                selectedProvince={selectedProvince}
                onProvinceClick={handleProvinceClick}
              />
            </div>
          </div>
        </div>

        {/* 2. Key Performance Indicators Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-[14px] font-black uppercase tracking-[0.25em] text-secondary">
              Impact Indicators Overview - {selectedProvince || "National"}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <IndicatorCard
              title="Stunting"
              subtitle="Children < 5y • SDG 2.2.1"
              value={data.stunting.toString()}
              target="15"
              status={
                data.stunting > 25
                  ? "error"
                  : data.stunting > 15
                    ? "warning"
                    : "success"
              }
              icon={<Baby size={16} />}
            />
            <IndicatorCard
              title="Wasting"
              subtitle="Children < 5y • SDG 2.2.2"
              value={data.wasting.toString()}
              target="4"
              status={
                data.wasting > 7
                  ? "error"
                  : data.wasting > 4
                    ? "warning"
                    : "success"
              }
              icon={<Accessibility size={16} />}
            />
            <IndicatorCard
              title="Low Birth Weight"
              subtitle="Newborn Health Indicator"
              value={data.lowBirthWeight.toString()}
              target="8"
              status={
                data.lowBirthWeight > 12
                  ? "error"
                  : data.lowBirthWeight > 8
                    ? "warning"
                    : "success"
              }
              icon={<Baby size={16} />}
            />
            <IndicatorCard
              title="Underweight"
              subtitle="Children < 5y • SDG 2.2.2.1"
              value={data.underweight.toString()}
              target="10"
              status={
                data.underweight > 18
                  ? "error"
                  : data.underweight > 10
                    ? "warning"
                    : "success"
              }
              icon={<Scale size={16} />}
            />
            <IndicatorCard
              title="Child Overweight"
              subtitle="Children Under 5 years"
              value={data.childOverweight.toString()}
              target="5"
              status={data.childOverweight > 5 ? "error" : "success"}
              icon={<Scale size={16} />}
            />
            <IndicatorCard
              title="Adol. Overweight"
              subtitle="Adolescents (10-19y)"
              value={data.adolOverweight.toString()}
              target="12.5"
              status={
                data.adolOverweight > 15
                  ? "error"
                  : data.adolOverweight > 12.5
                    ? "warning"
                    : "success"
              }
              icon={<User2 size={16} />}
            />
            <IndicatorCard
              title="Adult Overweight"
              subtitle="Age group 15-69y"
              value={data.adultOverweight.toString()}
              target="18"
              status={
                data.adultOverweight > 20
                  ? "error"
                  : data.adultOverweight > 18
                    ? "warning"
                    : "success"
              }
              icon={<User2 size={16} />}
            />
            <IndicatorCard
              title="Women Low BMI"
              subtitle="Reproductive Age • < 18.5"
              value={data.womenLowBMI.toString()}
              target="12"
              status={
                data.womenLowBMI > 18
                  ? "error"
                  : data.womenLowBMI > 12
                    ? "warning"
                    : "success"
              }
              icon={<Activity size={16} />}
            />
            <IndicatorCard
              title="Child Anaemia"
              subtitle="Children < 5y • SDG 2.2.5"
              value={data.childAnaemia.toString()}
              target="20"
              status={
                data.childAnaemia > 40
                  ? "error"
                  : data.childAnaemia > 20
                    ? "warning"
                    : "success"
              }
              icon={<Droplets size={16} />}
            />
            <IndicatorCard
              title="Women Anaemia"
              subtitle="Reproductive Age • SDG 2.2.4"
              value={data.womenAnaemia.toString()}
              target="18"
              status={
                data.womenAnaemia > 30
                  ? "error"
                  : data.womenAnaemia > 18
                    ? "warning"
                    : "success"
              }
              icon={<Droplets size={16} />}
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
