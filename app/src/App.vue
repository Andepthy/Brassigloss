<template>
  <div class="app-shell">
    <AppHeader
      :is-dark="isDark"
      :use-sans="useSans"
      @toggle-theme="toggleTheme"
      @toggle-font="toggleFont"
    />

    <header class="table-header">
      <div class="table-header__title">
        <h1>翻译对照</h1>
      </div>
      <div class="table-toolbar" aria-label="筛选工具">
        <label class="search-field">
          <span class="sr-only">搜索翻译</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="搜索翻译键或任意语言文本..."
          />
        </label>

        <MultiSelect
          v-model="selectedProjects"
          label="项目"
          placeholder="项目筛选"
          :options="projectOptions"
        />

        <MultiSelect
          v-model="selectedLanguages"
          label="语言"
          placeholder="语言列"
          :options="languageOptions"
        />

        <MultiSelect
          v-model="selectedCategories"
          label="分类"
          placeholder="分类筛选"
          :options="catOptions"
        />
      </div>
    </header>

    <main class="app-main">
      <div class="toolbar__stats-row">
        <span>{{ filtered.length }} / {{ entries.length }} 条</span>
      </div>
      <TranslationTable
        :entries="filtered"
        :loading="loading"
        :languages="displayLanguages"
        :language-names="languageNames"
        :html-lang-map="htmlLangMap"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import AppHeader from "./components/AppHeader.vue"
import TranslationTable from "./components/TranslationTable.vue"
import MultiSelect from "./components/MultiSelect.vue"

const entries = ref([])
const projects = ref([])
const languageRegistry = ref([])
const loading = ref(true)

const searchQuery = ref("")
const selectedProjects = ref([])
const selectedLanguages = ref([])
const selectedCategories = ref([])
const isDark = ref(true)
const useSans = ref(false)

const projectOptions = computed(() =>
  projects.value.map((p) => ({ value: p.id, label: p.name })),
)

const languageOptions = computed(() =>
  availableLanguages.value.map((code) => ({
    value: code,
    label: languageRegistry.value.find((l) => l.code === code)?.name || code,
  })),
)

const languageNames = computed(() =>
  Object.fromEntries(
    languageRegistry.value.map((l) => [l.code, l.name]),
  ),
)

const htmlLangMap = computed(() =>
  Object.fromEntries(
    languageRegistry.value.map((l) => [l.code, l.htmlLang]),
  ),
)

const availableLanguages = computed(() => {
  const active = selectedProjects.value.length
    ? projects.value.filter((p) => selectedProjects.value.includes(p.id))
    : projects.value
  const set = new Set()
  active.forEach((p) => p.languages.forEach((l) => set.add(l)))
  return [...set]
})

const displayLanguages = computed(() => {
  if (selectedLanguages.value.length) {
    return availableLanguages.value.filter((l) => selectedLanguages.value.includes(l))
  }
  return availableLanguages.value
})

const catLabelMap = {
  advancement: "进度",
  block: "方块",
  item: "物品",
  entity: "实体",
  effect: "效果",
  enchantment: "附魔",
  tag: "标签",
  fluid: "流体",
  death: "死亡",
  subtitle: "字幕",
  chat: "聊天",
  command: "命令",
  menu: "菜单",
  itemGroup: "物品组",
  jukebox_song: "唱片",
  generator: "生成器",
  other: "其他",
}

const catOptions = ref([])

onMounted(async () => {
  const res = await fetch(`${import.meta.env.BASE_URL}data/translations.json`)
  const data = await res.json()
  entries.value = data.entries
  projects.value = data.projects
  languageRegistry.value = data.languages

  const catSet = new Set()
  for (const e of data.entries) {
    catSet.add(e.category)
  }
  for (const c of [...catSet].sort()) {
    catOptions.value.push({ value: c, label: catLabelMap[c] || c })
  }
  loading.value = false
})

function toggleTheme() {
  isDark.value = !isDark.value
}

function toggleFont() {
  useSans.value = !useSans.value
}

watch(isDark, (val) => { document.body.classList.toggle("theme-light", !val) }, { immediate: true })
watch(useSans, (val) => { document.body.classList.toggle("font-sans", val) }, { immediate: true })

const filtered = computed(() => {
  let result = entries.value
  if (selectedProjects.value.length) {
    result = result.filter((e) => selectedProjects.value.includes(e.project))
  }
  if (selectedCategories.value.length) {
    result = result.filter((e) => selectedCategories.value.includes(e.category))
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    result = result.filter((e) => {
      if (e.key.toLowerCase().includes(q)) return true
      return Object.values(e.translations || {}).some((text) =>
        String(text).toLowerCase().includes(q),
      )
    })
  }
  return result
})
</script>
