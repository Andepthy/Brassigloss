import { ref, watch } from "vue"

export const FONT_PREFERENCE_STORAGE_KEY = "brassigloss:font-sans"

function readStoredUseSans(defaultValue) {
  try {
    const storedValue = localStorage.getItem(FONT_PREFERENCE_STORAGE_KEY)
    if (storedValue === "true") return true
    if (storedValue === "false") return false
    return defaultValue
  } catch {
    return defaultValue
  }
}

function storeUseSans(value) {
  try {
    localStorage.setItem(FONT_PREFERENCE_STORAGE_KEY, String(value))
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

export function useFontPreference(initialValue = false) {
  const useSans = ref(readStoredUseSans(initialValue))

  watch(
    useSans,
    (value) => {
      if (typeof document !== "undefined") {
        document.body.classList.toggle("font-sans", value)
      }
      storeUseSans(value)
    },
    { immediate: true },
  )

  function toggleFont() {
    useSans.value = !useSans.value
  }

  return { useSans, toggleFont }
}
