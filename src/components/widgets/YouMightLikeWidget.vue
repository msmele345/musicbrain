<script setup lang="ts">
import { useDiscoveryStore } from '@/stores/discovery'

const store = useDiscoveryStore()

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
  padding: 1.75rem;
  color: var(--text-primary);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.widget-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.widget-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 400;
  font-style: italic;
  color: var(--text-primary);
  margin: 0;
}

.widget-label {
  font-size: 0.6rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent-indigo);
  border: 1px solid rgba(139, 124, 248, 0.2);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-sm);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.6rem;
}

.artist-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding: 1.1rem 0.75rem;
  background: var(--bg-raised);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.35s ease-out, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease-out;
  animation: fadeSlideIn 0.5s ease-out both;
}

.artist-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-4px);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(0, 255, 106, 0.08),
    inset 0 1px 0 rgba(0, 255, 106, 0.05);
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

.artist-image-wrapper {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.04);
  transition: border-color 0.35s;
}

.artist-card:hover .artist-image-wrapper {
  border-color: var(--border-accent);
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
  font-style: italic;
  color: var(--accent-neon);
  text-transform: uppercase;
}

.artist-details {
  text-align: center;
  width: 100%;
}

.artist-name {
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.3;
  word-break: break-word;
  letter-spacing: -0.01em;
}

.artist-match {
  margin-top: 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.match-bar-track {
  width: 100%;
  max-width: 72px;
  height: 2px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 2px;
  overflow: hidden;
}

.match-bar-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent-neon), var(--accent-cyan));
  border-radius: 2px;
  transition: width 0.6s ease-out;
}

.match-text {
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
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
