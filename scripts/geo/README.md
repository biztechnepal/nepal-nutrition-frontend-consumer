# Nepal administrative boundaries

`src/data/nepal-admin.topo.json` holds all three administrative levels — 7
provinces, 77 districts, 753 local levels — in one TopoJSON. Run
`./scripts/geo/build.sh` to regenerate it.

## Layers

One shared arc table, three objects. Every feature uses the same field names:

| object           | count | `code`                    | `name`          | `parent`      | extra                 |
| ---------------- | ----- | ------------------------- | --------------- | ------------- | --------------------- |
| `provinces`      | 7     | `NP01`…`NP07`             | `Koshi`         | —             |                       |
| `districts`      | 77    | `NP0101`                  | `Taplejung`     | province code |                       |
| `municipalities` | 774   | `NP0101-aathrai-tribeni`  | `Aathrai Tribeni` | district code | `province`, `kind`  |

`kind` is `palika` for the 753 real local governments and `special` for the 21
national parks, reserves and the Lumbini Development Trust area. Those are kept
in the geometry so the map has no holes, and are meant to render inert rather
than appear as a selectable unit.

## Sources

- **Geometry** — [geoBoundaries](https://www.geoboundaries.org) `gbOpen/NPL/ADM3`,
  pinned to commit `9469f09`. Originally the Ministry of Federal Affairs and
  General Administration's own local-level boundaries, via Open Data Nepal.
  CC-BY 4.0.
- **District codes and names** — the HDX COD-AB district layer, which is the
  only clean source of the official `DIST_PCODE` / `ADM1_PCODE` codes.

## Why it is built this way

**District and province outlines are dissolved from the local-level geometry**
rather than taken from their own layers. Independently digitised layers disagree
along shared edges, which shows up as slivers and double-drawn borders when you
stack them. Dissolving guarantees the three levels nest exactly, and lets
TopoJSON share one arc between a municipality edge, its district edge and its
province edge.

**Parentage is a spatial join, not a name match.** geoBoundaries ADM3 carries
only `shapeName` — no parent, no code. Matching on district *name* fails,
because the district spellings differ between sources ("Chitwan"/"Chitawan") and
some sources predate the Nawalparasi and Rukum splits.

The join samples a grid of interior points per unit and takes the district
holding the most of them. A single centroid test is not enough: the ADM3 layer
(2019) and the district layer (2017) were digitised separately, so a centroid
sitting a couple of hundred metres the wrong side of a seam flips an entire unit
into a neighbouring district. Switching from centroid to area vote fixed four
such misassignments.

`normalize.py` asserts the result against the published local-level counts per
province (137/136/119/85/109/79/88). If a source is ever swapped and the join
degrades, the build says so instead of shipping a quietly wrong hierarchy.

## Known limitation

geoBoundaries ADM2 was evaluated for the district codes and rejected: it ships
75 features for 77 districts, with `Bara` and `Saptari` duplicated, four
districts missing, and several misspellings (`Baijura`, `Synagja`,
`Dadeidhura`). The HDX layer is used instead purely as a source of codes and
names — none of its geometry reaches the output.
