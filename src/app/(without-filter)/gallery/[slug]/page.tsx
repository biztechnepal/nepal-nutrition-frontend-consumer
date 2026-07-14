"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";

import { QueryKeys } from "@/constants/query-keys";
import { getAlbumDetails, getAlbumPhotos } from "@/services/library.service";
import { resolveMediaUrl } from "@/lib/media";
import { useLocale } from "@/features/i18n/hooks/useLocale";
import { Button } from "@/components/ui/button";
import { Photo } from "@/interfaces/model/library.interface";

export default function AlbumPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const { t } = useTranslation("gallery");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: albumData, isLoading: albumLoading } = useQuery({
    queryKey: [QueryKeys.ALBUMDETAIL, slug, locale],
    queryFn: () => getAlbumDetails(slug, locale),
    enabled: !!slug,
  });

  const album = albumData?.data;

  const {
    data: photosData,
    isLoading: photosLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QueryKeys.ALBUMPHOTOS, album?.id, locale],
    queryFn: ({ pageParam }) => getAlbumPhotos(album!.id, pageParam, locale),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    initialPageParam: 1,
    enabled: !!album?.id,
  });

  const photos = photosData?.pages.flatMap((page) => page.data) ?? [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + photos.length) % photos.length
      ),
    [photos.length]
  );
  const showNext = useCallback(
    () =>
      setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  if (albumLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">{t("loading", { defaultValue: "Loading..." })}</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">
          {t("albumNotFound", { defaultValue: "Album not found." })}
        </p>
      </div>
    );
  }

  const activePhoto: Photo | null =
    lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToGallery", { defaultValue: "Back to gallery" })}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{album.title}</h1>
        {album.description ? (
          <p className="text-muted-foreground max-w-3xl">{album.description}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {t("photoCount", { defaultValue: "{{count}} photos", count: album.photoCount })}
        </p>
      </div>

      {photosLoading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-muted-foreground">{t("loading", { defaultValue: "Loading..." })}</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-muted-foreground">
            {t("noPhotos", { defaultValue: "No photos in this album yet." })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(photo.thumbnailUrl)}
                alt={photo.caption || photo.originalFilename}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {photo.caption ? (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-6 text-left text-xs text-white line-clamp-1">
                  {photo.caption}
                </span>
              ) : null}
            </button>
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

      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.caption || activePhoto.originalFilename}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            aria-label={t("close", { defaultValue: "Close" })}
            onClick={closeLightbox}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              aria-label={t("previous", { defaultValue: "Previous" })}
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-2 sm:left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <figure
            className="max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveMediaUrl(activePhoto.webUrl)}
              alt={activePhoto.caption || activePhoto.originalFilename}
              className="max-h-[80vh] w-auto mx-auto rounded-md object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {activePhoto.caption || ""}
              <span className="block text-xs text-white/50 mt-1">
                {lightboxIndex! + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>

          {photos.length > 1 && (
            <button
              type="button"
              aria-label={t("next", { defaultValue: "Next" })}
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-2 sm:right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
