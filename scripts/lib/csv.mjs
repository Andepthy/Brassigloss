export function parseCsv(text) {
  const content = text.replace(/^\uFEFF/, "")
  const rows = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < content.length; index++) {
    const character = content[index]

    if (character === '"') {
      inQuotes = !inQuotes
      current += character
    } else if (
      (character === "\n" || character === "\r") &&
      !inQuotes
    ) {
      if (current.trim()) {
        rows.push(current)
      }

      current = ""

      if (character === "\r" && content[index + 1] === "\n") {
        index++
      }
    } else {
      current += character
    }
  }

  if (current.trim()) {
    rows.push(current)
  }

  return rows.map(parseCsvRow)
}

function parseCsvRow(row) {
  const cells = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < row.length; index++) {
    const character = row[index]

    if (character === '"') {
      if (inQuotes && row[index + 1] === '"') {
        current += '"'
        index++
      } else {
        inQuotes = !inQuotes
      }
    } else if (character === "," && !inQuotes) {
      cells.push(current.trim())
      current = ""
    } else {
      current += character
    }
  }

  cells.push(current.trim())
  return cells
}
