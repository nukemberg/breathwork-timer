import { ref } from 'vue'

export function useWakeLock() {
  const isActive = ref(false)
  let sentinel: WakeLockSentinel | null = null
  let shouldReacquire = false

  async function request() {
    if (!('wakeLock' in navigator)) return
    try {
      sentinel = await navigator.wakeLock.request('screen')
      isActive.value = true
      shouldReacquire = true
      sentinel.addEventListener('release', () => {
        isActive.value = false
        sentinel = null
      })
    } catch {
      // Permission denied or feature unavailable — fail silently
    }
  }

  function release() {
    shouldReacquire = false
    sentinel?.release()
    sentinel = null
    isActive.value = false
  }

  // Re-acquire when tab becomes visible again (spec requires re-request after hide)
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && shouldReacquire && !sentinel) {
      await request()
    }
  })

  return { isActive, request, release }
}
