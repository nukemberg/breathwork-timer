import { watch, onUnmounted } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useTimer } from './useTimer'
import { useWakeLock } from './useWakeLock'
import type { TrainingPlan, PhaseType } from '@/types'

const PHASE_TONES: Record<PhaseType, [number, number]> = {
  'inhale':           [528, 0.35],
  'full-retention':   [639, 0.25],
  'exhale':           [396, 0.35],
  'empty-retention':  [285, 0.25],
}

export function useBreathSession() {
  const session = useSessionStore()
  const timer = useTimer(1000)
  const wakeLock = useWakeLock()

  let audioCtx: AudioContext | null = null

  function getAudioContext(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext()
    return audioCtx
  }

  async function playTone(frequency: number, duration: number) {
    if (!session.audioEnabled) return
    try {
      const ctx = getAudioContext()
      if (ctx.state === 'suspended') await ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch {
      // AudioContext may be unavailable in some environments
    }
  }

  function vibrate(pattern: number | number[]) {
    if (!session.hapticEnabled) return
    try {
      navigator.vibrate?.(pattern)
    } catch {
      // Vibration API not available
    }
  }

  function onPhaseTransition() {
    const phase = session.currentPhase
    if (!phase) return
    const [freq, dur] = PHASE_TONES[phase.type]
    playTone(freq, dur)
    vibrate(40)
  }

  function tick() {
    if (session.status !== 'active') return

    session.tickPhase()

    // For user-timed phases, the composable does not auto-advance
    if (session.isUserTimedPhase) return

    if (session.phaseTimeRemaining <= 0) {
      const completed = session.advancePhase()
      if (completed) {
        timer.stop()
        wakeLock.release()
        vibrate([80, 40, 80, 40, 120])
      } else {
        onPhaseTransition()
      }
    }
  }

  async function startSession(trainingPlan: TrainingPlan) {
    session.startSession(trainingPlan)
    await wakeLock.request()
    onPhaseTransition()
    timer.start(tick)
  }

  function pauseSession() {
    session.pauseSession()
    timer.stop()
  }

  function resumeSession() {
    session.resumeSession()
    timer.start(tick)
  }

  function endSession() {
    timer.stop()
    wakeLock.release()
    session.resetSession()
  }

  /** Called when user taps to manually advance a user-timed phase. */
  function userAdvancePhase() {
    if (!session.isUserTimedPhase) return
    const completed = session.advancePhase()
    if (completed) {
      timer.stop()
      wakeLock.release()
      vibrate([80, 40, 80, 40, 120])
    } else {
      onPhaseTransition()
    }
  }

  watch(
    () => session.status,
    (newStatus) => {
      if (newStatus === 'completed' || newStatus === 'idle') {
        timer.stop()
        wakeLock.release()
      }
    }
  )

  onUnmounted(() => {
    timer.stop()
    wakeLock.release()
  })

  return {
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    userAdvancePhase,
  }
}
