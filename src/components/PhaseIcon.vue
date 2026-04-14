<script setup lang="ts">
import type { BreathingMethod, PhaseType } from '@/types'

const props = defineProps<{
  method: BreathingMethod
  phaseType: PhaseType
}>()

const PHASE_LABELS: Record<PhaseType, string> = {
  'inhale': 'Inhale',
  'full-retention': 'Hold',
  'exhale': 'Exhale',
  'empty-retention': 'Empty Hold',
}

const METHOD_LABELS: Record<BreathingMethod, string> = {
  'nose': 'through nose',
  'mouth': 'through mouth',
  'either': '',
}
</script>

<template>
  <div class="phase-icon" :aria-label="`${PHASE_LABELS[phaseType]} ${METHOD_LABELS[method]}`">
    <!-- Nose icon -->
    <svg
      v-if="method === 'nose' || method === 'either'"
      class="icon"
      :class="{ 'icon--dim': method === 'either' }"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <!-- Nose shape -->
      <path d="M14 4 C14 4 10 8 10 14 C10 18 8 20 8 22 C8 23.1 8.9 24 10 24 C11.1 24 12 23.1 12 22 L16 22 C16 23.1 16.9 24 18 24 C19.1 24 20 23.1 20 22 C20 20 18 18 18 14 C18 8 14 4 14 4 Z"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Nostrils -->
      <ellipse cx="11" cy="21" rx="1.5" ry="1" fill="currentColor" opacity="0.7"/>
      <ellipse cx="17" cy="21" rx="1.5" ry="1" fill="currentColor" opacity="0.7"/>
    </svg>

    <!-- Mouth icon -->
    <svg
      v-if="method === 'mouth' || method === 'either'"
      class="icon"
      :class="{ 'icon--dim': method === 'either' }"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <!-- Lips outline -->
      <path d="M7 14 C7 14 9 11 14 11 C19 11 21 14 21 14 C21 14 19 19 14 19 C9 19 7 14 7 14 Z"
        stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Upper lip curve -->
      <path d="M10.5 13.5 C11.5 12.5 12.5 12 14 12 C15.5 12 16.5 12.5 17.5 13.5"
        stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <!-- Smile line -->
      <path d="M9 14.5 C11 17 17 17 19 14.5"
        stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.4"/>
    </svg>

    <span class="method-label">
      <template v-if="method === 'nose'">nose</template>
      <template v-else-if="method === 'mouth'">mouth</template>
      <template v-else>nose or mouth</template>
    </span>
  </div>
</template>

<style scoped>
.phase-icon {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
}

.icon {
  flex-shrink: 0;
}

.icon--dim {
  opacity: 0.6;
}

.method-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  letter-spacing: 0.01em;
}
</style>
