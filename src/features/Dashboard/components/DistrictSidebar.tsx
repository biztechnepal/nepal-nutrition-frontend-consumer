import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronRight } from "lucide-react";

// Representative list of some districts
const districts = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Bharatpur",
  "Biratnagar",
  "Birgunj",
  "Dharan",
  "Itahari",
  "Butwal",
  "Hetauda",
  "Janakpur",
  "Dhangadhi",
  "Nepalgunj",
  "Tulsipur",
  "Siddharthanagar",
  "Madhyapur Thimi",
  "Ghorahi",
  "Lekhnath",
  "Mechinagar",
];

export const DistrictSidebar = () => {
  return (
    <Card className="bg-white/50 backdrop-blur-md border border-border/40 shadow-lg flex flex-col h-full rounded-2xl">
      <CardHeader className="p-2 px-3 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="font-black text-[10px] uppercase tracking-widest text-secondary">
          Districts Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1 px-2 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-0.5">
            {districts.map((district) => (
              <button
                key={district}
                className="w-full flex items-center justify-between p-1 px-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300 group border border-transparent hover:border-border/50 text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-muted rounded-md group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                    <MapPin size={10} />
                  </div>
                  <span className="font-bold text-[10px] text-foreground/80 group-hover:text-secondary transition-colors truncate">
                    {district}
                  </span>
                </div>
                <ChevronRight
                  size={10}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
