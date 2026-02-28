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
    <div class="ambient-glow" />

    <header class="dashboard-header">
      <div class="brand">
        <h1 class="logo">MusicBrain</h1>
        <span class="tagline">Your listening habits, visualised</span>
      </div>
      <div class="header-rule" />
    </header>

    <div class="widget-grid">
      <div class="widget-cell cell-recent">
        <RecentTracksWidget />
      </div>
      <div class="widget-cell cell-artists">
        <TopArtistsWidget />
      </div>
      <div class="widget-cell cell-genres">
        <GenreBreakdownWidget />
      </div>
      <div class="widget-cell cell-discover">
        <YouMightLikeWidget />
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2.5rem 3rem 4rem;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

.ambient-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(212, 165, 67, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.dashboard-header {
  position: relative;
  z-index: 1;
  margin-bottom: 3rem;
  animation: fadeSlideIn 0.6s ease-out both;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.logo {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 400;
  font-style: italic;
  color: var(--accent-gold);
  letter-spacing: -0.02em;
  line-height: 1;
}

.tagline {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header-rule {
  margin-top: 1rem;
  height: 1px;
  background: linear-gradient(90deg, var(--border-accent), transparent 60%);
}

.widget-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
}

.widget-cell {
  animation: fadeSlideIn 0.6s ease-out both;
}

.cell-recent {
  grid-row: 1 / 3;
  animation-delay: 0.1s;
}

.cell-artists {
  animation-delay: 0.2s;
}

.cell-genres {
  animation-delay: 0.3s;
}

.cell-discover {
  grid-column: 1 / -1;
  animation-delay: 0.4s;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .dashboard {
    padding: 1.5rem;
  }

  .logo {
    font-size: 2.2rem;
  }

  .widget-grid {
    grid-template-columns: 1fr;
  }

  .cell-recent {
    grid-row: auto;
  }

  .cell-discover {
    grid-column: auto;
  }
}
</style>
