<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrainingsStore } from '@/stores/trainings'
import { useSessionStore } from '@/stores/session'
import type { PhaseType } from '@/types'

const route = useRoute()
const router = useRouter()
const trainingsStore = useTrainingsStore()
const sessionStore = useSessionStore()

const training = computed(() => trainingsStore.getById(route.params.id as string))

const PHASE_LABELS: Record<PhaseType, string> = {
  'inhale': 'Inhale',
  'full-retention': 'Hold',
  'exhale': 'Exhale',
  'empty-retention': 'Empty',
}

const PHASE_COLORS: Record<PhaseType, string> = {
  'inhale': 'var(--color-inhale)',
  'full-retention': 'var(--color-full-retention)',
  'exhale': 'var(--color-exhale)',
  'empty-retention': 'var(--color-empty-retention)',
}

function phaseLabel(type: PhaseType, duration: number): string {
  const label = PHASE_LABELS[type]
  return duration > 0 ? `${label} ${duration}s` : `${label} (hold)`
}

function startSession() {
  if (!training.value) return
  sessionStore.plan = training.value
  router.push({ name: 'session' })
}

function goToEdit() {
  router.push({ name: 'custom-edit', params: { id: training.value!.id } })
}

function totalRounds(t: typeof training.value) {
  if (!t) return 0
  return t.stages.reduce((sum, s) => sum + s.rounds, 0)
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
</script>

<template>
  <!-- Training found: flex column layout so CTA is always in normal flow (not fixed) -->
  <div class="detail-page" v-if="training">
    <!-- Scrollable content -->
    <div class="detail-scroll">
      <!-- Back header -->
      <div class="detail-header">
        <button class="btn btn-ghost btn-icon" @click="router.back()" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button v-if="training.isCustom" class="btn btn-ghost" @click="goToEdit" style="font-size: 0.875rem; min-height:36px; padding: 0 12px;">
          Edit
        </button>
      </div>

      <!-- Title area -->
      <div class="detail-hero">
        <div class="hero-badges">
          <span class="badge" :class="`badge-${training.difficulty}`">{{ training.difficulty }}</span>
          <span v-if="training.isCustom" class="badge badge-custom">custom</span>
        </div>
        <h1>{{ training.name }}</h1>
        <p class="detail-desc text-secondary">{{ training.description }}</p>

        <div class="detail-meta">
          <div class="meta-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            {{ formatDuration(training.estimatedMinutes) }}
          </div>
          <div class="meta-chip">{{ totalRounds(training) }} total rounds</div>
          <div class="meta-chip">{{ training.stages.length }} stage{{ training.stages.length !== 1 ? 's' : '' }}</div>
        </div>
      </div>

      <!-- Stages breakdown -->
      <section class="stages-section">
        <h2 class="stages-title">Program</h2>
        <div class="stages-list">
          <div
            v-for="(stage, si) in training.stages"
            :key="stage.id"
            class="stage-card card"
          >
            <div class="stage-header">
              <span class="stage-num">{{ si + 1 }}</span>
              <div>
                <div class="stage-name">{{ stage.name }}</div>
                <div class="stage-rounds text-muted">{{ stage.rounds }} round{{ stage.rounds !== 1 ? 's' : '' }}</div>
              </div>
            </div>
            <div class="phase-pills">
              <div
                v-for="(phase, pi) in stage.phases"
                :key="pi"
                class="phase-pill"
                :style="{ borderColor: PHASE_COLORS[phase.type], color: PHASE_COLORS[phase.type] }"
              >
                {{ phaseLabel(phase.type, phase.duration) }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- CTA footer — in normal document flow, not position:fixed -->
    <div class="detail-cta">
      <div class="cta-toggles">
        <label class="toggle-row">
          <span>Sound</span>
          <input type="checkbox" v-model="sessionStore.audioEnabled" />
        </label>
        <label class="toggle-row">
          <span>Haptics</span>
          <input type="checkbox" v-model="sessionStore.hapticEnabled" />
        </label>
      </div>
      <button class="btn btn-primary start-btn" @click="startSession">
        Start Session
      </button>
    </div>
  </div>

  <main class="page" v-else>
    <div class="not-found">
      <p class="text-secondary">Training not found.</p>
      <RouterLink to="/" class="btn btn-secondary mt-16">Go Home</RouterLink>
    </div>
  </main>
</template>

<style scoped>
/* ── Page layout: flex column so CTA footer sits below scrollable content ── */
.detail-page {
  display: flex;
  flex-direction: column;
  /* fill viewport minus the fixed bottom nav */
  height: calc(100dvh - var(--nav-height) - var(--safe-bottom));
  padding-top: var(--safe-top);
}

.detail-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;   /* required: flex child with overflow must have min-height:0 */
}

/* ── Header ── */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 0;
}

/* ── Hero ── */
.detail-hero {
  padding: 16px 16px 24px;
}

.hero-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

h1 {
  margin-bottom: 10px;
}

.detail-desc {
  font-size: 0.9375rem;
  line-height: 1.55;
  margin-bottom: 16px;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--color-bg-card);
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

/* ── Stages ── */
.stages-section {
  padding: 0 16px 16px;
}

.stages-title {
  font-size: 1rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stage-card {
  border: 1px solid rgba(255,255,255,0.05);
}

.stage-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.stage-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.stage-name {
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 1.3;
}

.stage-rounds {
  font-size: 0.8125rem;
  margin-top: 2px;
}

.phase-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.phase-pill {
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
  background: transparent;
  opacity: 0.85;
}

/* ── CTA footer — normal flow, NOT position:fixed ── */
.detail-cta {
  flex-shrink: 0;
  padding: 12px 16px;
  background: var(--color-bg-primary);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cta-toggles {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  user-select: none;
}

.toggle-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.start-btn {
  width: 100%;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 16px;
}
</style>
