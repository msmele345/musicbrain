import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDiscoveryStore } from '@/stores/discovery'
import * as lastFmApi from '@/services/lastFmApi'
import type { SimilarArtist } from '@/services/lastFmApi'

const mockSuggestions: SimilarArtist[] = [
  { name: 'Massive Attack', match: 0.87, url: 'https://last.fm/music/Massive+Attack', imageUrl: null },
  { name: 'Tricky', match: 0.72, url: 'https://last.fm/music/Tricky', imageUrl: null },
]

describe('discovery store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('has correct initial state', () => {
    const store = useDiscoveryStore()
    expect(store.suggestedArtists).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchSuggestedArtists populates suggestedArtists on success', async () => {
    vi.spyOn(lastFmApi, 'getSuggestedArtists').mockResolvedValueOnce(mockSuggestions)

    const store = useDiscoveryStore()
    await store.fetchSuggestedArtists()

    expect(store.suggestedArtists).toEqual(mockSuggestions)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchSuggestedArtists sets error on failure', async () => {
    vi.spyOn(lastFmApi, 'getSuggestedArtists').mockRejectedValueOnce(new Error('Discovery error'))

    const store = useDiscoveryStore()
    await store.fetchSuggestedArtists()

    expect(store.suggestedArtists).toEqual([])
    expect(store.error).toBe('Discovery error')
    expect(store.loading).toBe(false)
  })

  it('sets loading true during fetch', async () => {
    let resolvePromise!: (artists: SimilarArtist[]) => void
    const pending = new Promise<SimilarArtist[]>((resolve) => { resolvePromise = resolve })
    vi.spyOn(lastFmApi, 'getSuggestedArtists').mockReturnValueOnce(pending)

    const store = useDiscoveryStore()
    const fetchPromise = store.fetchSuggestedArtists()
    expect(store.loading).toBe(true)
    resolvePromise(mockSuggestions)
    await fetchPromise
    expect(store.loading).toBe(false)
  })
})
