<script setup lang="ts">
type Status =
  | "completed"
  | "current"
  | "empty"
  | "locked"
  | "error"
  | "optional"
  | "in-progress";

interface Props {
  status?: Status;
  isFinalItem?: boolean;
  showLine?: boolean;
  size?: "large" | "small";
  level?: number;
  connectorGap?: number;
}

const props = withDefaults(defineProps<Props>(), {
  status: "empty",
  isFinalItem: false,
  showLine: true,
  size: "large",
  level: 0,
  connectorGap: 0,
});

const iconSize = computed(() => {
  if (props.size === "small") return "small";

  if (props.level !== undefined) {
    if (props.level <= 1) return "large";
    return "small";
  }

  return "large";
});

const circleClasses = computed(() => (iconSize.value === "large" ? "w-6 h-6" : "w-5 h-5"));
const dotClasses = computed(() => (iconSize.value === "large" ? "w-2 h-2" : "w-1.5 h-1.5"));
const iconWidth = computed(() => (iconSize.value === "large" ? "20" : "16"));
const iconHeight = computed(() => (iconSize.value === "large" ? "20" : "16"));

const connectorGapValue = computed(() => Math.max(props.connectorGap ?? 0, 0));
const connectorColor = computed(() => {
  switch (props.status) {
    case "completed":
    case "current":
    case "in-progress":
      return "var(--sidebar-primary)";
    case "optional":
      return "var(--sidebar-optional)";
    case "error":
      return "var(--sidebar-error)";
    default:
      return "var(--sidebar-border)";
  }
});
</script>

<template>
  <div class="relative flex flex-col items-center">
    <div
      v-if="status === 'completed'"
      :class="[circleClasses, 'flex items-center justify-center rounded-full border-2']"
      style="background-color: var(--sidebar-completed); border-color: var(--sidebar-completed);"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-white"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div
      v-else-if="status === 'current' || status === 'in-progress'"
      :class="[circleClasses, 'flex items-center justify-center rounded-full border-2 bg-white']"
      style="border-color: var(--sidebar-current)"
    >
      <span :class="[dotClasses, 'rounded-full']" style="background-color: var(--sidebar-current)" />
    </div>

    <div
      v-else-if="status === 'locked'"
      :class="[circleClasses, 'flex items-center justify-center rounded-full border-2 bg-white']"
      style="border-color: var(--sidebar-locked)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-gray-400"
        :width="iconSize === 'large' ? '16' : '14'"
        :height="iconSize === 'large' ? '16' : '14'"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          d="M10 2a5 5 0 0 0-5 5v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H7V7a3 3 0 0 1 5.905-.75a1 1 0 0 0 1.937-.5A5.002 5.002 0 0 0 10 2"
        />
      </svg>
    </div>

    <div
      v-else-if="status === 'optional'"
      :class="[circleClasses, 'flex items-center justify-center rounded-full border-2 bg-white']"
      style="border-color: var(--sidebar-optional); border-style: dashed;"
    />

    <div
      v-else-if="status === 'error'"
      :class="[circleClasses, 'flex items-center justify-center rounded-full border-2']"
      style="background-color: var(--sidebar-error); border-color: var(--sidebar-error);"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-white"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10L4.293 5.707a1 1 0 0 1 0-1.414"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div
      v-else
      :class="[circleClasses, 'flex items-center justify-center rounded-full border-2 bg-white']"
      style="border-color: var(--sidebar-empty)"
    />

    <div
      v-if="!isFinalItem && showLine"
      class="absolute left-1/2 w-[2px] -translate-x-1/2 transition-colors duration-300"
      :style="{
        backgroundColor: connectorColor,
        height: connectorGapValue > 0 ? `${connectorGapValue}px` : '32px',
        top: iconSize === 'large' ? '30px' : '26px',
      }"
      :data-connector-gap="connectorGapValue"
      :data-level="level"
    />
  </div>
</template>
