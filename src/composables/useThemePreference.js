import { computed, onBeforeUnmount, ref, watch } from "vue"

export const THEME_MODES = Object.freeze(["system", "dark", "light"])

const defaultThemeMode = "system"
const storageKey = "brassigloss:theme-mode"
const themeModes = new Set(THEME_MODES)

export function getNextThemeMode(mode) {
  if (mode === "system") return "dark"
  if (mode === "dark") return "light"
  return "system"
}

export function resolveIsDark(mode, systemPrefersDark) {
  return mode === "dark" || (mode === "system" && systemPrefersDark)
}

function readStoredThemeMode() {
  try {
    const storedMode = localStorage.getItem(storageKey)
    return themeModes.has(storedMode) ? storedMode : defaultThemeMode
  } catch {
    return defaultThemeMode
  }
}

function storeThemeMode(mode) {
  try {
    localStorage.setItem(storageKey, mode)
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

function getSystemPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true
  }

  return window.matchMedia("(prefers-color-scheme: dark)")
}

export function useThemePreference() {
  const mode = ref(readStoredThemeMode())
  const mediaQuery = getSystemPreference()
  const systemPrefersDark = ref(
    typeof mediaQuery === "boolean" ? mediaQuery : mediaQuery.matches,
  )
  const isDark = computed(() =>
    resolveIsDark(mode.value, systemPrefersDark.value),
  )

  function syncSystemPreference(event) {
    systemPrefersDark.value = event.matches
  }

  if (typeof mediaQuery !== "boolean") {
    mediaQuery.addEventListener("change", syncSystemPreference)
  }

  watch(
    isDark,
    (value) => document.documentElement.classList.toggle("theme-light", !value),
    { immediate: true },
  )

  watch(mode, storeThemeMode, { immediate: true })

  onBeforeUnmount(() => {
    if (typeof mediaQuery !== "boolean") {
      mediaQuery.removeEventListener("change", syncSystemPreference)
    }
  })

  function cycleTheme() {
    mode.value = getNextThemeMode(mode.value)
  }

  return { mode, isDark, cycleTheme }
}
