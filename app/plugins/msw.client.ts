export default defineNuxtPlugin(async () => {
  if (!import.meta.dev) return;
  if (typeof window === "undefined") return;
  if ((window as any).__MSW_REGISTROS_STARTED__) return;

  const { registrosWorker } = await import(
    "~/core/hexag/registros/sociedades/infrastructure/mocks/browser"
  );

  await registrosWorker.start({
    onUnhandledRequest: "bypass",
  });

  (window as any).__MSW_REGISTROS_STARTED__ = true;
});

