import { computed } from "vue";
import { useState } from "#app";

export type ToastVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
}

interface ToastInternal extends Required<Pick<ToastOptions, "title">> {
  id: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  actionLabel?: string;
  onAction?: () => void;
  dismissible: boolean;
}

type TimerRegistry = Record<string, ReturnType<typeof setTimeout>>;

const TOASTS_STATE_KEY = "ui:toasts-state";
const TOAST_TIMERS_KEY = "ui:toasts-timers";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function useToast() {
  const toasts = useState<ToastInternal[]>(TOASTS_STATE_KEY, () => []);
  const timers = useState<TimerRegistry>(TOAST_TIMERS_KEY, () => ({}));

  const scheduleDismiss = (toast: ToastInternal) => {
    if (toast.duration <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      dismiss(toast.id);
    }, toast.duration);

    timers.value[toast.id] = timer;
  };

  const toast = (options: ToastOptions): string => {
    const id = options.id ?? createId();
    const nextToast: ToastInternal = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? "default",
      duration: options.duration ?? 4000,
      actionLabel: options.actionLabel,
      onAction: options.onAction,
      dismissible: options.dismissible ?? true,
    };

    // Replace toast if exists
    toasts.value = [...toasts.value.filter((t) => t.id !== id), nextToast];
    scheduleDismiss(nextToast);

    return id;
  };

  const dismiss = (id: string) => {
    const currentTimer = timers.value[id];
    if (currentTimer) {
      clearTimeout(currentTimer);
    }
    const { [id]: _removed, ...restTimers } = timers.value;
    timers.value = restTimers;
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const clear = () => {
    Object.values(timers.value).forEach((timer) => clearTimeout(timer));
    timers.value = {};
    toasts.value = [];
  };

  return {
    toasts: computed(() => toasts.value),
    toast,
    dismiss,
    clear,
  };
}

