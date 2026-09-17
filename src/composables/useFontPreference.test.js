import assert from "node:assert/strict"
import test from "node:test"
import { nextTick } from "vue"

import {
  FONT_PREFERENCE_STORAGE_KEY,
  useFontPreference,
} from "./useFontPreference.js"

test("font preference persists across composable instances", async (t) => {
  const previousDocument = globalThis.document
  const previousLocalStorage = globalThis.localStorage
  const storedValues = new Map()
  const bodyClasses = new Set()

  globalThis.localStorage = {
    getItem(key) {
      return storedValues.get(key) ?? null
    },
    setItem(key, value) {
      storedValues.set(key, String(value))
    },
  }
  globalThis.document = {
    body: {
      classList: {
        toggle(className, enabled) {
          if (enabled) bodyClasses.add(className)
          else bodyClasses.delete(className)
        },
      },
    },
  }

  t.after(() => {
    globalThis.document = previousDocument
    globalThis.localStorage = previousLocalStorage
  })

  const first = useFontPreference()
  assert.equal(first.useSans.value, false)
  assert.equal(
    storedValues.get(FONT_PREFERENCE_STORAGE_KEY),
    "false",
  )

  first.toggleFont()
  await nextTick()

  assert.equal(first.useSans.value, true)
  assert.equal(bodyClasses.has("font-sans"), true)
  assert.equal(
    storedValues.get(FONT_PREFERENCE_STORAGE_KEY),
    "true",
  )

  const restored = useFontPreference()
  assert.equal(restored.useSans.value, true)
  assert.equal(bodyClasses.has("font-sans"), true)
})
