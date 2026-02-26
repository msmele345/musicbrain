<script setup lang="ts">
import { onMounted } from 'vue'
import GenreBreakdownWidget from '@/components/widgets/GenreBreakdownWidget.vue'
import TopArtistsWidget from '@/components/widgets/TopArtistsWidget.vue'
import RecentTracksWidget from '@/components/widgets/RecentTracksWidget.vue'
import YouMightLikeWidget from '@/components/widgets/YouMightLikeWidget.vue'
import { useGenresStore } from '@/stores/genres'
import { useArtistsStore } from '@/stores/artists'
import { useRecentTracksStore } from '@/stores/recentTracks'
import { useDiscoveryStore } from '@/stores/discovery'

const genresStore = useGenresStore()
const artistsStore = useArtistsStore()
const recentTracksStore = useRecentTracksStore()
const discoveryStore = useDiscoveryStore()

onMounted(() => {
  genresStore.fetchTopGenres()
  artistsStore.fetchTopArtists()
  recentTracksStore.fetchRecentTracks()
  discoveryStore.fetchSuggestedArtists()
})
</script>

<template>
  <main class="dashboard">
    <header class="dashboard-header">
      <h1>MusicBrain</h1>
      <p class="subtitle">Your listening habits, visualised</p>
    </header>

    <div class="widget-grid">
      <GenreBreakdownWidget />
      <TopArtistsWidget />
      <RecentTracksWidget />
      <YouMightLikeWidget />
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #11111b;
  padding: 2rem;
  font-family: 'Inter', system-ui, sans-serif;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #cba6f7;
  margin: 0;
}

.subtitle {
  color: #6c7086;
  margin: 0.25rem 0 0;
}

.widget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}
</style>
