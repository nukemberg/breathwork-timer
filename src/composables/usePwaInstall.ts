import { ref, readonly } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Captured at module-load time — before any component mounts
const _prompt = ref<BeforeInstallPromptEvent | null>(null)

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  _prompt.value = e as BeforeInstallPromptEvent
})

window.addEventListener('appinstalled', () => {
  _prompt.value = null
})

export function usePwaInstall() {
  async function install() {
    if (!_prompt.value) return
    await _prompt.value.prompt()
    const { outcome } = await _prompt.value.userChoice
    if (outcome === 'accepted') _prompt.value = null
  }

  return { installPrompt: readonly(_prompt), install }
}
