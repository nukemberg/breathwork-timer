export type BreathingMethod = 'nose' | 'mouth' | 'either'
export type PhaseType = 'inhale' | 'full-retention' | 'exhale' | 'empty-retention'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type SessionStatus = 'idle' | 'active' | 'paused' | 'completed'

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

export interface SessionPosition {
  stageIndex: number
  roundIndex: number
  phaseIndex: number
}
