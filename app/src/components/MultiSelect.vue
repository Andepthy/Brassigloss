<template>
  <div ref="root" class="multi-select">
    <span :id="labelId" class="sr-only">{{ label }}</span>
    <span :id="descriptionId" class="sr-only">
      {{ selectedOptions.length ? selectedOptions.map(optionSummary).join("，") : placeholder }}
    </span>

    <button
      ref="trigger"
      class="multi-select__trigger"
      type="button"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? popupId : undefined"
      :aria-labelledby="labelId"
      :aria-describedby="descriptionId"
      @click="isOpen = !isOpen"
      @keydown.escape.stop.prevent="closeAndFocus"
    >
      <span class="multi-select__summary">
        <template v-if="selectedOptions.length">
          <span
            v-for="option in selectedOptions"
            :key="option.value"
            class="multi-select__chip"
            :lang="summaryMode === 'labels' ? option.htmlLang : undefined"
          >
            {{ optionSummary(option) }}
          </span>
        </template>
        <span v-else class="multi-select__placeholder">{{ placeholder }}</span>
      </span>

      <svg
        class="multi-select__chevron"
        :class="{ 'is-rotated': isOpen }"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path fill="currentColor" d="m12 15.375l-6-6l1.4-1.4l4.6 4.6l4.6-4.6l1.4 1.4z"/>
      </svg>
    </button>

    <Transition name="motion-popover">
      <fieldset
        v-if="isOpen"
        :id="popupId"
        class="multi-select__popover"
        @keydown.esc.stop.prevent="closeAndFocus"
      >
        <legend class="sr-only">{{ label }}</legend>

        <div class="multi-select__actions">
          <button class="multi-select__select-all" type="button" @click="selectAll">
            全选
          </button>
          <button class="multi-select__clear" type="button" @click="clearAll">
            清除
          </button>
        </div>

        <div class="multi-select__options">
          <label
            v-for="option in options"
            :key="option.value"
            class="multi-select__option"
            :class="{ 'multi-select__option--with-value': showOptionValues }"
          >
            <input
              type="checkbox"
              :value="option.value"
              :checked="modelValue.includes(option.value)"
              @change="toggle(option.value)"
            />
            <span
              class="multi-select__option-label"
              :lang="option.htmlLang || undefined"
            >
              {{ option.label }}
            </span>
            <code v-if="showOptionValues" class="multi-select__option-value">
              {{ option.value }}
            </code>
          </label>
        </div>
      </fieldset>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, useId } from "vue"

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "选择..." },
  summaryMode: {
    type: String,
    default: "labels",
    validator: (value) => ["codes", "labels"].includes(value),
  },
  showOptionValues: { type: Boolean, default: false },
})

const emit = defineEmits(["update:modelValue"])

const root = ref(null)
const trigger = ref(null)
const isOpen = ref(false)
const instanceId = useId()
const popupId = `multi-select-${instanceId}`
const labelId = `multi-select-label-${instanceId}`
const descriptionId = `multi-select-description-${instanceId}`

const selectedOptions = computed(() =>
  props.options.filter((option) => props.modelValue.includes(option.value)),
)

function optionSummary(option) {
  return props.summaryMode === "codes" ? option.value : option.label
}

function toggle(value) {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((item) => item !== value)
    : [...props.modelValue, value]
  emit("update:modelValue", next)
}

function selectAll() {
  emit("update:modelValue", props.options.map((option) => option.value))
}

function clearAll() {
  emit("update:modelValue", [])
}

async function closeAndFocus() {
  isOpen.value = false
  await nextTick()
  trigger.value?.focus()
}

function handleClickOutside(event) {
  if (isOpen.value && root.value && !root.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener("pointerdown", handleClickOutside))
onUnmounted(() => document.removeEventListener("pointerdown", handleClickOutside))
</script>

<style scoped>
.multi-select {
  position: relative;
  z-index: 20;
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
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.multi-select__summary {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 0.25rem;
  min-width: 0;
}

.multi-select__chip {
  max-width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 0.8rem;
  line-height: 1;
  padding: 0.25rem 0.375rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multi-select__placeholder {
  overflow: hidden;
  color: var(--muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multi-select__chevron {
  flex: none;
  transition: transform var(--motion-fast) var(--ease-standard);
}

.is-rotated {
  transform: rotate(180deg);
}

.multi-select__popover {
  position: absolute;
  z-index: 100;
  top: calc(100% + 0.35rem);
  right: 0;
  left: 0;
  min-width: 0;
  margin: 0;
  padding: 0;
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
  padding: 0 0.75rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  transition:
    background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    color var(--motion-fast) var(--ease-standard);
}

.multi-select__select-all {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--on-accent);
  box-shadow: var(--shadow-sm);
}

.multi-select__select-all:hover {
  border-color: var(--accent-strong);
  background: var(--accent-strong);
}

.multi-select__clear {
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text-secondary);
}

.multi-select__clear:hover {
  background: var(--surface-subtle);
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

.multi-select__option--with-value {
  grid-template-columns: 1.25rem minmax(0, 1fr) auto;
}

.multi-select__option-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multi-select__option-value {
  color: var(--muted);
  font: 0.75rem var(--monospace-font);
}

.multi-select__option:hover {
  background: var(--surface-subtle);
}

.multi-select__option input {
  inline-size: 1.125rem;
  block-size: 1.125rem;
  accent-color: var(--accent);
}

.motion-popover-enter-active {
  transition: transform 170ms cubic-bezier(0, 0, 0.2, 1);
}

.motion-popover-leave-active {
  pointer-events: none;
  transition: transform 110ms cubic-bezier(0.4, 0, 1, 1);
}

.motion-popover-enter-from,
.motion-popover-leave-to {
  transform: translateY(-4px) scale(0.985);
}

@media (max-width: 800px) {
  .multi-select__popover {
    position: fixed;
    z-index: 110;
    top: auto;
    right: var(--space-4);
    bottom: calc(var(--space-4) + var(--safe-bottom));
    left: var(--space-4);
    width: auto;
    max-width: none;
  }

  .multi-select__options {
    max-height: min(48dvh, 360px);
  }
}
</style>
