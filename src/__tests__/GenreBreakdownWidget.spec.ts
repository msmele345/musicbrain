import GenreBreakdownWidget from '@/components/widgets/GenreBreakdownWidget.vue'
import type { Tag } from '@/services/lastFmApi'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('vue-chartjs', () => ({
  Doughnut: {
    name: 'Doughnut',
    template: '<canvas data-testid="doughnut-chart" />',
    props: ['data', 'options'],
  },
}))

vi.mock('chart.js', () => ({
  Chart: class {
    static register = vi.fn()
  },
  ArcElement: {},
  Tooltip: {},
  Legend: {},
}))

const mockTags: Tag[] = [
  { name: 'rock', count: 1200, url: 'https://last.fm/tag/rock' },
  { name: 'indie', count: 800, url: 'https://last.fm/tag/indie' },
]

describe('GenreBreakdownWidget', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading skeleton while loading', () => {
    const wrapper = mount(GenreBreakdownWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { genres: { genres: [], loading: true, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.skeleton').exists()).toBe(true)
    expect(wrapper.find('.chart-container').exists()).toBe(false)
  })

  it('shows error message on error', () => {
    const wrapper = mount(GenreBreakdownWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: {
              genres: { genres: [], loading: false, error: 'Network error' },
            },
          }),
        ],
      },
    })

    expect(wrapper.find('[role="alert"]').text()).toBe('Network error')
    expect(wrapper.find('.chart-container').exists()).toBe(false)
  })

  it('shows empty message when no genres', () => {
    const wrapper = mount(GenreBreakdownWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: { genres: { genres: [], loading: false, error: null } },
          }),
        ],
      },
    })

    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('renders doughnut chart when genres are loaded', () => {
    const wrapper = mount(GenreBreakdownWidget, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn,
            initialState: {
              genres: { genres: mockTags, loading: false, error: null },
            },
          }),
        ],
      },
    })

    expect(wrapper.find('.chart-container').exists()).toBe(true)
    expect(wrapper.find('[data-testid="doughnut-chart"]').exists()).toBe(true)
  })
})
