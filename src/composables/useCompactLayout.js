import { onBeforeUnmount, onMounted, ref } from "vue"

export function useCompactLayout(query = "(max-width: 800px)") {
  const isCompactLayout = ref(false)
  let mediaQuery

  function syncLayout(event) {
    isCompactLayout.value = event.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    syncLayout(mediaQuery)
    mediaQuery.addEventListener("change", syncLayout)
  })

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener("change", syncLayout)
  })

  return { isCompactLayout }
}
