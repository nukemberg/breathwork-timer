<script setup lang="ts">
import type { TrainingPlan } from '@/types'

const props = defineProps<{ training: TrainingPlan }>()
const emit = defineEmits<{ select: [training: TrainingPlan] }>()

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function totalRounds(plan: TrainingPlan): number {
  return plan.stages.reduce((sum, s) => sum + s.rounds, 0)
}
</script>

<template>
  <div
    class="training-card tap-feedback"
    role="button"
    tabindex="0"
    @click="emit('select', training)"
    @keydown.enter="emit('select', training)"
    @keydown.space.prevent="emit('select', training)"
  >
    <div class="card-header">
      <h3 class="card-name">{{ training.name }}</h3>
      <div class="card-badges">
        <span class="badge" :class="`badge-${training.difficulty}`">
          {{ training.difficulty }}
        </span>
        <span v-if="training.isCustom" class="badge badge-custom">custom</span>
      </div>
    </div>

    <p class="card-desc">{{ training.description }}</p>

    <div class="card-meta">
      <div class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        {{ formatDuration(training.estimatedMinutes) }}
      </div>
      <div class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        {{ totalRounds(training) }} rounds
      </div>
      <div class="meta-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
        </svg>
        {{ training.stages.length }} stage{{ training.stages.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <div class="card-arrow" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.training-card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: var(--radius-card);
  padding: 16px;
  cursor: pointer;
  transition: background var(--transition-ui), transform var(--transition-ui);
  border: 1px solid transparent;
}

.training-card:active {
  background: #1f1f3d;
  transform: scale(0.99);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.card-name {
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
  line-height: 1.3;
}

.card-badges {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.card-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.card-arrow {
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: var(--color-text-muted);
}
</style>
