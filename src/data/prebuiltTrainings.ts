import type { TrainingPlan, TrainingStage } from '@/types'

function stage(id: string, name: string, rounds: number, phases: TrainingStage['phases']): TrainingStage {
  return { id, name, rounds, phases }
}

export const PREBUILT_TRAININGS: ReadonlyArray<TrainingPlan> = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Equal-length inhale, hold, exhale, and empty hold. Reduces stress and improves focus. Used by Navy SEALs and first responders.',
    difficulty: 'beginner',
    estimatedMinutes: 4,
    stages: [
      stage('box-s1', 'Box Breathing', 8, [
        { type: 'inhale',           duration: 4, method: 'nose' },
        { type: 'full-retention',   duration: 4, method: 'nose' },
        { type: 'exhale',           duration: 4, method: 'mouth' },
        { type: 'empty-retention',  duration: 4, method: 'nose' },
      ]),
    ],
  },

  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Developed by Dr. Andrew Weil. Activates the parasympathetic nervous system for deep relaxation and improved sleep.',
    difficulty: 'beginner',
    estimatedMinutes: 3,
    stages: [
      stage('478-s1', '4-7-8 Pattern', 4, [
        { type: 'inhale',         duration: 4, method: 'nose' },
        { type: 'full-retention', duration: 7, method: 'nose' },
        { type: 'exhale',         duration: 8, method: 'mouth' },
      ]),
    ],
  },

  {
    id: 'coherent-breathing',
    name: 'Coherent Breathing',
    description: 'Slow 5-second inhale and exhale through the nose. Synchronizes heart rate variability and induces calm alertness.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    stages: [
      stage('coh-s1', 'Coherent Breathing', 20, [
        { type: 'inhale', duration: 5, method: 'nose' },
        { type: 'exhale', duration: 5, method: 'nose' },
      ]),
    ],
  },

  {
    id: 'relaxation-4262',
    name: 'Relaxation Breathing',
    description: 'Extended exhale pattern (4-2-6-2) that activates the rest-and-digest response. Great for winding down before sleep.',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    stages: [
      stage('rel-s1', 'Relaxation Pattern', 8, [
        { type: 'inhale',          duration: 4, method: 'nose' },
        { type: 'full-retention',  duration: 2, method: 'nose' },
        { type: 'exhale',          duration: 6, method: 'mouth' },
        { type: 'empty-retention', duration: 2, method: 'nose' },
      ]),
    ],
  },

  {
    id: 'energizing-breath',
    name: 'Energizing Breath',
    description: 'Rapid breathing cycles followed by a retention hold. Increases oxygen and energy levels, great as a morning activation.',
    difficulty: 'intermediate',
    estimatedMinutes: 6,
    stages: [
      stage('eng-s1', 'Activation Breathing', 20, [
        { type: 'inhale', duration: 2, method: 'nose' },
        { type: 'exhale', duration: 1, method: 'mouth' },
      ]),
      stage('eng-s2', 'Hold', 1, [
        { type: 'full-retention', duration: 20, method: 'nose' },
      ]),
      stage('eng-s3', 'Recovery', 1, [
        { type: 'inhale', duration: 5, method: 'nose' },
        { type: 'exhale', duration: 5, method: 'mouth' },
      ]),
    ],
  },

  {
    id: 'wim-hof-basic',
    name: 'Wim Hof Basic',
    description: 'Three cycles of 30 power breaths, exhale-empty hold (user-timed), and a 15-second recovery hold. Builds CO₂ tolerance and mental resilience.',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    stages: [
      // Cycle 1
      stage('wh-c1-power', 'Cycle 1 – Power Breathing', 30, [
        { type: 'inhale', duration: 2, method: 'nose' },
        { type: 'exhale', duration: 1, method: 'mouth' },
      ]),
      stage('wh-c1-hold', 'Cycle 1 – Exhale Hold', 1, [
        { type: 'empty-retention', duration: 0, method: 'either' },  // user-timed
      ]),
      stage('wh-c1-recovery', 'Cycle 1 – Recovery Hold', 1, [
        { type: 'full-retention', duration: 15, method: 'nose' },
      ]),
      // Cycle 2
      stage('wh-c2-power', 'Cycle 2 – Power Breathing', 30, [
        { type: 'inhale', duration: 2, method: 'nose' },
        { type: 'exhale', duration: 1, method: 'mouth' },
      ]),
      stage('wh-c2-hold', 'Cycle 2 – Exhale Hold', 1, [
        { type: 'empty-retention', duration: 0, method: 'either' },
      ]),
      stage('wh-c2-recovery', 'Cycle 2 – Recovery Hold', 1, [
        { type: 'full-retention', duration: 15, method: 'nose' },
      ]),
      // Cycle 3
      stage('wh-c3-power', 'Cycle 3 – Power Breathing', 30, [
        { type: 'inhale', duration: 2, method: 'nose' },
        { type: 'exhale', duration: 1, method: 'mouth' },
      ]),
      stage('wh-c3-hold', 'Cycle 3 – Exhale Hold', 1, [
        { type: 'empty-retention', duration: 0, method: 'either' },
      ]),
      stage('wh-c3-recovery', 'Cycle 3 – Recovery Hold', 1, [
        { type: 'full-retention', duration: 15, method: 'nose' },
      ]),
    ],
  },
]
