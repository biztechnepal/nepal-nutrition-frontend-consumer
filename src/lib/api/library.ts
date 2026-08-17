import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { PaginatedResponse } from "@/types/api.types";
import { AlbumDetail, AlbumSummary, Photo } from "@/types/library.types";

export const albumsApi = {
  findAllPaginated: async (params: {
    page: number;
    limit: number;
    locale?: string;
  }): Promise<PaginatedResponse<AlbumSummary>> => {
    const res = await apiClient.get(ENDPOINTS.ALBUMS.BASE, { params });
    return res.data;
  },

  findOne: async (
    slug: string,
    params?: { locale?: string }
  ): Promise<AlbumDetail> => {
    const res = await apiClient.get(ENDPOINTS.ALBUMS.BY_SLUG(slug), { params });
    return res.data?.data || res.data;
  },
};

export const photosApi = {
  findByAlbum: async (
    albumId: string,
    params: { page: number; limit: number; locale?: string }
  ): Promise<PaginatedResponse<Photo>> => {
    const res = await apiClient.get(ENDPOINTS.ALBUMS.PHOTOS(albumId), {
      params,
    });
    return res.data;
  },
};
