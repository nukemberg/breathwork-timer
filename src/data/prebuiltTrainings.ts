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
    id: 'buteyko',
    name: 'Buteyko Breathing',
    description: 'Developed by Konstantin Buteyko to raise CO₂ tolerance and normalize breathing volume. Nasal breathing only. The "control pause" — holding after a gentle exhale — is the core diagnostic and training tool.',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    stages: [
      stage('but-s1', 'Reduced Breathing', 10, [
        { type: 'inhale',          duration: 2, method: 'nose' },
        { type: 'exhale',          duration: 3, method: 'nose' },
        { type: 'empty-retention', duration: 2, method: 'nose' },
      ]),
      stage('but-s2', 'Control Pause', 5, [
        { type: 'inhale',          duration: 2, method: 'nose' },
        { type: 'exhale',          duration: 3, method: 'nose' },
        { type: 'empty-retention', duration: 0, method: 'nose' },  // user-timed: hold until first urge
      ]),
      stage('but-s3', 'Recovery Breathing', 5, [
        { type: 'inhale', duration: 3, method: 'nose' },
        { type: 'exhale', duration: 4, method: 'nose' },
      ]),
    ],
  },

  {
    id: 'antara-kumbhaka',
    name: 'Antara Kumbhaka',
    description: 'Internal (antara) breath retention after full inhale. Classic pranayama ratio 1:4:2. Builds prana, calms the mind, and deepens lung capacity. Keep the spine tall and apply a gentle chin lock (jalandhara bandha) during the hold.',
    difficulty: 'intermediate',
    estimatedMinutes: 5,
    stages: [
      stage('ank-s1', 'Preparatory Breathing', 4, [
        { type: 'inhale', duration: 4, method: 'nose' },
        { type: 'exhale', duration: 8, method: 'nose' },
      ]),
      stage('ank-s2', 'Antara Kumbhaka (1:4:2)', 8, [
        { type: 'inhale',         duration: 4,  method: 'nose' },
        { type: 'full-retention', duration: 16, method: 'nose' },
        { type: 'exhale',         duration: 8,  method: 'nose' },
      ]),
      stage('ank-s3', 'Integration', 4, [
        { type: 'inhale', duration: 4, method: 'nose' },
        { type: 'exhale', duration: 8, method: 'nose' },
      ]),
    ],
  },

  {
    id: 'bahya-kumbhaka',
    name: 'Bahya Kumbhaka',
    description: 'External (bahya) breath retention after full exhale. More challenging than internal retention; stimulates the digestive fire and strengthens the core. Apply mula and uddiyana bandha during the empty hold.',
    difficulty: 'advanced',
    estimatedMinutes: 6,
    stages: [
      stage('bak-s1', 'Preparatory Breathing', 4, [
        { type: 'inhale', duration: 4, method: 'nose' },
        { type: 'exhale', duration: 8, method: 'nose' },
      ]),
      stage('bak-s2', 'Bahya Kumbhaka (1:2:4)', 8, [
        { type: 'inhale',          duration: 4, method: 'nose' },
        { type: 'exhale',          duration: 8, method: 'nose' },
        { type: 'empty-retention', duration: 0, method: 'nose' },  // user-timed: hold with bandhas
      ]),
      stage('bak-s3', 'Integration', 4, [
        { type: 'inhale', duration: 4, method: 'nose' },
        { type: 'exhale', duration: 8, method: 'nose' },
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
