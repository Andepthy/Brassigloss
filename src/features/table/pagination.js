export function getTotalPages(totalItems, itemsPerPage) {
  if (!Number.isFinite(totalItems) || totalItems <= 0 || itemsPerPage <= 0) {
    return 0
  }

  return Math.ceil(totalItems / itemsPerPage)
}

export function paginateItems(items, currentPage, itemsPerPage) {
  if (itemsPerPage <= 0) {
    return items
  }

  const start = (Math.max(1, currentPage) - 1) * itemsPerPage
  return items.slice(start, start + itemsPerPage)
}

export function getPageWindow(totalPages, currentPage) {
  if (totalPages <= 0) {
    return []
  }

  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const page = Math.min(Math.max(currentPage, 1), totalPages)

  if (page <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages]
  }

  if (page >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    "ellipsis",
    page - 1,
    page,
    page + 1,
    "ellipsis",
    totalPages,
  ]
}
