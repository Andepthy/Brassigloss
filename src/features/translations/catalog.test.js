import assert from "node:assert/strict"
import test from "node:test"
import {
  createLanguageOptions,
  createProjectOptions,
  getAvailableLanguages,
  getDefaultProjectIds,
} from "./catalog.js"

const projects = [
  {
    id: "aeronautics",
    name: "aeronautics",
    languages: ["zh_cn", "en_us"],
  },
  {
    id: "chants-of-sennaar",
    name: "chants-of-sennaar",
    languages: ["fr_fr", "zh_tw"],
  },
  {
    id: "new-namespace",
    name: "new-namespace",
    languages: ["de_de", "en_us"],
  },
  {
    id: "offroad",
    name: "offroad",
    languages: ["zh_cn", "en_us"],
  },
  {
    id: "simulated",
    name: "simulated",
    languages: ["zh_cn", "en_us"],
  },
  {
    id: "create",
    name: "create",
    languages: ["lzh", "zh_tw", "en_us", "zh_cn"],
  },
]

test("createProjectOptions uses the namespace priority order", () => {
  assert.deepEqual(
    createProjectOptions(projects).map((project) => project.value),
    [
      "create",
      "simulated",
      "offroad",
      "aeronautics",
      "chants-of-sennaar",
      "new-namespace",
    ],
  )
})

test("getDefaultProjectIds excludes chants-of-sennaar", () => {
  assert.deepEqual(getDefaultProjectIds(projects), [
    "create",
    "simulated",
    "offroad",
    "aeronautics",
    "new-namespace",
  ])
})

test("language options use the requested order and append new codes", () => {
  const languageCodes = getAvailableLanguages(
    projects,
    projects.map((project) => project.id),
  )

  assert.deepEqual(languageCodes, [
    "en_us",
    "fr_fr",
    "zh_cn",
    "zh_tw",
    "lzh",
    "de_de",
  ])
  assert.deepEqual(
    createLanguageOptions([], languageCodes).map((language) => language.value),
    languageCodes,
  )
})
