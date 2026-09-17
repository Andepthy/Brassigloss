<template>
  <header class="app-bar">
    <span class="brand">GlossAtlas</span>

    <nav class="primary-nav" aria-label="主导航">
      <button
        class="primary-nav__link"
        :class="{ 'is-active': activeTab === 'table' }"
        @click="activeTab = 'table'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M8 22q-.825 0-1.412-.587T6 20V8q0-.825.588-1.412T8 6h12q.825 0 1.413.588T22 8v12q0 .825-.587 1.413T20 22zm0-2h5v-3H8zm7 0h5v-3h-5zM2 18V4q0-.825.588-1.412T4 2h14v2H4v14zm6-3h5v-3H8zm7 0h5v-3h-5zm-7-5h12V8H8z"/>
        </svg>
        <span>表格</span>
      </button>
    </nav>

    <div class="app-utilities">
      <a
        class="icon-button"
        href="https://github.com/Andepthy/GlossAtlas"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="'GitHub'"
        title="GitHub"
      >
        <svg width="20" height="20" viewBox="0 0 496 512" aria-hidden="true">
          <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2"/>
        </svg>
      </a>

      <button
        class="utility-button"
        type="button"
        :aria-label="themeActionLabel"
        :title="themeActionLabel"
        @click="$emit('cycleTheme')"
      >
        <svg
          v-if="themeMode === 'system'"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path fill="currentColor" d="M12 3a9 9 0 0 1 0 18z"/>
        </svg>
        <svg
          v-else-if="isDark"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M8.463 15.538Q7 14.075 7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.463 3.538T12 17t-3.537-1.463M5 13H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525z"/>
        </svg>
        <span class="utility-button__label">{{ themeLabel }}</span>
      </button>

      <button
        class="utility-button"
        type="button"
        @click="$emit('toggleFont')"
        :aria-label="useSans ? '切换到衬线字体' : '切换到无衬线字体'"
        :title="useSans ? '切换到衬线字体' : '切换到无衬线字体'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M6.4 18h2.1l1.1-3.05h4.8L15.5 18h2.1L13.05 6h-2.1zm3.8-4.8l1.75-4.95h.1l1.75 4.95zM4 22q-.825 0-1.412-.587T2 20V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v16q0 .825-.587 1.413T20 22zm0-2h16V4H4zM4 4v16z"/>
        </svg>
        <span class="utility-button__label">{{ useSans ? '无衬线体' : '衬线体' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from "vue"

const props = defineProps({
  isDark: { type: Boolean, default: true },
  themeMode: {
    type: String,
    default: "system",
    validator: (value) => ["system", "light", "dark"].includes(value),
  },
  useSans: { type: Boolean, default: false }
})

defineEmits(["cycleTheme", "toggleFont"])

const activeTab = ref("table")

const themeLabel = computed(() => {
  if (props.themeMode === "system") return "系统"
  return props.isDark ? "深色" : "浅色"
})

const themeActionLabel = computed(() => {
  if (props.themeMode === "system") return "使用深色主题"
  if (props.themeMode === "dark") return "使用浅色主题"
  return "跟随系统主题"
})
</script>
