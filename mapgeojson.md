# Nepal boundary GeoJSON — provinces, districts, local levels

Exported from the MSNP-III codebase by `scripts/export-geojson.mjs`.
All coordinates are **WGS 84 lon/lat** (EPSG:4326), as RFC 7946 requires.

| File | Features | What |
|---|---|---|
| `nepal-provinces.geojson`    |   7 | प्रदेश — provinces 1–7 |
| `nepal-districts.geojson`    |  77 | जिल्ला — districts |
| `nepal-local-levels.geojson` | 753 | स्थानीय तह — municipalities and rural municipalities |

## Provenance

Derived from **manishacharya60/nepal-geojson** (ADM1/ADM2), which follows Nepal's
**official post-2020 map**. Simplified with Ramer–Douglas–Peucker and rounded to
4 decimal places (~11 m), which is why the files are small enough to ship in a
bundle. Check that repository for the upstream licence before redistributing.

This source was chosen deliberately over the more commonly used
`mesaugat/geoJSON-Nepal` and raw OSM extracts: **those do not carry the
Kalapani / Limpiyadhura / Lipulekh salient in Darchula**, so a map built on them
shows a boundary the Government of Nepal does not recognise. If you swap the
source in your project, verify the salient survives — see the check below.

## Properties

One vocabulary across all three layers, so joining them is plain equality:

| Key | Provinces | Districts | Local levels |
|---|---|---|---|
| `province` (1–7)   | ✅ | ✅ | ✅ |
| `provinceName`     | ✅ | ✅ | ✅ |
| `pcode` (NP-1…)    | ✅ | — | — |
| `district`         | — | ✅ | ✅ |
| `localLevel`       | — | — | ✅ |
| `type`             | — | — | ✅ |

`type` is one of `metropolitan_city` (6), `sub_metropolitan_city` (11),
`municipality` (276), `rural_municipality` (460).

Run the exporter with `--raw` to keep the original in-app keys instead
(`number`/`name` on provinces; `n`/`d`/`p`/`t` on local levels) — that shape is
what the MSNP dashboard components already read.

## Two things to know before you rely on this

**1. Names are spelled inconsistently, on purpose.** These are the spellings the
upstream GeoJSON uses; they do not always match a given database. MSNP carries a
fold table for this (`src/lib/utils/geo-names.ts`: `districtKey`,
`localLevelKey`, `matchLocalLevel`) covering cases like Dhanusha/Dhanusa. If you
join these files to your own records **by name**, expect to need something
similar. There are no stable IDs in this data.

**2. The local-level layer does not tile the district layer.** Summed by
district the two agree to a median of 0.1%, but eight districts differ sharply:

| District | District layer | Σ local levels | Gap |
|---|---|---|---|
| Bardiya      | 2,002 km² | 1,104 km² | 44.8% |
| Parsa        | 1,411 km² |   787 km² | 44.2% |
| Chitawan     | 2,243 km² | 1,336 km² | 40.4% |
| Rukum East   | 1,686 km² | 1,166 km² | 30.9% |
| Kanchanpur   | 1,623 km² | 1,224 km² | 24.6% |
| Baglung      | 1,837 km² | 1,526 km² | 16.9% |
| Darchula     | 2,666 km² | 2,281 km² | 14.4% |
| Nuwakot      | 1,195 km² | 1,082 km² |  9.4% |

These are not errors. Land outside any municipality — **national parks and
conservation areas** — belongs to no local level, so the local-level layer has
genuine holes there (Bardiya NP, Parsa NP, Chitwan NP, Shuklaphanta NP,
Shivapuri-Nagarjun NP, Api Nampa CA). Nationally: districts total 148,225 km²
against an official ~147,516 km²; local levels total 143,267 km².

**Darchula is the one to watch.** Its 385 km² gap is the Kalapani salient
itself: the province and district layers include it (Darchula reaches
30.4672°N, with vertices on Kalapani and Lipulekh), the local-level layer stops
at 30.2277°N. Render local levels over a district outline in the far north-west
and you will see a notch. Draw the district or province layer on top, or fill
the base map, if that matters to you.

## Verifying the salient survives a source swap

```js
const d = fc.features.find(f => f.properties.district === 'Darchula');
const lat = [];
JSON.stringify(d.geometry.coordinates).replace(/-?\d+\.\d+,(-?\d+\.\d+)/g,
  (_, y) => lat.push(+y));
console.log(Math.max(...lat)); // 30.4672 with the salient, ~30.23 without
```

## Using it

Drop the `.geojson` files anywhere your project serves static assets. They need
no library to parse — every mapping stack reads GeoJSON directly:
d3 (`d3.geoPath` with `d3.geoMercator().fitSize`), Leaflet (`L.geoJSON`),
MapLibre/Mapbox (a `geojson` source), deck.gl (`GeoJsonLayer`), or QGIS.

If bundle size matters, convert to TopoJSON — these layers share almost every
border, so it typically cuts them by 70–80%:

```bash
npx -p topojson-server -p topojson-simplify geo2topo \
  provinces=nepal-provinces.geojson \
  districts=nepal-districts.geojson \
  localLevels=nepal-local-levels.geojson > nepal.topojson
```
