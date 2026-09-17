<template>
  <div class="table-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    <div v-else-if="!entries.length" class="empty-state">
      <p>没有匹配的翻译条目</p>
    </div>
    <div v-else class="table-wrapper" ref="wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col" class="key-column">Key</th>
            <th
              v-for="lang in languages"
              :key="lang"
              scope="col"
              :class="langClass(lang)"
            >
              {{ languageNames[lang] || lang }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in entries" :key="`${row.project}:${row.key}`">
            <th scope="row" class="key-column">{{ row.key }}</th>
            <td
              v-for="lang in languages"
              :key="lang"
              :lang="htmlLang(lang)"
              :class="langClass(lang)"
            >
              {{ row.translations?.[lang] || "" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  entries: { type: Array, default: () => [] },
  loading: { type: Boolean, default: true },
  languages: { type: Array, default: () => [] },
  languageNames: { type: Object, default: () => ({}) },
  htmlLangMap: { type: Object, default: () => ({}) },
})

function langClass(lang) {
  return `lang-col lang-${lang.replace(/_/g, "-")}`
}

function htmlLang(lang) {
  return props.htmlLangMap[lang] || ""
}
</script>
