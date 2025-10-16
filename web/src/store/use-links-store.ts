import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import type { Link } from '../http/types'
import * as api from '../http'

interface LinksState {
  links: Link[]
  total: number
  isLoading: boolean
  error: string | null
}

interface LinksActions {
  fetchLinks: () => Promise<void>
  createLink: (originalUrl: string, slug: string) => Promise<void>
  deleteLink: (id: string) => Promise<void>
  exportLinks: () => Promise<string>
  incrementLinkCount: (linkId: string) => void
  clearError: () => void
}

type LinksStore = LinksState & LinksActions

export const useLinksStore = create<LinksStore>()(
  persist(
    subscribeWithSelector(
      immer((set) => ({
        links: [],
        total: 0,
        isLoading: false,
        error: null,

        fetchLinks: async () => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const data = await api.getLinks()
            set((state) => {
              state.links = data.links
              state.total = data.total
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to fetch links'
              state.isLoading = false
            })
          }
        },

        createLink: async (originalUrl: string, slug: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const currentDomain = window.location.origin
            const shortUrl = `${currentDomain}/${slug}`

            const newLink = await api.createLink({ originalUrl, slug, shortUrl })
            set((state) => {
              state.links.unshift(newLink)
              state.total += 1
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to create link'
              state.isLoading = false
            })
            throw error
          }
        },

        deleteLink: async (id: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            await api.deleteLink(id)
            set((state) => {
              state.links = state.links.filter(link => link.id !== id)
              state.total -= 1
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to delete link'
              state.isLoading = false
            })
            throw error
          }
        },

        exportLinks: async () => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const data = await api.exportLinks()
            set((state) => {
              state.isLoading = false
            })
            return data.publicUrl
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to export links'
              state.isLoading = false
            })
            throw error
          }
        },

        incrementLinkCount: async (linkId: string) => {
          try {
            await api.incrementLinkAccess(linkId);
            set((state) => {
              const link = state.links.find(l => l.id === linkId)
              if (link) {
                link.accessCount += 1
              }
            })
          } catch (error) {
            console.error('Failed to increment link access count:', error)
          }

        },

        clearError: () => {
          set((state) => {
            state.error = null
          })
        },
      }))
    ),
    {
      name: 'brevly-links-storage',
      onRehydrateStorage: () => (state) => {
        state?.fetchLinks()
      },
      partialize: (state) => ({
        links: state.links,
        total: state.total,
      }),
    }
  )
)
