export function filterTranslationEntries(
  entries,
  { projectIds, searchQuery, languages },
) {
  if (!projectIds.length || !languages.length) {
    return []
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()

  return entries.filter((entry) => {
    if (!projectIds.includes(entry.project)) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    if (entry.key.toLowerCase().includes(normalizedQuery)) {
      return true
    }

    return languages.some((language) =>
      String(entry.translations?.[language] || "")
        .toLowerCase()
        .includes(normalizedQuery),
    )
  })
}
