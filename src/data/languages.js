export const LANGUAGE_REGISTRY = Object.freeze({
  en_us: {
    code: "en_us",
    name: "English (United States)",
    htmlLang: "en-US",
  },
  fr_fr: {
    code: "fr_fr",
    name: "Français (France)",
    htmlLang: "fr-FR",
  },
  zh_cn: {
    code: "zh_cn",
    name: "简体中文 (中国大陆)",
    htmlLang: "zh-Hans-CN",
  },
  zh_tw: {
    code: "zh_tw",
    name: "繁體中文 (台灣)",
    htmlLang: "zh-Hant-TW",
  },
})

export const LANGUAGES = Object.freeze(Object.values(LANGUAGE_REGISTRY))
