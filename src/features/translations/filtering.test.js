import assert from "node:assert/strict"
import test from "node:test"
import { filterTranslationEntries } from "./filtering.js"

const entries = [
  {
    project: "create",
    key: "block.example.press",
    translations: { en_us: "Mechanical Press", zh_cn: "机械压床" },
  },
  {
    project: "chants",
    key: "word.example",
    translations: { en_us: "Example", fr_fr: "Exemple" },
  },
]

test("filterTranslationEntries filters by project and selected languages", () => {
  const result = filterTranslationEntries(entries, {
    projectIds: ["create"],
    searchQuery: "机械",
    languages: ["zh_cn"],
  })

  assert.deepEqual(result, [entries[0]])
})

test("filterTranslationEntries ignores languages that are not selected", () => {
  const result = filterTranslationEntries(entries, {
    projectIds: ["chants"],
    searchQuery: "Exemple",
    languages: ["en_us"],
  })

  assert.deepEqual(result, [])
})
