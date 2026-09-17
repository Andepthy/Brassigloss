import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"

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

export function findLanguagePairs(rootDirectory) {
  const results = []
  const directoryEntries = readdirSync(rootDirectory, {
    withFileTypes: true,
  }).sort((left, right) => left.name.localeCompare(right.name))

  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) {
      continue
    }

    const sourceDirectory = join(rootDirectory, entry.name)
    const englishFile = join(sourceDirectory, "en_us.json")
    const chineseFile = join(sourceDirectory, "zh_cn.json")

    if (existsSync(englishFile) && existsSync(chineseFile)) {
      results.push({
        name: entry.name,
        enFile: englishFile,
        zhFile: chineseFile,
      })
    }

    results.push(...findLanguagePairs(sourceDirectory))
  }

  return results
}
