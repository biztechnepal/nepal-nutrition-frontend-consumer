"use client";

import { IndicatorCard } from "./components/IndicatorCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import NepalMap from "@/components/d3/NepalMap";
import { ProvinceTable } from "./components/ProvinceTable";
import { OfficialCard } from "./components/OfficialCard";
import { PORTAL_OFFICIALS } from "./officials";
import { QueryKeys } from "@/constants/query-keys";
import { getImpactIndicators } from "@/services/dashboard.service";
import { useLocale } from "@/features/i18n/hooks/useLocale";
import {
  IMPACT_INDICATOR_ICONS,
  formatTargetLabel,
  getIndicatorStatus,
} from "./impact-indicators";

export const DashboardView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();

  const selectedProvince = searchParams.get("province");

  const {
    data: impactData,
    isPending: isLoadingIndicators,
    isError: hasIndicatorError,
  } = useQuery({
    queryKey: [QueryKeys.IMPACTINDICATORS, locale],
    queryFn: () => getImpactIndicators(locale),
  });

  const indicators = impactData?.data?.indicators ?? [];
  const endFiscalYear = impactData?.data?.endFiscalYear;
  const fiscalYear = impactData?.data?.fiscalYear;

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
                <CardTitle className="text-[11px] font-black text-secondary ml-2">
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
                    <span className="block text-[11px] font-black text-secondary mb-2">
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

        {/* 2. About Us */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-[17px] font-black text-secondary">About Us</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <Card className="lg:col-span-8 bg-white border-border/40 shadow-xl rounded-2xl border-t-2 border-t-primary">
              <CardContent className="p-5">
                <p className="text-[14px] leading-7 text-foreground/70 font-medium text-justify">
                  There is an unprecedented momentum at present to improve
                  nutrition and food security situation in Nepal in tandem with
                  the strong global momentum. Nutrition and food security have
                  been identified as important agenda of national development
                  and have been accorded a top priority by Government of Nepal.
                  The strong high-level commitment from the government is
                  matched by an equally strong support from the external
                  development partners. As a result, a multitude of activities
                  are ongoing in this field in the country. A powerful rationale
                  therefore exists for an online and open access
                  “One-Stop-Shop” for all the resources, information and updates
                  related to nutrition and food security in Nepal. Hence, this
                  Nepal Nutrition and Food Security Portal has been established.
                </p>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 flex flex-col gap-4">
              {PORTAL_OFFICIALS.map((official) => (
                <OfficialCard key={official.email} {...official} />
              ))}
            </div>
          </div>
        </div>

        {/* 3. Key Performance Indicators Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-[17px] font-black text-secondary">
              Impact Indicators Overview - National
            </h2>
            {fiscalYear && (
              <span className="text-[12px] font-bold text-muted-foreground/70">
                FY {fiscalYear.year}
                {fiscalYear.dateInAd ? ` (${fiscalYear.dateInAd})` : ""}
              </span>
            )}
          </div>

          {/* The map and province table still drive the rest of the page, but no
              province-level values have been recorded against these indicators.
              Saying so beats captioning national figures with a province name. */}
          {selectedProvince && (
            <p className="text-[13px] font-bold text-muted-foreground/70 -mt-2">
              Province figures are not published for the impact indicators yet —
              showing national values while {selectedProvince} is selected.
            </p>
          )}

          {hasIndicatorError ? (
            <p className="text-[13px] font-bold text-primary">
              Impact indicators could not be loaded. Please try again later.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {isLoadingIndicators
                ? Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className="min-h-48 rounded-xl bg-white/60 border border-border/20 animate-pulse"
                    />
                  ))
                : indicators.map((indicator) => {
                    const Icon = IMPACT_INDICATOR_ICONS[indicator.code];

                    // Some indicators carry prose in place of a figure — the
                    // plan's "baseline and target to be set" placeholder. That
                    // reads as a sentence, not a measurement, so the card shows
                    // it as absent rather than setting it in the value slot.
                    const hasFigure = indicator.current?.value != null;

                    return (
                      <IndicatorCard
                        key={indicator.configId}
                        title={indicator.name}
                        value={hasFigure ? indicator.current!.label : "—"}
                        unit={hasFigure ? (indicator.unit ?? "") : ""}
                        target={formatTargetLabel(
                          indicator.endTarget,
                          indicator.unit,
                        )}
                        targetLabel={
                          endFiscalYear?.dateInAd
                            ? `${endFiscalYear.dateInAd} Target`
                            : "End of Plan Target"
                        }
                        status={getIndicatorStatus(indicator)}
                        icon={Icon ? <Icon size={16} /> : undefined}
                      />
                    );
                  })}
            </div>
          )}
        </div>

        {/* 4. System Footer Area */}
        <div className="w-full flex flex-col items-center gap-4 pt-12 pb-8 border-t border-dashed border-border/60">
          <div className="flex gap-6 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-secondary/30 animate-pulse delay-75" />
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-pulse delay-150" />
          </div>
          <p className="text-[11px] text-muted-foreground font-bold opacity-60">
            MSNP III Progressive Visualization System &bull; Active Data Feed
          </p>
        </div>
      </div>
    </div>
  );
};
