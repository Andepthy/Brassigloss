import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { LANGUAGE_REGISTRY } from "../src/data/languages.js"
import { parseCsv } from "./lib/csv.mjs"
import {
  categorizeMinecraftKey,
  findLanguagePairs,
} from "./lib/translation-sources.mjs"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const dataDir = join(__dirname, "../data")
const outputDir = join(__dirname, "../public/data")
const outputFile = join(outputDir, "translations.json")

const projects = []
const entries = []

// Minecraft-style JSON sources (Create and its sub-mods).
const pairs = findLanguagePairs(dataDir)
for (const pair of pairs) {
  const en = JSON.parse(readFileSync(pair.enFile, "utf-8"))
  const zh = JSON.parse(readFileSync(pair.zhFile, "utf-8"))
  const projectId = pair.name
  if (!projects.some((p) => p.id === projectId)) {
    projects.push({
      id: projectId,
      name: projectId === "create" ? "Create" : capitalize(projectId),
      languages: ["en_us", "zh_cn"],
    })
  }
  for (const [key, enVal] of Object.entries(en)) {
    entries.push({
      key,
      project: projectId,
      category: categorizeMinecraftKey(key),
      translations: {
        en_us: enVal,
        zh_cn: zh[key] || "",
      },
    })
  }
}

// Chants of Sennaar CSV source.
const csvPath = join(dataDir, "ChantsOfSennaar", "ChantsOfSennaar_Text.csv")
if (existsSync(csvPath)) {
  const csvRows = parseCsv(readFileSync(csvPath, "utf-8"))
  const header = csvRows[0]
  const columnToLang = {
    English: "en_us",
    French: "fr_fr",
    SimplifiedChinese: "zh_cn",
    TraditionalChinese: "zh_tw",
  }
  const langIndex = header.map((h) => columnToLang[h] || null)
  projects.push({
    id: "chants",
    name: "Chants of Sennaar",
    languages: ["en_us", "fr_fr", "zh_cn", "zh_tw"],
  })
  const seenChantsKeys = new Set()
  for (const row of csvRows.slice(1)) {
    const key = row[0]
    if (!key) continue
    if (seenChantsKeys.has(key)) continue
    seenChantsKeys.add(key)
    const translations = {}
    for (let i = 1; i < row.length; i++) {
      const lang = langIndex[i]
      if (lang) translations[lang] = row[i] || ""
    }
    entries.push({
      key,
      project: "chants",
      category: key.split(".")[0],
      translations,
    })
  }
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const allData = {
  projects,
  languages: Object.values(LANGUAGE_REGISTRY),
  entries,
}

mkdirSync(outputDir, { recursive: true })
writeFileSync(outputFile, JSON.stringify(allData, null, 2), "utf-8")
console.log(`Generated ${entries.length} entries across ${projects.length} project(s)`)
for (const project of projects) {
  const count = entries.filter((e) => e.project === project.id).length
  console.log(`  ${project.id}: ${count} keys (${project.languages.join(", ")})`)
}
