"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AreaFilter } from "./AreaFilter";
import { districtsOf, palikasOf, resolveSelection } from "@/lib/geo/admin";
import { applySelectionPatch, type SelectionPatch } from "@/lib/geo/selection-params";

/**
 * The district and local-level dropdowns.
 *
 * Split out of Header and loaded on demand because it is the only part of the
 * header that needs the boundary data. Header renders on every page, so a
 * static import here would put the ~330 KB TopoJSON in the shared chunk and
 * make the gallery and content pages pay for a map they never show.
 */
export default function SubProvinceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selection = resolveSelection({
    province: searchParams.get("province"),
    district: searchParams.get("district"),
    municipality: searchParams.get("municipality"),
  });

  if (!selection.province) return null;

  const apply = (patch: SelectionPatch) => {
    const params = applySelectionPatch(searchParams, patch);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <AreaFilter
        label="District"
        menuLabel="Select District"
        clearLabel="All Districts"
        current={selection.district?.properties.name ?? null}
        options={districtsOf(selection.province.properties.code).map(
          (d) => d.properties.name,
        )}
        onPick={(value) => apply({ district: value })}
      />

      {selection.district && (
        <AreaFilter
          label="Local Level"
          menuLabel="Select Local Level"
          clearLabel="All Local Levels"
          current={selection.municipality?.properties.name ?? null}
          options={palikasOf(selection.district.properties.code).map(
            (m) => m.properties.name,
          )}
          onPick={(value) => apply({ municipality: value })}
        />
      )}
    </>
  );
}
