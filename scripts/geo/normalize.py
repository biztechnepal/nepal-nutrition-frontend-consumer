"""Build one nesting-correct local-level layer for Nepal.

Geometry comes from a single source — geoBoundaries ADM3 (774 units, derived
from the Ministry of Federal Affairs' own local-level boundaries). District and
province outlines are then dissolved from it by mapshaper, so the three levels
nest exactly instead of disagreeing at the edges the way two independently
digitised layers would.

The one thing ADM3 lacks is parentage, so each unit is assigned to a district by
testing its centroid against the HDX COD-AB district layer, which carries the
official DIST_PCODE / ADM1_PCODE codes.

Output: adm3.geojson, every feature carrying
  code       stable id, "<district pcode>-<slug>"
  name       English name
  district   parent district pcode        e.g. NP0769
  province   parent province pcode        e.g. NP07
  distName   parent district name
  provName   parent province name
  kind       "palika" | "special"
"""

import collections
import json
import unicodedata

PROVINCE_NAMES = {
    "NP01": "Koshi",
    "NP02": "Madhesh",
    "NP03": "Bagmati",
    "NP04": "Gandaki",
    "NP05": "Lumbini",
    "NP06": "Karnali",
    "NP07": "Sudurpashchim",
}

# Parks, reserves and the Lumbini Development Trust area are ADM3 units in
# geoBoundaries but are not local governments. They stay in the geometry so the
# map has no holes, and are tagged so the UI renders them inert rather than
# offering them as a selection. Excluding these leaves exactly 753 palikas.
#
# "development area" must not swallow the Lumbini Sanskritik *rural
# municipality*, which is a separate, much larger unit of a very similar name.
SPECIAL_WORDS = ("national park", "wildlife reserve", "hunting reserve",
                 "conservation area", "watershed", "development area")


def polygons(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon":
        return list(geom["coordinates"])
    return []


def rings(geom):
    return [poly[0] for poly in polygons(geom) if poly]


def area_centroid(geom):
    """Area-weighted centroid over outer rings. Planar maths, which is accurate
    enough at Nepal's scale for the only question asked of it: which district."""
    tx = ty = ta = 0.0
    for ring in rings(geom):
        a = cx = cy = 0.0
        for i in range(len(ring) - 1):
            x0, y0 = ring[i][0], ring[i][1]
            x1, y1 = ring[i + 1][0], ring[i + 1][1]
            cross = x0 * y1 - x1 * y0
            a += cross
            cx += (x0 + x1) * cross
            cy += (y0 + y1) * cross
        if a == 0:
            continue
        a *= 0.5
        w = abs(a)
        tx += (cx / (6 * a)) * w
        ty += (cy / (6 * a)) * w
        ta += w
    if ta == 0:
        pts = [p for ring in rings(geom) for p in ring]
        return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)
    return tx / ta, ty / ta


def bbox(geom):
    xs, ys = [], []
    for ring in rings(geom):
        for p in ring:
            xs.append(p[0])
            ys.append(p[1])
    return min(xs), min(ys), max(xs), max(ys)


def in_ring(x, y, ring):
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside


def contains(geom, x, y):
    for poly in polygons(geom):
        if poly and in_ring(x, y, poly[0]) and not any(
            in_ring(x, y, hole) for hole in poly[1:]
        ):
            return True
    return False


def sample_points(geom, target=64):
    """Points spread through the interior, for a majority-area style join.

    A single centroid gets border units wrong: the ADM3 layer (2019) and the
    district layer (2017) were digitised separately, so a centroid sitting 200 m
    the wrong side of a seam flips the whole unit into a neighbouring district.
    Sampling the interior and letting the bulk of the area decide is stable
    against that, and against concave shapes whose centroid falls outside.
    """
    x0, y0, x1, y1 = bbox(geom)
    span = max(x1 - x0, y1 - y0) or 1e-9
    step = span / 12
    pts = []
    y = y0 + step / 2
    while y < y1:
        x = x0 + step / 2
        while x < x1:
            if contains(geom, x, y):
                pts.append((x, y))
            x += step
        y += step
    if not pts:
        pts = [area_centroid(geom)]
    if len(pts) > target:
        stride = len(pts) / target
        pts = [pts[int(i * stride)] for i in range(target)]
    return pts


def slug(text):
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    out = "".join(c.lower() if c.isalnum() else "-" for c in text)
    while "--" in out:
        out = out.replace("--", "-")
    return out.strip("-")


def load(path):
    with open(path) as fh:
        return json.load(fh)["features"]


def main():
    log = []

    districts = []
    for f in load("nepal-districts-new.geojson"):
        p = f["properties"]
        districts.append({
            "code": p["DIST_PCODE"],
            "name": p["DIST_EN"],
            "province": p["ADM1_PCODE"],
            "geometry": f["geometry"],
        })
    log.append(f"districts (parent index): {len(districts)}")

    index = [(d, bbox(d["geometry"])) for d in districts]
    centroids = {d["code"]: area_centroid(d["geometry"]) for d in districts}

    adm3 = load("gb-adm3.geojson")
    log.append(f"adm3 source features: {len(adm3)}")

    def district_at(x, y):
        for d, (x0, y0, x1, y1) in index:
            if x0 <= x <= x1 and y0 <= y <= y1 and contains(d["geometry"], x, y):
                return d
        return None

    out = []
    by_vote = by_nearest = 0
    unanimous = 0
    used_codes = collections.Counter()

    for f in adm3:
        geom = f["geometry"]
        name = (f["properties"].get("shapeName") or "").strip()

        votes = collections.Counter()
        for x, y in sample_points(geom):
            d = district_at(x, y)
            if d:
                votes[d["code"]] += 1

        if votes:
            winner = votes.most_common(1)[0]
            parent = next(d for d in districts if d["code"] == winner[0])
            by_vote += 1
            if len(votes) == 1:
                unanimous += 1
        else:
            cx, cy = area_centroid(geom)
            parent = min(
                districts,
                key=lambda d: (centroids[d["code"]][0] - cx) ** 2
                + (centroids[d["code"]][1] - cy) ** 2,
            )
            by_nearest += 1

        lowered = name.lower()
        kind = "special" if any(w in lowered for w in SPECIAL_WORDS) else "palika"

        code = f"{parent['code']}-{slug(name)}"
        used_codes[code] += 1
        if used_codes[code] > 1:
            # Same name twice inside one district — only happens where a park is
            # split into disjoint pieces. Suffix keeps the key unique.
            code = f"{code}-{used_codes[code]}"

        out.append({
            "type": "Feature",
            "properties": {
                "code": code,
                "name": name,
                "district": parent["code"],
                "province": parent["province"],
                "distName": parent["name"],
                "provName": PROVINCE_NAMES[parent["province"]],
                "kind": kind,
            },
            "geometry": geom,
        })

    out.sort(key=lambda f: f["properties"]["code"])
    log.append(
        f"joined: {by_vote} by area vote ({unanimous} unanimous), "
        f"{by_nearest} by nearest-district"
    )

    kinds = collections.Counter(f["properties"]["kind"] for f in out)
    log.append(f"kinds: {dict(kinds)}")

    per_district = collections.Counter(f["properties"]["district"] for f in out)
    empty = [d["name"] for d in districts if per_district[d["code"]] == 0]
    log.append(f"districts with no unit: {empty or 'none'}")
    log.append(
        "units per district: min %d max %d"
        % (min(per_district.values()), max(per_district.values()))
    )

    per_province = collections.Counter(f["properties"]["province"] for f in out)
    log.append("units per province: " + ", ".join(
        f"{PROVINCE_NAMES[k]}={per_province[k]}" for k in sorted(per_province)
    ))
    dist_per_prov = collections.Counter(d["province"] for d in districts)
    log.append("districts per province: " + ", ".join(
        f"{PROVINCE_NAMES[k]}={dist_per_prov[k]}" for k in sorted(dist_per_prov)
    ))

    # The join is only trustworthy if it reproduces the published local-level
    # counts, so check them rather than eyeballing the map afterwards.
    OFFICIAL = {"Koshi": 137, "Madhesh": 136, "Bagmati": 119, "Gandaki": 85,
                "Lumbini": 109, "Karnali": 79, "Sudurpashchim": 88}
    got = collections.Counter(
        f["properties"]["provName"] for f in out if f["properties"]["kind"] == "palika"
    )
    bad = {k: (got[k], v) for k, v in OFFICIAL.items() if got[k] != v}
    log.append(f"palika totals: {sum(got.values())} (official {sum(OFFICIAL.values())})")
    if bad:
        log.append(f"WARNING palika count mismatch (got, official): {bad}")
    else:
        log.append("palika counts match published figures for all 7 provinces")

    with open("adm3.geojson", "w") as fh:
        json.dump({"type": "FeatureCollection", "features": out}, fh)

    print("\n".join(log))


if __name__ == "__main__":
    main()
