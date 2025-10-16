import { api } from './client'
import type { Link } from './types'

export async function getLinkBySlug(slug: string): Promise<Link | null> {
  try {
    const response = await api.get<{ links: Link[] }>('/links')
    const link = response.data.links.find(link => link.slug === slug)
    return link || null
  } catch {
    return null
  }
}
