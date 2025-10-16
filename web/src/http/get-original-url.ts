import { api } from './client'
import type { GetOriginalUrlResponse } from './types'

export async function getOriginalUrl(slug: string): Promise<GetOriginalUrlResponse> {
  const response = await api.get<GetOriginalUrlResponse>(`/links/${slug}/original-url`)
  return response.data
}
