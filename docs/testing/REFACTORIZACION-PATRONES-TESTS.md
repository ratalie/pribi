# 🔄 Refactorización: Patrones y Mejoras para Tests

## 📋 Resumen de Cambios

### ✅ Completado

1. **Corrección de Errores de Build**
   - ✅ Todos los errores de TypeScript corregidos
   - ✅ Build pasa sin errores

2. **Estandarización de Importaciones**
   - ✅ Todas las importaciones de tests usan `@tests/*`
   - ✅ Todas las importaciones de repositorios usan `~/core/hexag/...`
   - ✅ Eliminadas todas las importaciones relativas largas (`../../../../../../..`)

3. **Type Guards para Persona**
   - ✅ Creadas funciones `isPersonaNatural()` y `isPersonaJuridica()`
   - ✅ Mejor type safety en tests

---

## 🎯 Patrones Identificados para Refactorización

### 1. **Código Duplicado**

#### `generateUUID()` duplicado en:
- ✅ `accionistas.repository.integration.test.ts`
- ✅ `acciones.repository.integration.test.ts`
- ✅ `apoderados.repository.integration.test.ts`
- ✅ `director.repository.integration.test.ts`
- ✅ `asignacion-acciones.repository.integration.test.ts`

**Solución**: ✅ Extraído a `tests/utils/uuid-generator.ts`

#### `createTestSociety()` duplicado en:
- Todos los archivos de tests tienen la misma función

**Solución**: ✅ Extraído a `IntegrationTestBase.createTestSociety()`

#### Patrón `beforeAll` / `afterAll` duplicado:
- Setup de repositorios
- Inicialización de logger
- Limpieza de sociedades
- Generación de resúmenes

**Solución**: ✅ Creada clase base `IntegrationTestBase`

---

### 2. **Estructura Común de Tests**

Todos los tests siguen este patrón:

```typescript
(shouldRun ? describe : describe.skip)("RepositoryName - Backend Real", () => {
  let repository: RepositoryType;
  let sociedadRepository: SociedadHttpRepository;
  const createdSocietyIds: string[] = [];
  let logger: TestLogger;
  const testResults = { total: 0, passed: 0, failed: 0 };

  beforeAll(async () => {
    // Setup...
    await clearAllSocieties();
  });

  afterAll(async () => {
    // Cleanup...
  });

  async function createTestSociety(): Promise<string> {
    // ...
  }
});
```

**Mejora propuesta**: Usar `IntegrationTestBase` (ya creado)

---

### 3. **Organización de Helpers**

#### Estado Actual:
```
tests/helpers/seed-helpers.ts (392 líneas)
├── generateUUID()
├── ensureUUID()
├── generateTestData()
├── createSocietyWithData()
├── createAccionistas()
├── createAcciones()
├── createAsignacionAcciones()
├── createQuorum()
├── createDirectorio()
├── createDirectores()
├── createClaseApoderado()
├── createApoderado()
└── clearAllSocieties()
```

#### Propuesta de Refactorización:
```
tests/
├── utils/
│   ├── uuid-generator.ts ✅ (creado)
│   └── test-logger.ts (ya existe)
├── base/
│   └── integration-test-base.ts ✅ (creado)
└── helpers/
    ├── seed-helpers.ts (mantener para compatibilidad)
    ├── sociedad-helpers.ts (nuevo)
    ├── accionistas-helpers.ts (nuevo)
    ├── acciones-helpers.ts (nuevo)
    ├── quorum-helpers.ts (nuevo)
    ├── directorio-helpers.ts (nuevo)
    └── apoderados-helpers.ts (nuevo)
```

---

## 🚀 Próximos Pasos (No Implementados Aún)

### Fase 1: Refactorización de Helpers (Pendiente)

1. **Separar helpers por dominio**:
   ```typescript
   // tests/helpers/sociedad-helpers.ts
   export function createTestSociety(): Promise<string> { ... }
   export function createSocietyWithData(...): Promise<string> { ... }
   
   // tests/helpers/accionistas-helpers.ts
   export function createTestAccionistaNatural(...): AccionistaDTO { ... }
   export function createTestAccionistaJuridico(...): AccionistaDTO { ... }
   ```

2. **Crear factories**:
   ```typescript
   // tests/factories/sociedad.factory.ts
   export class SociedadFactory {
     static create(overrides?: Partial<DatosSociedadDTO>): DatosSociedadDTO { ... }
     static createMany(count: number): DatosSociedadDTO[] { ... }
   }
   ```

3. **Extraer constantes**:
   ```typescript
   // tests/constants/test-data.ts
   export const TEST_SOCIETY_NAMES = ["Empresa Test 1", ...];
   export const TEST_RUCS = ["20449810100", ...];
   export const TEST_PERSON_NAMES = ["Juan", "María", ...];
   ```

### Fase 2: Migrar Tests a IntegrationTestBase (Pendiente)

**Ejemplo de migración**:

#### Antes:
```typescript
(shouldRun ? describe : describe.skip)("AccionistasHttpRepository - Backend Real", () => {
  let repository: AccionistasHttpRepository;
  let sociedadRepository: SociedadHttpRepository;
  const createdSocietyIds: string[] = [];
  let logger: TestLogger;
  const testResults = { total: 0, passed: 0, failed: 0 };

  beforeAll(async () => {
    repository = new AccionistasHttpRepository();
    sociedadRepository = new SociedadHttpRepository();
    logger = new TestLogger(...);
    await clearAllSocieties();
  });

  afterAll(async () => {
    // cleanup...
  });

  async function createTestSociety(): Promise<string> {
    // ...
  }
});
```

#### Después:
```typescript
class AccionistasIntegrationTest extends IntegrationTestBase {
  protected repository: AccionistasHttpRepository;

  constructor() {
    super("AccionistasHttpRepository - Backend Real");
    this.repository = new AccionistasHttpRepository();
  }

  protected async setupSpecific(): Promise<void> {
    // Setup específico si es necesario
  }
}

const testSuite = new AccionistasIntegrationTest();
(testSuite.shouldRun ? describe : describe.skip)(testSuite.testSuiteName, () => {
  beforeAll(() => testSuite.setup());
  afterAll(() => testSuite.cleanup());

  // Tests...
});
```

---

## 📊 Estado Actual

### ✅ Completado
- ✅ Build pasa sin errores
- ✅ Todas las importaciones estandarizadas
- ✅ Type guards creados
- ✅ `generateUUID()` extraído a utils
- ✅ `IntegrationTestBase` creada (base para futura refactorización)

### 🔄 Pendiente (No Implementado)
- ⏳ Migrar tests a usar `IntegrationTestBase`
- ⏳ Separar helpers por dominio
- ⏳ Crear factories
- ⏳ Extraer constantes

---

## 💡 Recomendaciones

### Para MSW (Próximo Objetivo)

1. **Usar la misma estructura de helpers**:
   - Los helpers de `seed-helpers.ts` deben funcionar tanto para HTTP como para MSW
   - Esto garantiza que los datos de prueba sean idénticos

2. **Tests compartidos**:
   - Crear `.shared.test.ts` que pruebe tanto HTTP como MSW
   - Usar `describe.each` para ejecutar los mismos tests contra ambos

3. **Mantener compatibilidad**:
   - No romper los tests existentes
   - Refactorizar gradualmente

---

**Última actualización**: 2025-12-01
**Estado**: ✅ Build pasando, código más limpio, base para refactorización creada

