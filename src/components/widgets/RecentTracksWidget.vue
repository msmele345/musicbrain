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
      <span class="widget-label">
        <span class="pulse-dot" />
        Live
      </span>
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
  padding: 1.75rem;
  color: var(--text-primary);
  min-height: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  overflow: hidden;
}

/* Subtle inner glow at the top */
.widget::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(180deg, rgba(0, 255, 106, 0.03) 0%, transparent 100%);
  pointer-events: none;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.widget-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  position: relative;
  z-index: 1;
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
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.6rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent-neon);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-neon);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0, 255, 106, 0.4); }
  50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(0, 255, 106, 0); }
}

.track-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  position: relative;
  z-index: 1;
}

.track-item {
  display: flex;
  align-items: center;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-sm);
  gap: 0.75rem;
  transition: background 0.25s ease-out;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.track-item:last-child {
  border-bottom: none;
}

.track-item:hover {
  background: var(--bg-raised);
}

.track-item.now-playing {
  background: linear-gradient(90deg, rgba(0, 255, 106, 0.1) 0%, rgba(0, 255, 106, 0.03) 100%);
  border-bottom-color: transparent;
  border-radius: var(--radius-md);
  padding: 0.85rem 0.75rem;
  margin-bottom: 0.25rem;
  position: relative;
}

.track-item.now-playing::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 2px;
  background: var(--accent-neon);
  border-radius: 1px;
  box-shadow: 0 0 12px rgba(0, 255, 106, 0.4);
}

.track-index {
  width: 28px;
  flex-shrink: 0;
  text-align: center;
}

.index-num {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.eq-bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  height: 16px;
}

.eq-bar {
  width: 2.5px;
  background: var(--accent-neon);
  border-radius: 1px;
  animation: eqBounce 0.6s ease-in-out infinite alternate;
  box-shadow: 0 0 6px rgba(0, 255, 106, 0.3);
}

.eq-bar:nth-child(1) { height: 50%; animation-delay: 0s; animation-duration: 0.5s; }
.eq-bar:nth-child(2) { height: 100%; animation-delay: 0.15s; animation-duration: 0.7s; }
.eq-bar:nth-child(3) { height: 35%; animation-delay: 0.3s; animation-duration: 0.55s; }
.eq-bar:nth-child(4) { height: 70%; animation-delay: 0.1s; animation-duration: 0.65s; }

@keyframes eqBounce {
  0% { transform: scaleY(0.2); }
  100% { transform: scaleY(1); }
}

.track-info {
  min-width: 0;
  flex: 1;
}

.track-name {
  font-weight: 500;
  font-size: 0.88rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.track-item.now-playing .track-name {
  color: var(--accent-neon);
  font-weight: 600;
  font-size: 0.92rem;
}

.track-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-right {
  flex-shrink: 0;
}

.now-playing-badge {
  font-size: 0.55rem;
  font-weight: 600;
  color: var(--accent-neon);
  letter-spacing: 0.12em;
  text-shadow: 0 0 20px rgba(0, 255, 106, 0.3);
}

.track-time {
  font-size: 0.7rem;
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
