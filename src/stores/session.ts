import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TrainingPlan, SessionStatus, SessionPosition, BreathPhase, TrainingStage } from '@/types'

export const useSessionStore = defineStore('session', () => {
  const plan = ref<TrainingPlan | null>(null)
  const status = ref<SessionStatus>('idle')
  const position = ref<SessionPosition>({ stageIndex: 0, roundIndex: 0, phaseIndex: 0 })
  const phaseTimeRemaining = ref<number>(0)
  const phaseElapsed = ref<number>(0)
  const overallElapsed = ref<number>(0)
  const audioEnabled = ref<boolean>(true)
  const hapticEnabled = ref<boolean>(true)

  // ── Derived ────────────────────────────────────────────────────────────────

  const currentStage = computed<TrainingStage | undefined>(
    () => plan.value?.stages[position.value.stageIndex]
  )

  const currentPhase = computed<BreathPhase | undefined>(
    () => currentStage.value?.phases[position.value.phaseIndex]
  )

  const totalStages = computed(() => plan.value?.stages.length ?? 0)

  /** duration === 0 means user must tap to advance */
  const isUserTimedPhase = computed(() => (currentPhase.value?.duration ?? -1) === 0)

  // ── Actions ────────────────────────────────────────────────────────────────

  function startSession(trainingPlan: TrainingPlan) {
    plan.value = trainingPlan
    status.value = 'active'
    position.value = { stageIndex: 0, roundIndex: 0, phaseIndex: 0 }
    phaseTimeRemaining.value = trainingPlan.stages[0].phases[0].duration
    phaseElapsed.value = 0
    overallElapsed.value = 0
  }

  function pauseSession() {
    if (status.value === 'active') status.value = 'paused'
  }

  function resumeSession() {
    if (status.value === 'paused') status.value = 'active'
  }

  function resetSession() {
    plan.value = null
    status.value = 'idle'
    position.value = { stageIndex: 0, roundIndex: 0, phaseIndex: 0 }
    phaseTimeRemaining.value = 0
    phaseElapsed.value = 0
    overallElapsed.value = 0
  }

  /** Called every second by the timer composable. */
  function tickPhase() {
    if (status.value !== 'active') return
    overallElapsed.value += 1
    phaseElapsed.value += 1
    if (!isUserTimedPhase.value && phaseTimeRemaining.value > 0) {
      phaseTimeRemaining.value -= 1
    }
  }

  /**
   * Advance to the next phase/round/stage.
   * Returns true if the session is now complete.
   */
  function advancePhase(): boolean {
    if (!plan.value) return true

    const stage = currentStage.value!
    const nextPhaseIdx = position.value.phaseIndex + 1

    if (nextPhaseIdx < stage.phases.length) {
      position.value = { ...position.value, phaseIndex: nextPhaseIdx }
      phaseTimeRemaining.value = stage.phases[nextPhaseIdx].duration
      phaseElapsed.value = 0
      return false
    }

    const nextRoundIdx = position.value.roundIndex + 1
    if (nextRoundIdx < stage.rounds) {
      position.value = { ...position.value, roundIndex: nextRoundIdx, phaseIndex: 0 }
      phaseTimeRemaining.value = stage.phases[0].duration
      phaseElapsed.value = 0
      return false
    }

    const nextStageIdx = position.value.stageIndex + 1
    if (nextStageIdx < plan.value.stages.length) {
      const nextStage = plan.value.stages[nextStageIdx]
      position.value = { stageIndex: nextStageIdx, roundIndex: 0, phaseIndex: 0 }
      phaseTimeRemaining.value = nextStage.phases[0].duration
      phaseElapsed.value = 0
      return false
    }

    status.value = 'completed'
    return true
  }

  return {
    plan,
    status,
    position,
    phaseTimeRemaining,
    phaseElapsed,
    overallElapsed,
    audioEnabled,
    hapticEnabled,
    currentStage,
    currentPhase,
    totalStages,
    isUserTimedPhase,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    tickPhase,
    advancePhase,
  }
})
