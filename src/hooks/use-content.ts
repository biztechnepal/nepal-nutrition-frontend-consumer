import { useQuery } from "@tanstack/react-query";
import { childContentApi, contentApi } from "@/lib/api/content";

const CONTENT_QUERY_KEY = ["content"];
const CHILD_CONTENT_QUERY_KEY = [...CONTENT_QUERY_KEY, "child"];

export function useContentList(locale?: string) {
  return useQuery({
    queryKey: [...CONTENT_QUERY_KEY, locale],
    queryFn: () => contentApi.findAll({ locale }),
  });
}

export function useContent(slug: string, locale?: string) {
  return useQuery({
    queryKey: [...CONTENT_QUERY_KEY, slug, locale],
    queryFn: () => contentApi.findOne(slug, { locale }),
    enabled: !!slug,
  });
}

export function useChildContent(id?: string | null, locale?: string) {
  return useQuery({
    queryKey: [...CHILD_CONTENT_QUERY_KEY, id, locale],
    queryFn: () => childContentApi.findOne(id!, { locale }),
    enabled: !!id,
  });
}
