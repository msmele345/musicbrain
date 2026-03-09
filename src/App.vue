<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
:root {
  --bg-deep: #050506;
  --bg-surface: #0c0c10;
  --bg-raised: #141418;
  --bg-hover: #1c1c22;
  --accent-neon: #00ff6a;
  --accent-neon-dim: rgba(0, 255, 106, 0.07);
  --accent-neon-glow: rgba(0, 255, 106, 0.2);
  --accent-rose: #d45a72;
  --accent-indigo: #8b7cf8;
  --accent-cyan: #00d4ff;
  --text-primary: #ece9e2;
  --text-secondary: #706d6a;
  --text-muted: #3d3b38;
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-accent: rgba(0, 255, 106, 0.12);
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --radius-lg: 14px;
  --radius-md: 10px;
  --radius-sm: 6px;
  --shadow-deep: 0 24px 64px rgba(0, 0, 0, 0.6), 0 8px 20px rgba(0, 0, 0, 0.4);
  --shadow-glow-neon: 0 0 40px rgba(0, 255, 106, 0.06);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg-deep);
  color: var(--text-primary);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image:
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(0, 255, 106, 0.02) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0, 212, 255, 0.02) 0%, transparent 50%);
  background-attachment: fixed;
}

/* Noise texture overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
