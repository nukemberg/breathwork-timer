<script setup lang="ts">
import { computed } from 'vue'
import type { CalibrationEntry } from '@/types'

const props = defineProps<{
  entries: CalibrationEntry[]
  personalBest: number
  rollingAverage: number
}>()

const emit = defineEmits<{ delete: [id: string] }>()

function formatTime(seconds: number): string {
  if (seconds === 0) return '--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

// Last 10 entries for bar chart
const chartEntries = computed(() => props.entries.slice(0, 10).reverse())
const maxDuration = computed(() =>
  chartEntries.value.reduce((max, e) => Math.max(max, e.duration), 1)
)

function barHeight(duration: number): string {
  return `${Math.max(8, (duration / maxDuration.value) * 100)}%`
}
</script>

<template>
  <div class="cal-history">
    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat">
        <span class="stat-label">Personal Best</span>
        <span class="stat-value stat-value--best">{{ formatTime(personalBest) }}</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <span class="stat-label">Avg (last 10)</span>
        <span class="stat-value">{{ formatTime(Math.round(rollingAverage)) }}</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <span class="stat-label">Total Holds</span>
        <span class="stat-value">{{ entries.length }}</span>
      </div>
    </div>

    <!-- Bar chart -->
    <div v-if="chartEntries.length >= 2" class="bar-chart">
      <div class="bars">
        <div
          v-for="entry in chartEntries"
          :key="entry.id"
          class="bar"
          :style="{ height: barHeight(entry.duration) }"
          :title="formatTime(entry.duration)"
          :class="{ 'bar--best': entry.duration === personalBest }"
        />
      </div>
      <div class="bar-label">Last {{ chartEntries.length }} holds</div>
    </div>

    <!-- Entry list -->
    <div v-if="entries.length" class="entry-list">
      <h3 class="list-title">History</h3>
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="entry"
      >
        <div class="entry-info">
          <span class="entry-time">{{ formatTime(entry.duration) }}</span>
          <span class="entry-date">{{ formatDate(entry.timestamp) }}</span>
        </div>
        <button
          class="btn btn-ghost btn-icon delete-btn"
          @click="emit('delete', entry.id)"
          :aria-label="`Delete ${formatTime(entry.duration)} hold entry`"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <p v-else class="no-entries">No calibration entries yet. Complete a breath hold to start tracking.</p>
  </div>
</template>

<style scoped>
.cal-history {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 16px;
}

/* ── Stats ── */
.stats-row {
  display: flex;
  background: var(--color-bg-card);
  border-radius: var(--radius-card);
  padding: 16px;
  align-items: center;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-value--best {
  color: var(--color-success);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.06);
}

/* ── Bar chart ── */
.bar-chart {
  background: var(--color-bg-card);
  border-radius: var(--radius-card);
  padding: 16px;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 80px;
  margin-bottom: 8px;
}

.bar {
  flex: 1;
  background: rgba(0, 212, 255, 0.3);
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
  min-width: 8px;
}

.bar--best {
  background: var(--color-accent);
}

.bar-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}

/* ── Entry list ── */
.list-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.entry:last-child {
  border-bottom: none;
}

.entry-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-time {
  font-size: 1.125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.entry-date {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.delete-btn {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.no-entries {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 24px 0;
  line-height: 1.5;
}
</style>
