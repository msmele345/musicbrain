import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGenresStore } from '@/stores/genres'
import * as lastFmApi from '@/services/lastFmApi'
import type { Tag } from '@/services/lastFmApi'

const mockTags: Tag[] = [
  { name: 'electronic', count: 900, url: 'https://last.fm/tag/electronic' },
  { name: 'jazz', count: 600, url: 'https://last.fm/tag/jazz' },
]

describe('genres store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('has correct initial state', () => {
    const store = useGenresStore()
    expect(store.genres).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchTopGenres populates genres on success', async () => {
    vi.spyOn(lastFmApi, 'getTopGenres').mockResolvedValueOnce(mockTags)

    const store = useGenresStore()
    await store.fetchTopGenres()

    expect(store.genres).toEqual(mockTags)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchTopGenres sets error on failure', async () => {
    vi.spyOn(lastFmApi, 'getTopGenres').mockRejectedValueOnce(new Error('API error'))

    const store = useGenresStore()
    await store.fetchTopGenres()

    expect(store.genres).toEqual([])
    expect(store.error).toBe('API error')
    expect(store.loading).toBe(false)
  })

  it('sets loading true during fetch', async () => {
    let resolvePromise!: (tags: Tag[]) => void
    const pending = new Promise<Tag[]>((resolve) => { resolvePromise = resolve })
    vi.spyOn(lastFmApi, 'getTopGenres').mockReturnValueOnce(pending)

    const store = useGenresStore()
    const fetchPromise = store.fetchTopGenres()
    expect(store.loading).toBe(true)
    resolvePromise(mockTags)
    await fetchPromise
    expect(store.loading).toBe(false)
  })
})
