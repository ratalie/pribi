# 🎯 Paso 4: Asignación de Acciones

**Paso**: 4 de 10  
**Ruta**: `/registros/sociedades/:id/asignacion-acciones`  
**Slug**: `asignacion-acciones`  
**Dependencias**: ✅ Paso 0 (Crear Sociedad), ✅ Paso 2 (Accionistas), ✅ Paso 3 (Acciones)

---

## 🎯 Resumen

Este paso permite distribuir las acciones (del paso 3) entre los accionistas (del paso 2). Calcula porcentajes y capital social automáticamente.

**Características principales:**

- Asignar acciones a accionistas
- Cálculo automático de porcentajes
- Cálculo de capital social
- Validaciones de consistencia (no exceder acciones disponibles)
- Visualización por clase de acción y por accionista

---

## 📊 Flujo de Datos

```
Usuario → AsignacionAccionesManager.vue
  ↓
useAsignacionAccionesLoader (loader)
  ↓
Carga en paralelo: Acciones + Accionistas + Valor Nominal
  ↓
Luego carga: Asignaciones
  ↓
useRegistroAsignacionAccionesStore (store)
  ↓
GetAsignacionAccionUseCase / CreateAsignacionAccionUseCase / UpdateAsignacionAccionUseCase / DeleteAsignacionAccionUseCase
  ↓
AsignacionAccionesRepository (port)
  ↓
AsignacionAccionesHttpRepository (infrastructure)
  ↓
Backend API: GET/POST/PUT/DELETE /api/v2/society-profile/:id/share-assignments
```

---

## 🏗️ Arquitectura por Capa

### **Domain Layer**

**Entidades:**

- `AsignacionAccion` - Entidad principal

```typescript
interface AsignacionAccion {
  id: string;
  accionistaId: string; // ID del accionista (del paso 2)
  accionId: string; // ID de la acción (del paso 3)
  cantidadSuscrita: number; // Cantidad de acciones asignadas
  porcentaje: number; // Porcentaje calculado
  precioPorAccion: number; // Precio por acción
  porcentajePagadoPorAccion: number; // Porcentaje pagado
  dividendoPasivoTotal: number; // Dividendo pasivo total
  pagadoCompletamente: boolean; // Si está completamente pagado
}
```

**Ports (Interfaces):**

- `AsignacionAccionesRepository` - Contrato del repositorio

```typescript
interface AsignacionAccionesRepository {
  get(profileId: string): Promise<AsignacionAccion[]>;
  create(profileId: string, payload: AsignacionAccionDTO): Promise<string>; // Retorna ID
  update(profileId: string, asignacionId: string, payload: AsignacionAccionDTO): Promise<void>;
  delete(profileId: string, asignacionId: string): Promise<void>;
}
```

---

### **Application Layer**

**DTOs:**

- `AsignacionAccionDTO` - Bidireccional (mismo formato que entity)

**Use Cases:**

- `GetAsignacionAccionUseCase` - Obtiene todas las asignaciones
- `CreateAsignacionAccionUseCase` - Crea nueva asignación
- `UpdateAsignacionAccionUseCase` - Actualiza asignación existente
- `DeleteAsignacionAccionUseCase` - Elimina asignación

**Flujo de Use Cases:**

```typescript
// Get (todas)
GetAsignacionAccionUseCase.execute(profileId)
  → AsignacionAccionesRepository.get(profileId)
  → Retorna AsignacionAccion[]

// Create
CreateAsignacionAccionUseCase.execute(profileId, payload)
  → AsignacionAccionesRepository.create(profileId, payload)
  → Retorna string (ID de asignación)

// Update
UpdateAsignacionAccionUseCase.execute(profileId, asignacionId, payload)
  → AsignacionAccionesRepository.update(profileId, asignacionId, payload)
  → Retorna void

// Delete
DeleteAsignacionAccionUseCase.execute(profileId, asignacionId)
  → AsignacionAccionesRepository.delete(profileId, asignacionId)
  → Retorna void
```

---

### **Infrastructure Layer**

**Repositories:**

- `AsignacionAccionesHttpRepository` - Implementación HTTP
  - `GET /api/v2/society-profile/:id/share-assignments` → Get (todas)
  - `POST /api/v2/society-profile/:id/share-assignments` → Create
  - `PUT /api/v2/society-profile/:id/share-assignments/:asignacionId` → Update
  - `DELETE /api/v2/society-profile/:id/share-assignments/:asignacionId` → Delete

**Mappers:**

- `AsignacionAccionesMapper` - Transforma DTO ↔ Entity
  - Maneja cálculos de porcentajes
  - Normaliza formatos numéricos

---

### **Presentation Layer**

**Composable Loader**: `useAsignacionAccionesLoader`

Carga datos necesarios en orden:

1. **Acciones** (paso 3) - En paralelo
2. **Accionistas** (paso 2) - En paralelo
3. **Valor Nominal** (transversal) - En paralelo
4. **Asignaciones existentes** (paso 4) - Después de los anteriores

**Características:**

- Carga en paralelo (acciones, accionistas, valor nominal)
- Luego carga asignaciones (depende de los anteriores)
- Maneja estados de carga individuales
- Inicializa store desde accionistas si no hay asignaciones

**Composable Computed**: `useAsignacionAccionesComputed`

Calcula valores derivados:

- `accionesDisponibles` - Acciones que aún se pueden asignar
- `totalAccionesAsignadasDisplay` - Total formateado
- `totalAccionesSociedadDisplay` - Total de la sociedad
- `capitalSocialDisplay` - Capital social calculado
- `valorNominalDisplay` - Valor nominal formateado

**Stores (Pinia - Option API):**

1. **`useRegistroAsignacionAccionesStore`** (principal):

   - Estado: `asignaciones[]`, `status`
   - Actions:
     - `loadAsignaciones()` - Carga desde backend
     - `addAsignacionAccion()` - Agrega nueva asignación
     - `updateAsignacionAccion()` - Actualiza existente
     - `removeAsignacionAccion()` - Elimina
     - `initializeFromAccionistas()` - Inicializa estructura desde accionistas
   - Getters:
     - `tablaAsignaciones` - Vista estructurada para tabla
     - `accionesDisponibles` - Acciones que se pueden asignar
     - `totalAccionesAsignadas` - Suma total
     - `capitalSocial` - Capital = total asignadas × valor nominal

2. **`useAsignacionAccionesStore`** (form):
   - Estado local del formulario de asignación
   - Campos: accionId, cantidadSuscrita, precioPorAccion, etc.
   - Validaciones

**Mappers Presentation:**

1. **`accionista-domain-to-store.mapper.ts`**:

   - Transforma accionistas de domain a formato para store
   - Agrega información necesaria para UI

2. **`asignacion-accion-presentation.mapper.ts`**:
   - FormData ↔ DTO
   - Calcula campos derivados
   - Normaliza formatos para UI

**Components:**

1. **`AsignacionAccionesManager.vue`** (principal):

   - Cards por clase de acción (muestra asignadas vs suscritas)
   - Tabla de asignaciones por accionista
   - Modal para asignar acciones
   - Muestra totales y capital social

2. **`AsignarAccionesModal.vue`**:

   - Modal para crear/editar asignación
   - Form con validaciones
   - Calcula porcentajes automáticamente

3. **`AsignationTable.vue`**:

   - Tabla de asignaciones
   - Agrupado por accionista
   - Muestra acciones por clase
   - Botones para editar/eliminar

4. **`SharesCard.vue`**:
   - Card por clase de acción
   - Muestra acciones asignadas vs suscritas
   - Visualización de progreso

---

## 🔄 Flujo Completo

### **1. Carga Inicial**

```typescript
// Componente se monta
AsignacionAccionesManager.vue mounted
  ↓
useAsignacionAccionesLoader() ejecuta
  ↓
// Carga en paralelo:
Promise.all([
  loadAcciones(),        // Paso 3
  loadAccionistas(),     // Paso 2
  loadValorNominal(),    // Transversal
])
  ↓
// Luego carga asignaciones:
loadAsignaciones()
  ↓
GetAsignacionAccionUseCase.execute(profileId)
  ↓
AsignacionAccionesHttpRepository.get(profileId)
  ↓
GET /api/v2/society-profile/:id/share-assignments
  ↓
Backend responde (200 con array de asignaciones)
  ↓
Store se inicializa:
  - Si hay asignaciones: las carga
  - Si no hay: initializeFromAccionistas() (estructura vacía)
  ↓
Componente renderiza:
  - Cards por clase de acción
  - Tabla de asignaciones
```

### **2. Crear Asignación**

```typescript
// Usuario hace click en "Asignar acciones"
Modal se abre
  ↓
Usuario selecciona:
  - Accionista (del paso 2)
  - Clase de acción (del paso 3)
  - Cantidad de acciones
  - Precio por acción (opcional)
  ↓
Validaciones:
  - Cantidad no puede exceder acciones disponibles
  - Precio y porcentajes consistentes
  ↓
Al guardar → store.addAsignacionAccion(payload)
  ↓
CreateAsignacionAccionUseCase.execute(profileId, payload)
  ↓
AsignacionAccionesHttpRepository.create(profileId, payload)
  ↓
POST /api/v2/society-profile/:id/share-assignments
  ↓
Backend responde (200 con ID de asignación)
  ↓
Store actualiza:
  - asignaciones.push(newAsignacion)
  - Recalcula totales y porcentajes
  ↓
Cards y tabla se actualizan automáticamente
```

### **3. Cálculos Automáticos**

```typescript
// Al crear/actualizar asignación, se calculan:
Porcentaje = (cantidadSuscrita / totalAccionesClase) × 100
Capital = cantidadSuscrita × valorNominal
TotalAsignadas = suma de todas las asignaciones
CapitalSocial = TotalAsignadas × valorNominal
```

---

## 📋 Variables y Estado

### **Store Principal** (`useRegistroAsignacionAccionesStore`)

```typescript
{
  asignaciones: AsignacionAccion[],  // Lista de asignaciones
  status: 'idle' | 'loading' | 'success' | 'error',
}
```

**Getters:**

```typescript
{
  tablaAsignaciones: ComputedRef<AsignacionTabla[]>,  // Vista estructurada
  accionesDisponibles: ComputedRef<Record<string, number>>, // Por clase
  totalAccionesAsignadas: ComputedRef<number>,
  capitalSocial: ComputedRef<number>, // Total × valor nominal
}
```

### **Store Form** (`useAsignacionAccionesStore`)

```typescript
{
  formData: {
    accionistaId: string,
    accionId: string,
    cantidadSuscrita: number,
    precioPorAccion: number,
    porcentajePagadoPorAccion: number,
  },
  errors: Record<string, string>,
  isSubmitting: boolean,
}
```

### **Loader State** (`useAsignacionAccionesLoader`)

```typescript
{
  acciones: Accion[],
  accionistas: Accionista[],
  valorNominal: number,
  asignaciones: AsignacionAccion[],
  isLoadingAcciones: boolean,
  isLoadingAccionistas: boolean,
  isLoadingValorNominal: boolean,
  isLoadingAsignaciones: boolean,
}
```

---

## 🔗 Dependencias

### **Pasos Previos Requeridos**

- ✅ **Paso 0: Crear Sociedad** (siempre requerido)
- ✅ **Paso 2: Accionistas** (requerido)
  - Debe haber al menos un accionista
- ✅ **Paso 3: Acciones** (requerido)
  - Debe haber al menos una acción
- ⚠️ **Valor Nominal** (transversal, requerido)
  - Se crea automáticamente en `setupAccion()`

### **Pasos Posteriores que Dependen de Este**

- **Ninguno directamente**
- Los pasos siguientes pueden usar información de asignaciones pero no es requerida

---

## 🧪 Testing

### **Tests Existentes**

- `infrastructure/repositories/__tests__/asignacion.test.ts` ✅

### **Helpers de Test**

```typescript
// Crear contexto para este paso (incluye dependencias automáticamente)
const context = await createTestContextForStep("asignacion");
// context = { societyId, accionistaId, accionId }

// Crear asignación de prueba
const asignacion = createAsignacionPayload(context.accionistaId, context.accionId);

// Limpiar después
await cleanupTestContext(context);
```

### **Dependencias para Testing**

- **Requiere**: Sociedad + Accionistas + Acciones (creadas automáticamente por helper)
- **Crea**: Asignaciones

### **Ejemplo de Test**

```typescript
describe("Asignación de Acciones Repository", () => {
  let context: TestContext;

  beforeAll(async () => {
    // Helper crea automáticamente: sociedad + accionista + acción
    context = await createTestContextForStep("asignacion");
  });

  afterAll(async () => {
    await cleanupTestContext(context);
  });

  it("debe crear una asignación", async () => {
    const repository = new AsignacionAccionesHttpRepository();
    const asignacion = createAsignacionPayload(context.accionistaId, context.accionId);

    const result = await repository.create(context.societyId, asignacion);

    expect(result).toBeDefined();
    expect(typeof result).toBe("string"); // ID de asignación
  });
});
```

---

## 🛣️ Rutas y Navegación

**Ruta Base:**

```
/registros/sociedades/:id/asignacion-acciones
```

**Navegación:**

- **Anterior**: Paso 3 (Acciones) - `/registros/sociedades/:id/acciones`
- **Siguiente**: Paso 5 (Directorio) - `/registros/sociedades/:id/directorio`

**Configuración:**

- Definida en `app/config/society-register-navigation.ts`
- Slug: `asignacion-acciones`
- Título: "Asignación de Acciones"

---

## ⚠️ Problemas Conocidos

1. **Dependencias múltiples**

   - Requiere accionistas y acciones
   - Si falta alguno, el paso no puede funcionar
   - No hay validación explícita de dependencias

2. **Cálculos complejos**

   - Los porcentajes y capital se calculan en múltiples lugares
   - Puede haber inconsistencias si se calcula mal

3. **Inicialización desde accionistas**
   - Si no hay asignaciones, se inicializa estructura vacía desde accionistas
   - Puede ser confuso para el usuario

---

## 🔧 Mejoras Futuras

1. **Validación de dependencias**

   - Validar que existan accionistas y acciones antes de permitir asignar
   - Mostrar mensajes claros si faltan dependencias

2. **Cálculos centralizados**

   - Unificar lógica de cálculos en un solo lugar
   - Tests para validar cálculos

3. **Visualización mejorada**
   - Gráficos de distribución de acciones
   - Comparación de asignadas vs disponibles

---

## 📚 Referencias

- **Investigación Completa**: `docs/input/03-investigacion-registro-sociedades-completa.md`
- **Estrategia de Testing**: `docs/input/06-estrategia-testing-vitest-hexagonal.md`
- **Helpers de Test**: `tests/helpers/test-context-helpers.ts`
- **Data Helpers**: `tests/data/sociedades/test-data-sociedades.ts`

---

**Última actualización**: 2024  
**Mantenido por**: Equipo Frontend Probo v3

