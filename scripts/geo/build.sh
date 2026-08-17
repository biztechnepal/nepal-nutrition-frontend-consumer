#!/usr/bin/env bash
#
# Regenerates src/data/nepal-admin.topo.json.
#
# Run from anywhere:  ./scripts/geo/build.sh
# Requires: bash, curl, python3, npx (mapshaper is fetched on demand).
#
# See README.md in this directory for why the sources are what they are.

set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo="$(cd "$here/../.." && pwd)"
work="${TMPDIR:-/tmp}/nepal-admin-build"
out="$repo/src/data/nepal-admin.topo.json"

mkdir -p "$work"
cd "$work"

# Pinned to a geoBoundaries commit so a rebuild is reproducible rather than
# silently picking up a new upstream release.
GB_COMMIT=9469f09
ADM3_URL="https://github.com/wmgeolab/geoBoundaries/raw/$GB_COMMIT/releaseData/gbOpen/NPL/ADM3/geoBoundaries-NPL-ADM3_simplified.geojson"
ADM2_URL="https://raw.githubusercontent.com/mesaugat/geoJSON-Nepal/master/nepal-districts-new.geojson"

fetch() {
  if [ -s "$2" ]; then
    echo "  cached  $2"
  else
    echo "  fetch   $2"
    curl -fsSL --retry 3 -o "$2" "$1"
  fi
}

echo "==> sources"
fetch "$ADM3_URL" gb-adm3.geojson
fetch "$ADM2_URL" nepal-districts-new.geojson

echo "==> normalise + attach parentage"
python3 "$here/normalize.py"

echo "==> simplify, dissolve, write topojson"
# 30% vertex retention is generous, but the whole file is still ~330 KB because
# all three levels share one arc table. `keep-shapes` stops small palikas from
# collapsing, and `clean` repairs the slivers simplification introduces before
# the dissolve, otherwise district outlines come out with pinholes.
npx --yes mapshaper adm3.geojson name=municipalities \
  -simplify 30% keep-shapes \
  -clean \
  -dissolve2 district copy-fields=distName,province,provName + name=districts \
  -dissolve2 province copy-fields=provName + name=provinces \
  -target municipalities -rename-fields parent=district \
    -filter-fields code,name,parent,province,kind \
  -target districts -rename-fields code=district,name=distName,parent=province \
    -filter-fields code,name,parent \
  -target provinces -rename-fields code=province,name=provName \
    -filter-fields code,name \
  -o "$out" format=topojson quantization=1e5 \
    target=provinces,districts,municipalities

echo "==> wrote $out ($(wc -c <"$out") bytes)"
