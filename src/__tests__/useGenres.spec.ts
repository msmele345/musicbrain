import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGenres } from '@/composables/useGenres'
import * as lastFmApi from '@/services/lastFmApi'
import type { Tag } from '@/services/lastFmApi'

const mockTags: Tag[] = [
  { name: 'rock', count: 1200, url: 'https://last.fm/tag/rock' },
  { name: 'indie', count: 800, url: 'https://last.fm/tag/indie' },
]

describe('useGenres', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with empty genres, not loading, no error', () => {
    const { genres, loading, error } = useGenres()
    expect(genres.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('sets loading to true while fetching', async () => {
    let resolvePromise!: (tags: Tag[]) => void
    const pending = new Promise<Tag[]>((resolve) => { resolvePromise = resolve })
    vi.spyOn(lastFmApi, 'getTopGenres').mockReturnValueOnce(pending)

    const { loading, fetchGenres } = useGenres()
    const fetchPromise = fetchGenres()
    expect(loading.value).toBe(true)
    resolvePromise(mockTags)
    await fetchPromise
    expect(loading.value).toBe(false)
  })

  it('populates genres on successful fetch', async () => {
    vi.spyOn(lastFmApi, 'getTopGenres').mockResolvedValueOnce(mockTags)

    const { genres, loading, error, fetchGenres } = useGenres()
    await fetchGenres()

    expect(genres.value).toEqual(mockTags)
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('sets error state when fetch fails', async () => {
    vi.spyOn(lastFmApi, 'getTopGenres').mockRejectedValueOnce(new Error('Network error'))

    const { genres, loading, error, fetchGenres } = useGenres()
    await fetchGenres()

    expect(genres.value).toEqual([])
    expect(error.value).toBe('Network error')
    expect(loading.value).toBe(false)
  })
})
