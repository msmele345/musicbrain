import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTopGenres, type Tag } from '@/services/lastFmApi'

export const useGenresStore = defineStore('genres', () => {
  const genres = ref<Tag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTopGenres() {
    loading.value = true
    error.value = null
    try {
      genres.value = await getTopGenres()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error fetching genres'
    } finally {
      loading.value = false
    }
  }

  return { genres, loading, error, fetchTopGenres }
})
