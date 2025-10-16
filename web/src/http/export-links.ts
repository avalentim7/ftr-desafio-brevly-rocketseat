import { api } from './client'
import type { ExportLinksResponse } from './types'

export async function exportLinks(): Promise<ExportLinksResponse> {
  const response = await api.post<ExportLinksResponse>('/links/export')
  return response.data
}
