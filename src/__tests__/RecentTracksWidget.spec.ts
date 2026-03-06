import RecentTracksWidget from '@/components/widgets/RecentTracksWidget.vue'
import type { Track } from '@/services/lastFmApi'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockTracks: Track[] = [
  { name: 'Fake Plastic Trees', artist: 'Radiohead', album: 'The Bends', timestamp: null, nowPlaying: true },
  { name: 'Glory Box', artist: 'Portishead', album: 'Dummy', timestamp: '14 Nov 2023, 20:00', nowPlaying: false },
]

describe('RecentTracksWidget', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading skeleton while loading', () => {
    const wrapper = mount(RecentTracksWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { recentTracks: { tracks: [], loading: true, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.skeleton').exists()).toBe(true)
    expect(wrapper.find('.track-list').exists()).toBe(false)
  })

  it('shows error message on error', () => {
    const wrapper = mount(RecentTracksWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { recentTracks: { tracks: [], loading: false, error: 'Network error' } },
          }),
        ],
      },
    })

    expect(wrapper.find('[role="alert"]').text()).toBe('Network error')
  })

  it('shows empty state when no tracks', () => {
    const wrapper = mount(RecentTracksWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { recentTracks: { tracks: [], loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('renders track list when tracks are loaded', () => {
    const wrapper = mount(RecentTracksWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { recentTracks: { tracks: mockTracks, loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.track-list').exists()).toBe(true)
    expect(wrapper.findAll('.track-item')).toHaveLength(2)
  })

  it('shows NOW PLAYING badge for currently playing track', () => {
    const wrapper = mount(RecentTracksWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { recentTracks: { tracks: mockTracks, loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.now-playing-badge').exists()).toBe(true)
    expect(wrapper.find('.now-playing-badge').text()).toContain('NOW PLAYING')
  })

  it('does not show NOW PLAYING badge for non-playing tracks', () => {
    const tracksNoNowPlaying: Track[] = [
      { name: 'Glory Box', artist: 'Portishead', album: 'Dummy', timestamp: '14 Nov 2023, 20:00', nowPlaying: false },
    ]

    const wrapper = mount(RecentTracksWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { recentTracks: { tracks: tracksNoNowPlaying, loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.now-playing-badge').exists()).toBe(false)
  })

  it('applies now-playing class to currently playing track item', () => {
    const wrapper = mount(RecentTracksWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { recentTracks: { tracks: mockTracks, loading: false, error: null } },
          }),
        ],
      },
    })

    const items = wrapper.findAll('.track-item')
    expect(items[0]!!.classes()).toContain('now-playing')
    expect(items[1]!!.classes()).not.toContain('now-playing')
  })
})
