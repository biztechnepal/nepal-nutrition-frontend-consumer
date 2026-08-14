import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IndicatorCardProps {
  /**
   * The indicator's own name from the plan. These run long — a clause naming the
   * population and its SDG reference — so the card wraps rather than truncates.
   */
  title: string;
  value: string;
  /** Unit the value is measured in — every impact indicator is a percentage. */
  unit?: string;
  /** Pre-formatted, unit included — targets carry comparators like `<15%`. */
  target?: string;
  /** Label above the target badge, e.g. the fiscal year the target belongs to. */
  targetLabel?: string;
  /** `neutral` is for indicators with no baseline recorded yet. */
  status: "success" | "warning" | "error" | "neutral";
  icon?: React.ReactNode;
}

export const IndicatorCard = ({
  title,
  value,
  unit = "%",
  target,
  targetLabel = "2030 Target",
  status,
  icon,
}: IndicatorCardProps) => {
  const statusColors = {
    success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    error: "text-primary bg-primary/10 border-primary/20",
    neutral: "text-muted-foreground bg-muted/20 border-border/40",
  };

  const statusBg = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-primary",
    neutral: "bg-border",
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white/60 backdrop-blur-md group hover:-translate-y-px transition-all duration-300 rounded-xl relative">
      {/* Side status indicator instead of top bar to save space */}
      <div
        className={cn("absolute left-0 top-0 bottom-0 w-1", statusBg[status])}
      />

      <CardContent className="p-3 pl-4 flex flex-col gap-1.5 min-h-48 justify-between">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-w-0">
            {/* Clamped generously rather than to one line: these are the plan's
                own indicator names, and the population they cover is usually in
                the tail of the clause. `title` keeps the rest reachable. */}
            <span
              title={title}
              className="text-[13px] font-black text-secondary leading-snug line-clamp-4 mb-0.5"
            >
              {title}
            </span>
          </div>

          {icon && (
            <div
              className={cn(
                "p-1.5 rounded-md border shrink-0",
                statusColors[status],
              )}
            >
              <div className="scale-90 origin-center">{icon}</div>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-3xl font-black tracking-tighter text-secondary leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-[12px] font-black opacity-30">{unit}</span>
          )}
        </div>

        {target && (
          <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-0.5">
            <span className="text-[11px] font-black text-muted-foreground/60 tracking-tight">
              {targetLabel}
            </span>
            <Badge
              variant="outline"
              className="text-[11px] font-black h-5 px-1.5 border-border/30 bg-muted/5 text-secondary/70"
            >
              {target}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
