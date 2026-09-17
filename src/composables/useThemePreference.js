import { ref, watch } from "vue"

export function useThemePreference(initialDark = true) {
  const isDark = ref(initialDark)

  watch(
    isDark,
    (value) => document.body.classList.toggle("theme-light", !value),
    { immediate: true },
  )

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
