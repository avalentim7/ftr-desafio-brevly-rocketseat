import { api } from './client'

export async function incrementLinkAccess(id: string): Promise<void> {
  await api.patch(`/links/${id}/increment-access-count`)
}
