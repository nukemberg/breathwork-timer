import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TrainingPlan } from '@/types'
import { PREBUILT_TRAININGS } from '@/data/prebuiltTrainings'

const STORAGE_KEY = 'breathwork_custom_trainings'

export const useTrainingsStore = defineStore('trainings', () => {
  const customTrainings = ref<TrainingPlan[]>(loadFromStorage())

  function loadFromStorage(): TrainingPlan[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customTrainings.value))
  }

  const allTrainings = computed<TrainingPlan[]>(() => [
    ...PREBUILT_TRAININGS,
    ...customTrainings.value,
  ])

  function saveCustomTraining(plan: TrainingPlan) {
    const idx = customTrainings.value.findIndex(t => t.id === plan.id)
    if (idx >= 0) {
      customTrainings.value[idx] = { ...plan, isCustom: true }
    } else {
      customTrainings.value.push({ ...plan, isCustom: true })
    }
    persist()
  }

  function deleteCustomTraining(id: string) {
    customTrainings.value = customTrainings.value.filter(t => t.id !== id)
    persist()
  }

  function getById(id: string): TrainingPlan | undefined {
    return allTrainings.value.find(t => t.id === id)
  }

  return {
    allTrainings,
    customTrainings,
    saveCustomTraining,
    deleteCustomTraining,
    getById,
  }
})
