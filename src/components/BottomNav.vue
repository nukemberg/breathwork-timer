<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bottom-nav" role="navigation" aria-label="Main navigation">
    <RouterLink to="/" class="nav-item" exact-active-class="nav-item--active">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12L12 3l9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Home</span>
    </RouterLink>

    <RouterLink to="/calibration" class="nav-item" active-class="nav-item--active">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 3v1M12 20v1M3 12h1M20 12h1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span>Calibrate</span>
    </RouterLink>

    <RouterLink to="/logs" class="nav-item" active-class="nav-item--active">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/>
        <path d="M8 9h8M8 13h5M8 17h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span>Logs</span>
    </RouterLink>

    <RouterLink to="/custom/new" class="nav-item" active-class="nav-item--active">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span>Custom</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(var(--nav-height) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: var(--color-bg-surface);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 48px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: color var(--transition-ui);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.nav-item--active {
  color: var(--color-accent);
}
</style>
