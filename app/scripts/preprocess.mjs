import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"
import { fileURLToPath } from "url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const dataDir = join(__dirname, "../../data")
const outputDir = join(__dirname, "../public/data")
const outputFile = join(outputDir, "translations.json")

const languageRegistry = {
  en_us: { code: "en_us", name: "English (United States)", htmlLang: "en-US" },
  fr_fr: { code: "fr_fr", name: "Français (France)", htmlLang: "fr-FR" },
  zh_cn: { code: "zh_cn", name: "简体中文 (中国大陆)", htmlLang: "zh-Hans-CN" },
  zh_tw: { code: "zh_tw", name: "繁體中文 (台灣)", htmlLang: "zh-Hant-TW" },
}

function findLangPairs(root) {
  const results = []
  const dirs = readdirSync(root, { withFileTypes: true })
  for (const entry of dirs) {
    if (!entry.isDirectory()) continue
    const subDir = join(root, entry.name)
    const enFile = join(subDir, "en_us.json")
    const zhFile = join(subDir, "zh_cn.json")
    if (existsSync(enFile) && existsSync(zhFile)) {
      const relPath = subDir.replace(dataDir, "").replace(/^[\\/]/, "").replace(/\\/g, "/")
      results.push({ name: entry.name, subKey: relPath, enFile, zhFile })
    }
    results.push(...findLangPairs(subDir))
  }
  return results
}

function categorizeMcKey(key) {
  const prefix = key.split(".")[0]
  const map = {
    advancement: "advancement",
    block: "block",
    item: "item",
    entity: "entity",
    biome: "biome",
    effect: "effect",
    enchantment: "enchantment",
    tag: "tag",
    fluid: "fluid",
    itemGroup: "itemGroup",
    death: "death",
    subtitle: "subtitle",
    chat: "chat",
    command: "command",
    menu: "menu",
    options: "options",
    selectWorld: "selectWorld",
    sound: "sound",
    mount: "mount",
    painting: "painting",
    jukebox_song: "jukebox_song",
    trim_pattern: "trim_pattern",
    trim_material: "trim_material",
    instrument: "instrument",
    banner: "banner",
    generator: "generator",
  }
  return map[prefix] || "other"
}

function parseCsv(text) {
  const content = text.replace(/^\uFEFF/, "")
  const rows = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < content.length; i++) {
    const ch = content[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      current += ch
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (current.trim()) rows.push(current)
      current = ""
      if (ch === "\r" && content[i + 1] === "\n") i++
    } else {
      current += ch
    }
  }
  if (current.trim()) rows.push(current)

  return rows.map(parseCsvRow)
}

function parseCsvRow(row) {
  const cells = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < row.length; i++) {
    const ch = row[i]
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      cells.push(current.trim())
      current = ""
    } else {
      current += ch
    }
  }
  cells.push(current.trim())
  return cells
}

const projects = []
const entries = []

// Minecraft-style JSON sources (Create and its sub-mods).
const pairs = findLangPairs(dataDir)
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
      category: categorizeMcKey(key),
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
  languages: Object.values(languageRegistry),
  entries,
}

writeFileSync(outputFile, JSON.stringify(allData, null, 2), "utf-8")
console.log(`Generated ${entries.length} entries across ${projects.length} project(s)`)
for (const project of projects) {
  const count = entries.filter((e) => e.project === project.id).length
  console.log(`  ${project.id}: ${count} keys (${project.languages.join(", ")})`)
}
