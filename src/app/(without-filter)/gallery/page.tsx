"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ImageIcon } from "lucide-react";

import { useAlbumListInfinite } from "@/hooks/use-library";
import { resolveMediaUrl } from "@/lib/media";
import { useLocale } from "@/features/i18n/hooks/useLocale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function GalleryPage() {
  const { locale } = useLocale();
  const { t } = useTranslation("gallery");

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAlbumListInfinite(locale);

  const albums = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">{t("loading", { defaultValue: "Loading..." })}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("title", { defaultValue: "Digital Library" })}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("subtitle", { defaultValue: "Photo albums and galleries" })}
        </p>
      </div>

      {albums.length === 0 ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-muted-foreground">
            {t("noAlbums", { defaultValue: "No albums available yet." })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Link key={album.id} href={`/gallery/${album.slug}`} className="group">
              <Card className="overflow-hidden pt-0 h-full transition-shadow group-hover:shadow-md">
                <div className="aspect-[4/3] w-full bg-muted overflow-hidden">
                  {album.coverThumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(album.coverThumbnailUrl)}
                      alt={album.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <CardContent className="space-y-1">
                  <CardTitle className="text-base leading-snug">{album.title}</CardTitle>
                  {album.description ? (
                    <CardDescription className="line-clamp-2">
                      {album.description}
                    </CardDescription>
                  ) : null}
                  <p className="text-xs text-muted-foreground pt-1">
                    {t("photoCount", {
                      defaultValue: "{{count}} photos",
                      count: album.photoCount,
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage
              ? t("loading", { defaultValue: "Loading..." })
              : t("loadMore", { defaultValue: "Load more" })}
          </Button>
        </div>
      )}
    </div>
  );
}
