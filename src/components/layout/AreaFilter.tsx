"use client";

import React from "react";
import { ChevronDown, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/** One level of the province → district → local level cascade. */
export const AreaFilter = ({
  label,
  menuLabel,
  clearLabel,
  current,
  options,
  onPick,
}: {
  label: string;
  menuLabel: string;
  clearLabel: string;
  current: string | null;
  options: string[];
  onPick: (value: string | null) => void;
}) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-2 bg-white shrink-0 border-border/60 hover:bg-muted/50 transition-colors max-w-[180px]"
      >
        <MapPin
          size={14}
          className={current ? "text-primary" : "text-muted-foreground"}
        />
        <span className="font-bold text-secondary truncate">
          {current ?? label}
        </span>
        <ChevronDown size={14} className="text-muted-foreground ml-1 shrink-0" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">
        {menuLabel}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => onPick(null)}
        className="flex items-center justify-between"
      >
        <span className={!current ? "font-bold text-primary" : ""}>
          {clearLabel}
        </span>
        {!current && <Check size={14} className="text-primary" />}
      </DropdownMenuItem>
      {options.map((option) => (
        <DropdownMenuItem
          key={option}
          onClick={() => onPick(option)}
          className="flex items-center justify-between"
        >
          <span className={current === option ? "font-bold text-primary" : ""}>
            {option}
          </span>
          {current === option && <Check size={14} className="text-primary" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
