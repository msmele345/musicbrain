import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useArtistsStore } from '@/stores/artists'
import * as lastFmApi from '@/services/lastFmApi'
import type { Artist } from '@/services/lastFmApi'

const mockArtists: Artist[] = [
  { name: 'Radiohead', playcount: '1500', url: 'https://last.fm/music/Radiohead', imageUrl: null },
  { name: 'Portishead', playcount: '800', url: 'https://last.fm/music/Portishead', imageUrl: null },
]

describe('artists store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('has correct initial state', () => {
    const store = useArtistsStore()
    expect(store.artists).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchTopArtists populates artists on success', async () => {
    vi.spyOn(lastFmApi, 'getTopArtists').mockResolvedValueOnce(mockArtists)

    const store = useArtistsStore()
    await store.fetchTopArtists()

    expect(store.artists).toEqual(mockArtists)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchTopArtists passes period to API', async () => {
    const spy = vi.spyOn(lastFmApi, 'getTopArtists').mockResolvedValueOnce(mockArtists)

    const store = useArtistsStore()
    await store.fetchTopArtists('overall')

    expect(spy).toHaveBeenCalledWith('overall')
  })

  it('fetchTopArtists sets error on failure', async () => {
    vi.spyOn(lastFmApi, 'getTopArtists').mockRejectedValueOnce(new Error('API error'))

    const store = useArtistsStore()
    await store.fetchTopArtists()

    expect(store.artists).toEqual([])
    expect(store.error).toBe('API error')
    expect(store.loading).toBe(false)
  })

  it('sets loading true during fetch', async () => {
    let resolvePromise!: (artists: Artist[]) => void
    const pending = new Promise<Artist[]>((resolve) => { resolvePromise = resolve })
    vi.spyOn(lastFmApi, 'getTopArtists').mockReturnValueOnce(pending)

    const store = useArtistsStore()
    const fetchPromise = store.fetchTopArtists()
    expect(store.loading).toBe(true)
    resolvePromise(mockArtists)
    await fetchPromise
    expect(store.loading).toBe(false)
  })
})
