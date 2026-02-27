import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getRecentTracks, type Track } from '@/services/lastFmApi'

export const useRecentTracksStore = defineStore('recentTracks', () => {
  const tracks = ref<Track[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRecentTracks() {
    loading.value = true
    error.value = null
    try {
      tracks.value = await getRecentTracks()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error fetching recent tracks'
    } finally {
      loading.value = false
    }
  }

  return { tracks, loading, error, fetchRecentTracks }
})
