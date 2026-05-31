import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IndicatorCardProps {
  title: string;
  subtitle?: string; // Summarized info like "U5 • SDG 2.2.1"
  value: string;
  target?: string;
  status: "success" | "warning" | "error";
  icon?: React.ReactNode;
}

export const IndicatorCard = ({
  title,
  subtitle,
  value,
  target,
  status,
  icon,
}: IndicatorCardProps) => {
  const statusColors = {
    success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    error: "text-primary bg-primary/10 border-primary/20",
  };

  const statusBg = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-primary",
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white/60 backdrop-blur-md group hover:-translate-y-px transition-all duration-300 rounded-xl relative">
      {/* Side status indicator instead of top bar to save space */}
      <div
        className={cn("absolute left-0 top-0 bottom-0 w-1", statusBg[status])}
      />

      <CardContent className="p-3 pl-4 flex flex-col gap-1.5 min-h-[115px] justify-between">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-black text-secondary leading-tight truncate mb-0.5">
              {title}
            </span>
            {subtitle && (
              <span className="text-[10px] font-bold text-muted-foreground opacity-70 leading-tight line-clamp-2">
                {subtitle}
              </span>
            )}
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
          <span className="text-2xl font-black tracking-tighter text-secondary leading-none">
            {value}
          </span>
          <span className="text-[10px] font-black opacity-30">
            %
          </span>
        </div>

        {target && (
          <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-0.5">
            <span className="text-[9px] font-black text-muted-foreground/60 tracking-tight">
              2030 Target
            </span>
            <Badge
              variant="outline"
              className="text-[9px] font-black h-4 px-1.5 border-border/30 bg-muted/5 text-secondary/70"
            >
              {target}%
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
