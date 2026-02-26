import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTopArtists, type Artist } from '@/services/lastFmApi'

export const useArtistsStore = defineStore('artists', () => {
  const artists = ref<Artist[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTopArtists(period = '7day') {
    loading.value = true
    error.value = null
    try {
      artists.value = await getTopArtists(period)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error fetching artists'
    } finally {
      loading.value = false
    }
  }

  return { artists, loading, error, fetchTopArtists }
})
