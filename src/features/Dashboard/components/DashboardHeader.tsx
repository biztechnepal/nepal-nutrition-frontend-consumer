import React from "react";
import { Map as MapIcon } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between border-b pb-3 shrink-0">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-black text-secondary tracking-tight">
          Nutrition <span className="text-primary">Intelligence</span>
        </h1>
        <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest bg-muted px-2 py-0.5 rounded">
          MSNP III System
        </span>
      </div>
      <div className="hidden md:flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border scale-90 origin-right">
        <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
          <MapIcon size={16} />
        </div>
        <div className="pr-2">
          <span className="text-xs font-bold text-secondary text-nowrap">
            National Visualization
          </span>
        </div>
      </div>
    </div>
  );
};
