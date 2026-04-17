<script setup lang="ts">
import { computed } from 'vue'
import type { PhaseType, BreathPhase } from '@/types'

const props = defineProps<{
  phaseType: PhaseType
  timeRemaining: number          // seconds
  totalDuration: number          // seconds (0 for user-timed)
  isUserTimed?: boolean
  phaseKey: string | number      // changes each phase → forces ring element re-creation
  isPaused?: boolean
  isPreparing?: boolean
  nextPhase?: BreathPhase | null
  phaseElapsed?: number          // seconds elapsed — shown as stopwatch for user-timed phases
}>()

// ── Orb scale per phase ────────────────────────────────────────────────────

const ORB_SCALE: Record<PhaseType, number> = {
  'inhale':           1.0,
  'full-retention':   1.0,
  'exhale':           0.35,
  'empty-retention':  0.35,
}

const ORB_COLOR: Record<PhaseType, string> = {
  'inhale':           'var(--color-inhale)',
  'full-retention':   'var(--color-full-retention)',
  'exhale':           'var(--color-exhale)',
  'empty-retention':  'var(--color-empty-retention)',
}

const PHASE_LABELS: Record<PhaseType, string> = {
  'inhale':           'Inhale',
  'full-retention':   'Hold',
  'exhale':           'Exhale',
  'empty-retention':  'Empty Hold',
}

const GLOW_COLOR: Record<PhaseType, string> = {
  'inhale':           'rgba(0, 212, 255, 0.25)',
  'full-retention':   'rgba(255, 208, 96, 0.25)',
  'exhale':           'rgba(123, 94, 167, 0.25)',
  'empty-retention':  'rgba(74, 61, 122, 0.2)',
}

// ── Computed ───────────────────────────────────────────────────────────────

const orbScale = computed(() => props.isPreparing ? 0.65 : ORB_SCALE[props.phaseType])
const orbColor = computed(() => props.isPreparing ? 'rgba(200, 200, 220, 0.55)' : ORB_COLOR[props.phaseType])
const phaseLabel = computed(() => props.isPreparing ? 'Get Ready' : PHASE_LABELS[props.phaseType])
const glowColor = computed(() => props.isPreparing ? 'rgba(200, 200, 220, 0.12)' : GLOW_COLOR[props.phaseType])

// For inhale/exhale the orb transition takes the full phase duration
// For hold phases we snap immediately (0.4s just for color)
const isMoving = computed(() =>
  !props.isPreparing && (props.phaseType === 'inhale' || props.phaseType === 'exhale')
)

const orbTransitionDuration = computed(() =>
  isMoving.value ? `${props.totalDuration}s` : '0.4s'
)

// ── Progress ring ──────────────────────────────────────────────────────────

const RING_RADIUS = 88
const circumference = 2 * Math.PI * RING_RADIUS  // ~552.9

const ringColor = computed(() => orbColor.value)
const ringHidden = computed(() => props.isUserTimed || props.totalDuration <= 0)

// ── Next phase label ───────────────────────────────────────────────────────

const nextPhaseLabel = computed(() =>
  props.nextPhase ? PHASE_LABELS[props.nextPhase.type] : null
)
const nextPhaseColor = computed(() =>
  props.nextPhase ? ORB_COLOR[props.nextPhase.type] : null
)

// ── Countdown / stopwatch display ─────────────────────────────────────────

const displaySeconds = computed(() => Math.ceil(Math.max(0, props.timeRemaining)))

const elapsed = computed(() => props.phaseElapsed ?? 0)
const elapsedFormatted = computed(() => {
  const s = elapsed.value
  if (s < 60) return String(s)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
})
</script>

<template>
  <div class="breath-wrapper">
    <div class="breath-container">
      <!-- Glow halo -->
      <div class="orb-glow" :style="{ background: glowColor, transform: `scale(${orbScale})` }" />

      <!-- SVG: ring + orb -->
      <svg class="breath-svg" viewBox="0 0 200 200" aria-hidden="true">
        <!-- Ring track -->
        <circle
          class="ring-track"
          cx="100" cy="100"
          :r="RING_RADIUS"
        />

        <!-- Ring progress — :key forces recreation (resets CSS animation) on each phase -->
        <circle
          :key="props.phaseKey"
          class="ring-fill"
          :class="{ 'ring-fill--pulse': props.isUserTimed }"
          cx="100" cy="100"
          :r="RING_RADIUS"
          :stroke="ringColor"
          :stroke-dasharray="circumference"
          :style="props.isUserTimed ? {} : {
            '--ring-duration': ringHidden ? '0s' : `${props.totalDuration}s`,
            animationPlayState: props.isPaused ? 'paused' : 'running',
            opacity: 1,
          }"
        />

        <!-- Orb -->
        <circle
          class="orb"
          cx="100" cy="100"
          r="52"
          :style="{
            fill: orbColor,
            transform: `scale(${orbScale})`,
            transition: `transform ${orbTransitionDuration} var(--transition-breath), fill 0.5s ease`,
          }"
        />
      </svg>

      <!-- Center overlay text -->
      <div class="breath-center">
        <span class="phase-label">{{ phaseLabel }}</span>

        <!-- Timed phase: big countdown -->
        <span v-if="!isUserTimed" class="countdown" :key="displaySeconds">
          {{ displaySeconds }}
        </span>

        <!-- User-timed phase: stopwatch + tap cue -->
        <template v-else>
          <span class="elapsed-timer" :key="elapsed">{{ elapsedFormatted }}</span>
          <!-- Finger-tap icon: clearly signals "tap when ready" -->
          <div class="tap-icon-wrap" aria-label="Tap when done">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <!-- Finger -->
              <path d="M22 5v17" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              <!-- Fingertip touch point -->
              <circle cx="22" cy="26" r="5.5" fill="currentColor"/>
              <!-- Inner ripple -->
              <circle cx="22" cy="26" r="11" stroke="currentColor" stroke-width="2" opacity="0.45"/>
              <!-- Outer ripple -->
              <circle cx="22" cy="26" r="17" stroke="currentColor" stroke-width="1.5" opacity="0.18"/>
            </svg>
          </div>
        </template>

        <span v-if="nextPhaseLabel" class="next-phase" :style="{ color: nextPhaseColor ?? '' }">
          Next · {{ nextPhaseLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.breath-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
}

.breath-container {
  position: relative;
  width: min(320px, 80vw);
  height: min(320px, 80vw);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Glow behind the orb */
.orb-glow {
  position: absolute;
  inset: 10%;
  border-radius: 50%;
  transition: background 0.5s ease, transform 2s var(--transition-breath);
  filter: blur(30px);
  pointer-events: none;
}

.breath-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Ring track (faint background ring) */
.ring-track {
  fill: none;
  stroke: var(--color-ring-track);
  stroke-width: 4;
}

/* Animated progress ring */
.ring-fill {
  fill: none;
  stroke-width: 4;
  stroke-linecap: butt;
  /* Rotate so it starts at top (12 o'clock) */
  transform: rotate(-90deg);
  transform-origin: 100px 100px;
  /* Only crossfade color; dashoffset is driven by the CSS animation below */
  transition: stroke 0.5s ease;
  animation: ring-drain var(--ring-duration, 0s) linear forwards;
}

@keyframes ring-drain {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: 552.92; } /* 2π × 88 */
}

/* Pulsing ring shown during user-timed (tap-to-continue) phases */
.ring-fill--pulse {
  stroke-dashoffset: 0; /* full ring visible */
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% { opacity: 0.2; }
  50%       { opacity: 0.7; }
}

/* Main orb */
.orb {
  transform-box: fill-box;
  transform-origin: center;
}

/* Center text overlay — number is pinned to container center;
   label floats above it, cue/next-phase float below */
.breath-center {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.phase-label {
  position: absolute;
  left: 0; right: 0;
  /* bottom edge sits (half-number-height + gap) above center */
  bottom: calc(50% + 1.6rem + 6px);
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.countdown {
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #fff;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.elapsed-timer {
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #fff;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.tap-icon-wrap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* top edge sits (half-number-height + gap) below center */
  top: calc(50% + 1.6rem + 8px);
  display: flex;
  color: var(--color-accent);
  animation: tap-pulse 1.6s ease-in-out infinite;
}

@keyframes tap-pulse {
  0%, 100% { opacity: 0.75; transform: translateX(-50%) scale(1); }
  50%       { opacity: 1;    transform: translateX(-50%) scale(1.12); }
}

.next-phase {
  position: absolute;
  left: 0; right: 0;
  /* top edge sits (half-number-height + gap) below center */
  top: calc(50% + 1.6rem + 8px);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.7;
}
</style>
