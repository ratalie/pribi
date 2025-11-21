export default defineNuxtPlugin(async () => {
  if (!import.meta.dev) return;
  if (typeof window === "undefined") return;

  const config = useRuntimeConfig();
  const isMswDisabled = config.public?.mswDisabled;

  console.log("mswDisabled", isMswDisabled);

  // CASO 1: MSW está deshabilitado Y ya estaba iniciado → DETENERLO
  if (isMswDisabled && (window as any).__MSW_WORKER_STARTED__) {
    const { mswWorker } = await import("~/core/hexag/mocks/browser");
    try {
      await mswWorker.stop();
      console.log("[MSW] Service Worker detenido");
    } catch (error) {
      console.error("[MSW] Error al detener el Service Worker:", error);
    }
    (window as any).__MSW_WORKER_STARTED__ = false;
    return;
  }

  // CASO 2: MSW está deshabilitado Y NO está iniciado → NO HACER NADA
  if (isMswDisabled) return;

  // CASO 3: MSW NO está deshabilitado PERO ya está iniciado → NO HACER NADA
  if ((window as any).__MSW_WORKER_STARTED__) return;

  // CASO 4: MSW NO está deshabilitado Y NO está iniciado → INICIARLO
  const { mswWorker } = await import("~/core/hexag/mocks/browser");

  await mswWorker.start({
    onUnhandledRequest: "bypass",
  });

  (window as any).__MSW_WORKER_STARTED__ = true;
  console.log("[MSW] Service Worker iniciado");
});
