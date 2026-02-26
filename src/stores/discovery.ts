import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSuggestedArtists, type SimilarArtist } from '@/services/lastFmApi'

export const useDiscoveryStore = defineStore('discovery', () => {
  const suggestedArtists = ref<SimilarArtist[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSuggestedArtists() {
    loading.value = true
    error.value = null
    try {
      suggestedArtists.value = await getSuggestedArtists()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error fetching suggested artists'
    } finally {
      loading.value = false
    }
  }

  return { suggestedArtists, loading, error, fetchSuggestedArtists }
})
