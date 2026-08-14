import { ENDPOINTS } from "@/constants/endpoints";
import { APIResponse } from "@/interfaces/api";
import { ImpactIndicatorsResponse } from "@/interfaces/model/indicator.interface";
import apiClient from "@/lib/axios";

export const getImpactIndicators = async (locale?: string) => {
  const res = await apiClient.get<APIResponse<ImpactIndicatorsResponse>>(
    ENDPOINTS.impactIndicators,
    {
      params: {
        ...(locale ? { locale } : {}),
      },
    }
  );

  return res.data;
};
