/**
 * Resolves a backend-relative media path (e.g. /uploads/library/...) against
 * the API origin. NEXT_PUBLIC_API_URL includes /api/v1, which is stripped.
 */
export function resolveMediaUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  const origin = (process.env.NEXT_PUBLIC_API_URL || "").replace(
    /\/api\/v1\/?$/,
    ""
  );
  return `${origin}${path}`;
}
