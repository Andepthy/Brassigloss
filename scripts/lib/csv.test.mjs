import assert from "node:assert/strict"
import test from "node:test"
import { parseCsv } from "./csv.mjs"

test("parseCsv handles quoted commas, escaped quotes, and newlines", () => {
  const rows = parseCsv(
    '\uFEFFKey,English,Chinese\r\n"a.b","Hello, world","你好"\r\n"a.c","He said ""hi""","多行\n文本"',
  )

  assert.deepEqual(rows, [
    ["Key", "English", "Chinese"],
    ["a.b", "Hello, world", "你好"],
    ["a.c", 'He said "hi"', "多行\n文本"],
  ])
})
