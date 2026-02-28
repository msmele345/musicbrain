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
    <div class="widget-header">
      <h2 class="widget-title">You Might Like</h2>
      <span class="widget-label">Discovery</span>
    </div>

    <div v-if="store.loading" class="skeleton" aria-label="Loading suggested artists..." />

    <div v-else-if="store.error" class="error" role="alert">
      {{ store.error }}
    </div>

    <div v-else-if="store.suggestedArtists.length === 0" class="empty">No suggestions available.</div>

    <div v-else class="card-grid">
      <a
        v-for="(artist, index) in store.suggestedArtists"
        :key="artist.name"
        :href="artist.url"
        target="_blank"
        rel="noopener noreferrer"
        class="artist-card"
        :style="{ animationDelay: `${0.4 + index * 0.06}s` }"
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
          <div class="artist-match">
            <span class="match-bar-track">
              <span class="match-bar-fill" :style="{ width: matchPercent(artist.match) }" />
            </span>
            <span class="match-text">{{ matchPercent(artist.match) }} match</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.widget {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  color: var(--text-primary);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.widget-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.widget-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.widget-label {
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-indigo);
  border: 1px solid rgba(123, 108, 246, 0.25);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.artist-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 0.75rem;
  background: var(--bg-raised);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  animation: fadeSlideIn 0.5s ease-out both;
}

.artist-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.artist-image-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--border-subtle);
}

.artist-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-hover), var(--bg-surface));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.8rem;
  color: var(--accent-gold);
  text-transform: uppercase;
}

.artist-details {
  text-align: center;
  width: 100%;
}

.artist-name {
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.3;
  word-break: break-word;
}

.artist-match {
  margin-top: 0.35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.match-bar-track {
  width: 100%;
  max-width: 80px;
  height: 3px;
  background: var(--bg-hover);
  border-radius: 2px;
  overflow: hidden;
}

.match-bar-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent-gold), var(--accent-rose));
  border-radius: 2px;
  transition: width 0.6s ease-out;
}

.match-text {
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.03em;
}

.skeleton {
  flex: 1;
  min-height: 120px;
  background: linear-gradient(90deg, var(--bg-raised) 25%, var(--bg-hover) 50%, var(--bg-raised) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error {
  color: var(--accent-rose);
  padding: 1rem;
  border: 1px solid var(--accent-rose);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 2rem;
  font-size: 0.85rem;
}
</style>
