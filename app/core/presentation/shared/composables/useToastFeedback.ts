import type { ToastOptions } from "@/components/ui/toast/use-toast";
import { useToast } from "@/components/ui/toast/use-toast";

type ToastOrFactory<T> = ToastOptions | null | undefined | ((payload: T) => ToastOptions | null | undefined);

interface AsyncToastMessages<TSuccess = unknown, TError = unknown> {
  loading?: ToastOptions | null;
  success?: ToastOrFactory<TSuccess>;
  error?: ToastOrFactory<TError>;
}

function resolveToast<T>(input: ToastOrFactory<T>, payload: T): ToastOptions | null | undefined {
  if (!input) {
    return null;
  }

  if (typeof input === "function") {
    return input(payload);
  }

  return input;
}

export function useToastFeedback() {
  const { toast, dismiss } = useToast();

  async function withAsyncToast<T>(
    task: () => Promise<T>,
    messages: AsyncToastMessages<T, unknown>
  ): Promise<T> {
    let loadingToastId: string | null = null;

    try {
      if (messages.loading) {
        loadingToastId = toast({
          duration: 0,
          variant: "info",
          ...messages.loading,
        });
      }

      const result = await task();

      if (loadingToastId) {
        dismiss(loadingToastId);
      }

      const successToast = resolveToast(messages.success, result);
      if (successToast) {
        toast({
          variant: "success",
          duration: 4000,
          ...successToast,
        });
      }

      return result;
    } catch (error) {
      if (loadingToastId) {
        dismiss(loadingToastId);
      }

      const errorToast = resolveToast(messages.error, error);
      if (errorToast) {
        toast({
          variant: "destructive",
          duration: 5000,
          ...errorToast,
        });
      }

      throw error;
    }
  }

  return {
    withAsyncToast,
  };
}

