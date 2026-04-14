import { ref, onUnmounted } from 'vue'

export function useTimer(intervalMs = 1000) {
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  function start(onTick: () => void) {
    if (isRunning.value) return
    isRunning.value = true
    intervalId = setInterval(onTick, intervalMs)
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  function restart(onTick: () => void) {
    stop()
    start(onTick)
  }

  onUnmounted(stop)

  return { isRunning, start, stop, restart }
}
