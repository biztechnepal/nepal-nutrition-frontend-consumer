export const ENDPOINTS = {
  CONTENTS: {
    BASE: "/contents",
    BY_SLUG: (slug: string) => `/contents/${slug}`,
  },
  CHILD_CONTENTS: {
    BASE: "/child-contents",
    BY_ID: (id: string) => `/child-contents/${id}`,
  },
  ALBUMS: {
    BASE: "/albums",
    BY_SLUG: (slug: string) => `/albums/${slug}`,
    PHOTOS: (id: string) => `/albums/${id}/photos`,
  },
  DASHBOARD: {
    IMPACT_INDICATORS: "/dashboard/impact-indicators",
  },
} as const;
