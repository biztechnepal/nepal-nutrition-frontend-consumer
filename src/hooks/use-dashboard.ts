import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";

const DASHBOARD_QUERY_KEY = ["dashboard"];

export function useImpactIndicators(locale?: string) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, "impact-indicators", locale],
    queryFn: () => dashboardApi.getImpactIndicators({ locale }),
  });
}
