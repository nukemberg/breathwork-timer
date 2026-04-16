<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSessionLogsStore } from '@/stores/sessionLogs'
import type { SessionLog } from '@/types'

const logsStore = useSessionLogsStore()

const expandedId = ref<string | null>(null)

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const isYesterday = d.toDateString() === new Date(now.getTime() - 86400000).toDateString()

  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `Today · ${time}`
  if (isYesterday) return `Yesterday · ${time}`
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ` · ${time}`
}

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

function fmtHoldDuration(s: number): string {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const sec = s % 60
  return sec > 0 ? `${m}m ${sec}s` : `${m}m`
}

function confirmClear() {
  if (confirm('Delete all session logs?')) logsStore.clearAll()
}

// Group user-timed phases by stage name for cleaner display
function groupedPhases(log: SessionLog) {
  const map = new Map<string, { durationSeconds: number; rounds: number[] }>()
  for (const p of log.userTimedPhases) {
    const key = p.stageName
    if (!map.has(key)) map.set(key, { durationSeconds: 0, rounds: [] })
    const entry = map.get(key)!
    entry.durationSeconds += p.durationSeconds
    entry.rounds.push(p.durationSeconds)
  }
  return Array.from(map.entries()).map(([name, data]) => ({ name, rounds: data.rounds }))
}

const hasLogs = computed(() => logsStore.entries.length > 0)
</script>

<template>
  <div class="logs-page page">
    <div class="page-header">
      <h1 class="page-title">Session Logs</h1>
      <button v-if="hasLogs" class="btn btn-ghost btn-sm" @click="confirmClear">Clear all</button>
    </div>

    <div v-if="!hasLogs" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
        <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
        <path d="M24 15v9l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p class="empty-title">No sessions yet</p>
      <p class="empty-sub text-secondary">Complete a session to see your history here.</p>
    </div>

    <div v-else class="log-list">
      <div
        v-for="entry in logsStore.entries"
        :key="entry.id"
        class="log-card"
      >
        <!-- Card header row -->
        <div class="log-row" @click="entry.userTimedPhases.length ? toggleExpand(entry.id) : null"
          :style="{ cursor: entry.userTimedPhases.length ? 'pointer' : 'default' }">
          <div class="log-info">
            <span class="log-plan">{{ entry.planName }}</span>
            <span class="log-date text-secondary">{{ formatDate(entry.timestamp) }}</span>
          </div>
          <div class="log-right">
            <span class="log-total">{{ fmtDuration(entry.totalDurationSeconds) }}</span>
            <svg
              v-if="entry.userTimedPhases.length"
              class="expand-chevron"
              :class="{ 'expand-chevron--open': expandedId === entry.id }"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <button
              class="btn btn-ghost btn-icon btn-xs"
              @click.stop="logsStore.deleteEntry(entry.id)"
              aria-label="Delete entry"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Expandable holds breakdown -->
        <Transition name="slide-expand">
          <div v-if="expandedId === entry.id && entry.userTimedPhases.length" class="holds-list">
            <template v-for="group in groupedPhases(entry)" :key="group.name">
              <div v-if="group.rounds.length === 1" class="hold-row">
                <span class="hold-name">{{ group.name }}</span>
                <span class="hold-duration">{{ fmtHoldDuration(group.rounds[0]) }}</span>
              </div>
              <div v-else class="hold-row hold-row--multi">
                <span class="hold-name">{{ group.name }}</span>
                <div class="hold-rounds">
                  <span v-for="(d, i) in group.rounds" :key="i" class="hold-round-chip">
                    {{ fmtHoldDuration(d) }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logs-page {
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - var(--nav-height) - var(--safe-bottom));
  padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 16px);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 12px;
  padding-top: calc(20px + var(--safe-top));
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
}

/* ── Empty state ── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 24px;
  color: var(--color-text-secondary);
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 8px;
}

.empty-sub {
  font-size: 0.875rem;
  text-align: center;
}

/* ── Log list ── */
.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}

.log-card {
  background: var(--color-bg-card);
  border-radius: 12px;
  overflow: hidden;
}

.log-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 14px;
  gap: 8px;
}

.log-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.log-plan {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-date {
  font-size: 0.75rem;
}

.log-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.log-total {
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-accent);
}

.expand-chevron {
  color: var(--color-text-muted);
  transition: transform 0.2s ease;
}

.expand-chevron--open {
  transform: rotate(180deg);
}

.btn-xs {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

/* ── Holds breakdown ── */
.holds-list {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hold-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.hold-name {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hold-duration {
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-primary);
  flex-shrink: 0;
}

.hold-row--multi {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.hold-rounds {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.hold-round-chip {
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 5px;
  padding: 2px 7px;
  color: var(--color-text-primary);
}

/* ── Transitions ── */
.slide-expand-enter-active,
.slide-expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-expand-enter-from,
.slide-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-expand-enter-to,
.slide-expand-leave-from {
  max-height: 400px;
  opacity: 1;
}
</style>
