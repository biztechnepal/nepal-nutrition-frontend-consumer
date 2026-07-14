import { ENDPOINTS } from "@/constants/endpoints";
import { APIResponse, PaginatedResponse } from "@/interfaces/api";
import {
  AlbumDetail,
  AlbumSummary,
  Photo,
} from "@/interfaces/model/library.interface";
import apiClient from "@/lib/axios";

export const getAlbums = async (page = 1, locale?: string) => {
  const res = await apiClient.get<PaginatedResponse<AlbumSummary>>(
    ENDPOINTS.albums,
    {
      params: {
        page,
        limit: 12,
        ...(locale ? { locale } : {}),
      },
    }
  );

  return res.data;
};

export const getAlbumDetails = async (slug: string, locale?: string) => {
  const res = await apiClient.get<APIResponse<AlbumDetail>>(
    `${ENDPOINTS.albums}/${slug}`,
    {
      params: {
        ...(locale ? { locale } : {}),
      },
    }
  );

  return res.data;
};

export const getAlbumPhotos = async (
  albumId: string,
  page = 1,
  locale?: string
) => {
  const res = await apiClient.get<PaginatedResponse<Photo>>(
    `${ENDPOINTS.albums}/${albumId}/photos`,
    {
      params: {
        page,
        limit: 24,
        ...(locale ? { locale } : {}),
      },
    }
  );

  return res.data;
};
