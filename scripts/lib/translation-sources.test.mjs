import assert from "node:assert/strict"
import test from "node:test"
import { categorizeMinecraftKey } from "./translation-sources.mjs"

test("categorizeMinecraftKey maps known and fallback prefixes", () => {
  assert.equal(categorizeMinecraftKey("block.create.example"), "block")
  assert.equal(categorizeMinecraftKey("itemGroup.create"), "itemGroup")
  assert.equal(categorizeMinecraftKey("unknown.example"), "other")
})
