<script setup lang="ts">
import { onMounted } from 'vue'
import GenreBreakdownWidget from '@/components/widgets/GenreBreakdownWidget.vue'
import { useGenresStore } from '@/stores/genres'

const genresStore = useGenresStore()

onMounted(() => {
  genresStore.fetchTopGenres()
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
