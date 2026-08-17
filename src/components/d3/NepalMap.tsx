"use client";

import React, { useCallback, useMemo } from "react";
import { geoAlbers, geoPath } from "d3-geo";
import { ParentSize } from "@visx/responsive";
import { localPoint } from "@visx/event";
import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminFeature,
  type AdminLevel,
  type AdminSelection,
  NEPAL,
  PROVINCES,
  districtsOf,
  municipalitiesOf,
} from "@/lib/geo/admin";
import { provinceColor, shadeFor } from "@/constants/provinces";
import type { SelectionPatch } from "@/lib/geo/selection-params";

export type { SelectionPatch };

interface NepalMapProps {
  selection: AdminSelection;
  onSelect: (patch: SelectionPatch) => void;
  onReset: () => void;
  onHover?: (name: string | null) => void;
}

interface Indicator {
  name: string;
  ranking: "Off Track" | "In Progress" | "On Track" | "No Ranking";
}

const dummyIndicators: Indicator[] = [
  { name: "Children stunted", ranking: "Off Track" },
  { name: "Exclusive Breast Feeding", ranking: "In Progress" },
  { name: "Exclusive Breast Feeding", ranking: "Off Track" },
  { name: "Minimum dietary diversity (6-23 months)", ranking: "In Progress" },
  { name: "Severe Acute Malnutrition", ranking: "No Ranking" },
];

const getRankingColor = (ranking: string) => {
  switch (ranking) {
    case "Off Track":
      return "bg-[#8b2b2b] text-white";
    case "In Progress":
      return "bg-[#c19412] text-white";
    case "On Track":
      return "bg-[#2b8b2b] text-white";
    default:
      return "bg-transparent text-foreground/60";
  }
};

const LEVEL_LABEL: Record<AdminLevel, string> = {
  province: "Province",
  district: "District",
  municipality: "Local Level",
};

interface HoverState {
  x: number;
  y: number;
  feature: AdminFeature;
  level: AdminLevel;
}

/** What the map is currently drawing: one level, one flat set of features. */
interface View {
  level: AdminLevel;
  features: AdminFeature[];
  color: (feature: AdminFeature, index: number, total: number) => string;
}

export default function NepalMap({
  selection,
  onSelect,
  onReset,
  onHover,
}: NepalMapProps) {
  const [hover, setHover] = React.useState<HoverState | null>(null);

  const { province, district, municipality, focus } = selection;

  const handleHover = useCallback(
    (next: HoverState | null) => {
      setHover((prev) => {
        if (!next) return null;
        if (
          prev &&
          prev.x === next.x &&
          prev.y === next.y &&
          prev.feature === next.feature
        ) {
          return prev;
        }
        return next;
      });
      onHover?.(next?.feature.properties.name ?? null);
    },
    [onHover],
  );

  /**
   * One level at a time. Selecting a unit replaces the map with that unit's
   * children — the province's districts, the district's local levels — rather
   * than drawing them over the wider country. Nothing outside the selection is
   * rendered, so the card shows the chosen area and only the chosen area.
   */
  const view = useMemo<View>(() => {
    const provinceHex = provinceColor(province?.properties.name);
    const shaded = (_f: AdminFeature, index: number, total: number) =>
      shadeFor(provinceHex, index, total);

    if (municipality) {
      return {
        level: "municipality",
        features: [municipality],
        color: () => provinceHex,
      };
    }

    if (district) {
      return {
        level: "municipality",
        // Parks and reserves are included so the district is drawn whole; they
        // are painted flat and are not selectable.
        features: municipalitiesOf(district.properties.code),
        color: (feature, index, total) =>
          feature.properties.kind === "special"
            ? "#d9d9d9"
            : shaded(feature, index, total),
      };
    }

    if (province) {
      return {
        level: "district",
        features: districtsOf(province.properties.code),
        color: shaded,
      };
    }

    return {
      level: "province",
      features: PROVINCES,
      color: (feature) => provinceColor(feature.properties.name),
    };
  }, [province, district, municipality]);

  const handleClick = useCallback(
    (level: AdminLevel, feature: AdminFeature) => {
      const name = feature.properties.name;

      // Only one level is on screen, and it is always the level *below* the
      // current selection, so a click on it is always a step down — except at
      // the deepest level, where the lone visible unit is the selection itself
      // and clicking it steps back up.
      if (level === "province") {
        onSelect({ province: name });
      } else if (level === "district") {
        onSelect({ district: name });
      } else if (feature.properties.kind !== "special") {
        const isSelected =
          municipality?.properties.code === feature.properties.code;
        onSelect({ municipality: isSelected ? null : name });
      }
    },
    [municipality, onSelect],
  );

  const crumbs: Array<{ label: string; patch: SelectionPatch | null }> = [
    { label: "Nepal", patch: { province: null, district: null, municipality: null } },
  ];
  if (province) {
    crumbs.push({
      label: province.properties.name,
      patch: { district: null, municipality: null },
    });
  }
  if (district) {
    crumbs.push({
      label: district.properties.name,
      patch: { municipality: null },
    });
  }
  if (municipality) {
    crumbs.push({ label: municipality.properties.name, patch: null });
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[300px]">
      {/* Breadcrumb — the way back up, and a readout of where you are. */}
      {crumbs.length > 1 && (
        <div className="absolute top-3 left-3 z-50 flex items-center flex-wrap gap-0.5 max-w-[65%]">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {index > 0 && (
                  <ChevronRight
                    size={11}
                    className="text-muted-foreground/50 shrink-0"
                  />
                )}
                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => crumb.patch && onSelect(crumb.patch)}
                  className={`text-[10px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded transition-colors ${
                    isLast
                      ? "text-primary cursor-default"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {focus && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="absolute top-3 right-3 z-50 bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-white text-[10px] font-black uppercase tracking-tight h-8 px-2 gap-2 shadow-sm"
        >
          <RotateCcw size={12} className="text-primary" />
          Reset Map
        </Button>
      )}

      <ParentSize>
        {({ width, height }) => {
          if (width < 2 || height < 2) return null;

          /**
           * The projection is fitted to the whole country once and then never
           * changes. Zoom is a transform on top of it, so a district keeps the
           * exact shape and position it had in the national view instead of
           * being re-projected into a subtly different outline each time the
           * selection changes.
           */
          const pad = Math.min(width, height) * 0.04;
          const projection = geoAlbers()
            .rotate([-84.124, 0])
            .center([0, 28.3949])
            .parallels([26, 30])
            .fitExtent(
              [
                [pad, pad],
                [width - pad, height - pad],
              ],
              NEPAL,
            );
          const path = geoPath(projection);

          const [[x0, y0], [x1, y1]] = path.bounds(focus ?? NEPAL);
          const boxWidth = Math.max(x1 - x0, 1e-6);
          const boxHeight = Math.max(y1 - y0, 1e-6);
          // 1.25 leaves a margin so the focused unit does not touch the edges;
          // clamping at 1 stops a wide selection from zooming back out.
          const scale = Math.max(
            1,
            Math.min(width / (boxWidth * 1.25), height / (boxHeight * 1.25), 40),
          );
          const translateX = width / 2 - (scale * (x0 + x1)) / 2;
          const translateY = height / 2 - (scale * (y0 + y1)) / 2;

          return (
            <div
              className="w-full h-full"
              onMouseLeave={() => handleHover(null)}
            >
              <svg width={width} height={height}>
                <g
                  className="nepal-map-group"
                  style={{
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    transformBox: "view-box",
                    transformOrigin: "0 0",
                    transition:
                      "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <style>{`
                    .nepal-map-group .nepal-unit {
                      transition: opacity 0.3s ease, fill 0.3s ease;
                    }
                    .nepal-map-group .nepal-unit.is-clickable:hover {
                      filter: brightness(1.06) drop-shadow(0px 1px 2px rgba(0,0,0,0.3));
                    }
                  `}</style>

                  {view.features.map((feature, index) => {
                    const { code, name, kind } = feature.properties;
                    const clickable = kind !== "special";

                    return (
                      <path
                        key={code}
                        d={path(feature) || ""}
                        fill={view.color(feature, index, view.features.length)}
                        stroke="#ffffff"
                        strokeWidth={0.6}
                        // Without this, borders thicken with the zoom and a
                        // local level ends up outlined more heavily than the
                        // country was.
                        vectorEffect="non-scaling-stroke"
                        className={`nepal-unit outline-none ${
                          clickable ? "is-clickable cursor-pointer" : ""
                        }`}
                        style={{ opacity: 0.9 }}
                        onMouseEnter={(event) => {
                          const point = localPoint(event);
                          if (point)
                            handleHover({
                              x: point.x,
                              y: point.y,
                              feature,
                              level: view.level,
                            });
                        }}
                        onMouseMove={(event) => {
                          const point = localPoint(event);
                          if (point)
                            handleHover({
                              x: point.x,
                              y: point.y,
                              feature,
                              level: view.level,
                            });
                        }}
                        onMouseLeave={() => handleHover(null)}
                        onClick={() =>
                          clickable && handleClick(view.level, feature)
                        }
                      >
                        <title>{name}</title>
                      </path>
                    );
                  })}
                </g>
              </svg>

              {hover && (
                <MapTooltip
                  hover={hover}
                  containerWidth={width}
                  parentName={
                    hover.level === "municipality"
                      ? district?.properties.name
                      : hover.level === "district"
                        ? province?.properties.name
                        : undefined
                  }
                />
              )}
            </div>
          );
        }}
      </ParentSize>
    </div>
  );
}

function MapTooltip({
  hover,
  containerWidth,
  parentName,
}: {
  hover: HoverState;
  containerWidth: number;
  parentName?: string;
}) {
  const { feature, level } = hover;
  const width = 280;
  // Flip to the left of the cursor near the right edge, or the card is clipped.
  const flip = hover.x + width + 30 > containerWidth;

  return (
    <div
      className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
      style={{
        left: flip ? undefined : hover.x + 15,
        right: flip ? containerWidth - hover.x + 15 : undefined,
        top: hover.y + 15,
        width,
      }}
    >
      <div className="flex flex-col gap-2 drop-shadow-2xl">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-white rounded-md shadow-lg overflow-hidden border border-border/40">
            <div className="bg-[#002e7a] text-white text-[8px] font-black py-0.5 px-2 text-center uppercase tracking-widest">
              {LEVEL_LABEL[level]}
            </div>
            <div className="p-1.5 text-center">
              <span className="text-[10px] font-black text-[#002e7a] uppercase truncate block">
                {feature.properties.name}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-lg overflow-hidden border border-border/40">
            <div className="bg-[#002e7a] text-white text-[8px] font-black py-0.5 px-2 text-center uppercase tracking-widest">
              {level === "province" ? "Status" : "Within"}
            </div>
            <div className="p-1.5 text-center">
              <span className="text-[10px] font-black text-[#002e7a] uppercase truncate block">
                {level === "province" ? "Active" : (parentName ?? "—")}
              </span>
            </div>
          </div>
        </div>

        {level === "province" ? (
          <div className="bg-white border border-border/40 shadow-xl flex flex-col overflow-hidden rounded-lg">
            <div className="bg-[#002e7a] p-1 px-2 flex flex-row items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-1">
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-white" />
                <span className="text-[8px] font-black text-white uppercase italic tracking-wider">
                  Indicator Name
                </span>
              </div>
              <span className="text-[8px] font-black text-white uppercase italic tracking-wider">
                Ranking
              </span>
            </div>
            <div className="flex flex-col max-h-[160px] overflow-hidden">
              {dummyIndicators.map((indicator, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[1fr_auto] items-center min-h-[24px] border-b border-border/20 last:border-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-muted/30"
                  }`}
                >
                  <div className="px-2 py-1 text-[9px] font-bold text-foreground/80 leading-tight">
                    {indicator.name}
                  </div>
                  <div className="flex justify-end p-0.5 pr-1">
                    <div
                      className={`px-1.5 py-0.5 rounded-sm text-[8px] font-black min-w-[60px] text-center ${getRankingColor(
                        indicator.ranking,
                      )}`}
                    >
                      {indicator.ranking}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No indicator is published below province level, so the card says so
             rather than repeating the province's figures under a smaller name. */
          <div className="bg-white border border-border/40 shadow-xl rounded-lg px-3 py-2">
            <p className="text-[9px] font-bold text-foreground/60 leading-snug">
              {feature.properties.kind === "special"
                ? "Protected area — not a local government."
                : `No indicator data is published at ${LEVEL_LABEL[level].toLowerCase()} level yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
