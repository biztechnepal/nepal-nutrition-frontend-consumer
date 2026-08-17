import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { provinceColor, shadeFor } from "@/constants/provinces";
import {
  type AdminFeature,
  type AdminSelection,
  PROVINCES,
  districtsOf,
  palikasOf,
} from "@/lib/geo/admin";
import type { SelectionPatch } from "@/components/d3/NepalMap";

interface AreaTableProps {
  selection: AdminSelection;
  onSelect: (patch: SelectionPatch) => void;
}

/**
 * The list beside the map. It follows the map down: provinces, then the
 * districts of the open province, then the local levels of the open district.
 * Keeping the two in step means the list is always a way to reach whatever the
 * map is showing, which matters because small local levels are hard to hit.
 */
export const AreaTable = ({ selection, onSelect }: AreaTableProps) => {
  const { province, district, municipality } = selection;

  const provinceHex = provinceColor(province?.properties.name);

  let title: string;
  let rows: AdminFeature[];
  let activeCode: string | undefined;
  let onRowClick: (feature: AdminFeature) => void;
  let back: { label: string; patch: SelectionPatch } | null = null;

  if (district) {
    title = "Local Level";
    rows = palikasOf(district.properties.code);
    activeCode = municipality?.properties.code;
    onRowClick = (feature) =>
      onSelect({
        municipality:
          municipality?.properties.code === feature.properties.code
            ? null
            : feature.properties.name,
      });
    back = {
      label: district.properties.name,
      patch: { district: null, municipality: null },
    };
  } else if (province) {
    title = "District";
    rows = districtsOf(province.properties.code);
    // A selected district would have taken the branch above, so nothing in this
    // list is active — the province row itself is the active one.
    activeCode = undefined;
    onRowClick = (feature) => onSelect({ district: feature.properties.name });
    back = {
      label: province.properties.name,
      patch: { province: null, district: null, municipality: null },
    };
  } else {
    title = "Province";
    rows = PROVINCES;
    activeCode = undefined;
    onRowClick = (feature) => onSelect({ province: feature.properties.name });
  }

  const colorFor = (feature: AdminFeature, index: number) =>
    province
      ? shadeFor(provinceHex, index, rows.length)
      : provinceColor(feature.properties.name);

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white/60 backdrop-blur-md group hover:-translate-y-px transition-all duration-300 rounded-xl relative">
      <CardHeader className="grid grid-cols-2 p-0 border-b-2 border-primary/20 shrink-0 space-y-0">
        <div className="flex items-center gap-2 p-3 px-4 min-w-0">
          <ChevronDown size={14} className="text-primary fill-primary shrink-0" />
          <span className="text-[12px] font-black text-primary uppercase tracking-wide truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center justify-center p-3 border-l border-border/40">
          <span className="text-[12px] font-black text-primary uppercase tracking-wide">
            Map Ref
          </span>
        </div>
      </CardHeader>

      {back && (
        <button
          type="button"
          onClick={() => onSelect(back!.patch)}
          className="w-full flex items-center gap-1.5 px-3 py-2 border-b border-border/40 bg-muted/30 hover:bg-primary/10 transition-colors text-left"
        >
          <ChevronLeft size={12} className="text-primary shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground truncate">
            Back to {back.label}
          </span>
        </button>
      )}

      <CardContent className="p-0 overflow-hidden">
        {/* Districts and local levels run long, so the list scrolls rather than
            stretching the card past the map beside it. */}
        <div className="flex flex-col max-h-[420px] overflow-y-auto">
          {rows.map((feature, index) => {
            const { code, name } = feature.properties;
            const isActive = activeCode === code;
            return (
              <button
                key={code}
                onClick={() => onRowClick(feature)}
                className={`grid grid-cols-2 items-stretch h-9 w-full text-left transition-all duration-300 group shrink-0 ${
                  isActive
                    ? "bg-primary/10 ring-1 ring-inset ring-primary/30"
                    : index % 2 === 0
                      ? "bg-white"
                      : "bg-muted/40"
                } hover:brightness-95`}
              >
                <div className="flex items-center px-3 border-r border-border/20 min-w-0">
                  <span
                    className={`text-[11px] font-black truncate transition-all duration-300 ${
                      isActive
                        ? "text-primary scale-105"
                        : "text-foreground/80 group-hover:text-primary"
                    }`}
                    style={{ transformOrigin: "left center" }}
                    title={name}
                  >
                    {name}
                  </span>
                </div>
                <div
                  className="w-full h-full flex items-center justify-center transition-opacity duration-300"
                  style={{
                    backgroundColor: colorFor(feature, index),
                    opacity: activeCode && !isActive ? 0.3 : 0.85,
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
