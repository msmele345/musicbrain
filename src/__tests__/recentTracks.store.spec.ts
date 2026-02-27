import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecentTracksStore } from '@/stores/recentTracks'
import * as lastFmApi from '@/services/lastFmApi'
import type { Track } from '@/services/lastFmApi'

const mockTracks: Track[] = [
  { name: 'Fake Plastic Trees', artist: 'Radiohead', album: 'The Bends', timestamp: null, nowPlaying: true },
  { name: 'Glory Box', artist: 'Portishead', album: 'Dummy', timestamp: '14 Nov 2023, 20:00', nowPlaying: false },
]

describe('recentTracks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('has correct initial state', () => {
    const store = useRecentTracksStore()
    expect(store.tracks).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchRecentTracks populates tracks on success', async () => {
    vi.spyOn(lastFmApi, 'getRecentTracks').mockResolvedValueOnce(mockTracks)

    const store = useRecentTracksStore()
    await store.fetchRecentTracks()

    expect(store.tracks).toEqual(mockTracks)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchRecentTracks sets error on failure', async () => {
    vi.spyOn(lastFmApi, 'getRecentTracks').mockRejectedValueOnce(new Error('Network error'))

    const store = useRecentTracksStore()
    await store.fetchRecentTracks()

    expect(store.tracks).toEqual([])
    expect(store.error).toBe('Network error')
    expect(store.loading).toBe(false)
  })

  it('sets loading true during fetch', async () => {
    let resolvePromise!: (tracks: Track[]) => void
    const pending = new Promise<Track[]>((resolve) => { resolvePromise = resolve })
    vi.spyOn(lastFmApi, 'getRecentTracks').mockReturnValueOnce(pending)

    const store = useRecentTracksStore()
    const fetchPromise = store.fetchRecentTracks()
    expect(store.loading).toBe(true)
    resolvePromise(mockTracks)
    await fetchPromise
    expect(store.loading).toBe(false)
  })
})
