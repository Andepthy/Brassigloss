import assert from "node:assert/strict"
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { basename, join } from "node:path"
import test from "node:test"
import {
  categorizeMinecraftKey,
  findDataProjects,
  resolveCsvLanguageCode,
} from "./translation-sources.mjs"

test("categorizeMinecraftKey maps known and fallback prefixes", () => {
  assert.equal(categorizeMinecraftKey("block.create.example"), "block")
  assert.equal(categorizeMinecraftKey("itemGroup.create"), "itemGroup")
  assert.equal(categorizeMinecraftKey("unknown.example"), "other")
})

test("resolveCsvLanguageCode accepts aliases and explicit language codes", () => {
  assert.equal(resolveCsvLanguageCode("English"), "en_us")
  assert.equal(resolveCsvLanguageCode("SimplifiedChinese"), "zh_cn")
  assert.equal(resolveCsvLanguageCode("pt-BR"), "pt_br")
  assert.equal(resolveCsvLanguageCode("Notes"), null)
})

test("findDataProjects discovers project folders and source files", (context) => {
  const rootDirectory = mkdtempSync(join(tmpdir(), "brassigloss-data-"))
  context.after(() => rmSync(rootDirectory, { recursive: true, force: true }))

  const projectDirectory = join(rootDirectory, "new-project")
  mkdirSync(projectDirectory)
  writeFileSync(join(projectDirectory, "en_us.json"), "{}")
  writeFileSync(join(projectDirectory, "zh_cn.json"), "{}")
  writeFileSync(join(projectDirectory, "text.csv"), "key,English\n")

  const projects = findDataProjects(rootDirectory)

  assert.equal(projects.length, 1)
  assert.equal(projects[0].id, "new-project")
  assert.equal(projects[0].name, "new-project")
  assert.deepEqual(
    projects[0].languageFiles.map((file) => ({
      code: file.code,
      name: basename(file.path),
    })),
    [
      { code: "en_us", name: "en_us.json" },
      { code: "zh_cn", name: "zh_cn.json" },
    ],
  )
  assert.deepEqual(
    projects[0].csvFiles.map((file) => basename(file)),
    ["text.csv"],
  )
})
