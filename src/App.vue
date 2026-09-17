<template>
  <div class="app-shell">
    <AppHeader
      :is-dark="isDark"
      :theme-mode="themeMode"
      :use-sans="useSans"
      @cycle-theme="cycleTheme"
      @toggle-font="toggleFont"
    />

    <header class="table-header">
      <div class="table-header__title">
        <h1>标准译名表</h1>
      </div>
      <div class="table-toolbar" aria-label="表格控件">
        <label class="search-field">
          <span class="sr-only">搜索翻译</span>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="搜索内容…"
          />
        </label>

        <MultiSelect
          v-model="selectedProjects"
          label="项目"
          placeholder="选择命名空间"
          :options="projectOptions"
        />

        <MultiSelect
          v-model="selectedLanguages"
          class="language-select"
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
        :items-per-page="itemsPerPage"
        show-info
        position="top"
      />

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
        :items-per-page="itemsPerPage"
        position="bottom"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import AppHeader from "@/components/AppHeader.vue"
import MultiSelect from "@/components/Query/MultiSelect.vue"
import TablePagination from "@/components/Table/TablePagination.vue"
import TranslationTable from "@/components/Table/TranslationTable.vue"
import { useCompactLayout } from "@/composables/useCompactLayout"
import { useFontPreference } from "@/composables/useFontPreference"
import { useThemePreference } from "@/composables/useThemePreference"
import { LANGUAGES } from "@/data/languages"
import {
  createHtmlLangMap,
  createLanguageNameMap,
  createLanguageOptions,
  createProjectOptions,
  getAvailableLanguages,
  getDefaultProjectIds,
  orderEntriesByProject,
} from "@/features/translations/catalog"
import { filterTranslationEntries } from "@/features/translations/filtering"
import { paginateItems } from "@/features/table/pagination"
import { loadTranslationData } from "@/services/translation-data"

const entries = ref([])
const projects = ref([])
const languages = ref(LANGUAGES)
const loading = ref(true)

const searchQuery = ref("")
const selectedProjects = ref([])
const selectedLanguages = ref([])
const usePagination = ref(true)
const currentPage = ref(1)
const { isCompactLayout } = useCompactLayout()
const { mode: themeMode, isDark, cycleTheme } = useThemePreference()
const { useSans, toggleFont } = useFontPreference()

const projectOptions = computed(() => createProjectOptions(projects.value))

const availableLanguages = computed(() =>
  getAvailableLanguages(projects.value, selectedProjects.value),
)

const languageOptions = computed(() =>
  createLanguageOptions(languages.value, availableLanguages.value),
)

const languageNames = computed(() => createLanguageNameMap(languages.value))
const htmlLangMap = computed(() => createHtmlLangMap(languages.value))

const displayLanguages = computed(() => {
  return availableLanguages.value.filter((l) => selectedLanguages.value.includes(l))
})

onMounted(async () => {
  const data = await loadTranslationData(import.meta.env.BASE_URL)
  entries.value = orderEntriesByProject(data.entries, data.projects)
  projects.value = data.projects
  languages.value = data.languages?.length ? data.languages : LANGUAGES
  selectedProjects.value = getDefaultProjectIds(data.projects)
  selectedLanguages.value = getAvailableLanguages(
    data.projects,
    selectedProjects.value,
  )
  loading.value = false
})

const filtered = computed(() =>
  filterTranslationEntries(entries.value, {
    projectIds: selectedProjects.value,
    searchQuery: searchQuery.value,
    languages: displayLanguages.value,
  }),
)

const itemsPerPage = computed(() => (isCompactLayout.value ? 10 : 50))

const displayEntries = computed(() => {
  if (!usePagination.value) return filtered.value
  return paginateItems(filtered.value, currentPage.value, itemsPerPage.value)
})

watch(
  [filtered, usePagination, itemsPerPage],
  () => {
    currentPage.value = 1
  },
  { immediate: true },
)
</script>
