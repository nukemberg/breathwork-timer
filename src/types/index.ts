export type BreathingMethod = 'nose' | 'mouth' | 'either'
export type PhaseType = 'inhale' | 'full-retention' | 'exhale' | 'empty-retention'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type SessionStatus = 'idle' | 'preparing' | 'active' | 'paused' | 'completed'

export interface BreathPhase {
  type: PhaseType
  /** Duration in seconds. 0 = user-timed (tap to continue) */
  duration: number
  method: BreathingMethod
}

export interface TrainingStage {
  id: string
  name: string
  rounds: number
  phases: BreathPhase[]
  /** Optional technique instruction shown during this stage in the session view. */
  instruction?: string
}

export interface TrainingPlan {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  estimatedMinutes: number
  stages: TrainingStage[]
  isCustom?: boolean
}

export interface CalibrationEntry {
  id: string
  timestamp: number
  /** Duration in seconds */
  duration: number
  notes?: string
}

export interface UserTimedPhaseLog {
  stageName: string
  phaseType: PhaseType
  round: number
  durationSeconds: number
}

export interface SessionLog {
  id: string
  timestamp: number
  planId: string
  planName: string
  totalDurationSeconds: number
  userTimedPhases: UserTimedPhaseLog[]
}

export interface SessionPosition {
  stageIndex: number
  roundIndex: number
  phaseIndex: number
}
