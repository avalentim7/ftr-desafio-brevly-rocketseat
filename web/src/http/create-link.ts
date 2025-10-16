import { api } from './client'
import type { CreateLinkRequest, CreateLinkResponse } from './types'

export async function createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
  const response = await api.post<CreateLinkResponse>('/links', data)
  return response.data
}
