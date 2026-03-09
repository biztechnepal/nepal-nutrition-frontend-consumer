"use client";

import React, { useMemo, useCallback } from "react";
import * as topojson from "topojson-client";
import { CustomProjection } from "@visx/geo";
import { geoAlbers } from "d3-geo";
import { ParentSize } from "@visx/responsive";
import { localPoint } from "@visx/event";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Topology, GeometryCollection } from "topojson-specification";
import { Geometry, FeatureCollection, Feature } from "geojson";

// Import your TopoJSON file
import nepalTopologyImport from "@/data/province.topo.json";
import { PROVINCE_COLORS, getDisplayName } from "@/constants/provinces";

const nepalTopology = nepalTopologyImport as unknown as Topology;

interface MapProperties {
  PR_NAME?: string;
  name?: string;
  Province?: string;
  PROVINCE?: number;
  OBJECTID?: number;
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

interface NepalMapProps {
  selectedProvince?: string | null;
  onReset?: () => void;
  onHover?: (province: string | null) => void;
}

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

const MapPaths = React.memo(
  ({
    features,
    width,
    height,
    selectedProvince,
    onHoverProvince,
  }: {
    features: Feature<Geometry, MapProperties>[];
    width: number;
    height: number;
    selectedProvince?: string | null;
    onHoverProvince: (
      point: { x: number; y: number } | null,
      name: string | null,
    ) => void;
  }) => {
    return (
      <CustomProjection
        data={features}
        projection={() =>
          geoAlbers()
            .rotate([-84.124, 0])
            .center([0, 28.3949])
            .parallels([26, 30])
        }
        fitSize={[
          [width * 0.9, height * 0.9],
          {
            type: "FeatureCollection",
            features,
          } as any,
        ]}
      >
        {({ features: projectedFeatures }) => (
          <g
            transform={`translate(${width * 0.05}, ${height * 0.05})`}
            className="nepal-map-group"
          >
            <style>{`
              .nepal-map-group .nepal-province {
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
              }
              .nepal-map-group .nepal-province:hover {
                transform: scale(1.02);
                filter: drop-shadow(0px 10px 15px rgba(0,0,0,0.25));
                stroke-width: 1.5px !important;
                z-index: 50;
              }
            `}</style>
            {projectedFeatures.map(({ feature, path }) => {
              const provinceName =
                feature.properties.PR_NAME || feature.properties.name || "";
              const displayName = getDisplayName(provinceName);
              const color = PROVINCE_COLORS[displayName] || "var(--primary)";
              const isSelected = selectedProvince === displayName;
              const isOtherSelected =
                selectedProvince && selectedProvince !== displayName;

              return (
                <path
                  key={displayName}
                  d={path || ""}
                  fill={color}
                  stroke={isSelected ? "#000000" : "#ffffff"}
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  className="nepal-province outline-none cursor-pointer"
                  style={{
                    opacity: isOtherSelected ? 0.3 : 0.85,
                    transformOrigin: "center",
                    transformBox: "fill-box",
                  }}
                  onMouseEnter={(event) => {
                    const point = localPoint(event);
                    if (point) onHoverProvince(point, displayName);
                  }}
                  onMouseMove={(event) => {
                    const point = localPoint(event);
                    if (point) onHoverProvince(point, displayName);
                  }}
                  onMouseLeave={() => {
                    onHoverProvince(null, null);
                  }}
                />
              );
            })}
          </g>
        )}
      </CustomProjection>
    );
  },
);

MapPaths.displayName = "MapPaths";

export default function NepalMap({
  selectedProvince,
  onReset,
  onHover,
}: NepalMapProps) {
  const [tooltip, setTooltip] = React.useState<{
    x: number;
    y: number;
    province: string;
  } | null>(null);

  const handleHoverProvince = useCallback(
    (point: { x: number; y: number } | null, name: string | null) => {
      if (point && name) {
        setTooltip((prev) => {
          if (
            prev &&
            prev.x === point.x &&
            prev.y === point.y &&
            prev.province === name
          ) {
            return prev;
          }
          return { x: point.x, y: point.y, province: name };
        });
      } else {
        setTooltip(null);
      }
      if (onHover) onHover(name);
    },
    [onHover],
  );

  const worldData = useMemo(() => {
    const objectKey = Object.keys(nepalTopology.objects)[0];
    const geometryCollection = nepalTopology.objects[
      objectKey
    ] as GeometryCollection<MapProperties>;

    const geo = topojson.feature(
      nepalTopology,
      geometryCollection,
    ) as unknown as FeatureCollection<Geometry, MapProperties>;

    const allFeatures = geo.features;

    if (selectedProvince) {
      const provinceMapping: Record<string, string> = {
        Koshi: "Province No 1",
        Madhesh: "Province No 2",
        Bagmati: "Bagmati Pradesh",
        Gandaki: "Gandaki Pradesh",
        Lumbini: "Province No 5",
        Karnali: "Karnali Pradesh",
        Sudurpashchim: "Sudurpashchim Pradesh",
      };

      const targetName = provinceMapping[selectedProvince] || selectedProvince;

      return allFeatures.filter((f) => {
        const featName = (
          f.properties.PR_NAME ||
          f.properties.name ||
          ""
        ).toLowerCase();
        return (
          featName.includes(targetName.toLowerCase()) ||
          targetName.toLowerCase().includes(featName)
        );
      });
    }

    return allFeatures;
  }, [selectedProvince]);

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[300px]">
      {selectedProvince && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-white text-[10px] font-black uppercase tracking-tight h-8 px-2 gap-2 shadow-sm"
        >
          <RotateCcw size={12} className="text-primary" />
          Reset Map
        </Button>
      )}

      <ParentSize>
        {({ width, height }) => (
          <div
            className="w-full h-full"
            onMouseLeave={() => handleHoverProvince(null, null)}
          >
            <svg width={width} height={height}>
              <MapPaths
                features={worldData}
                width={width}
                height={height}
                selectedProvince={selectedProvince}
                onHoverProvince={handleHoverProvince}
              />
            </svg>
          </div>
        )}
      </ParentSize>

      {/* Tooltip Popup */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y + 15,
            width: "280px",
          }}
        >
          <div className="flex flex-col gap-2 drop-shadow-2xl">
            {/* Top Cards Row */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white rounded-md shadow-lg overflow-hidden border border-border/40">
                <div className="bg-[#002e7a] text-white text-[8px] font-black py-0.5 px-2 text-center uppercase tracking-widest">
                  Province
                </div>
                <div className="p-1.5 text-center">
                  <span className="text-[10px] font-black text-[#002e7a] uppercase truncate block">
                    {tooltip.province}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-md shadow-lg overflow-hidden border border-border/40">
                <div className="bg-[#002e7a] text-white text-[8px] font-black py-0.5 px-2 text-center uppercase tracking-widest">
                  Status
                </div>
                <div className="p-1.5 text-center">
                  <span className="text-[10px] font-black text-[#002e7a] uppercase truncate block">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Indicator Table Card */}
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
          </div>
        </div>
      )}
    </div>
  );
}
