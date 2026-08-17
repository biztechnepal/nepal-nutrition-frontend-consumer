export interface SelectionPatch {
  province?: string | null;
  district?: string | null;
  municipality?: string | null;
}

/** Broad to narrow — a level is only valid while every level above it holds. */
const LEVELS = ["province", "district", "municipality"] as const;

/**
 * Applies a selection patch to the query string.
 *
 * Changing a level clears the levels below it unless the same patch sets them.
 * Without that, picking a different province would leave the old province's
 * district in the URL, and the map would be asked to zoom into a district that
 * is no longer on screen.
 */
export function applySelectionPatch(
  current: URLSearchParams,
  patch: SelectionPatch,
): URLSearchParams {
  const params = new URLSearchParams(current.toString());

  for (const [index, level] of LEVELS.entries()) {
    if (!(level in patch)) continue;

    const value = patch[level];
    if (value) params.set(level, value);
    else params.delete(level);

    for (const child of LEVELS.slice(index + 1)) {
      if (!(child in patch)) params.delete(child);
    }
  }

  return params;
}
