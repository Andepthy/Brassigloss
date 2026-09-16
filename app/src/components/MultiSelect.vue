<template>
  <div ref="root" class="multi-select">
    <button
      ref="trigger"
      class="multi-select__trigger"
      type="button"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
      @keydown.escape="isOpen = false"
    >
      <span class="multi-select__summary">{{ summary }}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" :class="{ 'is-rotated': isOpen }"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <Transition name="motion-popover">
      <div
        v-if="isOpen"
        class="multi-select__popover"
        role="group"
        :aria-label="label"
        @keydown.esc.stop.prevent="closeAndFocus"
      >
        <div class="multi-select__actions">
          <button type="button" @click="selectAll">全选</button>
          <button type="button" @click="clearAll">清除</button>
        </div>
        <div class="multi-select__options">
          <label v-for="opt in options" :key="opt.value" class="multi-select__option">
            <input
              type="checkbox"
              :value="opt.value"
              :checked="modelValue.includes(opt.value)"
              @change="toggle(opt.value)"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue"

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "选择..." }
})

const emit = defineEmits(["update:modelValue"])

const root = ref(null)
const trigger = ref(null)
const isOpen = ref(false)

const summary = computed(() => {
  const selected = props.options.filter(o => props.modelValue.includes(o.value))
  if (selected.length === 0) return props.placeholder
  if (selected.length === props.options.length) return "全部"
  return selected.map(o => o.label).join(", ")
})

function toggle(value) {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter(v => v !== value)
    : [...props.modelValue, value]
  emit("update:modelValue", next)
}

function selectAll() {
  emit("update:modelValue", props.options.map(o => o.value))
}

function clearAll() {
  emit("update:modelValue", [])
}

async function closeAndFocus() {
  isOpen.value = false
  await nextTick()
  trigger.value?.focus()
}

function handleClickOutside(e) {
  if (isOpen.value && root.value && !root.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener("pointerdown", handleClickOutside))
onUnmounted(() => document.removeEventListener("pointerdown", handleClickOutside))
</script>

<style scoped>
.multi-select {
  position: relative;
  width: 100%;
  min-width: 0;
}

.multi-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  min-height: var(--control-height);
  padding: 0.5rem 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  text-align: left;
  cursor: pointer;
}

.multi-select__summary {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multi-select__trigger svg {
  flex: none;
  transition: transform var(--motion-fast) var(--ease-standard);
}

.is-rotated {
  transform: rotate(180deg);
}

.multi-select__popover {
  position: absolute;
  z-index: 80;
  top: calc(100% + 0.35rem);
  right: 0;
  left: 0;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  box-shadow: var(--shadow-md);
}

.multi-select__actions {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.multi-select__actions button {
  min-height: 36px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--accent-strong);
  font-weight: 700;
  cursor: pointer;
}

.multi-select__actions button:hover {
  background: var(--accent-soft);
}

.multi-select__options {
  max-height: min(45dvh, 320px);
  overflow: auto;
  overscroll-behavior: contain;
}

.multi-select__option {
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr);
  gap: 0.65rem;
  align-items: center;
  min-height: 44px;
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid var(--border);
}

.multi-select__option > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multi-select__option:hover {
  background: var(--surface-subtle);
}

.multi-select__option input {
  inline-size: 1.125rem;
  block-size: 1.125rem;
  accent-color: var(--accent);
}
</style>
