export default defineNuxtPlugin(async () => {
  if (!import.meta.dev) return;
  if (typeof window === "undefined") return;
  if ((window as any).__MSW_WORKER_STARTED__) return;

  const config = useRuntimeConfig();
  if (config.public?.mswDisabled) return;

  const { mswWorker } = await import("~/core/hexag/mocks/browser");

  await mswWorker.start({
    onUnhandledRequest: "bypass",
  });

  (window as any).__MSW_WORKER_STARTED__ = true;
});

