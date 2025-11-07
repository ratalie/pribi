<script setup lang="ts">
  
</script>

<template>
  <div
    class="h-full border border-gray-100 rounded-xl flex flex-col"
  >
  <div :class="$slots.content ? 'border-b border-b-gray-100 py-12 px-10' : 'py-12 px-10'">
    <slot name="title"/>
  </div>
  <div v-if="$slots.content" :class="$slots.content ? 'py-12 px-10' : 'p-0'">
    <slot name="content"/>
  </div>
</div>
</template>
