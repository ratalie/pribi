<script setup lang="ts"></script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="h-[104px] border-y">
      <h1 class="text-2xl font-bold">Flow Layout</h1>
    </div>
    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <div class="w-[401px] border-r">
        <p>Progress bar</p>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="flex-1">
          <slot />
        </div>
        <div class="h-[92px] border-t sticky bottom-0 bg-white z-10 shrink-0">
          <div>Footer content</div>
        </div>
      </div>
    </div>
  </div>
</template>
