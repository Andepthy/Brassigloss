export function createProjectOptions(projects) {
  return projects.map((project) => ({
    value: project.id,
    label: project.name,
  }))
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

  return [...languageCodes]
}

export function createLanguageOptions(languages, languageCodes) {
  const languageByCode = new Map(
    languages.map((language) => [language.code, language]),
  )

  return languageCodes.map((code) => {
    const language = languageByCode.get(code)

    return {
      value: code,
      label: language?.name || code,
      htmlLang: language?.htmlLang || "",
    }
  })
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
