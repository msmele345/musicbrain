<script setup lang="ts">
import { useRecentTracksStore } from '@/stores/recentTracks'

const store = useRecentTracksStore()

function relativeTime(timestamp: string | null): string {
  if (!timestamp) return ''
  const parsed = new Date(timestamp.replace(',', ''))
  if (isNaN(parsed.getTime())) return timestamp
  const diffMs = Date.now() - parsed.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <h2 class="widget-title">Recent Tracks</h2>
      <span class="widget-label">Live Feed</span>
    </div>

    <div v-if="store.loading" class="skeleton" aria-label="Loading recent tracks..." />

    <div v-else-if="store.error" class="error" role="alert">
      {{ store.error }}
    </div>

    <div v-else-if="store.tracks.length === 0" class="empty">No recent tracks found.</div>

    <ul v-else class="track-list">
      <li
        v-for="(track, index) in store.tracks"
        :key="index"
        :class="['track-item', { 'now-playing': track.nowPlaying }]"
      >
        <div class="track-index">
          <span v-if="track.nowPlaying" class="eq-bars" aria-hidden="true">
            <span class="eq-bar" />
            <span class="eq-bar" />
            <span class="eq-bar" />
          </span>
          <span v-else class="index-num">{{ index + 1 }}</span>
        </div>
        <div class="track-info">
          <div class="track-name">{{ track.name }}</div>
          <div class="track-meta">{{ track.artist }}<span v-if="track.album"> &middot; {{ track.album }}</span></div>
        </div>
        <div class="track-right">
          <span v-if="track.nowPlaying" class="now-playing-badge" aria-label="Now playing">
            NOW PLAYING
          </span>
          <span v-else class="track-time">{{ relativeTime(track.timestamp) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.widget {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  color: var(--text-primary);
  min-height: 320px;
  height: 100%;
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
  color: var(--accent-gold);
  border: 1px solid var(--border-accent);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
}

.track-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  flex: 1;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-md);
  gap: 0.75rem;
  transition: background 0.2s;
}

.track-item:hover {
  background: var(--bg-raised);
}

.track-item.now-playing {
  background: var(--accent-gold-dim);
  border-left: 2px solid var(--accent-gold);
  padding-left: calc(0.75rem - 2px);
}

.track-index {
  width: 28px;
  flex-shrink: 0;
  text-align: center;
}

.index-num {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.eq-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  height: 14px;
}

.eq-bar {
  width: 3px;
  background: var(--accent-gold);
  border-radius: 1px;
  animation: eqBounce 0.8s ease-in-out infinite alternate;
}

.eq-bar:nth-child(1) { height: 60%; animation-delay: 0s; }
.eq-bar:nth-child(2) { height: 100%; animation-delay: 0.2s; }
.eq-bar:nth-child(3) { height: 40%; animation-delay: 0.4s; }

@keyframes eqBounce {
  0% { transform: scaleY(0.3); }
  100% { transform: scaleY(1); }
}

.track-info {
  min-width: 0;
  flex: 1;
}

.track-name {
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-item.now-playing .track-name {
  color: var(--accent-gold);
}

.track-meta {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-right {
  flex-shrink: 0;
}

.now-playing-badge {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--accent-gold);
  letter-spacing: 0.1em;
}

.track-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.skeleton {
  flex: 1;
  min-height: 260px;
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
