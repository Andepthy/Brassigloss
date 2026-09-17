export async function loadTranslationData(baseUrl, fetchImpl = fetch) {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
  const response = await fetchImpl(`${normalizedBaseUrl}data/translations.json`)

  if (!response.ok) {
    throw new Error(`Unable to load translation data (${response.status})`)
  }

  return response.json()
}
