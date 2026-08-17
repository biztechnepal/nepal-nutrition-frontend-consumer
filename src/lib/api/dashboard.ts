import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { ApiResponse } from "@/types/api.types";
import { ImpactIndicatorsResponse } from "@/types/indicator.types";

export const dashboardApi = {
  getImpactIndicators: async (params?: {
    locale?: string;
  }): Promise<ImpactIndicatorsResponse> => {
    const res = await apiClient.get<ApiResponse<ImpactIndicatorsResponse>>(
      ENDPOINTS.DASHBOARD.IMPACT_INDICATORS,
      { params }
    );
    return res.data.data;
  },
};
