<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { useBreathSession } from '@/composables/useBreathSession'
import BreathAnimation from '@/components/BreathAnimation.vue'
import StageProgress from '@/components/StageProgress.vue'
import PhaseIcon from '@/components/PhaseIcon.vue'

const router = useRouter()
const session = useSessionStore()
const breathSession = useBreathSession()

// ── Lifecycle ──────────────────────────────────────────────────────────────

onMounted(async () => {
  if (!session.plan) {
    router.replace({ name: 'home' })
    return
  }
  // Always start fresh — onBeforeRouteLeave prevents leaving a live session
  // without confirmation, so when we mount here the plan is freshly set.
  await breathSession.startSession(session.plan)
})

onUnmounted(() => {
  // Only reset if session is still active (not completed — completed shows summary)
  if (session.status === 'active' || session.status === 'paused') {
    breathSession.endSession()
  }
})

// Prevent accidental navigation mid-session
onBeforeRouteLeave((_to, _from, next) => {
  if (session.status === 'active' || session.status === 'paused') {
    breathSession.pauseSession()
    if (confirm('End this session?')) {
      breathSession.endSession()
      next()
    } else {
      if (session.status === 'paused') breathSession.resumeSession()
      next(false)
    }
  } else {
    next()
  }
})

// ── Computed ───────────────────────────────────────────────────────────────

const isCompleted = computed(() => session.status === 'completed')

const phaseKey = computed(() => {
  const p = session.position
  return `${p.stageIndex}-${p.roundIndex}-${p.phaseIndex}`
})

function fmtTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// Top-bar shows session time remaining; completed screen shows elapsed
const overallTime = computed(() => fmtTime(session.sessionTimeRemaining))
const elapsedTime = computed(() => fmtTime(session.overallElapsed))
const stageTime = computed(() =>
  `${fmtTime(session.stageTimeRemaining)} / ${fmtTime(session.stageTimeTotal)}`
)

// ── Actions ────────────────────────────────────────────────────────────────

function togglePause() {
  if (session.status === 'active') {
    breathSession.pauseSession()
  } else if (session.status === 'paused') {
    breathSession.resumeSession()
  }
}

function handleTap() {
  if (session.isUserTimedPhase && session.status === 'active') {
    breathSession.userAdvancePhase()
  }
}

function endAndGoHome() {
  breathSession.endSession()
  router.replace({ name: 'home' })
}

function finishAndGoHome() {
  session.resetSession()
  router.replace({ name: 'home' })
}
</script>

<template>
  <div class="session-page page--full">

    <!-- Completed overlay -->
    <Transition name="fade">
      <div v-if="isCompleted" class="completed-overlay">
        <div class="completed-content">
          <div class="completed-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" stroke="var(--color-success)" stroke-width="2"/>
              <path d="M18 28l7 7 13-13" stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="completed-title">Session Complete</h2>
          <div class="completed-time">{{ elapsedTime }}</div>
          <p class="completed-subtitle text-secondary">Total time</p>
          <p class="completed-plan text-secondary">{{ session.plan?.name }}</p>
          <button class="btn btn-primary completed-btn" @click="finishAndGoHome">Done</button>
        </div>
      </div>
    </Transition>

    <!-- Main session UI -->
    <div
      class="session-main"
      @click="handleTap"
      :style="{ cursor: session.isUserTimedPhase ? 'pointer' : 'default' }"
    >
      <!-- Top bar -->
      <div class="session-topbar">
        <button
          class="btn btn-ghost btn-icon"
          @click.stop="togglePause"
          :aria-label="session.status === 'paused' ? 'Resume' : 'Pause'"
        >
          <!-- Pause icon -->
          <svg v-if="session.status === 'active'" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
          </svg>
          <!-- Play icon -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
          </svg>
        </button>

        <div class="session-timer">{{ overallTime }}</div>

        <button
          class="btn btn-ghost btn-icon"
          @click.stop="endAndGoHome"
          aria-label="End session"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Paused banner -->
      <Transition name="slide-down">
        <div v-if="session.status === 'paused'" class="paused-banner">
          Paused — tap play to resume
        </div>
      </Transition>

      <!-- Breath animation -->
      <div class="animation-area">
        <BreathAnimation
          v-if="session.currentPhase"
          :phaseType="session.currentPhase.type"
          :timeRemaining="session.phaseTimeRemaining"
          :totalDuration="session.currentPhase.duration"
          :isUserTimed="session.isUserTimedPhase"
          :phaseKey="phaseKey"
          :isPaused="session.status === 'paused'"
          :nextPhase="session.nextPhase"
          :phaseElapsed="session.phaseElapsed"
        />
        <div v-else class="loading-placeholder" />
      </div>

      <!-- Phase info -->
      <div class="phase-info" v-if="session.currentPhase">
        <PhaseIcon
          :method="session.currentPhase.method"
          :phaseType="session.currentPhase.type"
        />
      </div>

      <!-- Stage instruction -->
      <Transition name="fade-instruction">
        <div v-if="session.currentStage?.instruction" :key="session.position.stageIndex" class="instruction-card">
          <svg class="instruction-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.25"/>
            <path d="M8 7v4.5M8 4.75v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <p class="instruction-text">{{ session.currentStage.instruction }}</p>
        </div>
      </Transition>

      <!-- Progress info -->
      <div class="progress-area" v-if="session.currentStage">
        <StageProgress
          :totalStages="session.totalStages"
          :currentStageIndex="session.position.stageIndex"
          :totalRounds="session.currentStage.rounds"
          :currentRound="session.position.roundIndex + 1"
          :stageName="session.currentStage.name"
        />
        <div class="stage-time" v-if="session.stageTimeTotal > 0">{{ stageTime }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-page {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: var(--color-bg-primary);
  overflow: hidden;
  position: relative;
}

.session-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* ── Top bar ── */
.session-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 0;
  padding-top: calc(12px + var(--safe-top));
  flex-shrink: 0;
}

.session-timer {
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary);
}

/* ── Paused banner ── */
.paused-banner {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  background: rgba(255,255,255,0.04);
  padding: 8px;
  flex-shrink: 0;
}

/* ── Animation area ── */
.animation-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.loading-placeholder {
  width: 200px;
  height: 200px;
}

/* ── Phase info ── */
.phase-info {
  display: flex;
  justify-content: center;
  padding: 8px 16px;
  flex-shrink: 0;
}

/* ── Stage instruction ── */
.instruction-card {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 0 16px 4px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  flex-shrink: 0;
}

.instruction-icon {
  color: var(--color-accent);
  flex-shrink: 0;
  margin-top: 1px;
  opacity: 0.7;
}

.instruction-text {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0;
}

.fade-instruction-enter-active,
.fade-instruction-leave-active { transition: opacity 0.3s ease; }
.fade-instruction-enter-from,
.fade-instruction-leave-to { opacity: 0; }

/* ── Progress ── */
.progress-area {
  padding: 12px 16px;
  padding-bottom: calc(24px + var(--safe-bottom));
  flex-shrink: 0;
}

.stage-time {
  text-align: center;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
  margin-top: 6px;
  letter-spacing: 0.03em;
}

/* ── Completed overlay ── */
.completed-overlay {
  position: absolute;
  inset: 0;
  background: var(--color-bg-primary);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.completed-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  text-align: center;
}

.completed-icon {
  margin-bottom: 8px;
}

.completed-title {
  font-size: 1.75rem;
  font-weight: 700;
}

.completed-time {
  font-size: 3rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-success);
}

.completed-subtitle {
  font-size: 0.875rem;
  margin-top: -4px;
}

.completed-plan {
  font-size: 0.9375rem;
}

.completed-btn {
  width: 200px;
  margin-top: 12px;
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
