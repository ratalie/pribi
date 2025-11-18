<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";
import { useToast } from "./use-toast";

const props = withDefaults(
  defineProps<{
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  }>(),
  {
    position: "top-right",
  }
);

const { toasts, dismiss } = useToast();

const containerClass = computed(() => {
  switch (props.position) {
    case "top-left":
      return "top-4 left-4 items-start";
    case "bottom-right":
      return "bottom-4 right-4 items-end";
    case "bottom-left":
      return "bottom-4 left-4 items-start";
    default:
      return "top-4 right-4 items-end";
  }
});

const variantClass = (variant: string) => {
  switch (variant) {
    case "success":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";
    case "warning":
      return "border-amber-400/40 bg-amber-500/10 text-amber-50";
    case "destructive":
      return "border-red-500/40 bg-red-600/10 text-red-100";
    case "info":
      return "border-sky-400/40 bg-sky-500/10 text-sky-50";
    default:
      return "border-slate-400/40 bg-slate-900/90 text-slate-100";
  }
};
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed z-[9999] flex max-w-full flex-col gap-3 p-4"
      :class="containerClass"
    >
      <TransitionGroup name="toast">
        <article
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto w-80 max-w-sm overflow-hidden rounded-xl border shadow-2xl backdrop-blur transition',
            variantClass(toast.variant),
          ]"
        >
          <div class="flex items-start gap-4 p-4">
            <div class="flex-1">
              <h3 class="text-sm font-semibold leading-tight">{{ toast.title }}</h3>
              <p v-if="toast.description" class="mt-1 text-sm leading-snug text-white/80">
                {{ toast.description }}
              </p>
            </div>
            <button
              v-if="toast.dismissible"
              type="button"
              class="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
              @click="dismiss(toast.id)"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
          <div
            v-if="toast.actionLabel && toast.onAction"
            class="flex items-center justify-end border-t border-white/10 bg-black/10 px-4 py-2"
          >
            <button
              type="button"
              class="text-sm font-medium text-white transition hover:text-white/80"
              @click="
                () => {
                  toast.onAction?.();
                  dismiss(toast.id);
                }
              "
            >
              {{ toast.actionLabel }}
            </button>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.18s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.toast-move {
  transition: transform 0.16s ease;
}
</style>

