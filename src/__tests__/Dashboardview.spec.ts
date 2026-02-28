import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardView from '@/views/DashboardView.vue'
import { createTestingPinia } from '@pinia/testing'
import type { Artist, SimilarArtist, Tag, Track } from '@/services/lastFmApi'
import type { VueWrapper } from '@vue/test-utils'

const mockTracks: Track[] = [
    { name: 'Fake Plastic Trees', artist: 'Radiohead', album: 'The Bends', timestamp: null, nowPlaying: true },
    { name: 'Glory Box', artist: 'Portishead', album: 'Dummy', timestamp: '14 Nov 2023, 20:00', nowPlaying: false },
]

const bah = vi.fn

const renderDashboardView = (
    recentTracks: Track[] = [],
    artists: Artist[] = [],
    genres: Tag[] = [],
    suggestedArtists: SimilarArtist[] = []
): VueWrapper => {
    return mount(DashboardView, {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: bah,
                    initialState: {
                        recentTracks: { tracks: recentTracks, loading: false, error: null },
                        artists: { artists: artists, loading: false, error: null },
                        genres: { genres: genres, loading: false, error: null },
                        discovery: { suggestedArtists: suggestedArtists, loading: false, error: null },
                    },
                }),
            ],
        },
    })
}

describe('dashboard view', () => {
    beforeEach(() => { 

    });

    it('runs tests', () => {
        const wrapper = renderDashboardView(mockTracks);

        const tagline = wrapper.find('.tagline');
        expect(tagline.exists()).toBe(true);
        expect(tagline.text()).toEqual("Your brain trends and music, visualised");
    });
});


// wrapper.find('.tagline').text()              // gets text content

// // RTL: expect(el).toBeInTheDocument()
// expect(wrapper.find('.tagline').exists()).toBe(true)

// // RTL: expect(el).toHaveTextContent('Hello')
// expect(wrapper.find('.tagline').text()).toBe('Hello')

// // RTL: expect(el).toHaveAttribute('href', '/home')
// expect(wrapper.find('.tagline').attributes('href')).toBe('/home')

// // RTL: getByRole, getByTestId, getByLabelText
// wrapper.find('[data-testid="tagline"]')     // data-testid
// wrapper.find('h1')                          // by tag
// wrapper.find({ ref: 'tagline' })           // by Vue ref