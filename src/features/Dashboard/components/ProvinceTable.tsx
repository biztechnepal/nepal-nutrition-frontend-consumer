import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

interface ProvinceTableProps {
  selectedProvince?: string | null;
  onProvinceClick?: (province: string | null) => void;
}

export const ProvinceTable = ({
  selectedProvince,
  onProvinceClick,
}: ProvinceTableProps) => {
  const provinces = [
    { name: "Koshi", opacity: 0.4 },
    { name: "Madhesh", opacity: 0.5 },
    { name: "Bagmati", opacity: 0.6 },
    { name: "Gandaki", opacity: 0.7 },
    { name: "Lumbini", opacity: 0.8 },
    { name: "Karnali", opacity: 0.9 },
    { name: "Sudurpashchim", opacity: 1.0 },
  ];

  const handleProvinceClick = (name: string) => {
    if (onProvinceClick) {
      onProvinceClick(selectedProvince === name ? null : name);
    }
  };

  return (
    <Card className="bg-white border border-border/40 shadow-lg flex flex-col overflow-hidden h-full rounded-2xl">
      <CardHeader className="grid grid-cols-2 p-0 border-b-2 border-primary/20 shrink-0 space-y-0">
        <div className="flex items-center gap-1.5 p-2 px-3">
          <ChevronDown size={12} className="text-secondary fill-secondary" />
          <span className="text-[11px] font-black text-secondary uppercase tracking-tight">
            Province
          </span>
        </div>
        <div className="flex items-center justify-center p-2 border-l border-border/40">
          <span className="text-[11px] font-black text-secondary uppercase tracking-tight">
            Map Ref
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {provinces.map((province, index) => (
              <button
                key={province.name}
                onClick={() => handleProvinceClick(province.name)}
                className={`grid grid-cols-2 items-stretch h-9 w-full text-left transition-all group ${
                  selectedProvince === province.name
                    ? "bg-secondary/10 ring-1 ring-inset ring-secondary/30"
                    : index % 2 === 0
                      ? "bg-white"
                      : "bg-muted/40"
                } hover:brightness-95`}
              >
                <div className="flex items-center px-3 border-r border-border/20">
                  <span
                    className={`text-[11px] font-black truncate transition-colors ${
                      selectedProvince === province.name
                        ? "text-secondary"
                        : "text-foreground/80 group-hover:text-secondary"
                    }`}
                  >
                    {province.name}
                  </span>
                </div>
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: `var(--secondary)`,
                    opacity: province.opacity,
                  }}
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
