/**
 * Configuración de Tests
 * 
 * Permite alternar entre MSW (mock) y Backend Real
 */

export interface TestConfig {
  /** Usar MSW (mock) o Backend Real */
  useMsw: boolean;
  
  /** URL del backend real (solo si useMsw = false) */
  backendUrl: string;
  
  /** Credenciales para login en backend real */
  credentials: {
    email: string;
    password: string;
  };
}

/**
 * Obtiene la configuración de tests desde variables de entorno
 * 
 * Variables de entorno:
 * - TEST_USE_MSW=true|false (default: true)
 * - TEST_BACKEND_URL=http://localhost:3000 (default: http://localhost:3000)
 * - TEST_EMAIL=usuario101@gmail.com
 * - TEST_PASSWORD=#Admin2025-probo!
 */
export function getTestConfig(): TestConfig {
  const useMsw = process.env.TEST_USE_MSW !== "false"; // default: true
  const backendUrl = process.env.TEST_BACKEND_URL || "http://localhost:3000";
  const email = process.env.TEST_EMAIL || "usuario101@gmail.com";
  const password = process.env.TEST_PASSWORD || "#Admin2025-probo!";

  return {
    useMsw,
    backendUrl,
    credentials: {
      email,
      password,
    },
  };
}

/**
 * Helper para obtener token del backend real
 */
export async function getRealBackendToken(
  backendUrl: string,
  credentials: { email: string; password: string }
): Promise<string> {
  const url = `${backendUrl}/api/v2/auth`;  // ✅ Ruta correcta (sin /login)
  
  console.log("🔐 [Test Config] Intentando login:", {
    url,
    email: credentials.email,
    passwordLength: credentials.password.length,
  });
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  console.log("🔐 [Test Config] Respuesta:", {
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("🔐 [Test Config] Error response:", errorText);
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  console.log("🔐 [Test Config] Data recibida:", {
    success: data.success,
    hasToken: !!data.data?.token,
  });
  
  if (!data.success || !data.data?.token) {
    throw new Error(`Login failed: ${data.message || "No token received"}`);
  }

  return data.data.token;
}

