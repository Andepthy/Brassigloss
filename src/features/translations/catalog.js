const PROJECT_ORDER = Object.freeze([
  "create",
  "simulated",
  "offroad",
  "aeronautics",
  "chants-of-sennaar",
])

const LANGUAGE_ORDER = Object.freeze([
  "en_us",
  "fr_fr",
  "zh_cn",
  "zh_tw",
  "lzh",
])

const DEFAULT_UNSELECTED_PROJECT_IDS = Object.freeze(["chants-of-sennaar"])

export function createProjectOptions(projects) {
  return sortValuesByPriority(
    projects,
    (project) => project.id,
    PROJECT_ORDER,
  ).map((project) => ({
    value: project.id,
    label: project.name,
  }))
}

export function getDefaultProjectIds(projects) {
  return createProjectOptions(projects)
    .map((project) => project.value)
    .filter(
      (projectId) => !DEFAULT_UNSELECTED_PROJECT_IDS.includes(projectId),
    )
}

export function getAvailableLanguages(projects, selectedProjectIds) {
  const activeProjects = selectedProjectIds.length
    ? projects.filter((project) => selectedProjectIds.includes(project.id))
    : projects
  const languageCodes = new Set()

  for (const project of activeProjects) {
    for (const languageCode of project.languages) {
      languageCodes.add(languageCode)
    }
  }

  return sortValuesByPriority([...languageCodes], (code) => code, LANGUAGE_ORDER)
}

export function createLanguageOptions(languages, languageCodes) {
  const languageByCode = new Map(
    languages.map((language) => [language.code, language]),
  )

  return sortValuesByPriority(languageCodes, (code) => code, LANGUAGE_ORDER).map(
    (code) => {
      const language = languageByCode.get(code)

      return {
        value: code,
        label: language?.name || code,
        htmlLang: language?.htmlLang || "",
      }
    },
  )
}

export function createLanguageNameMap(languages) {
  return Object.fromEntries(
    languages.map((language) => [language.code, language.name]),
  )
}

export function createHtmlLangMap(languages) {
  return Object.fromEntries(
    languages.map((language) => [language.code, language.htmlLang]),
  )
}

function sortValuesByPriority(values, getValue, priority) {
  const priorityByValue = new Map(
    priority.map((value, index) => [value, index]),
  )

  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => {
      const leftPriority = priorityByValue.get(getValue(left.value))
      const rightPriority = priorityByValue.get(getValue(right.value))

      if (leftPriority === undefined && rightPriority === undefined) {
        return left.index - right.index
      }
      if (leftPriority === undefined) {
        return 1
      }
      if (rightPriority === undefined) {
        return -1
      }

      return leftPriority - rightPriority
    })
    .map(({ value }) => value)
}
