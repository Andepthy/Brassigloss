import { ref, watch } from "vue"

export function useFontPreference(initialValue = false) {
  const useSans = ref(initialValue)

  watch(
    useSans,
    (value) => document.body.classList.toggle("font-sans", value),
    { immediate: true },
  )

  function toggleFont() {
    useSans.value = !useSans.value
  }

  return { useSans, toggleFont }
}
