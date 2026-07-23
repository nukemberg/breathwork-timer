<script setup lang="ts">
import { computed } from 'vue'
import type { BreathingMethod, PhaseType } from '@/types'

const props = defineProps<{
  method: BreathingMethod
  phaseType: PhaseType
}>()

const isFullRetention = computed(() => props.phaseType === 'full-retention')
const isEmptyRetention = computed(() => props.phaseType === 'empty-retention')
const isRetention = computed(() => isFullRetention.value || isEmptyRetention.value)

const methodLabel = computed(() => {
  if (isFullRetention.value) return 'lungs full'
  if (isEmptyRetention.value) return 'lungs empty'
  if (props.method === 'nose') return 'nose'
  if (props.method === 'mouth') return 'mouth'
  return 'nose or mouth'
})

const ariaLabel = computed(() => {
  if (isFullRetention.value) return 'Hold — lungs full'
  if (isEmptyRetention.value) return 'Empty hold — lungs empty'
  const via = props.method === 'nose' ? 'through nose' : props.method === 'mouth' ? 'through mouth' : ''
  return `${props.phaseType === 'inhale' ? 'Inhale' : 'Exhale'} ${via}`.trim()
})
</script>

<template>
  <div class="phase-icon" :aria-label="ariaLabel">

    <!-- Full retention: filled lungs (air held in) -->
    <svg
      v-if="isFullRetention"
      class="icon"
      width="40" height="40" viewBox="0 0 40 40"
      fill="none" aria-hidden="true"
    >
      <!-- Trachea -->
      <line x1="20" y1="4" x2="20" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Bronchi -->
      <path d="M20 13 Q15 13 12 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M20 13 Q25 13 28 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <!-- Left lobe — filled to show lungs are full -->
      <ellipse cx="11" cy="27" rx="6.5" ry="9" fill="currentColor" opacity="0.55" transform="rotate(-6 11 27)"/>
      <!-- Right lobe — filled -->
      <ellipse cx="29" cy="27" rx="6.5" ry="9" fill="currentColor" opacity="0.55" transform="rotate(6 29 27)"/>
    </svg>

    <!-- Empty retention: outlined lungs (air expelled) -->
    <svg
      v-else-if="isEmptyRetention"
      class="icon"
      width="40" height="40" viewBox="0 0 40 40"
      fill="none" aria-hidden="true"
    >
      <!-- Trachea -->
      <line x1="20" y1="4" x2="20" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Bronchi -->
      <path d="M20 13 Q15 13 12 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M20 13 Q25 13 28 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <!-- Left lobe — outlined only to show lungs are empty -->
      <ellipse cx="11" cy="27" rx="6.5" ry="9" stroke="currentColor" stroke-width="1.8" opacity="0.65" transform="rotate(-6 11 27)"/>
      <!-- Right lobe — outlined only -->
      <ellipse cx="29" cy="27" rx="6.5" ry="9" stroke="currentColor" stroke-width="1.8" opacity="0.65" transform="rotate(6 29 27)"/>
    </svg>

    <!-- Inhale / Exhale: nose and/or mouth icons -->
    <template v-else>
      <!-- Nose icon -->
      <svg
        v-if="method === 'nose' || method === 'either'"
        class="icon"
        :class="{ 'icon--dim': method === 'either' }"
        width="40" height="40" viewBox="0 0 40 40"
        fill="none" aria-hidden="true"
      >
        <path
          d="M20 6 C20 6 14 11 14 20 C14 25 11 28 11 31 C11 32.7 12.3 34 14 34 C15.7 34 17 32.7 17 31 L23 31 C23 32.7 24.3 34 26 34 C27.7 34 29 32.7 29 31 C29 28 26 25 26 20 C26 11 20 6 20 6 Z"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        />
        <ellipse cx="15.5" cy="30" rx="2.2" ry="1.4" fill="currentColor" opacity="0.7"/>
        <ellipse cx="24.5" cy="30" rx="2.2" ry="1.4" fill="currentColor" opacity="0.7"/>
      </svg>

      <!-- Mouth icon -->
      <svg
        v-if="method === 'mouth' || method === 'either'"
        class="icon"
        :class="{ 'icon--dim': method === 'either' }"
        width="40" height="40" viewBox="0 0 40 40"
        fill="none" aria-hidden="true"
      >
        <path
          d="M10 20 C10 20 13 15.5 20 15.5 C27 15.5 30 20 30 20 C30 20 27 26.5 20 26.5 C13 26.5 10 20 10 20 Z"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        />
        <path
          d="M15 18.5 C16.5 17 18 16.5 20 16.5 C22 16.5 23.5 17 25 18.5"
          stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.6"
        />
        <path
          d="M13 21.5 C15.5 25 24.5 25 27 21.5"
          stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.4"
        />
      </svg>
    </template>

    <span class="method-label">{{ methodLabel }}</span>
  </div>
</template>

<style scoped>
.phase-icon {
  display: flex;
  align-items: center;
  gap: 8px;
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
