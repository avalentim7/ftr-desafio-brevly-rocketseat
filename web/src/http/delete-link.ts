import { api } from './client'

export async function deleteLink(id: string): Promise<void> {
  await api.delete(`/links/${id}`)
}
