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
      backgroundColor: (ctx: { dataIndex: number }) => {
        const colors = ['#d4a543', '#c4687a', '#7b6cf6', '#5fa88e', '#d4a543', '#c4687a', '#7b6cf6', '#5fa88e', '#d4a543', '#c4687a']
        return colors[ctx.dataIndex % colors.length]
      },
      borderRadius: 3,
      borderSkipped: false,
      barThickness: 18,
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
      backgroundColor: '#1a1a24',
      titleColor: '#e8e6e1',
      bodyColor: '#8892a4',
      borderColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
      titleFont: { family: 'DM Sans' },
      bodyFont: { family: 'DM Sans' },
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.x?.toLocaleString() ?? ''} plays`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#555d6e', font: { family: 'DM Sans', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
      border: { display: false },
    },
    y: {
      ticks: { color: '#e8e6e1', font: { family: 'DM Sans', size: 12 } },
      grid: { display: false },
      border: { display: false },
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
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  color: var(--text-primary);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.widget-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.widget-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.period-tabs {
  display: flex;
  gap: 2px;
  background: var(--bg-raised);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.tab {
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.3rem 0.65rem;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}

.tab:hover {
  color: var(--text-secondary);
}

.tab.active {
  background: var(--bg-hover);
  color: var(--accent-gold);
}

.chart-container {
  flex: 1;
  position: relative;
  min-height: 260px;
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
