"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { createAdminIndex, type AdminIndex } from "./admin";

/**
 * Loads the three boundary layers once and shares them through context.
 * The files live in /public/geo (see mapgeojson.md) so they are fetched over
 * HTTP — gzipped and browser-cached — instead of riding in the JS bundle.
 */

let cache: Promise<AdminIndex> | null = null;

/**
 * Bumped whenever the boundary files change, so no cache layer between the
 * browser and /public can keep serving a stale layer.
 */
const GEOJSON_VERSION = "20260821";

async function fetchCollection<T>(file: string): Promise<T> {
  const response = await fetch(`/geo/${file}?v=${GEOJSON_VERSION}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${file}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function loadNepalAdmin(): Promise<AdminIndex> {
  if (!cache) {
    cache = Promise.all([
      fetchCollection<Parameters<typeof createAdminIndex>[0]>(
        "nepal-provinces.geojson",
      ),
      fetchCollection<Parameters<typeof createAdminIndex>[1]>(
        "nepal-districts.geojson",
      ),
      fetchCollection<Parameters<typeof createAdminIndex>[2]>(
        "nepal-local-levels.geojson",
      ),
    ]).then(
      ([provinces, districts, localLevels]) =>
        createAdminIndex(provinces, districts, localLevels),
    );
  }
  return cache;
}

// Start the transfer as soon as this module is evaluated — alongside
// hydration — rather than waiting for the provider's first effect.
if (typeof window !== "undefined") {
  loadNepalAdmin();
}

const NepalAdminContext = createContext<AdminIndex | null>(null);

export function NepalAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, setAdmin] = useState<AdminIndex | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadNepalAdmin().then((index) => {
      if (!cancelled) setAdmin(index);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <NepalAdminContext.Provider value={admin}>
      {children}
    </NepalAdminContext.Provider>
  );
}

/** Null until the boundary data has loaded; consumers render a loading state. */
export function useNepalAdmin(): AdminIndex | null {
  return useContext(NepalAdminContext);
}
