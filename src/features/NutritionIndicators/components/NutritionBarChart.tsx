import React from "react";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { ParentSize } from "@visx/responsive";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DataPoint {
  province: string;
  [key: string]: string | number;
}

interface NutritionBarChartProps {
  title: string;
  data: DataPoint[];
  keys: string[];
  height?: number;
}

const colors = ["#8b2f15", "#004b8e", "#2b4c7e", "#d4a017"]; // primary, secondary, chart-3, chart-4 approx oklch conversions

const Chart = ({
  data,
  keys,
  height = 350,
}: Omit<NutritionBarChartProps, "title">) => {
  const margin = { top: 20, right: 20, bottom: 60, left: 40 };
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<{
      province: string;
      key: string;
      value: number;
      color: string;
    }>();

  return (
    <ParentSize>
      {({ width }) => {
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        const xScale = scaleBand<string>({
          range: [0, xMax],
          round: true,
          domain: data.map((d) => d.province),
          padding: 0.3,
        });

        const x1Scale = scaleBand<string>({
          range: [0, xScale.bandwidth()],
          domain: keys,
          padding: 0.1,
        });

        const yScale = scaleLinear<number>({
          range: [yMax, 0],
          domain: [
            0,
            Math.max(
              ...data.map((d) =>
                Math.max(...keys.map((k) => Number(d[k]) || 0)),
              ),
            ),
          ],
        });

        const colorScale = scaleOrdinal<string, string>({
          domain: keys,
          range: colors,
        });

        return (
          <div className="relative">
            <svg width={width} height={height}>
              <Group top={margin.top} left={margin.left}>
                {data.map((d) => (
                  <Group
                    key={`bar-group-${d.province}`}
                    left={xScale(d.province)}
                  >
                    {keys.map((key) => {
                      const value = Number(d[key]) || 0;
                      const barWidth = x1Scale.bandwidth();
                      const barHeight = yMax - yScale(value);
                      const barX = x1Scale(key);
                      const barY = yScale(value);

                      return (
                        <Bar
                          key={`bar-${d.province}-${key}`}
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          fill={colorScale(key)}
                          rx={2}
                          onMouseMove={(event) => {
                            const point = localPoint(event) || { x: 0, y: 0 };
                            showTooltip({
                              tooltipData: {
                                province: d.province,
                                key,
                                value,
                                color: colorScale(key),
                              },
                              tooltipLeft: point.x,
                              tooltipTop: point.y,
                            });
                          }}
                          onMouseLeave={() => hideTooltip()}
                          className="cursor-pointer transition-opacity hover:opacity-80"
                        />
                      );
                    })}
                  </Group>
                ))}
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  stroke="#e2e8f0"
                  tickStroke="#e2e8f0"
                  strokeWidth={0}
                  tickLabelProps={() => ({
                    fill: "#64748b",
                    fontSize: 10,
                    textAnchor: "middle",
                    fontWeight: 700,
                  })}
                />
                <AxisLeft
                  scale={yScale}
                  stroke="#e2e8f0"
                  tickStroke="#e2e8f0"
                  strokeWidth={0}
                  tickLabelProps={() => ({
                    fill: "#64748b",
                    fontSize: 10,
                    textAnchor: "end",
                    dx: -4,
                    dy: 4,
                  })}
                />
              </Group>
            </svg>

            {tooltipData && (
              <TooltipWithBounds
                key={`${tooltipData.province}-${tooltipData.key}`}
                top={tooltipTop}
                left={tooltipLeft}
                style={{
                  ...defaultStyles,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  color: "#1e293b",
                  pointerEvents: "none",
                  zIndex: 200,
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div
                      className="w-2 h-4 rounded-[2px]"
                      style={{ backgroundColor: tooltipData.color }}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">
                      {tooltipData.province}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-secondary leading-tight uppercase">
                      {tooltipData.key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-xl font-black text-primary mt-1">
                      {tooltipData.value}%
                    </span>
                  </div>
                </div>
              </TooltipWithBounds>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <LegendOrdinal scale={colorScale}>
                {(labels) => (
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {labels.map((label, i) => (
                      <LegendItem key={`legend-${i}`} margin="0 8px">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              background: (label as { value: string }).value,
                            }}
                          />
                          <LegendLabel
                            align="left"
                            className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider"
                          >
                            {(label as { text: string }).text
                              .replace(/([A-Z])/g, " $1")
                              .trim()}
                          </LegendLabel>
                        </div>
                      </LegendItem>
                    ))}
                  </div>
                )}
              </LegendOrdinal>
            </div>
          </div>
        );
      }}
    </ParentSize>
  );
};

export const NutritionBarChart = (props: NutritionBarChartProps) => {
  return (
    <Card className="w-full bg-white/60 backdrop-blur-md border border-border/20 shadow-sm rounded-2xl overflow-hidden mb-8 relative hover:-translate-y-px transition-all duration-300">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      <CardHeader className="py-4 px-6 border-b border-border/10 bg-muted/5">
        <CardTitle className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Chart {...props} />
      </CardContent>
    </Card>
  );
};
