<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecentTracksStore } from '@/stores/recentTracks'

const store = useRecentTracksStore()

onMounted(() => {
  store.fetchRecentTracks()
})

function relativeTime(timestamp: string | null): string {
  if (!timestamp) return ''
  // Last.fm date format: "14 Nov 2023, 20:00"
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
    <h2 class="widget-title">Recent Tracks</h2>

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
        <div class="track-info">
          <div class="track-name">{{ track.name }}</div>
          <div class="track-meta">{{ track.artist }}<span v-if="track.album"> · {{ track.album }}</span></div>
        </div>
        <div class="track-right">
          <span v-if="track.nowPlaying" class="now-playing-badge" aria-label="Now playing">
            <span class="pulse-dot" />
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

.track-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 400px;
}

.track-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  background: #181825;
  gap: 0.75rem;
}

.track-item.now-playing {
  background: #1e1e3a;
  border: 1px solid #6366f1;
}

.track-info {
  min-width: 0;
}

.track-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-meta {
  font-size: 0.8rem;
  color: #6c7086;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-right {
  flex-shrink: 0;
}

.now-playing-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #6366f1;
  letter-spacing: 0.05em;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.track-time {
  font-size: 0.75rem;
  color: #6c7086;
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
