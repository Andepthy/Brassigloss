import assert from "node:assert/strict"
import test from "node:test"

import {
  getNextThemeMode,
  resolveIsDark,
} from "./useThemePreference.js"

test("theme modes follow the Verdigloss cycle", () => {
  assert.equal(getNextThemeMode("system"), "dark")
  assert.equal(getNextThemeMode("dark"), "light")
  assert.equal(getNextThemeMode("light"), "system")
})

test("system theme follows the operating system preference", () => {
  assert.equal(resolveIsDark("system", true), true)
  assert.equal(resolveIsDark("system", false), false)
  assert.equal(resolveIsDark("dark", false), true)
  assert.equal(resolveIsDark("light", true), false)
})
