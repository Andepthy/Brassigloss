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
          placeholder="选择项目"
          :options="projectOptions"
        />

        <MultiSelect
          v-model="selectedLanguages"
          label="显示语言"
          placeholder="选择语言"
          :options="languageOptions"
          summary-mode="codes"
          show-option-values
        />

        <label class="pagination-toggle">
          <input v-model="usePagination" type="checkbox" />
          <span>使用分页</span>
        </label>
      </div>
    </header>

    <main class="app-main">
      <TablePagination
        v-if="!loading && usePagination"
        v-model:current-page="currentPage"
        :total-items="filtered.length"
        :total-count="entries.length"
        :items-per-page="itemsPerPage"
        show-info
        position="top"
      />

      <div v-else-if="!loading" class="toolbar__stats-row">
        <span>{{ filtered.length }} / {{ entries.length }} 条</span>
      </div>

      <TranslationTable
        :entries="displayEntries"
        :loading="loading"
        :languages="displayLanguages"
        :language-names="languageNames"
        :html-lang-map="htmlLangMap"
      />

      <TablePagination
        v-if="!loading && usePagination"
        v-model:current-page="currentPage"
        :total-items="filtered.length"
        :total-count="entries.length"
        :items-per-page="itemsPerPage"
        position="bottom"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue"
import AppHeader from "./components/AppHeader.vue"
import TranslationTable from "./components/TranslationTable.vue"
import MultiSelect from "./components/MultiSelect.vue"
import TablePagination from "./components/TablePagination.vue"

const entries = ref([])
const projects = ref([])
const languageRegistry = ref([])
const loading = ref(true)

const searchQuery = ref("")
const selectedProjects = ref([])
const selectedLanguages = ref([])
const isDark = ref(true)
const useSans = ref(false)
const usePagination = ref(true)
const currentPage = ref(1)
const isCompactLayout = ref(false)

let compactLayoutQuery

const projectOptions = computed(() =>
  projects.value.map((p) => ({ value: p.id, label: p.name })),
)

const languageOptions = computed(() =>
  availableLanguages.value.map((code) => {
    const language = languageRegistry.value.find((l) => l.code === code)
    return {
      value: code,
      label: language?.name || code,
      htmlLang: language?.htmlLang || "",
    }
  }),
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

onMounted(async () => {
  compactLayoutQuery = window.matchMedia("(max-width: 800px)")
  syncCompactLayout(compactLayoutQuery)
  compactLayoutQuery.addEventListener("change", syncCompactLayout)

  const res = await fetch(`${import.meta.env.BASE_URL}data/translations.json`)
  const data = await res.json()
  entries.value = data.entries
  projects.value = data.projects
  languageRegistry.value = data.languages
  loading.value = false
})

onBeforeUnmount(() => {
  compactLayoutQuery?.removeEventListener("change", syncCompactLayout)
})

function syncCompactLayout(event) {
  isCompactLayout.value = event.matches
}

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

const itemsPerPage = computed(() => (isCompactLayout.value ? 10 : 50))

const displayEntries = computed(() => {
  if (!usePagination.value) return filtered.value
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filtered.value.slice(start, start + itemsPerPage.value)
})

watch(
  [filtered, usePagination, itemsPerPage],
  () => {
    currentPage.value = 1
  },
  { immediate: true },
)
</script>
