"use client";

import React, { useState } from "react";
import { Accessibility } from "lucide-react";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AccessibilitySidebar from "./AccessibilitySidebar";

export default function AccessibilityFab() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="xl"
          className="fixed bottom-6 right-6 z-[100] size-14 rounded-full shadow-lg"
          aria-label="Open accessibility settings"
        >
          <Accessibility className="size-6" />
        </Button>
      </SheetTrigger>
      <AccessibilitySidebar />
    </Sheet>
  );
}
