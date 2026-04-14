import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CalibrationEntry } from '@/types'

const STORAGE_KEY = 'breathwork_calibration_log'

export const useCalibrationStore = defineStore('calibration', () => {
  const entries = ref<CalibrationEntry[]>(loadFromStorage())

  function loadFromStorage(): CalibrationEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  const personalBest = computed<number>(() =>
    entries.value.reduce((best, e) => Math.max(best, e.duration), 0)
  )

  const rollingAverage = computed<number>(() => {
    const recent = entries.value.slice(0, 10)
    if (!recent.length) return 0
    return recent.reduce((sum, e) => sum + e.duration, 0) / recent.length
  })

  function addEntry(duration: number, notes?: string) {
    const entry: CalibrationEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      duration,
      notes,
    }
    entries.value.unshift(entry)
    persist()
  }

  function deleteEntry(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
    persist()
  }

  return {
    entries,
    personalBest,
    rollingAverage,
    addEntry,
    deleteEntry,
  }
})
