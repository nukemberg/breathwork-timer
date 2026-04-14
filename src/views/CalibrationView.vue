<script setup lang="ts">
import { useCalibrationStore } from '@/stores/calibration'
import CalibrationTimer from '@/components/CalibrationTimer.vue'
import CalibrationHistory from '@/components/CalibrationHistory.vue'

const calibrationStore = useCalibrationStore()

function handleComplete(duration: number) {
  calibrationStore.addEntry(duration)
}

function handleDelete(id: string) {
  calibrationStore.deleteEntry(id)
}
</script>

<template>
  <main class="page">
    <div class="cal-header">
      <h1>Calibration</h1>
      <p class="text-secondary">Track your breath hold capacity over time</p>
    </div>

    <CalibrationTimer @complete="handleComplete" />

    <div class="divider" style="margin: 8px 16px;" />

    <CalibrationHistory
      :entries="calibrationStore.entries"
      :personalBest="calibrationStore.personalBest"
      :rollingAverage="calibrationStore.rollingAverage"
      @delete="handleDelete"
    />
  </main>
</template>

<style scoped>
.cal-header {
  padding: 24px 16px 8px;
}

.cal-header h1 {
  margin-bottom: 4px;
}
</style>
