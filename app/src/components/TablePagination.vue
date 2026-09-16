<template>
  <nav
    class="pagination-controls"
    :class="`pagination-controls--${position}`"
    :aria-label="navigationLabel"
  >
    <p v-if="showInfo" class="pagination__info">
      <template v-if="totalCount !== null">
        {{ totalItems }} / {{ totalCount }} 条
      </template>
      <template v-else>{{ totalItems }} 条</template>
    </p>

    <p class="sr-only">
      当前第 {{ currentPage || 1 }} 页，共 {{ totalPages || 1 }} 页
    </p>

    <div class="pagination__buttons">
      <button
        class="pagination__button pagination__button--wide"
        type="button"
        :disabled="currentPage <= 1 || !totalItems"
        aria-label="上一页"
        @click="goTo(currentPage - 1)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        <span>上一页</span>
      </button>

      <div class="pagination__pages">
        <template v-for="(page, index) in displayedPages" :key="`${page}-${index}`">
          <span v-if="page === 'ellipsis'" class="pagination__ellipsis" aria-hidden="true">…</span>
          <button
            v-else
            class="pagination__page"
            type="button"
            :aria-current="currentPage === page ? 'page' : undefined"
            :aria-label="`第 ${page} 页`"
            @click="goTo(page)"
          >
            {{ page }}
          </button>
        </template>
      </div>

      <label class="pagination__jump">
        <span class="sr-only">跳至页码</span>
        <input
          v-model="jumpPage"
          type="number"
          min="1"
          :max="totalPages || 1"
          inputmode="numeric"
          placeholder="#"
          @change="jump"
        />
      </label>

      <button
        class="pagination__button pagination__button--wide"
        type="button"
        :disabled="currentPage >= totalPages || !totalItems"
        aria-label="下一页"
        @click="goTo(currentPage + 1)"
      >
        <span>下一页</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from "vue"

const props = defineProps({
  currentPage: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 },
  totalCount: { type: Number, default: null },
  itemsPerPage: { type: Number, default: 50 },
  showInfo: { type: Boolean, default: false },
  position: {
    type: String,
    default: "bottom",
    validator: (value) => ["top", "bottom"].includes(value),
  },
})

const emit = defineEmits(["update:currentPage"])
const jumpPage = ref("")

const totalPages = computed(() =>
  props.totalItems ? Math.ceil(props.totalItems / props.itemsPerPage) : 0,
)

const navigationLabel = computed(() =>
  props.position === "top" ? "结果上方的表格分页" : "结果下方的表格分页",
)

const displayedPages = computed(() => getPageWindow(totalPages.value, props.currentPage))

function getPageWindow(total, current) {
  if (total <= 0) return []
  if (total <= 6) return Array.from({ length: total }, (_, index) => index + 1)

  const page = Math.min(Math.max(current, 1), total)
  if (page <= 3) return [1, 2, 3, 4, "ellipsis", total]
  if (page >= total - 2) {
    return [1, "ellipsis", total - 3, total - 2, total - 1, total]
  }
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", total]
}

function goTo(page) {
  if (!Number.isInteger(page) || page < 1 || page > totalPages.value) return
  emit("update:currentPage", page)
}

function jump() {
  const page = Number(jumpPage.value)
  if (Number.isInteger(page) && page >= 1 && page <= totalPages.value) {
    emit("update:currentPage", page)
  }
  jumpPage.value = ""
}
</script>

<style scoped>
.pagination-controls {
  display: grid;
  justify-items: center;
  gap: 0.65rem;
  width: min(100% - 2rem, var(--content-max));
  margin: var(--space-4) auto var(--space-3);
}

.pagination-controls--bottom {
  margin-top: var(--space-5);
  margin-bottom: var(--space-8);
}

.pagination__info {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.pagination__buttons {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.pagination__button,
.pagination__page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--control-height);
  min-height: var(--control-height);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
}

.pagination__button {
  gap: 0.35rem;
  padding: 0 0.7rem;
}

.pagination__button:hover:not(:disabled),
.pagination__page:hover:not([aria-current="page"]) {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.pagination__button:disabled {
  border-color: var(--border);
  background: var(--surface-subtle);
  color: var(--muted);
}

.pagination__page[aria-current="page"] {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 700;
}

.pagination__button svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pagination__ellipsis {
  min-width: 1.5rem;
  color: var(--muted);
  text-align: center;
}

.pagination__jump input {
  width: 3.25rem;
  min-height: var(--control-height);
  padding: 0.25rem 0.45rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  text-align: center;
}

@media (max-width: 560px) {
  .pagination-controls {
    gap: 0.4rem;
    margin-top: var(--space-3);
  }

  .pagination-controls--top .pagination__buttons {
    display: none;
  }

  .pagination__buttons,
  .pagination__pages {
    gap: 0.1rem;
  }

  .pagination__button,
  .pagination__page {
    min-width: 2.4rem;
    min-height: 2.4rem;
  }

  .pagination__button--wide {
    padding: 0 0.45rem;
  }

  .pagination__button--wide span,
  .pagination__jump {
    display: none;
  }
}
</style>
