export interface Photo {
  id: string;
  albumId: string;
  caption: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  sortOrder: number;
  url: string;
  thumbnailUrl: string;
  webUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  photoCount: number;
  coverThumbnailUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumDetail extends AlbumSummary {
  coverPhoto: Photo | null;
}
