<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { useGenresStore } from '@/stores/genres'

ChartJS.register(ArcElement, Tooltip, Legend)

const store = useGenresStore()

onMounted(() => {
  if (store.genres.length === 0) {
    store.fetchTopGenres()
  }
})

const PALETTE = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#a855f7', '#e11d48', '#fb923c', '#facc15', '#4ade80',
  '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6',
  '#fb7185', '#fdba74', '#fde047', '#86efac', '#67e8f9',
]

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: store.genres.map((g) => g.name),
  datasets: [
    {
      data: store.genres.map((g) => g.count),
      backgroundColor: store.genres.map((_, i) => PALETTE[i % PALETTE.length]),
      borderWidth: 2,
      borderColor: '#1e1e2e',
    },
  ],
}))

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#cdd6f4',
        font: { size: 12 },
        padding: 12,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} plays`,
      },
    },
  },
}))
</script>

<template>
  <div class="widget">
    <h2 class="widget-title">Genre Breakdown</h2>

    <div v-if="store.loading" class="skeleton" aria-label="Loading genres..." />

    <div v-else-if="store.error" class="error" role="alert">
      {{ store.error }}
    </div>

    <div v-else-if="store.genres.length === 0" class="empty">No genre data available.</div>

    <div v-else class="chart-container">
      <Doughnut :data="chartData" :options="chartOptions" />
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

.chart-container {
  flex: 1;
  position: relative;
  min-height: 260px;
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
