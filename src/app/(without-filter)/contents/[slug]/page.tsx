"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useChildContent, useContent } from "@/hooks/use-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/features/i18n/hooks/useLocale";

export default function ContentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const { data: parent, isLoading: parentLoading } = useContent(slug, locale);

  const defaultChildId =
    parent && !parent.htmlContent && parent.children.length > 0
      ? parent.children[0].id
      : null;
  const activeChildId = selectedChildId ?? defaultChildId;

  const { data: childDetail, isLoading: childDetailLoading } = useChildContent(
    activeChildId,
    locale
  );

  if (parentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Content not found.</p>
      </div>
    );
  }

  const isShowingParent = selectedChildId === null && !!parent.htmlContent;
  const rightContent = isShowingParent ? parent : childDetail;
  const isRightLoading = !isShowingParent && childDetailLoading;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
      <aside className="w-full lg:w-60 shrink-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="space-y-1">
            {parent.htmlContent ? (
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
            ) : null}
            {parent.children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  activeChildId === child.id
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
            <div
              className="prose prose-gray prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: rightContent.htmlContent }}
            />
          </article>
        ) : null}
      </main>
    </div>
  );
}
