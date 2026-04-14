<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const emit = defineEmits<{ complete: [duration: number] }>()

type TimerState = 'idle' | 'countdown' | 'holding' | 'done'

const state = ref<TimerState>('idle')
const countdown = ref(3)
const elapsed = ref(0)
const result = ref(0)

let intervalId: ReturnType<typeof setInterval> | null = null

function clearTick() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function startCountdown() {
  state.value = 'countdown'
  countdown.value = 3
  intervalId = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearTick()
      startHold()
    }
  }, 1000)
}

function startHold() {
  state.value = 'holding'
  elapsed.value = 0
  intervalId = setInterval(() => {
    elapsed.value += 1
  }, 1000)
}

function release() {
  if (state.value !== 'holding') return
  clearTick()
  result.value = elapsed.value
  state.value = 'done'
}

function save() {
  emit('complete', result.value)
  reset()
}

function discard() {
  reset()
}

function reset() {
  clearTick()
  state.value = 'idle'
  countdown.value = 3
  elapsed.value = 0
  result.value = 0
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const elapsedDisplay = computed(() => formatTime(elapsed.value))
const resultDisplay = computed(() => formatTime(result.value))

onUnmounted(clearTick)
</script>

<template>
  <div class="cal-timer">
    <!-- Idle -->
    <template v-if="state === 'idle'">
      <div class="cal-orb cal-orb--idle">
        <span class="cal-orb-text">Ready</span>
      </div>
      <p class="cal-hint">Take a deep breath, then exhale fully and hold</p>
      <button class="btn btn-primary cal-btn" @click="startCountdown">
        Start Hold
      </button>
    </template>

    <!-- Countdown -->
    <template v-else-if="state === 'countdown'">
      <div class="cal-orb cal-orb--countdown">
        <span class="cal-countdown">{{ countdown }}</span>
      </div>
      <p class="cal-hint">Get ready to hold…</p>
    </template>

    <!-- Holding -->
    <template v-else-if="state === 'holding'">
      <div class="cal-orb cal-orb--holding">
        <span class="cal-elapsed">{{ elapsedDisplay }}</span>
      </div>
      <p class="cal-hint">Hold your breath. Tap when you need to breathe.</p>
      <button class="btn btn-danger cal-btn" @click="release">
        Release
      </button>
    </template>

    <!-- Done -->
    <template v-else-if="state === 'done'">
      <div class="cal-orb cal-orb--done">
        <span class="cal-result">{{ resultDisplay }}</span>
      </div>
      <p class="cal-hint">Your hold time</p>
      <div class="cal-actions">
        <button class="btn btn-primary" @click="save">Save</button>
        <button class="btn btn-ghost" @click="discard">Discard</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cal-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px 16px;
}

.cal-orb {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.4s ease;
}

.cal-orb--idle    { background: radial-gradient(circle, #1f1f40, #12122a); border: 2px solid rgba(255,255,255,0.08); }
.cal-orb--countdown { background: radial-gradient(circle, #2a2a4a, #12122a); border: 2px solid rgba(0,212,255,0.3); }
.cal-orb--holding { background: radial-gradient(circle, #1a3a4a, #0a1a2a); border: 2px solid var(--color-inhale); box-shadow: 0 0 32px rgba(0,212,255,0.2); }
.cal-orb--done    { background: radial-gradient(circle, #1a3a2a, #0a1a12); border: 2px solid var(--color-success); }

.cal-orb-text {
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.05em;
}

.cal-countdown {
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.cal-elapsed {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-inhale);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.cal-result {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-success);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.cal-hint {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  text-align: center;
  max-width: 280px;
  line-height: 1.5;
}

.cal-btn {
  width: 100%;
  max-width: 280px;
}

.cal-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 280px;
}

.cal-actions .btn {
  flex: 1;
}
</style>
