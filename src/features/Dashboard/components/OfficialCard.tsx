"use client";

import React, { useCallback, useState } from "react";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OfficialCardProps {
  name: string;
  role: string;
  email: string;
  /** Path under `public/`. Falls back to initials until the file is added. */
  photoUrl?: string;
}

/**
 * Drops honorifics before initialising, so "Dr. Gunakar Bhatta" reads as GB
 * rather than DG.
 */
const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter((part) => part.length > 0 && !part.endsWith("."))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export const OfficialCard = ({
  name,
  role,
  email,
  photoUrl,
}: OfficialCardProps) => {
  // The portrait files are deployed assets, not part of the bundle, so a missing
  // one shouldn't leave a broken-image icon in the middle of the card.
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(photoUrl) && !photoFailed;

  /**
   * `onError` alone is not enough: the server renders the `<img>`, so a portrait
   * that 404s usually fails *before* hydration and the error event is long gone
   * by the time React attaches a handler. Once mounted, the element's own state
   * is the only reliable signal — a request that finished with no intrinsic
   * width did not decode.
   */
  const checkAlreadyFailed = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) {
      setPhotoFailed(true);
    }
  }, []);

  return (
    // `py-0` overrides the base card's vertical padding; the content padding
    // below is the only inset these need.
    <Card className="bg-muted/40 border-border/60 shadow-sm rounded-xl overflow-hidden py-0">
      <CardContent className="p-3 flex items-center gap-4">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={checkAlreadyFailed}
            src={photoUrl}
            alt={name}
            loading="lazy"
            onError={() => setPhotoFailed(true)}
            className="w-16 h-16 shrink-0 rounded-lg object-cover bg-white"
          />
        ) : (
          <div
            aria-hidden
            className="w-16 h-16 shrink-0 rounded-lg bg-white border border-border/60 flex items-center justify-center text-[15px] font-black text-secondary/60"
          >
            {getInitials(name)}
          </div>
        )}

        <div className="flex flex-col min-w-0 gap-0.5">
          <span className="text-[15px] font-black text-secondary leading-tight">
            {name}
          </span>
          <span className="text-[13px] font-bold text-muted-foreground leading-tight">
            {role}
          </span>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 mt-1 text-[13px] font-bold text-secondary/80 hover:text-primary transition-colors min-w-0"
          >
            <Mail size={14} className="shrink-0" />
            <span className="truncate">{email}</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
