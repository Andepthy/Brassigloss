import { readdirSync } from "node:fs"
import { extname, join, parse } from "node:path"

const CATEGORY_BY_PREFIX = Object.freeze({
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
})

export function categorizeMinecraftKey(key) {
  const prefix = key.split(".")[0]
  return CATEGORY_BY_PREFIX[prefix] || "other"
}

const CSV_LANGUAGE_BY_HEADER = Object.freeze({
  english: "en_us",
  french: "fr_fr",
  simplifiedchinese: "zh_cn",
  traditionalchinese: "zh_tw",
})

export function resolveCsvLanguageCode(header) {
  const value = String(header || "").trim()
  if (!value) {
    return null
  }

  const compactHeader = value.toLowerCase().replace(/[\s_-]+/g, "")
  if (CSV_LANGUAGE_BY_HEADER[compactHeader]) {
    return CSV_LANGUAGE_BY_HEADER[compactHeader]
  }

  const normalizedCode = value.toLowerCase().replace(/-/g, "_")
  return /^[a-z]{2,3}(?:_[a-z0-9]{2,8})*$/.test(normalizedCode)
    ? normalizedCode
    : null
}

export function findDataProjects(rootDirectory) {
  return readdirSync(rootDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const directory = join(rootDirectory, entry.name)
      const files = readdirSync(directory, { withFileTypes: true })
        .filter((file) => file.isFile())
        .sort((left, right) => left.name.localeCompare(right.name))

      return {
        id: entry.name,
        name: entry.name,
        directory,
        languageFiles: files
          .filter((file) => extname(file.name).toLowerCase() === ".json")
          .map((file) => ({
            code: parse(file.name).name.toLowerCase().replace(/-/g, "_"),
            path: join(directory, file.name),
          })),
        csvFiles: files
          .filter((file) => extname(file.name).toLowerCase() === ".csv")
          .map((file) => join(directory, file.name)),
      }
    })
}
