<script setup lang="ts">
import { computed } from 'vue'
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


const PALETTE = [
  '#d4a543', '#c4687a', '#7b6cf6', '#5fa88e', '#d49a6a',
  '#8892a4', '#b8945f', '#9b6ec4', '#6a9fb5', '#c79a8d',
]

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: store.genres.map((g) => g.name),
  datasets: [
    {
      data: store.genres.map((g) => g.count),
      backgroundColor: store.genres.map((_, i) => PALETTE[i % PALETTE.length]),
      borderWidth: 2,
      borderColor: '#111118',
      hoverBorderColor: '#111118',
      hoverBorderWidth: 3,
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#8892a4',
        font: { size: 11, family: 'DM Sans' },
        padding: 10,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
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

.widget-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-primary);
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
