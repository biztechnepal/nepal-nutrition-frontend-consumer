"use client";

import React, { useMemo } from "react";
import * as topojson from "topojson-client";
import { CustomProjection } from "@visx/geo";
import { geoAlbers } from "d3-geo";
import { ParentSize } from "@visx/responsive";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Topology, GeometryCollection } from "topojson-specification";
import { Geometry, FeatureCollection } from "geojson";

// Import your TopoJSON file
import nepalTopologyImport from "@/data/province.topo.json";
const nepalTopology = nepalTopologyImport as unknown as Topology;

interface MapProperties {
  PR_NAME?: string;
  name?: string;
  Province?: string;
  PROVINCE?: number;
  OBJECTID?: number;
}

interface NepalMapProps {
  selectedProvince?: string | null;
  onReset?: () => void;
}

export default function NepalMap({ selectedProvince, onReset }: NepalMapProps) {
  // 1. Stable Province Metadata for Color Consistency
  const provinceMeta: Record<string, { opacity: number }> = {
    "Province No 1": { opacity: 0.4 },
    "Province No 2": { opacity: 0.5 },
    "Bagmati Pradesh": { opacity: 0.6 },
    "Gandaki Pradesh": { opacity: 0.7 },
    "Province No 5": { opacity: 0.8 },
    "Karnali Pradesh": { opacity: 0.9 },
    "Sudurpashchim Pradesh": { opacity: 1.0 },
    // Fallbacks for display names
    Koshi: { opacity: 0.4 },
    Madhesh: { opacity: 0.5 },
    Bagmati: { opacity: 0.6 },
    Gandaki: { opacity: 0.7 },
    Lumbini: { opacity: 0.8 },
    Karnali: { opacity: 0.9 },
    Sudurpashchim: { opacity: 1.0 },
  };

  const getProvinceOpacity = (name: string) => {
    const key = Object.keys(provinceMeta).find(
      (k) =>
        name.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(name.toLowerCase()),
    );
    return key ? provinceMeta[key].opacity : 0.6;
  };

  // 2. Convert TopoJSON to GeoJSON Features
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

    // Filter by selected province if provided
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
          <svg width={width} height={height}>
            <CustomProjection
              data={worldData}
              projection={() =>
                geoAlbers()
                  .rotate([-84.124, 0])
                  .center([0, 28.3949])
                  .parallels([26, 30])
              }
              fitSize={[
                [width * 0.9, height * 0.9],
                // Casting to 'any' here as @visx/geo fitsSize prop has a type conflict with standard GeoJSON collections
                {
                  type: "FeatureCollection",
                  features: worldData,
                } as any,
              ]}
            >
              {({ features }) => (
                <g transform={`translate(${width * 0.05}, ${height * 0.05})`}>
                  {features.map(({ feature, path }, i) => {
                    const provinceName =
                      feature.properties.PR_NAME ||
                      feature.properties.name ||
                      "";
                    const opacity = getProvinceOpacity(provinceName);

                    return (
                      <path
                        key={`province-${i}`}
                        d={path || ""}
                        fill="var(--secondary)"
                        fillOpacity={opacity}
                        stroke="var(--primary)"
                        strokeWidth={selectedProvince ? 1 : 0.5}
                        className="transition-all duration-300 hover:fill-opacity-100 hover:scale-[1.01] cursor-pointer outline-none"
                        style={{
                          transformOrigin: "center",
                          transformBox: "fill-box",
                        }}
                      />
                    );
                  })}
                </g>
              )}
            </CustomProjection>
          </svg>
        )}
      </ParentSize>
    </div>
  );
}
