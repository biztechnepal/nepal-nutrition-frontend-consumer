import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface IndicatorDetailHeaderProps {
  title: string;
  description: string;
}

export const IndicatorDetailHeader = ({
  title,
  description,
}: IndicatorDetailHeaderProps) => {
  return (
    <Card className="w-full bg-white/60 backdrop-blur-md border border-border/20 shadow-sm rounded-2xl overflow-hidden mb-8 relative">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
      <CardContent className="p-8 pl-10">
        <h1 className="text-[16px] font-black text-secondary uppercase tracking-[0.25em] mb-6">
          {title}
        </h1>
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed text-left">
          <p className="whitespace-pre-line text-[14px] font-semibold leading-8 opacity-80">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
