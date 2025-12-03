# 🎯 PLAN: Playwright E2E Testing para Juntas de Accionistas

**Fecha:** 3 de Diciembre 2025  
**Estado:** 📋 PLANEADO - Para implementar en otro issue  
**Prioridad:** Media (después de correcciones críticas)  
**Tiempo Estimado:** 8-12 horas

---

## 📊 RESUMEN EJECUTIVO

Implementar testing End-to-End con Playwright para garantizar que el flujo completo de Juntas de Accionistas funciona correctamente desde la perspectiva del usuario.

**Objetivo:** Automatizar pruebas de:
1. Crear junta
2. Seleccionar puntos de agenda
3. Configurar detalles de la junta
4. Instalación de la junta
5. Navegación entre pasos
6. Persistencia de datos

---

## 🏗️ ARQUITECTURA DE TESTING

### **Estructura de Archivos Propuesta**

```
tests/
└── e2e/
    ├── juntas/
    │   ├── 01-crear-junta.spec.ts           # Test: Crear junta nueva
    │   ├── 02-seleccion-agenda.spec.ts      # Test: Seleccionar puntos
    │   ├── 03-detalles-junta.spec.ts        # Test: Configurar detalles
    │   ├── 04-instalacion.spec.ts           # Test: Instalación
    │   └── 05-flujo-completo.spec.ts        # Test: Flujo end-to-end
    ├── fixtures/
    │   ├── auth.ts                          # Login automático
    │   └── test-data.ts                     # Datos de prueba
    └── helpers/
        ├── juntas.helpers.ts                # Funciones reutilizables
        └── navigation.helpers.ts            # Navegación entre pasos

playwright.config.ts                          # Configuración Playwright
```

---

## 📋 FASE 1: Setup Inicial (2-3 horas)

### **1.1 Instalación**

```bash
# Instalar Playwright
pnpm add -D @playwright/test

# Instalar browsers
npx playwright install

# Instalar dependencies de sistema (Linux)
npx playwright install-deps
```

### **1.2 Configuración Base**

**Archivo:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  
  // Timeout por test
  timeout: 30 * 1000,
  
  // Expectativas
  expect: {
    timeout: 5000,
  },
  
  // Ejecutar tests en paralelo
  fullyParallel: true,
  
  // Retry en caso de fallo
  retries: process.env.CI ? 2 : 0,
  
  // Workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['list'],
  ],
  
  // Configuración compartida
  use: {
    // Base URL
    baseURL: 'http://localhost:3000',
    
    // Trace en caso de retry
    trace: 'on-first-retry',
    
    // Screenshot en fallo
    screenshot: 'only-on-failure',
    
    // Video en fallo
    video: 'retain-on-failure',
  },
  
  // Proyectos (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  
  // Web Server (opcional - si necesitas levantar el dev server)
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **1.3 Scripts en package.json**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:codegen": "playwright codegen http://localhost:3000"
  }
}
```

---

## 📋 FASE 2: Fixtures y Helpers (2-3 horas)

### **2.1 Auth Fixture**

**Archivo:** `tests/e2e/fixtures/auth.ts`

```typescript
import { Page } from '@playwright/test';

/**
 * Login automático
 * Reutilizable en todos los tests
 */
export async function login(page: Page) {
  // TODO: Ajustar según tu flujo de login real
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Esperar redirección al dashboard
  await page.waitForURL('**/dashboard');
  
  console.log('✅ Login exitoso');
}
```

### **2.2 Helpers de Juntas**

**Archivo:** `tests/e2e/helpers/juntas.helpers.ts`

```typescript
import { Page, expect } from '@playwright/test';

/**
 * Crea una nueva junta y retorna el flowId
 */
export async function crearJunta(
  page: Page,
  societyId: number
): Promise<string> {
  await page.goto(`/operaciones/sociedades/${societyId}/junta-accionistas/crear`);
  await page.click('button:has-text("Crear Nueva Junta")');
  
  // Esperar redirección a selección agenda
  await page.waitForURL(/\/seleccion-agenda$/);
  
  // Extraer flowId de la URL
  const url = page.url();
  const match = url.match(/\/junta-accionistas\/(\d+)\//);
  if (!match) throw new Error('No se pudo extraer flowId');
  
  const flowId = match[1];
  console.log(`✅ Junta creada: flowId=${flowId}`);
  return flowId;
}

/**
 * Selecciona puntos de agenda
 */
export async function seleccionarPuntosAgenda(
  page: Page,
  puntos: string[]
): Promise<void> {
  for (const puntoId of puntos) {
    await page.check(`[data-testid="punto-${puntoId}"]`);
  }
  
  console.log(`✅ ${puntos.length} puntos seleccionados`);
}

/**
 * Configura detalles de la junta
 */
export async function configurarDetalles(
  page: Page,
  config: {
    tipoJunta: 'universal' | 'general';
    modalidad: 'presencial' | 'virtual';
    direccion: string;
    fecha: string;
    hora: string;
  }
): Promise<void> {
  // Seleccionar tipo
  await page.click(`text=${config.tipoJunta === 'universal' ? 'Junta Universal' : 'Junta General'}`);
  
  // Seleccionar modalidad
  await page.click(`text=${config.modalidad === 'presencial' ? 'Presencial' : 'Virtual'}`);
  
  // Llenar formulario
  await page.fill('input[name="direccion"]', config.direccion);
  await page.fill('input[type="date"]', config.fecha);
  await page.fill('input[type="time"]', config.hora);
  
  console.log('✅ Detalles configurados');
}

/**
 * Navega al siguiente paso
 */
export async function clickSiguiente(page: Page): Promise<void> {
  await page.click('button:has-text("Siguiente")');
  
  // Esperar que desaparezca el loading
  await page.waitForLoadState('networkidle');
}
```

### **2.3 Test Data**

**Archivo:** `tests/e2e/fixtures/test-data.ts`

```typescript
export const TEST_SOCIETY_ID = 69; // Sociedad de prueba

export const PUNTOS_AGENDA_TEST = [
  'aporte-dinerarios',
  'remocion-gerente',
  'nombramiento-apoderados',
];

export const DETALLES_JUNTA_TEST = {
  tipoJunta: 'universal' as const,
  modalidad: 'presencial' as const,
  direccion: 'Av. Test 123, Lima',
  fecha: '2025-01-15',
  hora: '14:30',
};
```

---

## 📋 FASE 3: Tests Individuales (3-4 horas)

### **3.1 Test: Crear Junta**

**Archivo:** `tests/e2e/juntas/01-crear-junta.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { TEST_SOCIETY_ID } from '../fixtures/test-data';

test.describe('Crear Junta de Accionistas', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('debe crear una nueva junta y redirigir a selección agenda', async ({ page }) => {
    // Ir a crear junta
    await page.goto(`/operaciones/sociedades/${TEST_SOCIETY_ID}/junta-accionistas/crear`);
    
    // Click en botón crear
    await page.click('button:has-text("Crear Nueva Junta")');
    
    // Verificar redirección
    await expect(page).toHaveURL(/\/seleccion-agenda$/);
    
    // Verificar que se muestra el componente correcto
    await expect(page.locator('h3:has-text("Puntos de Agenda")')).toBeVisible();
  });

  test('debe mostrar error si falla la creación', async ({ page }) => {
    // TODO: Simular error del backend
  });
});
```

### **3.2 Test: Selección de Agenda**

**Archivo:** `tests/e2e/juntas/02-seleccion-agenda.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { crearJunta, seleccionarPuntosAgenda, clickSiguiente } from '../helpers/juntas.helpers';
import { TEST_SOCIETY_ID, PUNTOS_AGENDA_TEST } from '../fixtures/test-data';

test.describe('Selección de Puntos de Agenda', () => {
  let flowId: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    flowId = await crearJunta(page, TEST_SOCIETY_ID);
  });

  test('debe seleccionar puntos de agenda y mostrarlos en preview', async ({ page }) => {
    // Seleccionar 3 puntos
    await page.check('[data-testid="punto-aporte-dinerarios"]');
    await page.check('[data-testid="punto-remocion-gerente"]');
    await page.check('[data-testid="punto-nombramiento-apoderados"]');
    
    // Verificar en preview
    const preview = page.locator('.preview-agenda');
    await expect(preview).toContainText('Aportes dinerarios');
    await expect(preview).toContainText('Remoción de gerente');
    await expect(preview).toContainText('Nombramiento de apoderados');
  });

  test('debe navegar a detalles al hacer click en Siguiente', async ({ page }) => {
    // Seleccionar al menos 1 punto
    await page.check('[data-testid="punto-aporte-dinerarios"]');
    
    // Click siguiente
    await clickSiguiente(page);
    
    // Verificar navegación
    await expect(page).toHaveURL(/\/detalles$/);
  });

  test('debe activar toggle de Junta Obligatoria', async ({ page }) => {
    // Click en toggle
    await page.click('[data-testid="toggle-junta-obligatoria"]');
    
    // Verificar que se seleccionaron los 3 puntos obligatorios
    const preview = page.locator('.preview-agenda');
    await expect(preview).toContainText('Pronunciamiento de la gestión');
    await expect(preview).toContainText('Aplicación de resultados');
    await expect(preview).toContainText('Designación de auditores');
  });
});
```

### **3.3 Test: Detalles de la Junta**

**Archivo:** `tests/e2e/juntas/03-detalles-junta.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { crearJunta, seleccionarPuntosAgenda, clickSiguiente, configurarDetalles } from '../helpers/juntas.helpers';
import { TEST_SOCIETY_ID, PUNTOS_AGENDA_TEST, DETALLES_JUNTA_TEST } from '../fixtures/test-data';

test.describe('Detalles de la Junta', () => {
  let flowId: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    flowId = await crearJunta(page, TEST_SOCIETY_ID);
    await seleccionarPuntosAgenda(page, PUNTOS_AGENDA_TEST);
    await clickSiguiente(page);
  });

  test('debe configurar detalles de Junta Universal', async ({ page }) => {
    // Seleccionar Universal
    await page.click('text=Junta Universal');
    
    // Configurar datos
    await configurarDetalles(page, DETALLES_JUNTA_TEST);
    
    // Guardar
    await clickSiguiente(page);
    
    // Verificar toast de éxito
    await expect(page.locator('.toast-success')).toContainText('guardados correctamente');
  });

  test('debe configurar detalles de Junta General', async ({ page }) => {
    // Seleccionar General
    await page.click('text=Junta General');
    
    // Debe mostrar 2 cards de convocatoria
    await expect(page.locator('text=Primera Convocatoria')).toBeVisible();
    await expect(page.locator('text=Segunda Convocatoria')).toBeVisible();
  });

  test('debe validar plazos entre convocatorias', async ({ page }) => {
    // TODO: Implementar cuando se agreguen validaciones
  });
});
```

### **3.4 Test: Flujo Completo**

**Archivo:** `tests/e2e/juntas/05-flujo-completo.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { crearJunta, seleccionarPuntosAgenda, clickSiguiente, configurarDetalles } from '../helpers/juntas.helpers';
import { TEST_SOCIETY_ID, PUNTOS_AGENDA_TEST, DETALLES_JUNTA_TEST } from '../fixtures/test-data';

test.describe('Flujo Completo: Crear Junta de Accionistas', () => {
  test('debe completar el flujo desde crear hasta instalación', async ({ page }) => {
    // 1. Login
    await login(page);
    
    // 2. Crear junta
    const flowId = await crearJunta(page, TEST_SOCIETY_ID);
    expect(flowId).toBeTruthy();
    
    // 3. Seleccionar puntos de agenda
    await seleccionarPuntosAgenda(page, PUNTOS_AGENDA_TEST);
    await clickSiguiente(page);
    
    // 4. Configurar detalles
    await configurarDetalles(page, DETALLES_JUNTA_TEST);
    await clickSiguiente(page);
    
    // 5. Verificar llegada a instalación
    await expect(page).toHaveURL(/\/instalacion$/);
    await expect(page.locator('h4:has-text("Detalles de la celebración")')).toBeVisible();
  });

  test('debe persistir datos al navegar entre pasos', async ({ page }) => {
    await login(page);
    const flowId = await crearJunta(page, TEST_SOCIETY_ID);
    
    // Seleccionar puntos
    await page.check('[data-testid="punto-aporte-dinerarios"]');
    await clickSiguiente(page);
    
    // Ir a detalles y volver
    await page.goBack();
    
    // Verificar que el punto sigue seleccionado
    await expect(page.locator('[data-testid="punto-aporte-dinerarios"]')).toBeChecked();
  });
});
```

---

## 📋 FASE 4: CI/CD Integration (1-2 horas)

### **4.1 GitHub Actions**

**Archivo:** `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: pnpm test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Setup**
- [ ] Instalar Playwright y browsers
- [ ] Crear `playwright.config.ts`
- [ ] Agregar scripts a `package.json`
- [ ] Configurar `.gitignore` para reports

### **Fixtures y Helpers**
- [ ] Crear `auth.ts` (login automático)
- [ ] Crear `juntas.helpers.ts` (funciones reutilizables)
- [ ] Crear `test-data.ts` (datos de prueba)

### **Tests Individuales**
- [ ] Test: Crear junta
- [ ] Test: Selección de agenda
- [ ] Test: Detalles de la junta
- [ ] Test: Instalación
- [ ] Test: Flujo completo

### **CI/CD**
- [ ] Configurar GitHub Actions
- [ ] Verificar que tests corren en CI

### **Documentación**
- [ ] Documentar cómo ejecutar tests localmente
- [ ] Documentar cómo debugear tests
- [ ] Documentar cómo agregar nuevos tests

---

## 📚 RECURSOS Y COMANDOS ÚTILES

### **Comandos Básicos**

```bash
# Ejecutar todos los tests
pnpm test:e2e

# Ejecutar en modo UI (interfaz visual)
pnpm test:e2e:ui

# Ejecutar con browser visible
pnpm test:e2e:headed

# Debugear un test específico
pnpm test:e2e:debug tests/e2e/juntas/01-crear-junta.spec.ts

# Ver reporte HTML
pnpm test:e2e:report

# Generar código automáticamente (record & play)
pnpm test:e2e:codegen
```

### **Debugging**

```bash
# Pausar en un punto específico
await page.pause();

# Ver trace
npx playwright show-trace trace.zip

# Screenshots
await page.screenshot({ path: 'screenshot.png' });
```

### **Selectores Útiles**

```typescript
// Por texto
page.click('text=Siguiente');
page.click('button:has-text("Crear")');

// Por data-testid
page.check('[data-testid="punto-aporte-dinerarios"]');

// Por rol
page.click('role=button[name="Siguiente"]');

// Combinaciones
page.locator('form >> input[type="email"]');
```

---

## 🎯 PRÓXIMOS PASOS

1. **Implementar este plan** en un nuevo issue/branch
2. **Ejecutar tests localmente** para validar
3. **Integrar con CI** para ejecución automática
4. **Agregar más tests** según necesidad:
   - Tests de errores
   - Tests de validaciones
   - Tests de edge cases
5. **Mantener tests actualizados** con cambios en la UI

---

## 📊 MÉTRICAS DE ÉXITO

- ✅ **Cobertura:** Al menos 80% de flujos críticos cubiertos
- ✅ **Velocidad:** Tests completos en < 5 minutos
- ✅ **Confiabilidad:** 0% flaky tests (tests intermitentes)
- ✅ **Mantenibilidad:** Helpers reutilizables y documentados

---

**Estado:** 📋 PLANEADO - Listo para implementar cuando decidas  
**Prioridad:** Media (después de correcciones críticas)  
**Tiempo Estimado Total:** 8-12 horas

---

**¡Plan completo y listo para ejecutar! 🚀**

