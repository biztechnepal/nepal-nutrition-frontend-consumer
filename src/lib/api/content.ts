import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import {
  ChildContentDetail,
  Content,
  ContentDetail,
} from "@/types/content.types";
import { PaginatedResponse } from "@/types/api.types";

export const contentApi = {
  findAll: async (params?: { locale?: string }): Promise<Content[]> => {
    const res = await apiClient.get(ENDPOINTS.CONTENTS.BASE, {
      params: { page: 1, limit: 20, ...params },
    });
    return res.data?.data || res.data || [];
  },

  findAllPaginated: async (params: {
    page: number;
    limit: number;
    locale?: string;
  }): Promise<PaginatedResponse<Content>> => {
    const res = await apiClient.get(ENDPOINTS.CONTENTS.BASE, { params });
    return res.data;
  },

  findOne: async (
    slug: string,
    params?: { locale?: string }
  ): Promise<ContentDetail> => {
    const res = await apiClient.get(ENDPOINTS.CONTENTS.BY_SLUG(slug), {
      params,
    });
    return res.data?.data || res.data;
  },
};

export const childContentApi = {
  findOne: async (
    id: string,
    params?: { locale?: string }
  ): Promise<ChildContentDetail> => {
    const res = await apiClient.get(ENDPOINTS.CHILD_CONTENTS.BY_ID(id), {
      params,
    });
    return res.data?.data || res.data;
  },
};
