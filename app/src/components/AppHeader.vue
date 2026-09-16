<template>
  <header class="app-bar">
    <span class="brand">GlossAtlas</span>

    <nav class="primary-nav" aria-label="主导航">
      <button
        class="primary-nav__link"
        :class="{ 'is-active': activeTab === 'table' }"
        @click="activeTab = 'table'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        <span>表格</span>
      </button>
    </nav>

    <div class="app-utilities">
      <a
        class="icon-button"
        href="https://github.com/SkyEye-FAST/verdigloss"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="'GitHub'"
        title="GitHub"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>

      <button
        class="utility-button"
        type="button"
        @click="$emit('toggleTheme')"
        :aria-label="isDark ? '切换到浅色主题' : '切换到深色主题'"
        :title="isDark ? '切换到浅色主题' : '切换到深色主题'"
      >
        <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <span class="utility-button__label">{{ isDark ? '深色' : '浅色' }}</span>
      </button>

      <button
        class="utility-button"
        type="button"
        @click="$emit('toggleFont')"
        :aria-label="useSans ? '切换到衬线字体' : '切换到无衬线字体'"
        :title="useSans ? '切换到衬线字体' : '切换到无衬线字体'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
        <span class="utility-button__label">{{ useSans ? '无衬线' : '衬线' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue"

defineProps({
  isDark: { type: Boolean, default: true },
  useSans: { type: Boolean, default: false }
})

defineEmits(["toggleTheme", "toggleFont"])

const activeTab = ref("table")
</script>
