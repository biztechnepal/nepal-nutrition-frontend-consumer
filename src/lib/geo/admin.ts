import * as topojson from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type {
  GeometryCollection,
  Topology,
} from "topojson-specification";

import topologyImport from "@/data/nepal-admin.topo.json";

/**
 * Nepal's three administrative levels, read from one shared TopoJSON.
 *
 * Every feature carries the same four fields, so the map can treat a province,
 * a district and a local level identically and only vary which set it asks for.
 * See scripts/geo/README.md for how the file is produced.
 */

export type AdminLevel = "province" | "district" | "municipality";

export interface AdminProperties {
  code: string;
  name: string;
  /** Parent's `code`. Absent on provinces. */
  parent?: string;
  /** Municipalities only — the province code, so they can be coloured. */
  province?: string;
  /**
   * Municipalities only. `special` marks national parks, reserves and the
   * Lumbini Development Trust area: they exist so the map has no holes, but
   * they are not local governments and must not be offered as a selection.
   */
  kind?: "palika" | "special";
}

export type AdminFeature = Feature<Geometry, AdminProperties>;

const topology = topologyImport as unknown as Topology;

function read(object: "provinces" | "districts" | "municipalities"): AdminFeature[] {
  const collection = topology.objects[object] as GeometryCollection<AdminProperties>;
  const geo = topojson.feature(
    topology,
    collection,
  ) as unknown as FeatureCollection<Geometry, AdminProperties>;
  return geo.features;
}

export const PROVINCES: AdminFeature[] = read("provinces");
export const DISTRICTS: AdminFeature[] = read("districts");
export const MUNICIPALITIES: AdminFeature[] = read("municipalities");

/** Every unit, at any level, by its `code`. Codes are unique across levels. */
const byCode = new Map<string, AdminFeature>();
for (const feature of [...PROVINCES, ...DISTRICTS, ...MUNICIPALITIES]) {
  byCode.set(feature.properties.code, feature);
}

function groupByParent(features: AdminFeature[]) {
  const groups = new Map<string, AdminFeature[]>();
  for (const feature of features) {
    const parent = feature.properties.parent;
    if (!parent) continue;
    const bucket = groups.get(parent);
    if (bucket) bucket.push(feature);
    else groups.set(parent, [feature]);
  }
  for (const bucket of groups.values()) {
    bucket.sort((a, b) => a.properties.name.localeCompare(b.properties.name));
  }
  return groups;
}

const districtsByProvince = groupByParent(DISTRICTS);
const municipalitiesByDistrict = groupByParent(MUNICIPALITIES);

/**
 * Names are the public identifier: the `?province=` URL param already holds a
 * display name, and four other pages read it, so switching the URL to codes
 * would break them. Names are safe as keys here — district names are unique
 * nationally, and no district contains two local levels of the same name.
 */
function indexByName(features: AdminFeature[]) {
  const index = new Map<string, AdminFeature>();
  for (const feature of features) {
    index.set(feature.properties.name.toLowerCase(), feature);
  }
  return index;
}

const provincesByName = indexByName(PROVINCES);
const districtsByName = indexByName(DISTRICTS);

export const unitByCode = (code: string | null | undefined) =>
  code ? (byCode.get(code) ?? null) : null;

export const provinceByName = (name: string | null | undefined) =>
  name ? (provincesByName.get(name.toLowerCase()) ?? null) : null;

export const districtByName = (name: string | null | undefined) =>
  name ? (districtsByName.get(name.toLowerCase()) ?? null) : null;

export const districtsOf = (provinceCode: string | null | undefined) =>
  provinceCode ? (districtsByProvince.get(provinceCode) ?? []) : [];

export const municipalitiesOf = (districtCode: string | null | undefined) =>
  districtCode ? (municipalitiesByDistrict.get(districtCode) ?? []) : [];

/** Only the units a user may select — parks and reserves are excluded. */
export const palikasOf = (districtCode: string | null | undefined) =>
  municipalitiesOf(districtCode).filter((m) => m.properties.kind !== "special");

export const municipalityByName = (
  districtCode: string | null | undefined,
  name: string | null | undefined,
) => {
  if (!districtCode || !name) return null;
  const wanted = name.toLowerCase();
  return (
    municipalitiesOf(districtCode).find(
      (m) => m.properties.name.toLowerCase() === wanted,
    ) ?? null
  );
};

/**
 * All of Nepal as a single feature. The projection is fitted to this once and
 * then left alone, so zooming is a transform rather than a re-projection and
 * shapes stay put instead of morphing between levels.
 */
export const NEPAL: Feature<Geometry, Record<string, never>> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "GeometryCollection",
    geometries: PROVINCES.map((p) => p.geometry),
  },
};

/**
 * The selection, resolved from URL params to features. Anything that does not
 * resolve — a stale district under a newly changed province, a typo'd param —
 * comes back null, and callers treat that as "not selected" rather than
 * throwing or showing an empty map.
 */
export interface AdminSelection {
  province: AdminFeature | null;
  district: AdminFeature | null;
  municipality: AdminFeature | null;
  /** Deepest resolved unit, or null at the national view. */
  focus: AdminFeature | null;
  level: AdminLevel | "nation";
}

export function resolveSelection(params: {
  province?: string | null;
  district?: string | null;
  municipality?: string | null;
}): AdminSelection {
  const province = provinceByName(params.province);

  // A district only counts if it really sits in the selected province,
  // otherwise ?province=Koshi&district=Kaski would zoom somewhere absurd.
  const districtCandidate = districtByName(params.district);
  const district =
    province && districtCandidate?.properties.parent === province.properties.code
      ? districtCandidate
      : null;

  const municipality = municipalityByName(
    district?.properties.code,
    params.municipality,
  );

  const focus = municipality ?? district ?? province ?? null;
  const level = municipality
    ? "municipality"
    : district
      ? "district"
      : province
        ? "province"
        : "nation";

  return { province, district, municipality, focus, level };
}
