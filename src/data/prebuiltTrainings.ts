import type { TrainingPlan, TrainingStage } from '@/types'

function stage(id: string, name: string, rounds: number, phases: TrainingStage['phases'], instruction?: string): TrainingStage {
  return instruction ? { id, name, rounds, phases, instruction } : { id, name, rounds, phases }
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
      ], 'After the gentle exhale, pinch the nose shut. Wait for the first clear, definite urge to breathe — then tap and release. Do not strain; this is a diagnostic hold, not a competition.'),
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
      ], 'On the full inhale, tuck the chin slightly toward the chest (jalandhara bandha). Feel the breath expand across the chest and collar bones. Hold steadily — no gripping. Release the chin lock before exhaling.'),
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
      stage('bak-s2', 'Bahya Kumbhaka (1:2:hold)', 8, [
        { type: 'inhale',          duration: 4, method: 'nose' },
        { type: 'exhale',          duration: 8, method: 'nose' },
        { type: 'empty-retention', duration: 0, method: 'nose' },  // user-timed: hold with bandhas
      ], 'After the full exhale, lock the breath out. Apply root lock (squeeze the pelvic floor — mula bandha) and draw the belly up (uddiyana bandha). Keep a gentle chin tuck. Hold as long as comfortable, then tap to inhale.'),
      stage('bak-s3', 'Integration', 4, [
        { type: 'inhale', duration: 4, method: 'nose' },
        { type: 'exhale', duration: 8, method: 'nose' },
      ]),
    ],
  },

  {
    id: 'kapalabhati',
    name: 'Kapalabhati',
    description: 'Skull Shining Breath — three cycles of rapid forceful nasal exhalations that energise the body and clear the airways, each followed by a user-timed full retention. Sit tall; the exhale is sharp and active, the inhale passive.',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    stages: [
      // Cycle 1
      stage('kap-c1-pumps', 'Cycle 1 – Power Pumps', 30, [
        { type: 'exhale', duration: 1, method: 'nose' },
        { type: 'inhale', duration: 1, method: 'nose' },
      ], 'Sit tall. Each exhale is a sharp, quick burst from the lower belly — the inhale follows passively. Keep a steady rhythm.'),
      stage('kap-c1-retain', 'Cycle 1 – Retention', 1, [
        { type: 'inhale',         duration: 3, method: 'nose' },
        { type: 'full-retention', duration: 0, method: 'either' }, // user-timed: hold as long as comfortable
        { type: 'exhale',         duration: 6, method: 'nose' },
      ], 'Take one full, slow inhale. Hold comfortably — feel warmth and tingling rise through the body. Release gently when ready.'),
      // Cycle 2
      stage('kap-c2-pumps', 'Cycle 2 – Power Pumps', 30, [
        { type: 'exhale', duration: 1, method: 'nose' },
        { type: 'inhale', duration: 1, method: 'nose' },
      ], 'Sit tall. Each exhale is a sharp, quick burst from the lower belly — the inhale follows passively. Keep a steady rhythm.'),
      stage('kap-c2-retain', 'Cycle 2 – Retention', 1, [
        { type: 'inhale',         duration: 3, method: 'nose' },
        { type: 'full-retention', duration: 0, method: 'either' },
        { type: 'exhale',         duration: 6, method: 'nose' },
      ], 'Take one full, slow inhale. Hold comfortably — feel warmth and tingling rise through the body. Release gently when ready.'),
      // Cycle 3
      stage('kap-c3-pumps', 'Cycle 3 – Power Pumps', 30, [
        { type: 'exhale', duration: 1, method: 'nose' },
        { type: 'inhale', duration: 1, method: 'nose' },
      ], 'Sit tall. Each exhale is a sharp, quick burst from the lower belly — the inhale follows passively. Keep a steady rhythm.'),
      stage('kap-c3-retain', 'Cycle 3 – Retention', 1, [
        { type: 'inhale',         duration: 3, method: 'nose' },
        { type: 'full-retention', duration: 0, method: 'either' },
        { type: 'exhale',         duration: 6, method: 'nose' },
      ], 'Take one full, slow inhale. Hold comfortably — feel warmth and tingling rise through the body. Release gently when ready.'),
      stage('kap-recovery', 'Integration', 5, [
        { type: 'inhale', duration: 4, method: 'nose' },
        { type: 'exhale', duration: 6, method: 'nose' },
      ]),
    ],
  },

  {
    id: 'nauli-kriya',
    name: 'Nauli Kriya',
    description: 'Advanced abdominal isolation technique that massages the digestive organs and strengthens the core. Stand with feet shoulder-width, knees slightly bent, hands on thighs. Exhale fully, draw the belly up (uddiyana bandha), then isolate and roll the rectus abdominis. Practice on an empty stomach only.',
    difficulty: 'advanced',
    estimatedMinutes: 8,
    stages: [
      stage('nauli-prep', 'Uddiyana Preparation', 5, [
        { type: 'inhale',          duration: 4, method: 'nose' },
        { type: 'exhale',          duration: 6, method: 'mouth' },
        { type: 'empty-retention', duration: 0, method: 'either' }, // user-timed: hold + draw belly up
      ], 'Stand with feet shoulder-width apart, knees slightly bent, hands on thighs. After full exhale, draw the entire abdomen up and inward — create a hollow under the ribs (uddiyana bandha). Release before inhaling.'),
      stage('nauli-chalana', 'Nauli Chalana', 10, [
        { type: 'inhale',          duration: 3, method: 'nose' },
        { type: 'exhale',          duration: 5, method: 'mouth' },
        { type: 'empty-retention', duration: 0, method: 'either' }, // user-timed: isolate + rotate
      ], 'From uddiyana bandha, push the central abdominal column (rectus abdominis) forward. Then roll it to the left, then right. Hold as long as comfortable before releasing.'),
      stage('nauli-settle', 'Settling Breath', 5, [
        { type: 'inhale', duration: 5, method: 'nose' },
        { type: 'exhale', duration: 5, method: 'nose' },
      ]),
    ],
  },

  {
    id: 'digestive-flow',
    name: 'Digestive Flow',
    description: 'A targeted sequence to stimulate peristalsis and encourage bowel movement: diaphragmatic activation, left-nostril parasympathetic breathing (close right nostril with thumb), apana release, abdominal pumps, and a final bandha seal. Best practiced in the morning before eating.',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    stages: [
      stage('dig-warmup', 'Diaphragm Activation', 5, [
        { type: 'inhale', duration: 5, method: 'nose' },
        { type: 'exhale', duration: 7, method: 'mouth' },
      ], 'Place one hand on the belly. Each inhale should push the hand outward — breathe into the abdomen, not the chest. Slow and full.'),
      stage('dig-left', 'Left Nostril Breath', 10, [
        { type: 'inhale', duration: 4, method: 'nose' },
        { type: 'exhale', duration: 6, method: 'nose' },
      ], 'Close your right nostril with the right thumb. Breathe slowly through the left nostril only. Left-nostril breathing activates the parasympathetic (rest-and-digest) nervous system.'),
      stage('dig-apana', 'Apana Release', 8, [
        { type: 'inhale',          duration: 4, method: 'nose' },
        { type: 'full-retention',  duration: 4, method: 'either' },
        { type: 'exhale',          duration: 8, method: 'mouth' },
        { type: 'empty-retention', duration: 2, method: 'either' },
      ], 'On the hold, draw the lower belly gently inward. On the long exhale, visualise downward energy (apana) releasing through the base of the body.'),
      stage('dig-pumps', 'Abdominal Pumps', 30, [
        { type: 'exhale', duration: 1, method: 'nose' },
        { type: 'inhale', duration: 1, method: 'nose' },
      ], 'Each exhale is a sharp pump from the abdomen — like a quick squeeze. The inhale is passive. This stimulates the large intestine and peristalsis.'),
      stage('dig-seal', 'Maha Bandha Seal', 3, [
        { type: 'inhale',         duration: 5, method: 'nose' },
        { type: 'full-retention', duration: 0, method: 'either' }, // user-timed: engage all bandhas
        { type: 'exhale',         duration: 8, method: 'mouth' },
      ], 'Inhale fully, then apply all three locks together: tuck chin to chest (jalandhara), squeeze the pelvic floor (mula bandha), draw the navel up and in (uddiyana). Hold, then release all locks before exhaling.'),
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
