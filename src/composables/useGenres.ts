import { ref } from 'vue'
import { getTopGenres, type Tag } from '@/services/lastFmApi'

export function useGenres() {
  const genres = ref<Tag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchGenres() {
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

  return { genres, loading, error, fetchGenres }
}
