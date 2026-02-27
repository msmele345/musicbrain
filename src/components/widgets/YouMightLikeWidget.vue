<script setup lang="ts">
import { onMounted } from 'vue'
import { useDiscoveryStore } from '@/stores/discovery'

const store = useDiscoveryStore()

onMounted(() => {
  store.fetchSuggestedArtists()
})

function matchPercent(match: number): string {
  return `${Math.round(match * 100)}%`
}
</script>

<template>
  <div class="widget">
    <h2 class="widget-title">You Might Like</h2>

    <div v-if="store.loading" class="skeleton" aria-label="Loading suggested artists..." />

    <div v-else-if="store.error" class="error" role="alert">
      {{ store.error }}
    </div>

    <div v-else-if="store.suggestedArtists.length === 0" class="empty">No suggestions available.</div>

    <div v-else class="card-grid">
      <a
        v-for="artist in store.suggestedArtists"
        :key="artist.name"
        :href="artist.url"
        target="_blank"
        rel="noopener noreferrer"
        class="artist-card"
        :aria-label="`${artist.name} — ${matchPercent(artist.match)} match`"
      >
        <div class="artist-image-wrapper">
          <img
            v-if="artist.imageUrl"
            :src="artist.imageUrl"
            :alt="artist.name"
            class="artist-image"
          />
          <div v-else class="artist-image-placeholder">
            {{ artist.name.charAt(0) }}
          </div>
        </div>
        <div class="artist-details">
          <div class="artist-name">{{ artist.name }}</div>
          <div class="artist-match">{{ matchPercent(artist.match) }} match</div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.widget {
  background: #1e1e2e;
  border-radius: 12px;
  padding: 1.5rem;
  color: #cdd6f4;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.widget-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #cba6f7;
  margin: 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.artist-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #181825;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s, transform 0.15s;
}

.artist-card:hover {
  background: #313244;
  transform: translateY(-2px);
}

.artist-image-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.artist-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-image-placeholder {
  width: 100%;
  height: 100%;
  background: #313244;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
}

.artist-details {
  text-align: center;
}

.artist-name {
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.3;
  word-break: break-word;
}

.artist-match {
  font-size: 0.7rem;
  color: #a6e3a1;
  margin-top: 2px;
}

.skeleton {
  flex: 1;
  min-height: 260px;
  background: linear-gradient(90deg, #313244 25%, #45475a 50%, #313244 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error {
  color: #f38ba8;
  padding: 1rem;
  border: 1px solid #f38ba8;
  border-radius: 8px;
}

.empty {
  color: #6c7086;
  text-align: center;
  padding: 2rem;
}
</style>
