<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { useArtistsStore } from '@/stores/artists'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useArtistsStore()

const PERIODS = [
  { label: 'Week', value: '7day' },
  { label: 'Month', value: '1month' },
  { label: 'All Time', value: 'overall' },
]

const activePeriod = ref('7day')

onMounted(() => {
  store.fetchTopArtists(activePeriod.value)
})

function selectPeriod(period: string) {
  activePeriod.value = period
  store.fetchTopArtists(period)
}

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: store.artists.map((a) => a.name),
  datasets: [
    {
      label: 'Play count',
      data: store.artists.map((a) => parseInt(a.playcount, 10) || 0),
      backgroundColor: '#6366f1',
      borderRadius: 4,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.x.toLocaleString()} plays`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#6c7086' },
      grid: { color: '#313244' },
    },
    y: {
      ticks: { color: '#cdd6f4' },
      grid: { display: false },
    },
  },
}))
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <h2 class="widget-title">Top Artists</h2>
      <div class="period-tabs" role="tablist">
        <button
          v-for="p in PERIODS"
          :key="p.value"
          role="tab"
          :aria-selected="activePeriod === p.value"
          :class="['tab', { active: activePeriod === p.value }]"
          @click="selectPeriod(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <div v-if="store.loading" class="skeleton" aria-label="Loading top artists..." />

    <div v-else-if="store.error" class="error" role="alert">
      {{ store.error }}
    </div>

    <div v-else-if="store.artists.length === 0" class="empty">No artist data available.</div>

    <div v-else class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
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

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.widget-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #cba6f7;
  margin: 0;
}

.period-tabs {
  display: flex;
  gap: 0.25rem;
}

.tab {
  background: transparent;
  border: 1px solid #313244;
  border-radius: 6px;
  color: #6c7086;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  transition: all 0.15s;
}

.tab.active,
.tab:hover {
  background: #313244;
  border-color: #6366f1;
  color: #cdd6f4;
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
