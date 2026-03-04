import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IndicatorCardProps {
  title: string;
  value: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  status: "success" | "warning" | "error";
  icon?: React.ReactNode;
}

export const IndicatorCard = ({
  title,
  value,
  secondaryLabel,
  secondaryValue,
  status,
  icon,
}: IndicatorCardProps) => {
  const statusColors = {
    success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    error: "text-primary bg-primary/10 border-primary/20",
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg shadow-foreground/5 bg-white/60 backdrop-blur-md group hover:translate-y-[-2px] transition-all duration-300 rounded-2xl">
      <div
        className={cn(
          "h-1 w-full shrink-0",
          status === "success"
            ? "bg-emerald-500"
            : status === "warning"
              ? "bg-amber-500"
              : "bg-primary",
        )}
      />
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate mr-2">
            {title}
          </span>
          {icon && (
            <div
              className={cn("p-1.5 rounded-lg border", statusColors[status])}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="text-2xl font-black tracking-tighter text-secondary flex items-baseline gap-1">
            {value}
            <span className="text-[10px] font-bold opacity-40 uppercase">
              percent
            </span>
          </div>

          {secondaryLabel && secondaryValue && (
            <div className="mt-1 pt-2 border-t border-border/40 flex items-center justify-between">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">
                {secondaryLabel}
              </span>
              <Badge
                variant="outline"
                className="text-[9px] font-black h-4 px-1 border-border/40"
              >
                {secondaryValue}%
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
