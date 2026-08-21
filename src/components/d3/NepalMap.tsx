"use client";

import React, { useCallback, useMemo } from "react";
import { geoAlbers, geoPath } from "d3-geo";
import { ParentSize } from "@visx/responsive";
import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AdminFeature,
  type AdminLevel,
  type AdminSelection,
  EMPTY_SELECTION,
} from "@/lib/geo/admin";
import { useNepalAdmin } from "@/lib/geo/nepal-admin-provider";
import { provinceColor, shadeFor } from "@/constants/provinces";
import type { SelectionPatch } from "@/lib/geo/selection-params";

export type { SelectionPatch };

interface NepalMapProps {
  selection: AdminSelection;
  onSelect: (patch: SelectionPatch) => void;
  onReset: () => void;
}

/** On-screen label size per level; the counter-scale keeps these constant. */
const LABEL_FONT_SIZE: Record<AdminLevel, number> = {
  province: 11,
  district: 9,
  municipality: 8,
};

const ZOOM_TRANSITION = "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)";

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
}: NepalMapProps) {
  const admin = useNepalAdmin();

  const { province, district, municipality, focus } =
    admin ? selection : EMPTY_SELECTION;

  /**
   * One level at a time. Selecting a unit replaces the map with that unit's
   * children — the province's districts, the district's local levels — rather
   * than drawing them over the wider country. Nothing outside the selection is
   * rendered, so the card shows the chosen area and only the chosen area.
   */
  const view = useMemo<View | null>(() => {
    if (!admin) return null;

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
        features: admin.municipalitiesOf(district.properties.code),
        color: shaded,
      };
    }

    if (province) {
      return {
        level: "district",
        features: admin.districtsOf(province.properties.code),
        color: shaded,
      };
    }

    return {
      level: "province",
      features: admin.PROVINCES,
      color: (feature) => provinceColor(feature.properties.name),
    };
  }, [admin, province, district, municipality]);

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
      } else {
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

      {!admin || !view ? (
        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <div className="size-8 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Loading map…
          </span>
        </div>
      ) : (
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
                admin.NEPAL,
              );
            const path = geoPath(projection);

            const [[x0, y0], [x1, y1]] = path.bounds(focus ?? admin.NEPAL);
            const boxWidth = Math.max(x1 - x0, 1e-6);
            const boxHeight = Math.max(y1 - y0, 1e-6);
            // 1.25 leaves a margin so the focused unit does not touch the edges;
            // clamping at 1 stops a wide selection from zooming back out.
            const scale = Math.max(
              1,
              Math.min(
                width / (boxWidth * 1.25),
                height / (boxHeight * 1.25),
                40,
              ),
            );
            const translateX = width / 2 - (scale * (x0 + x1)) / 2;
            const translateY = height / 2 - (scale * (y0 + y1)) / 2;

            return (
              <div className="w-full h-full">
                <svg width={width} height={height}>
                  <g
                    className="nepal-map-group"
                    style={{
                      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                      transformBox: "view-box",
                      transformOrigin: "0 0",
                      transition: ZOOM_TRANSITION,
                    }}
                  >
                    <style>{`
                      .nepal-map-group .nepal-unit {
                        transition: opacity 0.3s ease, fill 0.3s ease;
                      }
                      .nepal-map-group .nepal-unit.is-clickable:hover {
                        filter: brightness(1.06) drop-shadow(0px 1px 2px rgba(0,0,0,0.3));
                      }
                      .nepal-map-group .nepal-label {
                        transition: ${ZOOM_TRANSITION};
                      }
                    `}</style>

                    {/* The upstream local-level layer has no park or reserve
                        features, so a district drawn purely from its palikas
                        would show holes where they sit — and a notch in the far
                        north-west where Darchula's Kalapani salient belongs to
                        no local level. The district outline underneath plugs
                        both. */}
                    {view.level === "municipality" && district && !municipality && (
                      <path
                        d={path(district) || ""}
                        fill="#e5e5e5"
                        stroke="#ffffff"
                        strokeWidth={0.6}
                        vectorEffect="non-scaling-stroke"
                        className="nepal-unit"
                        style={{ pointerEvents: "none" }}
                      />
                    )}

                    {view.features.map((feature, index) => {
                      const { code, name } = feature.properties;

                      return (
                        <path
                          key={code}
                          d={path(feature) || ""}
                          fill={view.color(
                            feature,
                            index,
                            view.features.length,
                          )}
                          stroke="#ffffff"
                          strokeWidth={0.6}
                          // Without this, borders thicken with the zoom and a
                          // local level ends up outlined more heavily than the
                          // country was.
                          vectorEffect="non-scaling-stroke"
                          className="nepal-unit is-clickable cursor-pointer outline-none"
                          style={{ opacity: 0.9 }}
                          onClick={() => handleClick(view.level, feature)}
                        >
                          <title>{name}</title>
                        </path>
                      );
                    })}

                    {/* Unit names painted onto their shapes. Each label sits at
                        the shape's projected centroid and counter-scales by
                        1/scale, so text stays a constant size while the map
                        zooms around it; the shared transition keeps the two in
                        step during the animated drill-down. */}
                    {view.features.map((feature) => {
                      const [cx, cy] = path.centroid(feature);
                      if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
                        return null;
                      }

                      return (
                        <g
                          key={`label-${feature.properties.code}`}
                          className="nepal-label"
                          transform={`translate(${cx}, ${cy}) scale(${
                            1 / scale
                          })`}
                          style={{ pointerEvents: "none" }}
                        >
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={LABEL_FONT_SIZE[view.level]}
                            fontWeight={900}
                            letterSpacing={0.4}
                            fill="#1f2937"
                            stroke="#ffffff"
                            strokeWidth={3}
                            strokeLinejoin="round"
                            paintOrder="stroke"
                          >
                            {feature.properties.name.toUpperCase()}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            );
          }}
        </ParentSize>
      )}
    </div>
  );
}
