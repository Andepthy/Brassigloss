import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { createLanguageCatalog } from "../src/data/languages.js"
import { parseCsv } from "./lib/csv.mjs"
import {
  categorizeMinecraftKey,
  findDataProjects,
  resolveCsvLanguageCode,
} from "./lib/translation-sources.mjs"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const dataDir = join(__dirname, "../data")
const outputDir = join(__dirname, "../public/data")
const outputFile = join(outputDir, "translations.json")

const projects = []
const entries = []

for (const source of findDataProjects(dataDir)) {
  const projectEntries = deduplicateEntries([
    ...readJsonEntries(source),
    ...readCsvEntries(source),
  ])

  if (!projectEntries.length) {
    continue
  }

  projects.push({
    id: source.id,
    name: source.name,
    languages: [
      ...new Set(
        projectEntries.flatMap((entry) => Object.keys(entry.translations)),
      ),
    ],
  })
  entries.push(...projectEntries)
}

const allData = {
  projects,
  languages: createLanguageCatalog(
    projects.flatMap((project) => project.languages),
  ),
  entries,
}

mkdirSync(outputDir, { recursive: true })
writeFileSync(outputFile, JSON.stringify(allData, null, 2), "utf-8")
console.log(`Generated ${entries.length} entries across ${projects.length} project(s)`)
for (const project of projects) {
  const count = entries.filter((e) => e.project === project.id).length
  console.log(`  ${project.id}: ${count} keys (${project.languages.join(", ")})`)
}

function readJsonEntries(source) {
  const datasets = new Map()

  for (const languageFile of source.languageFiles) {
    const data = JSON.parse(readFileSync(languageFile.path, "utf-8"))
    if (!isTranslationMap(data)) {
      throw new TypeError(
        `Expected ${languageFile.path} to contain a JSON object of translations`,
      )
    }
    datasets.set(languageFile.code, data)
  }

  if (!datasets.size) {
    return []
  }

  return collectKeys(datasets).map((key) => ({
    key,
    project: source.id,
    category: categorizeMinecraftKey(key),
    translations: Object.fromEntries(
      [...datasets.entries()].map(([language, translations]) => [
        language,
        translations[key] || "",
      ]),
    ),
  }))
}

function readCsvEntries(source) {
  const entries = []

  for (const csvFile of source.csvFiles) {
    const rows = parseCsv(readFileSync(csvFile, "utf-8"))
    if (!rows.length) {
      continue
    }

    const header = rows[0]
    const keyIndex = header.findIndex(
      (column) => column.trim().toLowerCase() === "key",
    )
    if (keyIndex === -1) {
      throw new TypeError(`Expected ${csvFile} to contain a key column`)
    }

    const languageColumns = header.flatMap((column, index) => {
      if (index === keyIndex) {
        return []
      }

      const language = resolveCsvLanguageCode(column)
      return language ? [{ language, index }] : []
    })
    const seenKeys = new Set()

    for (const row of rows.slice(1)) {
      const key = row[keyIndex] || ""
      if (!key || seenKeys.has(key)) {
        continue
      }

      seenKeys.add(key)
      entries.push({
        key,
        project: source.id,
        category: key.split(".")[0] || "other",
        translations: Object.fromEntries(
          languageColumns.map(({ language, index }) => [
            language,
            row[index] || "",
          ]),
        ),
      })
    }
  }

  return entries
}

function collectKeys(datasets) {
  const keys = []
  const seenKeys = new Set()
  const languageOrder = datasets.has("en_us")
    ? ["en_us", ...[...datasets.keys()].filter((language) => language !== "en_us")]
    : [...datasets.keys()]

  for (const language of languageOrder) {
    for (const key of Object.keys(datasets.get(language))) {
      if (!seenKeys.has(key)) {
        seenKeys.add(key)
        keys.push(key)
      }
    }
  }

  return keys
}

function deduplicateEntries(entries) {
  const entriesByKey = new Map()

  for (const entry of entries) {
    const existing = entriesByKey.get(entry.key)
    if (existing) {
      Object.assign(existing.translations, entry.translations)
    } else {
      entriesByKey.set(entry.key, {
        ...entry,
        translations: { ...entry.translations },
      })
    }
  }

  return [...entriesByKey.values()]
}

function isTranslationMap(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}
