<script setup lang="ts">
defineProps<{
  totalStages: number
  currentStageIndex: number
  totalRounds: number
  currentRound: number  // 1-based
  stageName: string
}>()
</script>

<template>
  <div class="stage-progress">
    <!-- Stage dots -->
    <div class="stage-dots" v-if="totalStages > 1">
      <span
        v-for="i in totalStages"
        :key="i"
        class="dot"
        :class="{
          'dot--done': i - 1 < currentStageIndex,
          'dot--active': i - 1 === currentStageIndex,
        }"
      />
    </div>

    <!-- Stage name -->
    <div class="stage-name">{{ stageName }}</div>

    <!-- Round counter -->
    <div class="round-info">
      Round <strong>{{ currentRound }}</strong> / {{ totalRounds }}
    </div>
  </div>
</template>

<style scoped>
.stage-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stage-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-muted);
  transition: background var(--transition-ui), transform var(--transition-ui);
}

.dot--done {
  background: rgba(0, 212, 255, 0.5);
}

.dot--active {
  background: var(--color-accent);
  transform: scale(1.4);
}

.stage-name {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
  letter-spacing: 0.02em;
}

.round-info {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.round-info strong {
  color: var(--color-text-primary);
}
</style>
