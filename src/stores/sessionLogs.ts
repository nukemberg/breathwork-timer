import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SessionLog } from '@/types'

const STORAGE_KEY = 'breathwork-session-logs'
const MAX_ENTRIES = 200

export const useSessionLogsStore = defineStore('sessionLogs', () => {
  const entries = ref<SessionLog[]>(
    (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
      catch { return [] }
    })()
  )

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  function addEntry(log: SessionLog) {
    entries.value.unshift(log)
    if (entries.value.length > MAX_ENTRIES) entries.value.length = MAX_ENTRIES
    persist()
  }

  function deleteEntry(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
    persist()
  }

  function clearAll() {
    entries.value = []
    persist()
  }

  return { entries, addEntry, deleteEntry, clearAll }
})
