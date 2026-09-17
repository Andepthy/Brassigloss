import assert from "node:assert/strict"
import test from "node:test"
import {
  getPageWindow,
  getTotalPages,
  paginateItems,
} from "./pagination.js"

test("getTotalPages rounds up and handles empty input", () => {
  assert.equal(getTotalPages(101, 50), 3)
  assert.equal(getTotalPages(0, 50), 0)
})

test("paginateItems returns the requested page", () => {
  assert.deepEqual(paginateItems([1, 2, 3, 4, 5], 2, 2), [3, 4])
})

test("getPageWindow keeps the current page in view", () => {
  assert.deepEqual(getPageWindow(10, 5), [
    1,
    "ellipsis",
    4,
    5,
    6,
    "ellipsis",
    10,
  ])
})
