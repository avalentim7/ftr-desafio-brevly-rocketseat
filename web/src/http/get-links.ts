import { api } from './client'
import type { GetLinksResponse } from './types'

export async function getLinks(): Promise<GetLinksResponse> {
  const response = await api.get<GetLinksResponse>('/links')
  return response.data
}
