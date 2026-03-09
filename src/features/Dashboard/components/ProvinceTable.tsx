import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { PROVINCE_COLORS } from "@/constants/provinces";

interface ProvinceTableProps {
  selectedProvince?: string | null;
  onProvinceClick?: (province: string | null) => void;
}

export const ProvinceTable = ({
  selectedProvince,
  onProvinceClick,
}: ProvinceTableProps) => {
  const provinces = [
    { name: "Koshi" },
    { name: "Madhesh" },
    { name: "Bagmati" },
    { name: "Gandaki" },
    { name: "Lumbini" },
    { name: "Karnali" },
    { name: "Sudurpashchim" },
  ];

  const handleProvinceClick = (name: string) => {
    if (onProvinceClick) {
      onProvinceClick(selectedProvince === name ? null : name);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white/60 backdrop-blur-md group hover:-translate-y-px transition-all duration-300 rounded-xl relative">
      <CardHeader className="grid grid-cols-2 p-0 border-b-2 border-primary/20 shrink-0 space-y-0">
        <div className="flex items-center gap-2 p-3 px-4">
          <ChevronDown size={14} className="text-primary fill-primary" />
          <span className="text-[12px] font-black text-primary uppercase tracking-wide">
            Province
          </span>
        </div>
        <div className="flex items-center justify-center p-3 border-l border-border/40">
          <span className="text-[12px] font-black text-primary uppercase tracking-wide">
            Map Ref
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <div className="flex flex-col">
          {provinces.map((province, index) => {
            const color = PROVINCE_COLORS[province.name] || "var(--primary)";
            return (
              <button
                key={province.name}
                onClick={() => handleProvinceClick(province.name)}
                className={`grid grid-cols-2 items-stretch h-9 w-full text-left transition-all duration-300 group ${
                  selectedProvince === province.name
                    ? "bg-primary/10 ring-1 ring-inset ring-primary/30"
                    : index % 2 === 0
                      ? "bg-white"
                      : "bg-muted/40"
                } hover:brightness-95`}
              >
                <div className="flex items-center px-3 border-r border-border/20">
                  <span
                    className={`text-[11px] font-black truncate transition-all duration-300 ${
                      selectedProvince === province.name
                        ? "text-primary scale-105"
                        : "text-foreground/80 group-hover:text-primary"
                    }`}
                    style={{ transformOrigin: "left center" }}
                  >
                    {province.name}
                  </span>
                </div>
                <div
                  className="w-full h-full flex items-center justify-center transition-opacity duration-300"
                  style={{
                    backgroundColor: color,
                    opacity:
                      selectedProvince && selectedProvince !== province.name
                        ? 0.3
                        : 0.85,
                  }}
                />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
