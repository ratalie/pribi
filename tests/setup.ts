/**
 * Setup global para tests de Vitest
 * 
 * Configura el entorno de testing y mocks globales necesarios
 * 
 * Soporta DOS modos:
 * 1. MSW (mock) - Tests rápidos sin backend real
 * 2. Backend Real - Tests de integración contra backend real
 * 
 * Controlado por variable de entorno: TEST_USE_MSW=true|false
 */

import { vi } from "vitest";
import { setupServer } from "msw/node";
import { allMockHandlers } from "~/core/hexag/mocks/register-handlers";
import { getTestConfig, getRealBackendToken } from "./config/test-config";

const testConfig = getTestConfig();

// ⭐ MSW Server para interceptar peticiones HTTP en tests (solo si useMsw = true)
export const mswServer = testConfig.useMsw ? setupServer(...allMockHandlers) : null;

// Iniciar MSW antes de todos los tests (solo si está habilitado)
if (mswServer) {
  beforeAll(() => {
    mswServer.listen({ onUnhandledRequest: "bypass" });
    console.log("🧪 [Tests] MSW activado - Usando mocks");
  });

  // Limpiar después de cada test
  afterEach(() => {
    mswServer.resetHandlers();
  });

  // Cerrar después de todos los tests
  afterAll(() => {
    mswServer.close();
  });
} else {
  console.log("🧪 [Tests] MSW desactivado - Usando backend real:", testConfig.backendUrl);
  
  // Si no usamos MSW, necesitamos obtener token real del backend
  let realToken: string | null = null;
  
  beforeAll(async () => {
    try {
      console.log("🔐 [Tests] Obteniendo token del backend real...");
      realToken = await getRealBackendToken(testConfig.backendUrl, testConfig.credentials);
      console.log("✅ [Tests] Token obtenido exitosamente");
    } catch (error: any) {
      console.error("❌ [Tests] Error obteniendo token:", error.message);
      throw new Error(
        `No se pudo obtener token del backend real. ` +
        `Verifica que el backend esté corriendo en ${testConfig.backendUrl} ` +
        `y que las credenciales sean correctas.`
      );
    }
  });
  
  // Exponer token para uso en tests
  (globalThis as any).__TEST_REAL_TOKEN__ = () => realToken;
}

// Mock de Nuxt composables
vi.mock("#app", () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: testConfig.useMsw ? "http://localhost:3000" : testConfig.backendUrl,
      societyProfileEndpoint: "/api/v2/society-profile",
      societyProfileListSuffix: "/list",
      // ⭐ Token mock para tests con MSW, o token real para backend real
      defaultAuthToken: testConfig.useMsw 
        ? "test-token-mock-12345" 
        : (globalThis as any).__TEST_REAL_TOKEN__?.() || null,
    },
  }),
}));

// Mock global de useRuntimeConfig para uso directo (sin import)
(globalThis as any).useRuntimeConfig = () => ({
  public: {
    apiBase: testConfig.useMsw ? "http://localhost:3000" : testConfig.backendUrl,
    societyProfileEndpoint: "/api/v2/society-profile",
    societyProfileListSuffix: "/list",
    defaultAuthToken: testConfig.useMsw 
      ? "test-token-mock-12345" 
      : (globalThis as any).__TEST_REAL_TOKEN__?.() || null,
  },
});

// Mock global de $fetch (ofetch) - será interceptado por MSW si está activo
(globalThis as any).$fetch = async (url: string, options?: any) => {
  // Si MSW está activo, las peticiones serán interceptadas automáticamente
  // Si no, usar fetch real
  
  // Serializar body a JSON si es un objeto y Content-Type es application/json
  let body = options?.body;
  const headers = new Headers(options?.headers || {});
  const requestContentType = headers.get("content-type") || options?.headers?.["Content-Type"] || options?.headers?.["content-type"];
  
  if (body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob)) {
    // Si Content-Type es application/json o no está definido, serializar a JSON
    if (!requestContentType || requestContentType.includes("application/json")) {
      body = JSON.stringify(body);
      headers.set("Content-Type", "application/json");
    }
  }
  
  const fetchFn = typeof fetch !== "undefined" ? fetch : globalThis.fetch;
  const response = await fetchFn(url, {
    ...options,
    method: options?.method || "GET",
    headers: Object.fromEntries(headers.entries()),
    body: body,
  });
  
  if (!response.ok) {
    // Intentar obtener el mensaje de error del backend
    let errorMessage = `HTTP ${response.status}`;
    let errorData: any = null;
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
        errorMessage = errorData?.message || errorData?.error || errorMessage;
        
        // Capturar errores de validación detallados
        if (errorData?.errors) {
          const errorsArray = Array.isArray(errorData.errors) 
            ? errorData.errors 
            : Object.entries(errorData.errors).map(([key, value]) => ({ field: key, message: value }));
          errorMessage += `\nErrores de validación:\n${JSON.stringify(errorsArray, null, 2)}`;
        }
        
        // Capturar mensaje de data si existe
        if (errorData?.data?.message) {
          errorMessage = errorData.data.message;
        }
        
        // Log detallado para debugging
        console.error(`[Tests] Error HTTP ${response.status}:`, {
          message: errorMessage,
          errorData: JSON.stringify(errorData, null, 2),
          url: response.url || url,
        });
      }
    } catch (parseError) {
      // Si no se puede parsear, usar el status text
      errorMessage = response.statusText || errorMessage;
      console.error(`[Tests] Error al parsear respuesta:`, parseError);
    }
    const error: any = new Error(errorMessage);
    error.statusCode = response.status;
    error.response = response;
    error.data = errorData;
    throw error;
  }
  
  // Manejar respuestas vacías (DELETE, etc.)
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }
  
  const text = await response.text();
  if (!text || text.trim().length === 0) {
    return null;
  }
  
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// Mock de Pinia stores (auth store)
vi.mock("~/core/presentation/auth/stores/auth.store", () => {
  // Si usamos backend real, necesitamos obtener el token dinámicamente
  const getToken = () => {
    if (testConfig.useMsw) {
      return "test-token-mock-12345";
    }
    // Para backend real, obtener token del global
    return (globalThis as any).__TEST_REAL_TOKEN__?.() || null;
  };

  return {
    useAuthStore: () => ({
      session: {
        token: getToken(),
        studyName: "Test Study",
        roleName: "Administrador",
        issuedAt: new Date().toISOString(),
      },
      isAuthenticated: true,
      status: "idle",
      errorMessage: null,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

// Mock de window.crypto para generar UUIDs en tests
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = {
    randomUUID: () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
  } as Crypto;
}

// Limpiar mocks entre tests
beforeEach(() => {
  vi.clearAllMocks();
});
