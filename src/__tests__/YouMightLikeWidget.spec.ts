import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import YouMightLikeWidget from '@/components/widgets/YouMightLikeWidget.vue'
import { useDiscoveryStore } from '@/stores/discovery'
import type { SimilarArtist } from '@/services/lastFmApi'

const mockSuggestions: SimilarArtist[] = [
  { name: 'Massive Attack', match: 0.87, url: 'https://last.fm/music/Massive+Attack', imageUrl: 'https://img.ma.jpg' },
  { name: 'Tricky', match: 0.72, url: 'https://last.fm/music/Tricky', imageUrl: null },
]

describe('YouMightLikeWidget', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading skeleton while loading', () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: [], loading: true, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.skeleton').exists()).toBe(true)
    expect(wrapper.find('.card-grid').exists()).toBe(false)
  })

  it('shows error message on error', () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: [], loading: false, error: 'Discovery failed' } },
          }),
        ],
      },
    })

    expect(wrapper.find('[role="alert"]').text()).toBe('Discovery failed')
  })

  it('shows empty state when no suggestions', () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: [], loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('renders artist cards when suggestions are loaded', () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: mockSuggestions, loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.card-grid').exists()).toBe(true)
    expect(wrapper.findAll('.artist-card')).toHaveLength(2)
  })

  it('renders artist name and match percentage on each card', () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: mockSuggestions, loading: false, error: null } },
          }),
        ],
      },
    })

    const cards = wrapper.findAll('.artist-card')
    expect(cards[0]!!.find('.artist-name').text()).toBe('Massive Attack')
    expect(cards[0]!!.find('.artist-match').text()).toBe('87% match')
    expect(cards[1]!!.find('.artist-name').text()).toBe('Tricky')
    expect(cards[1]!!.find('.artist-match').text()).toBe('72% match')
  })

  it('links each card to the Last.fm URL with target _blank', () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: mockSuggestions, loading: false, error: null } },
          }),
        ],
      },
    })

    const cards = wrapper.findAll('.artist-card')
    expect(cards[0]!!.attributes('href')).toBe('https://last.fm/music/Massive+Attack')
    expect(cards[0]!!.attributes('target')).toBe('_blank')
    expect(cards[1]!!.attributes('href')).toBe('https://last.fm/music/Tricky')
  })

  it('shows artist image when imageUrl is present', () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: mockSuggestions, loading: false, error: null } },
          }),
        ],
      },
    })

    const cards = wrapper.findAll('.artist-card')
    expect(cards[0]!!.find('img').exists()).toBe(true)
    expect(cards[0]!!.find('img').attributes('src')).toBe('https://img.ma.jpg')
    expect(cards[1]!!.find('.artist-image-placeholder').exists()).toBe(true)
  })

  it('calls fetchSuggestedArtists on mount', async () => {
    const wrapper = mount(YouMightLikeWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { discovery: { suggestedArtists: [], loading: false, error: null } },
          }),
        ],
      },
    })

    const store = useDiscoveryStore()
    await flushPromises()
    expect(store.fetchSuggestedArtists).toHaveBeenCalledOnce()
  })
})
