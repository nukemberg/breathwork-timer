<script setup lang="ts">
import { computed } from 'vue'
import type { PhaseType } from '@/types'

const props = defineProps<{
  phaseType: PhaseType
  timeRemaining: number   // seconds
  totalDuration: number   // seconds (0 for user-timed)
  isUserTimed?: boolean
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

const orbScale = computed(() => ORB_SCALE[props.phaseType])
const orbColor = computed(() => ORB_COLOR[props.phaseType])
const phaseLabel = computed(() => PHASE_LABELS[props.phaseType])
const glowColor = computed(() => GLOW_COLOR[props.phaseType])

// For inhale/exhale the orb transition takes the full phase duration
// For hold phases we snap immediately (0.4s just for color)
const isMoving = computed(() =>
  props.phaseType === 'inhale' || props.phaseType === 'exhale'
)

const orbTransitionDuration = computed(() =>
  isMoving.value ? `${props.totalDuration}s` : '0.4s'
)

// ── Progress ring ──────────────────────────────────────────────────────────

const RING_RADIUS = 88
const circumference = 2 * Math.PI * RING_RADIUS  // ~552.9

const dashOffset = computed(() => {
  if (props.isUserTimed || props.totalDuration <= 0) return 0
  const progress = Math.max(0, props.timeRemaining) / props.totalDuration
  return circumference * (1 - progress)
})

const ringColor = computed(() => orbColor.value)

// ── Countdown display ──────────────────────────────────────────────────────

const displaySeconds = computed(() => Math.ceil(Math.max(0, props.timeRemaining)))
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

        <!-- Ring progress -->
        <circle
          class="ring-fill"
          cx="100" cy="100"
          :r="RING_RADIUS"
          :stroke="ringColor"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
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
        <span v-if="!isUserTimed" class="countdown" :key="displaySeconds">
          {{ displaySeconds }}
        </span>
        <span v-else class="tap-hint">tap anywhere</span>
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
  stroke-linecap: round;
  /* Rotate so it starts at top (12 o'clock) */
  transform: rotate(-90deg);
  transform-origin: 100px 100px;
  transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
}

/* Main orb */
.orb {
  transform-box: fill-box;
  transform-origin: center;
}

/* Center text overlay */
.breath-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  pointer-events: none;
}

.phase-label {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.countdown {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #fff;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.tap-hint {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.03em;
}
</style>
