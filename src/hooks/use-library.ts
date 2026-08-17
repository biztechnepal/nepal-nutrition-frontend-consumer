import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { albumsApi, photosApi } from "@/lib/api/library";

const LIBRARY_QUERY_KEY = ["library"];
const ALBUMS_QUERY_KEY = [...LIBRARY_QUERY_KEY, "albums"];
const PHOTOS_QUERY_KEY = [...LIBRARY_QUERY_KEY, "photos"];

export function useAlbumListInfinite(locale?: string) {
  return useInfiniteQuery({
    queryKey: [...ALBUMS_QUERY_KEY, "infinite", locale],
    queryFn: ({ pageParam }) =>
      albumsApi.findAllPaginated({ page: pageParam, limit: 12, locale }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useAlbum(slug: string, locale?: string) {
  return useQuery({
    queryKey: [...ALBUMS_QUERY_KEY, slug, locale],
    queryFn: () => albumsApi.findOne(slug, { locale }),
    enabled: !!slug,
  });
}

export function useAlbumPhotosInfinite(albumId?: string, locale?: string) {
  return useInfiniteQuery({
    queryKey: [...PHOTOS_QUERY_KEY, "infinite", albumId, locale],
    queryFn: ({ pageParam }) =>
      photosApi.findByAlbum(albumId!, { page: pageParam, limit: 24, locale }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!albumId,
  });
}
