<script setup lang="ts">
import { ref, computed } from 'vue'
// Bar is the chart.js horizontal bar chart component wrapped for Vue
import { Bar } from 'vue-chartjs'
// Register only the chart.js modules we need (tree-shakeable)
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

// Tell chart.js which modules to use — required before rendering any chart
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useArtistsStore()

// The three time-range options shown as tabs in the UI
const PERIODS = [
  { label: 'Week', value: '7day' },
  { label: 'Month', value: '1month' },
  { label: 'All Time', value: 'overall' },
]

// Tracks which tab is currently selected; drives both the active tab style and the API call
const activePeriod = ref('7day')

// Called when a tab is clicked — updates the active period and re-fetches from the API
function selectPeriod(period: string) {
  activePeriod.value = period
  store.fetchTopArtists(period)
}

// Derives chart-ready data from the store whenever store.artists changes
const chartData = computed<ChartData<'bar'>>(() => ({
  labels: store.artists.map((a) => a.name),
  datasets: [
    {
      label: 'Play count',
      data: store.artists.map((a) => parseInt(a.playcount, 10) || 0),
      // Cycles through a palette of brand colors based on bar index
      backgroundColor: (ctx: { dataIndex: number }) => {
        const colors = ['#00ff6a', '#d45a72', '#8b7cf8', '#00d4ff', '#5fa88e', '#00ff6a', '#d45a72', '#8b7cf8', '#00d4ff', '#5fa88e']
        return colors[ctx.dataIndex % colors.length]
      },
      borderRadius: 3,
      borderSkipped: false, // rounds all 4 corners, not just the end cap
      barThickness: 18,
    },
  ],
}))

// Static chart configuration — layout, axis styling, and tooltip appearance
const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y', // makes bars horizontal (artists on Y axis, play count on X)
  responsive: true,
  maintainAspectRatio: false, // lets the chart fill its CSS container height
  plugins: {
    legend: { display: false }, // no legend needed — the Y axis labels are self-explanatory
    tooltip: {
      backgroundColor: '#0c0c10',
      titleColor: '#ece9e2',
      bodyColor: '#706d6a',
      borderColor: 'rgba(255,255,255,0.04)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: { family: 'DM Sans' },
      bodyFont: { family: 'DM Sans' },
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.x?.toLocaleString() ?? ''} plays`,
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#3d3b38', font: { family: 'DM Sans', size: 11 } },
      grid: { color: 'rgba(255,255,255,0.025)' },
      border: { display: false },
    },
    y: {
      ticks: { color: '#ece9e2', font: { family: 'DM Sans', size: 12 } },
      grid: { display: false }, // no horizontal gridlines — keeps the chart clean
      border: { display: false },
    },
  },
}))
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <h2 class="widget-title">Top Artists</h2>

      <!-- Tab group for selecting the time period; role="tablist" for a11y -->
      <div class="period-tabs" role="tablist">
        <!-- renders one button per PERIODS entry; .active added when it matches activePeriod -->
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

    <!-- Mutually exclusive states: only one of these four divs renders at a time -->
    <div v-if="store.loading" class="skeleton" aria-label="Loading top artists..." />

    <div v-else-if="store.error" class="error" role="alert">
      {{ store.error }}
    </div>

    <div v-else-if="store.artists.length === 0" class="empty">No artist data available.</div>

    <!-- Happy path: pass the computed chart data and options into the Bar component -->
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
  padding: 1.75rem;
  color: var(--text-primary);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  font-size: 1.6rem;
  font-weight: 400;
  font-style: italic;
  color: var(--text-primary);
  margin: 0;
}

.period-tabs {
  display: flex;
  gap: 1px;
  background: transparent;
  border-radius: var(--radius-sm);
}

.tab {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  padding: 0.3rem 0.7rem;
  transition: color 0.3s, border-color 0.3s;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.tab:hover {
  color: var(--text-secondary);
}

.tab.active {
  color: var(--accent-neon);
  border-color: var(--border-accent);
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
