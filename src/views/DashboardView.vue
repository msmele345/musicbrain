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
    <div class="ambient-glow ambient-glow--top" />
    <div class="ambient-glow ambient-glow--corner" />

    <header class="dashboard-header">
      <div class="brand">
        <h1 class="logo">MusicBrain</h1>
        <span class="tagline">Your brain trends and music, visualised</span>
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
  padding: 3.5rem 3.5rem 5rem;
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
}

.ambient-glow--top {
  position: absolute;
  top: -200px;
  left: 30%;
  transform: translateX(-50%);
  width: 800px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(0, 255, 106, 0.04) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
  animation: glowPulse 8s ease-in-out infinite alternate;
}

.ambient-glow--corner {
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 500px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(0, 212, 255, 0.03) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}

@keyframes glowPulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

.dashboard-header {
  position: relative;
  z-index: 1;
  margin-bottom: 3.5rem;
  animation: fadeIn 0.8s ease-out both;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.logo {
  font-family: var(--font-display);
  font-size: 4.5rem;
  font-weight: 400;
  font-style: italic;
  color: var(--accent-neon);
  letter-spacing: -0.03em;
  line-height: 1;
  text-shadow: 0 0 80px rgba(0, 255, 106, 0.12);
}

.tagline {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  color: rgba(182, 166, 12, 0.92);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.header-rule {
  margin-top: 1.5rem;
  height: 1px;
  background: linear-gradient(90deg, var(--border-accent), transparent 50%);
}

.widget-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.25rem;
}

.widget-cell {
  animation: fadeSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.cell-recent {
  grid-row: 1 / 3;
  animation-delay: 0.05s;
}

.cell-artists {
  animation-delay: 0.15s;
}

.cell-genres {
  animation-delay: 0.25s;
}

.cell-discover {
  grid-column: 1 / -1;
  animation-delay: 0.35s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(24px);
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
    font-size: 3rem;
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
