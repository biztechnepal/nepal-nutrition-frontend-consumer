import { ENDPOINTS } from "@/constants/endpoints";
import { APIResponse, PaginatedResponse } from "@/interfaces/api";
import {
  ChildContentDetail,
  Content,
  ContentDetail,
} from "@/interfaces/model/content.interface";
import apiClient from "@/lib/axios";

export const getContent = async () => {
  const res = await apiClient.get<PaginatedResponse<Content>>(
    ENDPOINTS.contents,
    {
      params: {
        page: 1,
        limit: 20,
      },
    }
  );

  return res.data;
};

export const getContentDetails = async (slug: string) => {
  const res = await apiClient.get<APIResponse<ContentDetail>>(
    `${ENDPOINTS.contents}/${slug}`
  );

  return res.data;
};

export const getChildContentDetails = async (id: string) => {
  const res = await apiClient.get<APIResponse<ChildContentDetail>>(
    `${ENDPOINTS.childContents}/${id}`
  );

  return res.data;
};
