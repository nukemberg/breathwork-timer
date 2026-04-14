<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrainingsStore } from '@/stores/trainings'
import type { TrainingPlan, TrainingStage, BreathPhase, PhaseType, BreathingMethod, Difficulty } from '@/types'

const route = useRoute()
const router = useRouter()
const trainingsStore = useTrainingsStore()

const editId = computed(() => route.params.id as string | undefined)
const isEditing = computed(() => !!editId.value)

// ── Form state ─────────────────────────────────────────────────────────────

function emptyPhase(): BreathPhase {
  return { type: 'inhale', duration: 4, method: 'nose' }
}

function emptyStage(): TrainingStage {
  return {
    id: crypto.randomUUID(),
    name: 'Stage',
    rounds: 4,
    phases: [emptyPhase()],
  }
}

function emptyPlan(): TrainingPlan {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    difficulty: 'beginner',
    estimatedMinutes: 1,
    stages: [emptyStage()],
    isCustom: true,
  }
}

const form = ref<TrainingPlan>(emptyPlan())
const errors = ref<string[]>([])

onMounted(() => {
  if (isEditing.value && editId.value) {
    const existing = trainingsStore.getById(editId.value)
    if (existing) {
      // Deep clone to avoid mutating store
      form.value = JSON.parse(JSON.stringify(existing))
    }
  }
})

// ── Stage/phase management ─────────────────────────────────────────────────

function addStage() {
  form.value.stages.push(emptyStage())
}

function removeStage(si: number) {
  if (form.value.stages.length <= 1) return
  form.value.stages.splice(si, 1)
}

function addPhase(stage: TrainingStage) {
  stage.phases.push(emptyPhase())
}

function removePhase(stage: TrainingStage, pi: number) {
  if (stage.phases.length <= 1) return
  stage.phases.splice(pi, 1)
}

function moveStageUp(si: number) {
  if (si === 0) return
  const s = form.value.stages
  ;[s[si - 1], s[si]] = [s[si], s[si - 1]]
}

function moveStageDown(si: number) {
  const s = form.value.stages
  if (si >= s.length - 1) return
  ;[s[si], s[si + 1]] = [s[si + 1], s[si]]
}

// ── Estimated minutes ──────────────────────────────────────────────────────

function recomputeEstimated() {
  let total = 0
  for (const stage of form.value.stages) {
    for (const phase of stage.phases) {
      total += (phase.duration || 5) * stage.rounds
    }
  }
  form.value.estimatedMinutes = Math.max(1, Math.round(total / 60))
}

// ── Validation + save ──────────────────────────────────────────────────────

function validate(): boolean {
  errors.value = []
  if (!form.value.name.trim()) errors.value.push('Program name is required.')
  if (!form.value.stages.length) errors.value.push('At least one stage is required.')
  for (const [si, stage] of form.value.stages.entries()) {
    if (!stage.name.trim()) errors.value.push(`Stage ${si + 1} needs a name.`)
    if (stage.rounds < 1) errors.value.push(`Stage ${si + 1} must have at least 1 round.`)
    if (!stage.phases.length) errors.value.push(`Stage ${si + 1} needs at least one phase.`)
    for (const [pi, phase] of stage.phases.entries()) {
      if (phase.duration < 0) errors.value.push(`Stage ${si + 1}, phase ${pi + 1}: duration cannot be negative.`)
    }
  }
  return errors.value.length === 0
}

function save() {
  recomputeEstimated()
  if (!validate()) return
  trainingsStore.saveCustomTraining(form.value)
  router.replace({ name: 'training-detail', params: { id: form.value.id } })
}

function cancel() {
  router.back()
}

// ── Helpers ────────────────────────────────────────────────────────────────

const PHASE_OPTIONS: { value: PhaseType; label: string }[] = [
  { value: 'inhale',           label: 'Inhale' },
  { value: 'full-retention',   label: 'Full Hold' },
  { value: 'exhale',           label: 'Exhale' },
  { value: 'empty-retention',  label: 'Empty Hold' },
]

const METHOD_OPTIONS: { value: BreathingMethod; label: string }[] = [
  { value: 'nose',   label: 'Nose' },
  { value: 'mouth',  label: 'Mouth' },
  { value: 'either', label: 'Either' },
]

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'beginner',     label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced' },
]
</script>

<template>
  <main class="page">
    <div class="custom-header">
      <button class="btn btn-ghost btn-icon" @click="cancel" aria-label="Cancel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1>{{ isEditing ? 'Edit Program' : 'New Program' }}</h1>
      <button class="btn btn-primary save-btn-top" @click="save">Save</button>
    </div>

    <div class="form-body">
      <!-- Basic info -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">Program Name *</label>
          <input
            class="form-input"
            v-model="form.name"
            placeholder="e.g. Morning Calm"
            maxlength="60"
          />
        </div>

        <div class="form-group mt-12">
          <label class="form-label">Description</label>
          <textarea
            class="form-textarea form-input"
            v-model="form.description"
            placeholder="What is this program for?"
            maxlength="300"
          />
        </div>

        <div class="form-group mt-12">
          <label class="form-label">Difficulty</label>
          <select class="form-select" v-model="form.difficulty">
            <option v-for="opt in DIFFICULTY_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="divider" />

      <!-- Stages -->
      <div class="stages-builder">
        <div class="stages-builder-header">
          <h2>Stages</h2>
          <button class="btn btn-secondary add-stage-btn" @click="addStage">
            + Add Stage
          </button>
        </div>

        <div class="stages-list">
          <div
            v-for="(stage, si) in form.stages"
            :key="stage.id"
            class="stage-block card"
          >
            <!-- Stage header -->
            <div class="stage-block-header">
              <div class="stage-num-badge">{{ si + 1 }}</div>
              <input
                class="form-input stage-name-input"
                v-model="stage.name"
                placeholder="Stage name"
                maxlength="60"
              />
              <div class="stage-actions">
                <button
                  class="btn btn-ghost btn-icon mini-btn"
                  @click="moveStageUp(si)"
                  :disabled="si === 0"
                  aria-label="Move stage up"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button
                  class="btn btn-ghost btn-icon mini-btn"
                  @click="moveStageDown(si)"
                  :disabled="si === form.stages.length - 1"
                  aria-label="Move stage down"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button
                  class="btn btn-ghost btn-icon mini-btn danger"
                  @click="removeStage(si)"
                  :disabled="form.stages.length <= 1"
                  aria-label="Remove stage"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Rounds -->
            <div class="form-group mt-12">
              <label class="form-label">Rounds</label>
              <input
                class="form-input"
                type="number"
                min="1"
                max="100"
                v-model.number="stage.rounds"
              />
            </div>

            <!-- Phases -->
            <div class="phases-section mt-12">
              <div class="phases-header">
                <span class="form-label">Phases</span>
              </div>

              <div class="phases-list">
                <div
                  v-for="(phase, pi) in stage.phases"
                  :key="pi"
                  class="phase-row"
                >
                  <span class="phase-index">{{ pi + 1 }}</span>

                  <select class="form-select phase-type-select" v-model="phase.type">
                    <option v-for="opt in PHASE_OPTIONS" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>

                  <div class="phase-duration-group">
                    <input
                      class="form-input phase-dur-input"
                      type="number"
                      min="0"
                      max="600"
                      v-model.number="phase.duration"
                      :placeholder="'0=tap'"
                    />
                    <span class="dur-unit">s</span>
                  </div>

                  <select class="form-select phase-method-select" v-model="phase.method">
                    <option v-for="opt in METHOD_OPTIONS" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>

                  <button
                    class="btn btn-ghost btn-icon mini-btn danger"
                    @click="removePhase(stage, pi)"
                    :disabled="stage.phases.length <= 1"
                    aria-label="Remove phase"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <button class="btn btn-ghost add-phase-btn" @click="addPhase(stage)">
                + Add Phase
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Errors -->
      <div v-if="errors.length" class="errors-block">
        <p v-for="err in errors" :key="err" class="error-msg">{{ err }}</p>
      </div>

      <!-- Bottom actions -->
      <div class="form-actions">
        <button class="btn btn-ghost" @click="cancel">Cancel</button>
        <button class="btn btn-primary" @click="save">Save Program</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.custom-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 0;
}

.custom-header h1 {
  flex: 1;
  font-size: 1.25rem;
}

.save-btn-top {
  min-height: 36px;
  padding: 0 16px;
  font-size: 0.875rem;
}

.form-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-section {
  padding-bottom: 8px;
}

/* ── Stages builder ── */
.stages-builder {
  padding-top: 8px;
}

.stages-builder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.add-stage-btn {
  min-height: 36px;
  padding: 0 14px;
  font-size: 0.875rem;
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Stage block ── */
.stage-block {
  border: 1px solid rgba(255,255,255,0.06);
}

.stage-block-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stage-num-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.stage-name-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.9375rem;
}

.stage-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.mini-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.mini-btn.danger {
  color: var(--color-danger);
  opacity: 0.7;
}

.mini-btn.danger:hover {
  opacity: 1;
}

/* ── Phases ── */
.phases-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.phases-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.phases-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.phase-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.phase-index {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  width: 16px;
  flex-shrink: 0;
  text-align: center;
}

.phase-type-select {
  flex: 2;
  padding: 8px 10px;
  font-size: 0.875rem;
  padding-right: 28px;
  background-position: right 8px center;
}

.phase-duration-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.phase-dur-input {
  flex: 1;
  padding: 8px 10px;
  font-size: 0.875rem;
  min-width: 0;
}

.dur-unit {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.phase-method-select {
  flex: 1.2;
  padding: 8px 10px;
  font-size: 0.875rem;
  padding-right: 28px;
  background-position: right 8px center;
}

.add-phase-btn {
  align-self: flex-start;
  min-height: 32px;
  padding: 0 12px;
  font-size: 0.8125rem;
  color: var(--color-accent);
}

/* ── Errors ── */
.errors-block {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 16px;
}

.error-msg {
  font-size: 0.875rem;
  color: var(--color-danger);
  line-height: 1.5;
}

/* ── Bottom actions ── */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.form-actions .btn {
  flex: 1;
}
</style>
