<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTrainingsStore } from '@/stores/trainings'
import { usePwaInstall } from '@/composables/usePwaInstall'
import TrainingCard from '@/components/TrainingCard.vue'
import { PREBUILT_TRAININGS } from '@/data/prebuiltTrainings'
import type { TrainingPlan } from '@/types'

const router = useRouter()
const trainingsStore = useTrainingsStore()

const prebuilt = computed(() => [...PREBUILT_TRAININGS])
const custom = computed(() => trainingsStore.customTrainings)

function selectTraining(training: TrainingPlan) {
  router.push({ name: 'training-detail', params: { id: training.id } })
}

const { installPrompt, install } = usePwaInstall()
const showInstall = computed(() => installPrompt.value !== null)
</script>

<template>
  <main class="page">
    <!-- Header -->
    <div class="home-header">
      <div class="header-logo">
        <svg width="32" height="32" viewBox="0 0 512 512" aria-hidden="true">
          <rect width="512" height="512" rx="112" fill="var(--color-bg-surface)"/>
          <path d="M 36 320 A 220 220 0 0 0 476 320" fill="none" stroke="var(--color-accent)" stroke-width="18" stroke-linecap="round" opacity="0.25"/>
          <path d="M 106 320 A 150 150 0 0 0 406 320" fill="none" stroke="var(--color-accent)" stroke-width="22" stroke-linecap="round" opacity="0.55"/>
          <path d="M 176 320 A 80 80 0 0 0 336 320"  fill="none" stroke="var(--color-accent)" stroke-width="26" stroke-linecap="round" opacity="0.88"/>
          <circle cx="256" cy="320" r="34" fill="var(--color-accent)"/>
        </svg>
      </div>
      <div>
        <h1 class="home-title">Breathwork</h1>
        <p class="home-subtitle text-secondary">Choose a program to begin</p>
      </div>
    </div>

    <!-- Install banner -->
    <Transition name="install-fade">
      <div v-if="showInstall" class="install-banner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3v13M7 11l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="install-label">Add to Home Screen</span>
        <button class="btn btn-primary install-btn" @click="install">Install</button>
      </div>
    </Transition>

    <!-- Programs section -->
    <section class="training-section">
      <div class="section-header">
        <h2>Programs</h2>
      </div>
      <div class="training-list">
        <TrainingCard
          v-for="training in prebuilt"
          :key="training.id"
          :training="training"
          @select="selectTraining"
        />
      </div>
    </section>

    <!-- Custom programs section -->
    <section class="training-section" v-if="custom.length">
      <div class="section-header">
        <h2>My Programs</h2>
        <RouterLink to="/custom/new" class="btn btn-ghost" style="font-size:0.875rem; min-height: 36px; padding: 0 12px;">
          + New
        </RouterLink>
      </div>
      <div class="training-list">
        <TrainingCard
          v-for="training in custom"
          :key="training.id"
          :training="training"
          @select="selectTraining"
        />
      </div>
    </section>

    <!-- Empty custom state -->
    <section class="training-section" v-else>
      <div class="section-header">
        <h2>My Programs</h2>
      </div>
      <div class="empty-custom card">
        <p class="text-secondary">Create your own custom breathing program</p>
        <RouterLink to="/custom/new" class="btn btn-secondary mt-12">
          + Create Program
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 16px 16px;
}

.header-logo {
  flex-shrink: 0;
}

.home-title {
  font-size: 1.5rem;
  margin-bottom: 2px;
}

.home-subtitle {
  font-size: 0.875rem;
}

.training-section {
  margin-bottom: 8px;
}

.training-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 16px;
}

.empty-custom {
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  text-align: center;
}

/* Install banner */
.install-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 16px 16px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: var(--color-text-secondary);
}

.install-label {
  flex: 1;
  font-size: 0.875rem;
}

.install-btn {
  flex-shrink: 0;
  min-height: 34px;
  padding: 0 14px;
  font-size: 0.8125rem;
}

.install-fade-enter-active,
.install-fade-leave-active { transition: opacity 0.3s ease; }
.install-fade-enter-from,
.install-fade-leave-to { opacity: 0; }
</style>
