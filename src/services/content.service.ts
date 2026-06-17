import { ENDPOINTS } from "@/constants/endpoints";
import { APIResponse, PaginatedResponse } from "@/interfaces/api";
import {
  ChildContentDetail,
  Content,
  ContentDetail,
} from "@/interfaces/model/content.interface";
import apiClient from "@/lib/axios";

export const getContent = async (locale?: string) => {
  const res = await apiClient.get<PaginatedResponse<Content>>(
    ENDPOINTS.contents,
    {
      params: {
        page: 1,
        limit: 20,
        ...(locale ? { locale } : {}),
      },
    }
  );

  return res.data;
};

export const getContentDetails = async (slug: string, locale?: string) => {
  const res = await apiClient.get<APIResponse<ContentDetail>>(
    `${ENDPOINTS.contents}/${slug}`,
    {
      params: {
        ...(locale ? { locale } : {}),
      },
    }
  );

  return res.data;
};

export const getChildContentDetails = async (id: string, locale?: string) => {
  const res = await apiClient.get<APIResponse<ChildContentDetail>>(
    `${ENDPOINTS.childContents}/${id}`,
    {
      params: {
        ...(locale ? { locale } : {}),
      },
    }
  );

  return res.data;
};
