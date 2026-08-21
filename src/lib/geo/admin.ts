import { geoArea } from "d3-geo";
import type { Feature, FeatureCollection, Geometry, Polygon } from "geojson";

/**
 * Nepal's three administrative levels, read at runtime from the GeoJSON files
 * served out of /public/geo (see mapgeojson.md). The raw layers carry no
 * stable IDs, so this module synthesizes codes from the name hierarchy and
 * normalizes everything into one AdminProperties shape, after which a
 * province, a district and a local level can be treated identically.
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
   * Municipalities only. The upstream local-level layer has no park features,
   * so today every unit is a palika; `special` remains part of the vocabulary
   * in case inert overlay units come back.
   */
  kind?: "palika" | "special";
}

export type AdminFeature = Feature<Geometry, AdminProperties>;

/** Property shapes of the three raw GeoJSON layers. */
interface RawProvinceProps {
  province: number;
  provinceName: string;
  pcode: string;
}
interface RawDistrictProps {
  province: number;
  provinceName: string;
  district: string;
}
interface RawLocalLevelProps {
  province: number;
  provinceName: string;
  district: string;
  localLevel: string;
  type: string;
}

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The upstream data spells it Sudurpaschim; the app's colour constants and
 * every URL already issued use Sudurpashchim. Canonicalize on load so both
 * spellings resolve to one feature.
 */
const PROVINCE_NAME_ALIASES: Record<string, string> = {
  sudurpaschim: "Sudurpashchim",
};

const canonicalProvinceName = (name: string) =>
  PROVINCE_NAME_ALIASES[name.toLowerCase()] ?? name;

/**
 * The upstream export writes most rings clockwise, which RFC 7946 and d3's
 * spherical geometry both read as the complement of the shape — districts and
 * local levels rendered as planet-sized ghosts. A polygon whose spherical
 * area exceeds half the globe is inverted; reversing its rings restores it.
 */
function normalizePolygon(coordinates: Polygon["coordinates"]) {
  return coordinates.map((ring) => [...ring].reverse());
}

function normalizeGeometry<G extends Geometry>(geometry: G): G {
  if (geometry.type === "Polygon") {
    return geoArea(geometry) > 2 * Math.PI
      ? { ...geometry, coordinates: normalizePolygon(geometry.coordinates) }
      : geometry;
  }
  if (geometry.type === "MultiPolygon") {
    let changed = false;
    const coordinates = geometry.coordinates.map((polygon) => {
      if (geoArea({ type: "Polygon", coordinates: polygon }) > 2 * Math.PI) {
        changed = true;
        return normalizePolygon(polygon);
      }
      return polygon;
    });
    return changed ? { ...geometry, coordinates } : geometry;
  }
  return geometry;
}

export interface AdminIndex {
  PROVINCES: AdminFeature[];
  DISTRICTS: AdminFeature[];
  MUNICIPALITIES: AdminFeature[];
  NEPAL: Feature<Geometry, Record<string, never>>;
  unitByCode(code: string | null | undefined): AdminFeature | null;
  provinceByName(name: string | null | undefined): AdminFeature | null;
  districtByName(name: string | null | undefined): AdminFeature | null;
  districtsOf(provinceCode: string | null | undefined): AdminFeature[];
  municipalitiesOf(districtCode: string | null | undefined): AdminFeature[];
  palikasOf(districtCode: string | null | undefined): AdminFeature[];
  municipalityByName(
    districtCode: string | null | undefined,
    name: string | null | undefined,
  ): AdminFeature | null;
  resolveSelection(params: {
    province?: string | null;
    district?: string | null;
    municipality?: string | null;
  }): AdminSelection;
}

export function createAdminIndex(
  provinces: FeatureCollection<Geometry, RawProvinceProps>,
  districts: FeatureCollection<Geometry, RawDistrictProps>,
  localLevels: FeatureCollection<Geometry, RawLocalLevelProps>,
): AdminIndex {
  const provinceFeatures: AdminFeature[] = provinces.features.map((f) => ({
    ...f,
    geometry: normalizeGeometry(f.geometry),
    properties: {
      code: f.properties.pcode,
      name: canonicalProvinceName(f.properties.provinceName),
    },
  }));

  const districtFeatures: AdminFeature[] = districts.features.map((f) => {
    const pcode = `NP-${f.properties.province}`;
    const code = `${pcode}:${slug(f.properties.district)}`;
    return {
      ...f,
      geometry: normalizeGeometry(f.geometry),
      properties: {
        code,
        name: f.properties.district,
        parent: pcode,
      },
    };
  });

  const municipalityFeatures: AdminFeature[] = localLevels.features.map(
    (f) => {
      const districtCode = `NP-${f.properties.province}:${slug(
        f.properties.district,
      )}`;
      return {
        ...f,
        geometry: normalizeGeometry(f.geometry),
        properties: {
          code: `${districtCode}:${slug(f.properties.localLevel)}`,
          name: f.properties.localLevel,
          parent: districtCode,
          province: canonicalProvinceName(f.properties.provinceName),
          kind: "palika" as const,
        },
      };
    },
  );

  const byCode = new Map<string, AdminFeature>();
  for (const feature of [
    ...provinceFeatures,
    ...districtFeatures,
    ...municipalityFeatures,
  ]) {
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

  const districtsByProvince = groupByParent(districtFeatures);
  const municipalitiesByDistrict = groupByParent(municipalityFeatures);

  /**
   * Names are the public identifier: the `?province=` URL param holds a
   * display name and several pages read it. District names are unique
   * nationally, and no district contains two local levels of the same name.
   */
  function indexByName(features: AdminFeature[]) {
    const index = new Map<string, AdminFeature>();
    for (const feature of features) {
      index.set(feature.properties.name.toLowerCase(), feature);
    }
    return index;
  }

  const provincesByName = indexByName(provinceFeatures);
  const districtsByName = indexByName(districtFeatures);

  // The canonical name is indexed under its upstream spelling too, so a URL
  // written against the raw GeoJSON resolves to the same feature.
  for (const [alias, canonical] of Object.entries(PROVINCE_NAME_ALIASES)) {
    const feature = provincesByName.get(canonical.toLowerCase());
    if (feature) provincesByName.set(alias, feature);
  }

  const NEPAL: Feature<Geometry, Record<string, never>> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "GeometryCollection",
      geometries: provinceFeatures.map((p) => p.geometry),
    },
  };

  const resolveSelection = (params: {
    province?: string | null;
    district?: string | null;
    municipality?: string | null;
  }): AdminSelection => {
    const province =
      params.province
        ? (provincesByName.get(params.province.toLowerCase()) ?? null)
        : null;

    // A district only counts if it really sits in the selected province,
    // otherwise ?province=Koshi&district=Kaski would zoom somewhere absurd.
    const districtCandidate = params.district
      ? (districtsByName.get(params.district.toLowerCase()) ?? null)
      : null;
    const district =
      province &&
      districtCandidate?.properties.parent === province.properties.code
        ? districtCandidate
        : null;

    let municipality: AdminFeature | null = null;
    if (district && params.municipality) {
      const wanted = params.municipality.toLowerCase();
      municipality =
        (municipalitiesByDistrict.get(district.properties.code) ?? []).find(
          (m) => m.properties.name.toLowerCase() === wanted,
        ) ?? null;
    }

    const focus = municipality ?? district ?? province ?? null;
    const level: AdminLevel | "nation" = municipality
      ? "municipality"
      : district
        ? "district"
        : province
          ? "province"
          : "nation";

    return { province, district, municipality, focus, level };
  };

  return {
    PROVINCES: provinceFeatures,
    DISTRICTS: districtFeatures,
    MUNICIPALITIES: municipalityFeatures,
    NEPAL,
    unitByCode: (code) => (code ? (byCode.get(code) ?? null) : null),
    provinceByName: (name) =>
      name ? (provincesByName.get(name.toLowerCase()) ?? null) : null,
    districtByName: (name) =>
      name ? (districtsByName.get(name.toLowerCase()) ?? null) : null,
    districtsOf: (provinceCode) =>
      provinceCode ? (districtsByProvince.get(provinceCode) ?? []) : [],
    municipalitiesOf: (districtCode) =>
      districtCode ? (municipalitiesByDistrict.get(districtCode) ?? []) : [],
    palikasOf: (districtCode) =>
      (municipalitiesByDistrict.get(districtCode ?? "") ?? []).filter(
        (m) => m.properties.kind !== "special",
      ),
    municipalityByName: (districtCode, name) => {
      if (!districtCode || !name) return null;
      const wanted = name.toLowerCase();
      return (
        (municipalitiesByDistrict.get(districtCode) ?? []).find(
          (m) => m.properties.name.toLowerCase() === wanted,
        ) ?? null
      );
    },
    resolveSelection,
  };
}

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

/** What components render against before the GeoJSON has loaded. */
export const EMPTY_SELECTION: AdminSelection = {
  province: null,
  district: null,
  municipality: null,
  focus: null,
  level: "nation",
};
