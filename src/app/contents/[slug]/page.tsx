"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { QueryKeys } from "@/constants/query-keys";
import { getContentDetails, getChildContentDetails } from "@/services/content.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/features/i18n/hooks/useLocale";

export default function ContentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const autoSelectedRef = useRef(false);

  const { data: parentData, isLoading: parentLoading } = useQuery({
    queryKey: [QueryKeys.CONTENTDETAIL, slug, locale],
    queryFn: () => getContentDetails(slug, locale),
    enabled: !!slug,
  });

  const { data: childDetailData, isLoading: childDetailLoading } = useQuery({
    queryKey: [QueryKeys.CHILDCONTENTDETAIL, selectedChildId, locale],
    queryFn: () => getChildContentDetails(selectedChildId!, locale),
    enabled: !!selectedChildId,
  });

  useEffect(() => {
    if (parentData && !autoSelectedRef.current && !parentData.data.htmlContent && parentData.data.children.length > 0) {
      autoSelectedRef.current = true;
      setSelectedChildId(parentData.data.children[0].id);
    }
  }, [parentData]);

  if (parentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!parentData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Content not found.</p>
      </div>
    );
  }

  const parent = parentData.data;
  const isShowingParent = selectedChildId === null;
  const rightContent = isShowingParent ? parent : childDetailData?.data;
  const isRightLoading = !isShowingParent && childDetailLoading;

  const formattedCreatedDate = rightContent
    ? dayjs(rightContent.createdAt).format("MMMM D, YYYY")
    : null;

  const formattedUpdatedDate = rightContent
    ? dayjs(rightContent.updatedAt).format("MMMM D, YYYY")
    : null;

  return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="w-full lg:w-60 shrink-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="space-y-1">
            <button
              onClick={() => setSelectedChildId(null)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                isShowingParent
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              {parent.title}
            </button>
            {parent.children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  selectedChildId === child.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                )}
              >
                {child.title}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      <main className="flex-1 min-w-0">
        {isRightLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : rightContent ? (
          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                {rightContent.title}
              </h1>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span>Published: {formattedCreatedDate}</span>
                <span>Updated: {formattedUpdatedDate}</span>
              </div>
            </header>
            <div
              className="prose prose-gray prose-sm md:prose-base lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: rightContent.htmlContent }}
            />
          </article>
        ) : null}
      </main>
    </div>
  );
}
