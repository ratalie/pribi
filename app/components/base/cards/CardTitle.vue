<template>
  <div class="flex w-full" :class="$slots.actions ? 'justify-between items-start' : ''">
    <div class="flex gap-4 items-center">
      <slot name="preActions" />
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <p
            :class="
              $slots.preActions
                ? 't-h6 text-gray-800 font-semibold font-primary'
                : 't-h4 text-gray-800 font-semibold font-primary'
            "
          >
            {{ title }}
          </p>
          <slot name="switch" />
        </div>
        <p v-if="body" class="t-t1 font-secondary text-gray-600 font-medium">
          {{ body }}
        </p>
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: { type: String, default: "Title" },
    body: { type: String, default: "Body" },
  });
</script>
