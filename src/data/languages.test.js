import assert from "node:assert/strict"
import test from "node:test"
import { createLanguageCatalog } from "./languages.js"

test("createLanguageCatalog keeps known metadata and adds unknown codes", () => {
  assert.deepEqual(createLanguageCatalog(["en_us", "lzh", "de-DE"]), [
    {
      code: "en_us",
      name: "English (United States)",
      htmlLang: "en-US",
    },
    {
      code: "lzh",
      name: "文言 (華夏)",
      htmlLang: "lzh",
    },
    {
      code: "de_de",
      name: "de_de",
      htmlLang: "de-DE",
    },
  ])
})
