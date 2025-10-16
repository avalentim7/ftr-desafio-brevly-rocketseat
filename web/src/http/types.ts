export interface Link {
  id: string
  originalUrl: string
  slug: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export interface CreateLinkRequest {
  originalUrl: string
  slug: string
  shortUrl: string
}

export interface CreateLinkResponse {
  id: string
  originalUrl: string
  slug: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export interface GetLinksResponse {
  links: Link[]
  total: number
}

export interface GetOriginalUrlResponse {
  originalUrl: string
}

export interface ExportLinksResponse {
  fileKey: string
  publicUrl: string
  rowCount: number
}
