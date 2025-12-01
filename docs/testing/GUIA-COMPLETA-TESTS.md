# 🧪 Guía Completa: Sistema de Tests

## 📋 Índice

1. [Estado Actual](#estado-actual)
2. [Flujo Completo: Crear Sociedad](#flujo-completo-crear-sociedad)
3. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
4. [Cómo Ejecutar Tests](#cómo-ejecutar-tests)
5. [Autenticación en Tests](#autenticación-en-tests)
6. [Sistema de Logs](#sistema-de-logs)
7. [Patrón de Tests Compartidos](#patrón-de-tests-compartidos)
8. [Seed de Sociedades y MSW](#seed-de-sociedades-y-msw)
9. [Plan de Implementación: Seed MSW](#plan-de-implementación-seed-msw)

---

## ✅ Estado Actual

### Implementado

1. **Tests de Integración con Backend Real**

   - ✅ POST /api/v2/society-profile (crear)
   - ✅ GET /api/v2/society-profile/list (listar)
   - ✅ DELETE /api/v2/society-profile/:id (eliminar)
   - ✅ 6 tests pasando correctamente

2. **Sistema de Logs Automático**

   - ✅ TestLogger captura todos los eventos
   - ✅ Genera resumen en JSON y Markdown
   - ✅ Guarda en `logs/tests/` (en .gitignore)

3. **Limpieza Automática**

   - ✅ Todas las sociedades creadas se eliminan automáticamente
   - ✅ Resumen indica si alguna no se pudo eliminar

4. **Documentación Consolidada**
   - ✅ Esta guía completa consolidada
   - ✅ Plan para seed MSW incluido

---

## 🔄 Flujo Completo: Crear Sociedad

### Ruta Inicial

**URL**: `http://localhost:3001/registros/sociedades/agregar`  
**Archivo**: `app/pages/registros/sociedades/agregar.vue`

### Flujo Paso a Paso

```
Usuario
  ↓
/registros/sociedades/agregar
  ↓
Click "Comenzar formulario guiado"
  ↓
historialStore.crearSociedad()
  ↓
CreateSociedadUseCase.execute()
  ↓
SociedadHttpRepository.create()
  ↓
POST http://localhost:3000/api/v2/society-profile
  ↓
Backend crea sociedad en DB
  ↓
Retorna { data: { structureId: 123 } }
  ↓
Redirige a /registros/sociedades/123/datos-sociedad
```

### Código Clave

**Página**: `app/pages/registros/sociedades/agregar.vue`

```typescript
const handleStartFlow = async () => {
  const id = await historialStore.crearSociedad();
  await router.push(`/registros/sociedades/${id}/datos-sociedad`);
};
```

**Store**: `app/core/presentation/registros/sociedades/stores/sociedad-historial.store.ts`

```typescript
async function crearSociedad(): Promise<string | null> {
  const id = await createUseCase.execute();
  await cargarHistorial();
  return id;
}
```

**Repositorio**: `app/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository.ts`

```typescript
async create(): Promise<string> {
  const response = await $fetch(this.resolveUrl(), {
    method: "POST",
    headers: withAuthHeaders()
  });
  return String(response.data.structureId);
}
```

---

## 🔧 Configuración de Variables de Entorno

### Variables de Nuxt (Desarrollo)

**Archivo**: `.env`

```bash
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v2
MSW_DISABLED=false                    # false = MSW activado (desarrollo)
MSW_ROLES_PERMISOS_DISABLED=false
```

### Variables de Tests

**Archivo**: `.env.test` (o variables inline)

```bash
# Modo de tests
TEST_USE_MSW=true                     # true = MSW (mock), false = Backend Real

# Backend Real (solo si TEST_USE_MSW=false)
TEST_BACKEND_URL=http://localhost:3000
TEST_EMAIL=usuario101@gmail.com
TEST_PASSWORD=#Admin2025-probo!
```

### Cómo Alternar

| Escenario                  | `.env`               | `.env.test`          | Comando                           |
| -------------------------- | -------------------- | -------------------- | --------------------------------- |
| **Todo MSW**               | `MSW_DISABLED=false` | `TEST_USE_MSW=true`  | `npm run test`                    |
| **Todo Backend Real**      | `MSW_DISABLED=true`  | `TEST_USE_MSW=false` | `TEST_USE_MSW=false npm run test` |
| **App MSW, Tests Backend** | `MSW_DISABLED=false` | `TEST_USE_MSW=false` | `TEST_USE_MSW=false npm run test` |

---

## 🚀 Cómo Ejecutar Tests

### Tests con MSW (Rápido, sin Backend)

```bash
# Opción 1: Por defecto
npm run test sociedad.repository.shared.test.ts

# Opción 2: Explícitamente
TEST_USE_MSW=true npm run test sociedad.repository.shared.test.ts
```

**Características**:

- ✅ Rápido (no necesita backend)
- ✅ No necesita credenciales reales
- ✅ Tests aislados
- ✅ Útil para desarrollo

### Tests con Backend Real (Validación Completa)

```bash
TEST_USE_MSW=false \
TEST_BACKEND_URL=http://localhost:3000 \
TEST_EMAIL=usuario101@gmail.com \
TEST_PASSWORD='#Admin2025-probo!' \
npm run test sociedad.repository.integration.test.ts -- --run
```

**Características**:

- ✅ Valida endpoints reales
- ✅ Tests de integración completos
- ✅ Requiere backend corriendo
- ✅ Requiere credenciales válidas
- ✅ **SÍ crea sociedades en la DB real**
- ✅ **Intenta eliminar todas las sociedades al finalizar**

### Comandos Disponibles

```bash
# Ejecutar todos los tests en modo watch
npm run test

# Ejecutar todos los tests una vez
npm run test:run

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar un archivo específico
npm run test sociedad.repository.shared.test.ts
```

---

## 🔐 Autenticación en Tests

### Con MSW (TEST_USE_MSW=true)

```
1. Test inicia
2. Mock del auth store devuelve token mock: "test-token-mock-12345"
3. MSW intercepta TODAS las peticiones HTTP
4. MSW ejecuta handlers mock
5. MSW devuelve respuestas mock
6. Test valida resultados
```

**No necesita**:

- ❌ Backend corriendo
- ❌ Credenciales reales
- ❌ Token válido del backend
- ❌ Base de datos

### Con Backend Real (TEST_USE_MSW=false)

```
1. Test inicia
2. beforeAll() hace login REAL al backend
3. Obtiene token REAL del backend
4. Token se guarda en mock del auth store
5. Tests hacen peticiones HTTP REALES
6. Backend valida token y devuelve respuestas REALES
7. Test valida resultados
```

**Necesita**:

- ✅ Backend corriendo en `TEST_BACKEND_URL`
- ✅ Credenciales válidas en `.env.test`
- ✅ Base de datos accesible

### Configuración en `tests/setup.ts`

```typescript
// Mock del auth store
vi.mock("~/core/presentation/auth/stores/auth.store", () => ({
  useAuthStore: () => ({
    session: {
      token: testConfig.useMsw
        ? "test-token-mock-12345" // MSW: token mock
        : realToken, // Backend Real: token real
    },
  }),
}));
```

---

## 📊 Sistema de Logs

### Resumen Automático

Después de ejecutar tests de integración, se genera un resumen en `logs/tests/`:

**Archivos generados**:

- `sociedad-integration-YYYY-MM-DD-HH-MM-SS.json` - Datos estructurados
- `sociedad-integration-YYYY-MM-DD-HH-MM-SS.md` - Resumen legible

### Contenido del Resumen

**JSON**:

```json
{
  "testSuite": "SociedadHttpRepository - Backend Real",
  "timestamp": "2025-01-XX...",
  "duration": "2.5s",
  "config": {
    "backendUrl": "http://localhost:3000",
    "useMsw": false,
    "email": "usuario101@gmail.com"
  },
  "results": {
    "total": 6,
    "passed": 6,
    "failed": 0
  },
  "societies": {
    "created": ["123", "124", "125"],
    "deleted": ["123", "124", "125"],
    "failedToDelete": []
  },
  "events": [...],
  "errors": []
}
```

**Markdown**: Resumen legible con:

- Sociedades creadas
- Sociedades eliminadas
- Errores encontrados
- Estado final

### Cómo Leer los Logs

```bash
# Ver el último log
cat logs/tests/sociedad-integration-*.md | tail -20

# Buscar sociedades no eliminadas
grep -A 5 "failedToDelete" logs/tests/sociedad-integration-*.json

# Ver todos los eventos
cat logs/tests/sociedad-integration-*.json | jq '.events'
```

---

## 🧪 Patrón de Tests Compartidos

### Objetivo

Garantizar que **ambos repositorios** (HTTP y MSW) implementan el mismo contrato y producen los mismos resultados.

### Estructura

```
app/core/hexag/registros/sociedades/
└── infrastructure/
    └── repositories/
        ├── sociedad.http.repository.ts      # Repositorio HTTP
        ├── sociedad.msw.repository.ts       # Repositorio MSW
        └── __tests__/
            ├── sociedad.repository.shared.test.ts      # Tests compartidos
            └── sociedad.repository.integration.test.ts # Tests de integración
```

### Ejemplo: Tests Compartidos

```typescript
describe.each([
  { name: "SociedadHttpRepository", factory: () => new SociedadHttpRepository() },
  { name: "SociedadMswRepository", factory: () => new SociedadMswRepository() },
])("$name - Tests Compartidos", ({ factory }) => {
  let repository: SociedadRepository;

  beforeEach(async () => {
    repository = factory();
    await clearAllMockData();
  });

  it("debe crear una sociedad", async () => {
    const structureId = await repository.create();
    expect(structureId).toBeDefined();
  });
});
```

**Ventajas**:

- ✅ Sin duplicación: Un solo archivo de tests para ambos repositorios
- ✅ Garantía de consistencia: Si un test falla en uno, falla en ambos
- ✅ Fácil mantenimiento: Cambios en tests se aplican a ambos

---

## 🌱 Seed de Sociedades y MSW

### Cómo Funciona el Seed

**Ubicación**: `app/pages/dev/seeds-sociedades.vue`

El seed crea sociedades completas con estos pasos:

1. **Paso 0**: Crear sociedad (root) - `POST /api/v2/society-profile`
2. **Paso 1**: Datos principales - `PUT /api/v2/society-profile/:id/society`
3. **Paso 2**: Accionistas (2 naturales) - `POST /api/v2/society-profile/:id/shareholder`
4. **Paso 3**: Acciones (500 comunes) - `POST /api/v2/society-profile/:id/action`
5. **Paso 4**: Asignación de acciones - `POST /api/v2/society-profile/:id/share-assignment`
6. **Paso 5**: Quórums y mayorías - `PUT /api/v2/society-profile/:id/quorum`
7. **Paso 6**: Directores - `POST /api/v2/society-profile/:id/director`
8. **Paso 7**: Directorio - `PUT /api/v2/society-profile/:id/directory`
9. **Paso 8**: Clase de apoderado - `POST /api/v2/society-profile/:id/attorney-class`
10. **Paso 9**: Apoderado (Gerente) - `POST /api/v2/society-profile/:id/attorney`

### Estrategia: Replicar Seed en MSW

#### Objetivo

Crear un sistema MSW que replique el comportamiento del seed para:

- ✅ Testing rápido sin backend
- ✅ Crear 5 sociedades completas en MSW
- ✅ Validar que MSW y Backend Real funcionan igual
- ✅ Preparar datos para testing de Juntas

#### Plan de Implementación

**1. Crear Helper de Seed para MSW**

**Archivo**: `tests/utils/seed-sociedades-msw.ts`

```typescript
export async function createSocietySeedMSW(index: number): Promise<string> {
  // 1. Crear sociedad (root)
  const societyId = await createSociedadMock();

  // 2. Datos principales
  await createDatosSociedadMock(societyId, generateTestData(index).datosSociedad);

  // 3. Accionistas
  const accionistasIds = [];
  for (const accionista of generateTestData(index).accionistas) {
    const id = await createAccionistaMock(societyId, accionista);
    accionistasIds.push(id);
  }

  // 4. Acciones
  const accionId = await createAccionMock(societyId, generateTestData(index).accion);

  // 5. Asignación de acciones
  await createAsignacionAccionesMock(societyId, accionId, accionistasIds);

  // 6. Quórums
  await createQuorumMock(societyId, generateTestData(index).quorum);

  // 7. Directores
  const directoresIds = [];
  for (const director of generateTestData(index).directores) {
    const id = await createDirectorMock(societyId, director);
    directoresIds.push(id);
  }

  // 8. Directorio
  await updateDirectorioMock(societyId, {
    ...generateTestData(index).directorio,
    presidenteId: directoresIds[0],
  });

  // 9. Clase de apoderado
  const claseApoderadoId = await createClaseApoderadoMock(
    societyId,
    generateTestData(index).claseApoderado
  );

  // 10. Apoderado
  await createApoderadoMock(societyId, {
    ...generateTestData(index).apoderado,
    claseApoderadoId,
  });

  return societyId;
}

export async function createMultipleSocietiesMSW(count: number = 5): Promise<string[]> {
  const societyIds: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = await createSocietySeedMSW(i);
    societyIds.push(id);
  }
  return societyIds;
}
```

**2. Tests que Usan el Seed MSW**

```typescript
describe("Tests con Sociedades Completas (MSW)", () => {
  beforeEach(async () => {
    await clearAllMockData();
  });

  it("debe crear 5 sociedades completas en MSW", async () => {
    const societyIds = await createMultipleSocietiesMSW(5);

    expect(societyIds).toHaveLength(5);

    // Verificar que todas tienen todos los pasos
    for (const id of societyIds) {
      const datos = await getDatosSociedadMock(id);
      const accionistas = await listAccionistasMock(id);
      const acciones = await listAccionesMock(id);
      const directores = await listDirectoresMock(id);

      expect(datos).toBeDefined();
      expect(accionistas.length).toBeGreaterThan(0);
      expect(acciones.length).toBeGreaterThan(0);
      expect(directores.length).toBeGreaterThan(0);
    }
  });
});
```

**3. Comparar MSW vs Backend Real**

```typescript
describe("Validación: MSW vs Backend Real", () => {
  it("debe crear sociedades idénticas en MSW y Backend Real", async () => {
    // Crear en MSW
    const mswId = await createSocietySeedMSW(0);
    const mswData = await getSociedadCompletaMSW(mswId);

    // Crear en Backend Real (solo si TEST_USE_MSW=false)
    if (!testConfig.useMsw) {
      const backendId = await createSocietySeedBackend(0);
      const backendData = await getSociedadCompletaBackend(backendId);

      // Comparar estructuras
      expect(mswData).toMatchObject(backendData);
    }
  });
});
```

### Beneficios

1. **Para Registro de Sociedades**:

   - ✅ Testing rápido con MSW
   - ✅ Validación contra backend real
   - ✅ Datos consistentes para todos los tests

2. **Para Juntas**:
   - ✅ 5 sociedades completas listas en MSW
   - ✅ Testing libre sin depender del backend
   - ✅ Backend se acopla a los casos que creemos

---

## 🛠️ Plan de Implementación: Seed MSW

### Objetivo

Replicar el comportamiento del seed de sociedades (`app/pages/dev/seeds-sociedades.vue`) en MSW para:

- ✅ Testing rápido sin backend
- ✅ Crear 5 sociedades completas en MSW
- ✅ Validar que MSW y Backend Real funcionan igual
- ✅ Preparar datos para testing de Juntas

### Pasos del Seed Original

1. **Paso 0**: Crear sociedad (root) - `POST /api/v2/society-profile`
2. **Paso 1**: Datos principales - `PUT /api/v2/society-profile/:id/society`
3. **Paso 2**: Accionistas (2 naturales) - `POST /api/v2/society-profile/:id/shareholder`
4. **Paso 3**: Acciones (500 comunes) - `POST /api/v2/society-profile/:id/action`
5. **Paso 4**: Asignación de acciones - `POST /api/v2/society-profile/:id/share-assignment`
6. **Paso 5**: Quórums y mayorías - `PUT /api/v2/society-profile/:id/quorum`
7. **Paso 6**: Directores - `POST /api/v2/society-profile/:id/director`
8. **Paso 7**: Directorio - `PUT /api/v2/society-profile/:id/directory`
9. **Paso 8**: Clase de apoderado - `POST /api/v2/society-profile/:id/attorney-class`
10. **Paso 9**: Apoderado (Gerente) - `POST /api/v2/society-profile/:id/attorney`

### Implementación

#### 1. Crear Helper de Seed

**Archivo**: `tests/utils/seed-sociedades-msw.ts`

```typescript
import { generateUUID } from "~/core/shared/utils/uuid";
import {
  createSociedadMock,
  createDatosSociedadMock,
  createAccionistaMock,
  createAccionMock,
  createAsignacionAccionesMock,
  createQuorumMock,
  createDirectorMock,
  updateDirectorioMock,
  createClaseApoderadoMock,
  createApoderadoMock,
} from "~/core/hexag/registros/sociedades/infrastructure/mocks/data";

/**
 * Genera datos de prueba para una sociedad (igual que seeds-sociedades.vue)
 */
function generateTestData(index: number) {
  const baseName = `Empresa Test ${index + 1}`;
  const ruc = `20${String(index + 1).padStart(7, "0")}${String(
    Math.floor(Math.random() * 100)
  ).padStart(2, "0")}`;

  return {
    datosSociedad: {
      numeroRuc: ruc,
      tipoSocietario: "S.A.C.",
      razonSocial: baseName,
      nombreComercial: `${baseName} S.A.C.`,
      direccion: `Av. Principal ${index + 1}`,
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
      fechaInscripcionRuc: "01-01-2024",
      actividadExterior: "Comercio",
      fechaEscrituraPublica: "01-01-2024",
      fechaRegistrosPublicos: "01-01-2024",
      partidaRegistral: `1234${index}`,
      oficinaRegistral: "Lima",
    },
    accionistas: [
      {
        id: generateUUID(),
        persona: {
          id: generateUUID(),
          tipo: "NATURAL",
          nombre: "Juan",
          apellidoPaterno: "Pérez",
          apellidoMaterno: "García",
          numeroDocumento: String(index * 2 + 1).padStart(8, "0"),
          tipoDocumento: "DNI",
          fechaNacimiento: "01-01-1990",
          nacionalidad: "Peruana",
          estadoCivil: "SOLTERO",
          direccion: "Av. Test 123",
          distrito: "San Isidro",
          provincia: "Lima",
          departamento: "Lima",
        },
        participacionPorcentual: 60,
      },
      {
        id: generateUUID(),
        persona: {
          id: generateUUID(),
          tipo: "NATURAL",
          nombre: "María",
          apellidoPaterno: "González",
          apellidoMaterno: "López",
          numeroDocumento: String(index * 2 + 2).padStart(8, "0"),
          tipoDocumento: "DNI",
          fechaNacimiento: "01-01-1992",
          nacionalidad: "Peruana",
          estadoCivil: "SOLTERO",
          direccion: "Av. Test 456",
          distrito: "Miraflores",
          provincia: "Lima",
          departamento: "Lima",
        },
        participacionPorcentual: 40,
      },
    ],
    accion: {
      id: generateUUID(),
      tipo: "COMUN",
      nombreAccion: "Acción Común",
      accionesSuscritas: 500,
      derechoVoto: true,
      redimible: false,
      otrosDerechosEspeciales: false,
      obligacionesAdicionales: false,
      comentariosAdicionales: false,
    },
    quorum: {
      quorumMinimoSimple: 50,
      quorumMinimoCalificado: 60,
      primeraConvocatoriaSimple: 60,
      primeraConvocatoriaCalificada: 60,
      segundaConvocatoriaSimple: 66,
      segundaConvocatoriaCalificada: 66,
    },
    directores: Array.from({ length: 3 }, (_, i) => ({
      id: generateUUID(),
      persona: {
        id: generateUUID(),
        nombre: ["Carlos", "Ana", "Luis"][i],
        apellidoPaterno: ["Rodríguez", "Martínez", "Fernández"][i],
        apellidoMaterno: ["Vargas", "Sánchez", "Torres"][i],
        tipoDocumento: "DNI",
        numeroDocumento: String(index * 10 + i + 10).padStart(8, "0"),
        paisEmision: "PE",
      },
      rolDirector: "TITULAR",
    })),
    directorio: {
      cantidadDirectores: 3,
      conteoPersonalizado: false,
      minimoDirectores: null,
      maximoDirectores: null,
      inicioMandato: "01-01-2025",
      finMandato: "01-01-2026",
      quorumMinimo: 2,
      mayoria: 2,
      presidenteDesignado: true,
      secretarioAsignado: true,
      reeleccionPermitida: true,
      presidentePreside: true,
      presidenteDesempata: true,
      periodo: "1",
      presidenteId: null, // Se actualizará después
    },
    claseApoderado: {
      id: generateUUID(),
      nombre: "Gerente General",
    },
    apoderado: {
      id: generateUUID(),
      claseApoderadoId: "", // Se llenará después
      persona: {
        id: generateUUID(),
        tipo: "NATURAL",
        nombre: "Roberto",
        apellidoPaterno: "Silva",
        apellidoMaterno: "Mendoza",
        numeroDocumento: String(index * 6 + 6).padStart(8, "0"),
        tipoDocumento: "DNI",
        fechaNacimiento: "01-01-1985",
        nacionalidad: "Peruana",
        estadoCivil: "CASADO",
        direccion: "Av. Gerente 789",
        distrito: "San Isidro",
        provincia: "Lima",
        departamento: "Lima",
      },
    },
  };
}

/**
 * Crea una sociedad completa en MSW (replica del seed)
 */
export async function createSocietySeedMSW(index: number): Promise<string> {
  const testData = generateTestData(index);

  // Paso 0: Crear sociedad (root)
  const societyId = await createSociedadMock();
  console.debug(`[Seed MSW] Sociedad ${index + 1} creada: ${societyId}`);

  // Paso 1: Datos principales
  await createDatosSociedadMock(societyId, testData.datosSociedad);
  console.debug(`[Seed MSW] Datos principales creados para ${societyId}`);

  // Paso 2: Accionistas
  const accionistasIds: string[] = [];
  for (const accionista of testData.accionistas) {
    const id = await createAccionistaMock(societyId, accionista);
    accionistasIds.push(id);
  }
  console.debug(`[Seed MSW] ${accionistasIds.length} accionistas creados para ${societyId}`);

  // Paso 3: Acciones
  const accionId = await createAccionMock(societyId, testData.accion);
  console.debug(`[Seed MSW] Acción creada: ${accionId} para ${societyId}`);

  // Paso 4: Asignación de acciones
  await createAsignacionAccionesMock(societyId, {
    accionId,
    accionistaId: accionistasIds[0],
    cantidadSuscrita: 300,
    precioPorAccion: 1.0,
    porcentajePagadoPorAccion: 100,
    totalDividendosPendientes: 0,
    pagadoCompletamente: true,
  });
  await createAsignacionAccionesMock(societyId, {
    accionId,
    accionistaId: accionistasIds[1],
    cantidadSuscrita: 200,
    precioPorAccion: 1.0,
    porcentajePagadoPorAccion: 100,
    totalDividendosPendientes: 0,
    pagadoCompletamente: true,
  });
  console.debug(`[Seed MSW] Asignaciones de acciones creadas para ${societyId}`);

  // Paso 5: Quórums
  await createQuorumMock(societyId, testData.quorum);
  console.debug(`[Seed MSW] Quórums creados para ${societyId}`);

  // Paso 6: Directores
  const directoresIds: string[] = [];
  for (const director of testData.directores) {
    const id = await createDirectorMock(societyId, director);
    directoresIds.push(id);
  }
  console.debug(`[Seed MSW] ${directoresIds.length} directores creados para ${societyId}`);

  // Paso 7: Directorio
  await updateDirectorioMock(societyId, {
    ...testData.directorio,
    presidenteId: directoresIds[0], // Primer director como presidente
  });
  console.debug(`[Seed MSW] Directorio configurado para ${societyId}`);

  // Paso 8: Clase de apoderado
  const claseApoderadoId = await createClaseApoderadoMock(societyId, testData.claseApoderado);
  console.debug(`[Seed MSW] Clase de apoderado creada: ${claseApoderadoId} para ${societyId}`);

  // Paso 9: Apoderado
  await createApoderadoMock(societyId, {
    ...testData.apoderado,
    claseApoderadoId,
  });
  console.debug(`[Seed MSW] Apoderado creado para ${societyId}`);

  return societyId;
}

/**
 * Crea múltiples sociedades completas en MSW
 */
export async function createMultipleSocietiesMSW(count: number = 5): Promise<string[]> {
  const societyIds: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = await createSocietySeedMSW(i);
    societyIds.push(id);
  }
  console.debug(`[Seed MSW] ${societyIds.length} sociedades completas creadas`);
  return societyIds;
}
```

#### 2. Checklist de Implementación

**Fase 1: Funciones Mock Necesarias**

- [x] `createSociedadMock()` - Ya existe
- [ ] `createDatosSociedadMock()` - Verificar
- [ ] `createAccionistaMock()` - Verificar
- [ ] `createAccionMock()` - Verificar
- [ ] `createAsignacionAccionesMock()` - Verificar
- [ ] `createQuorumMock()` - Verificar
- [ ] `createDirectorMock()` - Verificar
- [ ] `updateDirectorioMock()` - Verificar
- [ ] `createClaseApoderadoMock()` - Verificar
- [ ] `createApoderadoMock()` - Verificar

**Fase 2: Helper de Seed**

- [ ] Crear `tests/utils/seed-sociedades-msw.ts`
- [ ] Implementar `generateTestData()` (copiar de seeds-sociedades.vue)
- [ ] Implementar `createSocietySeedMSW()`
- [ ] Implementar `createMultipleSocietiesMSW()`

**Fase 3: Tests**

- [ ] Crear `tests/integration/seed-sociedades-msw.test.ts`
- [ ] Test: crear una sociedad completa
- [ ] Test: crear 5 sociedades completas
- [ ] Test: validar estructura de datos

**Fase 4: Validación MSW vs Backend**

- [ ] Crear test que compare MSW vs Backend Real
- [ ] Validar que los datos son idénticos
- [ ] Documentar diferencias (si las hay)

### Beneficios

1. **Para Registro de Sociedades**:

   - ✅ Testing rápido con MSW
   - ✅ Validación contra backend real
   - ✅ Datos consistentes para todos los tests

2. **Para Juntas**:
   - ✅ 5 sociedades completas listas en MSW
   - ✅ Testing libre sin depender del backend
   - ✅ Backend se acopla a los casos que creemos
   - ✅ Desarrollo paralelo: frontend avanza sin esperar backend

---

## ⚠️ Importante

### Sociedades en DB Real

- ✅ Los tests de integración **SÍ crean** sociedades en la DB real
- ✅ Los tests **intentan eliminar** todas las sociedades al finalizar
- ⚠️ Si un test falla, algunas sociedades pueden quedar en la DB
- ✅ Revisa el resumen en `logs/tests/` para verificar limpieza

### Verificar Limpieza

Después de ejecutar tests:

1. Revisa el resumen en `logs/tests/`
2. Si hay sociedades en `failedToDelete`, elimínalas manualmente
3. Verifica en la DB que no queden sociedades de prueba

---

## 📚 Archivos Clave

### Configuración

- `vitest.config.ts` - Configuración de Vitest
- `tests/setup.ts` - Setup global (MSW o Backend Real)
- `tests/config/test-config.ts` - Configuración de tests

### Tests

- `sociedad.repository.shared.test.ts` - Tests compartidos
- `sociedad.repository.integration.test.ts` - Tests de integración

### Utilidades

- `tests/utils/test-logger.ts` - Sistema de logs
- `tests/utils/seed-sociedades-msw.ts` - Seed para MSW (por crear)

### Seed

- `app/pages/dev/seeds-sociedades.vue` - Seed de desarrollo (backend real)

---

## ✅ Checklist

### Configuración

- [ ] Crear `.env` con variables de desarrollo
- [ ] Crear `.env.test` con variables de tests
- [ ] Verificar que `.env` y `.env.test` estén en `.gitignore`

### Tests

- [ ] Probar tests con MSW: `npm run test sociedad.repository.shared.test.ts`
- [ ] Probar tests con Backend Real: `TEST_USE_MSW=false npm run test sociedad.repository.integration.test.ts`
- [ ] Verificar que se generan logs en `logs/tests/`

### Seed MSW (Próximo Paso)

- [ ] Crear `tests/utils/seed-sociedades-msw.ts`
- [ ] Implementar `createSocietySeedMSW()`
- [ ] Implementar `createMultipleSocietiesMSW()`
- [ ] Crear tests que usen el seed MSW
- [ ] Validar que MSW y Backend Real producen datos idénticos

---

**Fecha**: 2025-01-XX  
**Última actualización**: 2025-01-XX
