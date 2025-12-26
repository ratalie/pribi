/**
 * Plugin de servidor para suprimir errores "Premature close" en desarrollo
 *
 * Estos errores son esperados cuando:
 * - El cliente cancela peticiones (navegación rápida)
 * - HMR (Hot Module Replacement) cierra conexiones
 * - El navegador cancela peticiones automáticamente
 *
 * No afectan la funcionalidad de la aplicación, solo generan ruido en los logs.
 */
export default defineNitroPlugin((nitroApp) => {
  // Solo en desarrollo
  if (!import.meta.dev) return;

  // Interceptar el proceso de logging de errores
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Lista de errores esperados que podemos ignorar
  const expectedErrorPatterns = [
    /Premature close/i,
    /Cannot pipe to a closed or destroyed stream/i,
    /aborted/i,
    /end-of-stream/i,
    /ECONNRESET/i,
    /EPIPE/i,
    /Fetch handler error.*Premature close/i,
  ];

  // Función para verificar si un error es esperado
  const isExpectedError = (message: string): boolean => {
    return expectedErrorPatterns.some((pattern) => pattern.test(message));
  };

  // Interceptar console.error
  console.error = (...args: any[]) => {
    const message = args.map((arg) => (typeof arg === "string" ? arg : String(arg))).join(" ");

    if (isExpectedError(message)) {
      // Silenciar el error - es esperado y no afecta la funcionalidad
      return;
    }

    // Para otros errores, usar el console.error original
    originalConsoleError.apply(console, args);
  };

  // Interceptar console.warn (por si acaso)
  console.warn = (...args: any[]) => {
    const message = args.map((arg) => (typeof arg === "string" ? arg : String(arg))).join(" ");

    if (isExpectedError(message)) {
      // Silenciar el warning
      return;
    }

    // Para otros warnings, usar el console.warn original
    originalConsoleWarn.apply(console, args);
  };

  // Interceptar errores de fetch handler mediante hooks
  nitroApp.hooks.hook("error", (error, { event }) => {
    const errorMessage = error?.message || String(error);
    const errorStack = error?.stack || "";

    if (isExpectedError(errorMessage) || isExpectedError(errorStack)) {
      // Silenciar el error
      return;
    }
  });

  // Limpiar al desmontar (aunque en desarrollo esto rara vez ocurre)
  nitroApp.hooks.hook("close", () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });
});








