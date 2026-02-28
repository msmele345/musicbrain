import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import TopArtistsWidget from '@/components/widgets/TopArtistsWidget.vue'
import { useArtistsStore } from '@/stores/artists'
import type { Artist } from '@/services/lastFmApi'

vi.mock('vue-chartjs', () => ({
  Bar: {
    name: 'Bar',
    template: '<canvas data-testid="bar-chart" />',
    props: ['data', 'options'],
  },
}))

vi.mock('chart.js', () => ({
  Chart: class {
    static register = vi.fn()
  },
  BarElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {},
  Legend: {},
}))

const mockArtists: Artist[] = [
  { name: 'Radiohead', playcount: '1500', url: 'https://last.fm/music/Radiohead', imageUrl: null },
  { name: 'Portishead', playcount: '800', url: 'https://last.fm/music/Portishead', imageUrl: null },
]

describe('TopArtistsWidget', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading skeleton while loading', () => {
    const wrapper = mount(TopArtistsWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { artists: { artists: [], loading: true, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.skeleton').exists()).toBe(true)
    expect(wrapper.find('.chart-container').exists()).toBe(false)
  })

  it('shows error message on error', () => {
    const wrapper = mount(TopArtistsWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { artists: { artists: [], loading: false, error: 'API failed' } },
          }),
        ],
      },
    })

    expect(wrapper.find('[role="alert"]').text()).toBe('API failed')
    expect(wrapper.find('.chart-container').exists()).toBe(false)
  })

  it('shows empty message when no artists', () => {
    const wrapper = mount(TopArtistsWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { artists: { artists: [], loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('renders bar chart when artists are loaded', () => {
    const wrapper = mount(TopArtistsWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { artists: { artists: mockArtists, loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.chart-container').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bar-chart"]').exists()).toBe(true)
  })

  it('calls fetchTopArtists on mount', async () => {
    const wrapper = mount(TopArtistsWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { artists: { artists: [], loading: false, error: null } },
          }),
        ],
      },
    })

    const store = useArtistsStore()
    await flushPromises()
    expect(store.fetchTopArtists).toHaveBeenCalledOnce()
  })

  it('calls fetchTopArtists with correct period when tab is clicked', async () => {
    const wrapper = mount(TopArtistsWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { artists: { artists: [], loading: false, error: null } },
          }),
        ],
      },
    })

    const store = useArtistsStore()
    const allTimeTab = wrapper.findAll('[role="tab"]').find((btn) => btn.text() === 'All Time')
    await allTimeTab!.trigger('click')

    expect(store.fetchTopArtists).toHaveBeenCalledWith('overall')
  })

  it('renders period tabs', () => {
    const wrapper = mount(TopArtistsWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { artists: { artists: [], loading: false, error: null } },
          }),
        ],
      },
    })

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]!!.text()).toBe('Week')
    expect(tabs[1]!!.text()).toBe('Month')
    expect(tabs[2]!!.text()).toBe('All Time')
  })
})
