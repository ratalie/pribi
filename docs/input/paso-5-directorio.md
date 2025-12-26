# 🏛️ Paso 5: Directorio

**Paso**: 5 de 10  
**Ruta**: `/registros/sociedades/:id/directorio`  
**Slug**: `directorio`  
**Dependencias**: ✅ Paso 0 (Crear Sociedad)

---

## 🎯 Resumen

Este paso permite configurar el directorio de la sociedad (si tiene o no) y designar directores. Incluye configuración de cantidad, presidente, secretario, reglas de funcionamiento, etc.

**Características principales:**

- Toggle para tener/no tener directorio
- Configuración de cantidad de directores (mínimo, máximo, personalizado)
- Designación de directores individuales
- Designación de presidente
- Configuración de secretario (gerente general)
- Reglas de funcionamiento (quórum, mayoría, reelección, etc.)

---

## 📊 Flujo de Datos

```
Usuario → DirectorioManager.vue
  ↓
useDirectorioFormSync / useDirectorioModals (composables)
  ↓
useDirectorioStore (store) ⚠️ DUPLICADO
  ↓
GetDirectorioUseCase / UpdateDirectorioUseCase
  ↓
DirectorioRepository (port)
  ↓
DirectorioHttpRepository (infrastructure)
  ↓
Backend API: GET/PUT /api/v2/society-profile/:id/directory

// Para directores individuales:
CreateDirectorUseCase / UpdateDirectorUseCase / DeleteDirectorUseCase
  ↓
DirectorRepository (port)
  ↓
DirectorHttpRepository (infrastructure)
  ↓
Backend API: GET/POST/PUT/DELETE /api/v2/society-profile/:id/directors
```

---

## 🏗️ Arquitectura por Capa

### **Domain Layer**

**Entidades:**

1. **`DirectorioConfig`** - Configuración del directorio

```typescript
interface DirectorioConfig {
  id: string;
  cantidadDirectores: number;
  conteoPersonalizado: boolean;
  minimoDirectores: number | null;
  maximoDirectores: number | null;
  inicioMandato: string; // dd-mm-aaaa
  finMandato: string; // dd-mm-aaaa
  quorumMinimo: number;
  mayoria: number;
  presidenteDesignado: boolean;
  secretarioAsignado: boolean; // TRUE = Gerente General es secretario
  reeleccionPermitida: boolean;
  presidentePreside: boolean; // TRUE = Presidente del directorio preside la junta
  presidenteDesempata: boolean;
  periodo: string; // "1" = ONE_YEAR
  presidenteId: string | null; // UUID del director (NO de la persona)
  createdAt: string;
  updatedAt: string;
}
```

2. **`Director`** - Director individual

```typescript
interface Director {
  id: string; // UUID del director
  persona: Persona; // Información de la persona
  rolDirector: TipoDirector; // TITULAR, ALTERNO, etc.
  reemplazaId?: string; // Si es ALTERNO, ID del director que reemplaza
}
```

**Ports (Interfaces):**

- `DirectorioRepository` - CRUD de configuración

```typescript
interface DirectorioRepository {
  get(profileId: string): Promise<DirectorioConfig | null>;
  update(profileId: string, payload: DirectorioDTO): Promise<DirectorioConfig>;
}
```

- `DirectorRepository` - CRUD de directores individuales

```typescript
interface DirectorRepository {
  get(profileId: string): Promise<Director[]>;
  create(profileId: string, payload: DirectorDTO): Promise<Director>;
  update(profileId: string, directorId: string, payload: DirectorDTO): Promise<Director>;
  delete(profileId: string, directorId: string): Promise<void>;
}
```

**Enums:**

- `TipoDirector` - Tipos de director (TITULAR, ALTERNO, etc.)

---

### **Application Layer**

**DTOs:**

- `DirectorioDTO` - Configuración del directorio (bidireccional)
- `DirectorDTO` - Director individual (bidireccional)

**Use Cases:**

**Directorio:**

- `GetDirectorioUseCase` - Obtiene configuración
- `CreateDirectorioUseCase` - Crea configuración
- `UpdateDirectorioUseCase` - Actualiza configuración

**Directores:**

- `CreateDirectorUseCase` - Crea director
- `UpdateDirectorUseCase` - Actualiza director
- `DeleteDirectorUseCase` - Elimina director

**Flujo de Use Cases:**

```typescript
// Get Configuración
GetDirectorioUseCase.execute(profileId)
  → DirectorioRepository.get(profileId)
  → Retorna DirectorioConfig | null

// Update Configuración
UpdateDirectorioUseCase.execute(profileId, payload)
  → DirectorioRepository.update(profileId, payload)
  → Retorna DirectorioConfig

// Create Director
CreateDirectorUseCase.execute(profileId, payload)
  → DirectorRepository.create(profileId, payload)
  → Retorna Director

// Get Directores
DirectorRepository.get(profileId)
  → Retorna Director[]
```

---

### **Infrastructure Layer**

**Repositories:**

- `DirectorioHttpRepository` - Implementación HTTP
  - `GET /api/v2/society-profile/:id/directory` → Get
  - `PUT /api/v2/society-profile/:id/directory` → Update
- `DirectorHttpRepository` - Implementación HTTP
  - `GET /api/v2/society-profile/:id/directors` → List
  - `POST /api/v2/society-profile/:id/directors` → Create
  - `PUT /api/v2/society-profile/:id/directors/:directorId` → Update
  - `DELETE /api/v2/society-profile/:id/directors/:directorId` → Delete

**Mappers:**

- `DirectorioMapper` - DTO ↔ Entity para configuración
- `DirectorMapper` - DTO ↔ Entity para directores

---

### **Presentation Layer**

**Stores (Pinia - Option API):**

⚠️ **PROBLEMA: Duplicación de Stores**

1. **`useDirectorioStore`** (en `stores/directorio.store.ts`):

   - Estado: `tieneDirectorio`, `limites`, `configuracion`, `presidente`
   - Actions: `setTieneDirectorio()`, `updateConfiguracion()`, `updatePresidente()`, `hydrate()`

2. **`useDirectorioStore`** (en `pasos/directorio/stores/useDirectorio.ts`):

   - Mismo nombre, funcionalidad similar
   - ⚠️ **PROBLEMA**: Duplicación

3. **`useDirectores`** (store de directores):
   - Estado: `directores[]`
   - Actions: CRUD de directores

**Composables:**

1. **`useDirectorioFormSync`**:

   - Sincroniza form con store
   - Maneja cambios reactivos

2. **`useDirectorioModals`**:

   - Gestión de modales (agregar director, configurar)

3. **`useDirectorioDirectores`**:
   - Orquesta operaciones de directores
   - Carga y sincronización

**Components:**

1. **`DirectorioManager.vue`** (principal):

   - Toggle para tener/no tener directorio
   - Form de configuración
   - Lista de directores
   - Gestión de presidente

2. **`DirectorioConfigForm.vue`**:

   - Form de configuración
   - Cantidad de directores
   - Reglas

3. **`AgregarDirectorModal.vue`**:

   - Modal para agregar director
   - Form con validaciones

4. **`PresidenteDirectorioForm.vue`**:
   - Form específico para presidente

---

## 🔄 Flujo Completo

### **1. Carga Inicial**

```typescript
// Componente se monta
DirectorioManager.vue mounted
  ↓
// Carga configuración
GetDirectorioUseCase.execute(profileId)
  ↓
DirectorioHttpRepository.get(profileId)
  ↓
GET /api/v2/society-profile/:id/directory
  ↓
Backend responde (200 con configuración o 404 si no existe)
  ↓
// Carga directores
DirectorRepository.get(profileId)
  ↓
GET /api/v2/society-profile/:id/directors
  ↓
Backend responde (200 con array de directores)
  ↓
Store actualiza: configuracion = response, directores = response[]
  ↓
Componente renderiza con datos
```

### **2. Configurar Directorio**

```typescript
// Usuario indica si tiene directorio
Toggle cambia
  ↓
Si tiene directorio:
  - Usuario configura cantidad de directores
  - Usuario configura reglas (quórum, mayoría, etc.)
  - Usuario agrega directores individuales
  - Usuario designa presidente
  ↓
Validaciones:
  - Cantidad mínima/máxima
  - Presidente debe ser uno de los directores
  ↓
Al guardar configuración:
  UpdateDirectorioUseCase.execute(profileId, payload)
  ↓
PUT /api/v2/society-profile/:id/directory
  ↓
Backend responde (200 con configuración actualizada)
  ↓
Store actualiza: configuracion = updated
```

### **3. Agregar Director**

```typescript
// Usuario hace click en "Agregar Director"
Modal se abre
  ↓
Usuario completa datos:
  - Información de la persona
  - Rol (TITULAR, ALTERNO, etc.)
  - Si es ALTERNO: selecciona director que reemplaza
  ↓
Validación
  ↓
Al guardar → CreateDirectorUseCase.execute(profileId, payload)
  ↓
DirectorHttpRepository.create(profileId, payload)
  ↓
POST /api/v2/society-profile/:id/directors
  ↓
Backend responde (200 con director creado)
  ↓
Store actualiza: directores.push(newDirector)
  ↓
Lista se actualiza
```

### **4. Designar Presidente**

```typescript
// Usuario selecciona presidente de la lista de directores
Select de presidente
  ↓
Usuario selecciona director
  ↓
Al guardar configuración:
  UpdateDirectorioUseCase.execute(profileId, { ...config, presidenteId: directorId })
  ↓
PUT /api/v2/society-profile/:id/directory
  ↓
Backend responde (200)
  ↓
Store actualiza: configuracion.presidenteId = directorId
  ↓
UI muestra presidente seleccionado
```

---

## 📋 Variables y Estado

### **Store Configuración** (`useDirectorioStore`)

```typescript
{
  tieneDirectorio: boolean,
  limites: {
    minimo: number | null,
    maximo: number | null,
    cantidad: number,
  },
  configuracion: DirectorioConfig | null,
  presidente: Director | null,
}
```

### **Store Directores** (`useDirectores`)

```typescript
{
  directores: Director[],
  status: 'idle' | 'loading' | 'success' | 'error',
}
```

---

## 🔗 Dependencias

### **Pasos Previos Requeridos**

- ✅ **Paso 0: Crear Sociedad** (siempre requerido)

### **Pasos Posteriores que Dependen de Este**

- **Ninguno directamente**
- Los pasos siguientes pueden usar información del directorio pero no es requerida

---

## 🧪 Testing

### **Tests Existentes**

- `infrastructure/repositories/__tests__/directorio.test.ts` ✅

### **Helpers de Test**

```typescript
// Crear contexto para este paso
const context = await createTestContextForStep("directorio");
// context = { societyId }

// Crear directorio completo (config + 3 directores + presidente)
const { directorioId, directoresIds, presidenteId } = await setupDirectorio(societyId);

// Limpiar después
await cleanupTestContext(context);
```

### **Dependencias para Testing**

- **Requiere**: Solo sociedad (Paso 0)
- **Crea**: Configuración de directorio + Directores

### **Ejemplo de Test**

```typescript
describe("Directorio Repository", () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestContextForStep("directorio");
  });

  afterAll(async () => {
    await cleanupTestContext(context);
  });

  it("debe crear un director", async () => {
    const repository = new DirectorHttpRepository();
    const director = createTestDirector(0, TipoDirector.TITULAR);

    const { CreateDirectorUseCase } = await import("...");
    const useCase = new CreateDirectorUseCase(repository);
    const result = await useCase.execute(context.societyId, director);

    expect(result.id).toBeDefined();
    expect(result.persona.nombre).toBe(director.persona.nombre);
  });
});
```

---

## 🛣️ Rutas y Navegación

**Ruta Base:**

```
/registros/sociedades/:id/directorio
```

**Navegación:**

- **Anterior**: Paso 4 (Asignación de Acciones) - `/registros/sociedades/:id/asignacion-acciones`
- **Siguiente**: Paso 6 (Registro de Apoderados) - `/registros/sociedades/:id/apoderados`

**Configuración:**

- Definida en `app/config/society-register-navigation.ts`
- Slug: `directorio`
- Título: "Directorio"

---

## ⚠️ Problemas Conocidos

1. **Duplicación de stores** 🔴 CRÍTICO

   - Dos `useDirectorioStore` con funcionalidad similar
   - Uno en `stores/directorio.store.ts`
   - Otro en `pasos/directorio/stores/useDirectorio.ts`
   - Confusión sobre cuál usar

2. **Orden de creación**

   - Debe crear directores PRIMERO
   - Luego configurar directorio con `presidenteId`
   - Si se hace al revés, puede fallar

3. **presidenteId vs personaId**
   - `presidenteId` es el UUID del **director**, no de la persona
   - Puede causar confusión

---

## 🔧 Mejoras Futuras

1. **Consolidar stores duplicados** 🔴 PRIORIDAD ALTA

   - Unificar `useDirectorioStore`
   - Determinar cuál es el correcto
   - Eliminar duplicación

2. **Validación de orden**

   - Validar que los directores existan antes de configurar directorio
   - Mostrar mensajes claros

3. **Mejorar UX**
   - Wizard para crear directorio completo
   - Guía paso a paso

---

## 📚 Referencias

- **Investigación Completa**: `docs/input/03-investigacion-registro-sociedades-completa.md`
- **Estrategia de Testing**: `docs/input/06-estrategia-testing-vitest-hexagonal.md`
- **Helpers de Test**: `tests/helpers/test-context-helpers.ts`
- **Data Helpers**: `tests/helpers/seed-helpers.ts`

---

**Última actualización**: 2024  
**Mantenido por**: Equipo Frontend Probo v3

