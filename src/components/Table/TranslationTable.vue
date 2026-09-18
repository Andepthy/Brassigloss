<template>
  <div class="table-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中…</p>
    </div>
    <div v-else-if="!entries.length" class="empty-state">
      <p>没有本地化键名符合当前筛选条件。</p>
    </div>
    <template v-else>
      <div
        v-if="!compact"
        class="table-wrapper"
        ref="wrapper"
        role="region"
        tabindex="0"
        aria-label="标准译名表"
      >
        <table :style="{ width: `${16 + languages.length * 14}rem` }">
          <colgroup>
            <col class="key-column-track" />
            <col
              v-for="lang in languages"
              :key="lang"
              class="language-column-track"
            />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" class="key-column">键名</th>
              <th
                v-for="lang in languages"
                :key="lang"
                scope="col"
                :class="langClass(lang)"
              >
                <code>{{ lang }}</code>
                <span class="sr-only" :lang="htmlLang(lang)">
                  {{ languageNames[lang] || lang }}
                </span>
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

      <ol v-else class="mobile-table-list" aria-label="标准译名表">
        <li
          v-for="row in entries"
          :key="`${row.project}:${row.key}`"
          class="mobile-table-card"
        >
          <article>
            <h2>{{ row.key }}</h2>
            <dl>
              <div
                v-for="lang in languages"
                :key="lang"
                class="mobile-translation"
              >
                <dt>
                  <span :lang="htmlLang(lang)" :class="langClass(lang)">
                    {{ languageNames[lang] || lang }}
                  </span>
                  <code>{{ lang }}</code>
                </dt>
                <dd :lang="htmlLang(lang)" :class="langClass(lang)">
                  {{ row.translations?.[lang] || "" }}
                </dd>
              </div>
            </dl>
          </article>
        </li>
      </ol>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  entries: { type: Array, default: () => [] },
  loading: { type: Boolean, default: true },
  compact: { type: Boolean, default: false },
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
