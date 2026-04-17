import { watch, onUnmounted } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useSessionLogsStore } from '@/stores/sessionLogs'
import { useTimer } from './useTimer'
import { useWakeLock } from './useWakeLock'
import type { TrainingPlan, PhaseType, UserTimedPhaseLog } from '@/types'

const PHASE_TONES: Record<PhaseType, [number, number]> = {
  'inhale':           [528, 0.35],
  'full-retention':   [639, 0.25],
  'exhale':           [396, 0.35],
  'empty-retention':  [285, 0.25],
}

export function useBreathSession() {
  const session = useSessionStore()
  const logsStore = useSessionLogsStore()
  const timer = useTimer(1000)
  const wakeLock = useWakeLock()

  let audioCtx: AudioContext | null = null

  // ── Session log collection ─────────────────────────────────────────────────
  let userTimedLog: UserTimedPhaseLog[] = []

  function recordUserTimedPhase() {
    if (!session.currentStage || !session.currentPhase) return
    userTimedLog.push({
      stageName: session.currentStage.name,
      phaseType: session.currentPhase.type,
      round: session.position.roundIndex + 1,
      durationSeconds: session.phaseElapsed,
    })
  }

  function saveSessionLog() {
    if (!session.plan) return
    logsStore.addEntry({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      planId: session.plan.id,
      planName: session.plan.name,
      totalDurationSeconds: session.overallElapsed,
      userTimedPhases: [...userTimedLog],
    })
  }

  // ── Wall-clock phase tracking ──────────────────────────────────────────────
  // Stores the effective wall-clock start time of the current phase.
  // Back-calculated when resuming so paused sessions pick up where they left off.
  let phaseStartedAt = 0

  function syncPhaseStart() {
    const total = session.currentPhase?.duration ?? 0
    const remaining = session.phaseTimeRemaining
    // If remaining === total, phase just started. Otherwise, rewind start time.
    phaseStartedAt = Date.now() - (total - remaining) * 1000
  }

  // ── Audio ──────────────────────────────────────────────────────────────────

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

  // ── Tick ──────────────────────────────────────────────────────────────────

  function tick() {
    if (session.status === 'preparing') {
      session.tickPrep()
      if (session.prepCountdown <= 0) {
        session.activateSession()
        syncPhaseStart()
        onPhaseTransition()
      }
      return
    }

    if (session.status !== 'active') return

    session.tickPhase()  // increments overallElapsed + phaseElapsed

    if (session.isUserTimedPhase) return

    const phase = session.currentPhase
    if (!phase) return

    // Wall-clock remaining — accurate even when setInterval was throttled
    const elapsed = (Date.now() - phaseStartedAt) / 1000
    const remaining = Math.max(0, phase.duration - elapsed)
    session.setPhaseTimeRemaining(Math.ceil(remaining))

    if (remaining <= 0) {
      const completed = session.advancePhase()
      syncPhaseStart()
      if (completed) {
        saveSessionLog()
        timer.stop()
        wakeLock.release()
        removeVisibilityListener()
        vibrate([80, 40, 80, 40, 120])
      } else {
        onPhaseTransition()
      }
    }
  }

  // ── Visibility catch-up ───────────────────────────────────────────────────
  // When the browser throttles setInterval (tab hidden, screen locked),
  // fire a tick immediately when the page becomes visible again to resync.

  function onVisibilityChange() {
    if (!document.hidden && (session.status === 'active' || session.status === 'preparing')) {
      tick()
    }
  }

  function addVisibilityListener() {
    document.addEventListener('visibilitychange', onVisibilityChange)
  }

  function removeVisibilityListener() {
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }

  // ── Session controls ──────────────────────────────────────────────────────

  async function startSession(trainingPlan: TrainingPlan) {
    userTimedLog = []
    session.startPreparing(trainingPlan)
    await wakeLock.request()
    addVisibilityListener()
    timer.start(tick)
  }

  function pauseSession() {
    session.pauseSession()
    timer.stop()
    removeVisibilityListener()
  }

  function resumeSession() {
    session.resumeSession()
    syncPhaseStart()  // recalibrate wall-clock start for remaining time
    addVisibilityListener()
    timer.start(tick)
  }

  function endSession() {
    timer.stop()
    wakeLock.release()
    removeVisibilityListener()
    session.resetSession()
  }

  /** Called when user taps to manually advance a user-timed phase. */
  function userAdvancePhase() {
    if (!session.isUserTimedPhase) return
    recordUserTimedPhase()
    const completed = session.advancePhase()
    syncPhaseStart()
    if (completed) {
      saveSessionLog()
      timer.stop()
      wakeLock.release()
      removeVisibilityListener()
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
        removeVisibilityListener()
      }
    }
  )

  onUnmounted(() => {
    timer.stop()
    wakeLock.release()
    removeVisibilityListener()
  })

  return {
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    userAdvancePhase,
  }
}
