# 📊 Paso 3: Acciones

**Paso**: 3 de 10  
**Ruta**: `/registros/sociedades/:id/acciones`  
**Slug**: `acciones`  
**Dependencias**: ✅ Paso 0 (Crear Sociedad)

---

## 🎯 Resumen

Este paso permite gestionar los tipos de acciones y el capital social de la sociedad. Incluye gestión de valor nominal (concepto transversal usado en múltiples pasos).

**Características principales:**

- CRUD completo de acciones (clases de acciones)
- Gestión de valor nominal (transversal)
- Acciones comunes y preferentes
- Cálculo de capital social
- Validaciones de consistencia

---

## 📊 Flujo de Datos

```
Usuario → AccionesManager.vue
  ↓
useRegistroAccionesStore (store)
  ↓
ListAccionesUseCase / CreateAccionUseCase / UpdateAccionUseCase / DeleteAccionUseCase
  ↓
AccionesRepository (port)
  ↓
AccionesHttpRepository (infrastructure)
  ↓
Backend API: GET/POST/PUT/DELETE /api/v2/society-profile/:id/actions
```

**Valor Nominal (transversal):**

```
useValorNominalStore (store transversal)
  ↓
GetValorNominalUseCase / UpdateValorNominalUseCase
  ↓
ValorNominalRepository (port)
  ↓
ValorNominalHttpRepository (infrastructure)
  ↓
Backend API: GET/PUT /api/v2/society-profile/:id/nominal-value
```

---

## 🏗️ Arquitectura por Capa

### **Domain Layer**

**Entidades:**

- `Accion` - Entidad principal

```typescript
interface Accion {
  id: string;
  tipo: TipoAccionEnum; // COMUN, PREFERENCIAL, SIN_DERECHO_A_VOTO
  nombreAccion: string;
  accionesSuscritas: number;
  derechoVoto: boolean;
  redimible: boolean;
  otrosDerechosEspeciales: boolean;
  obligacionesAdicionales: boolean;
  comentariosAdicionales: boolean;
}
```

**Value Objects:**

- `ValorNominal` (transversal) - Valor nominal de las acciones
  - Se usa en múltiples pasos (3, 4, etc.)
  - Tiene su propio repository y use cases en capa transversal

**Ports (Interfaces):**

- `AccionesRepository` - Contrato del repositorio

```typescript
interface AccionesRepository {
  list(profileId: string): Promise<Accion[]>;
  create(profileId: string, payload: AccionDTO): Promise<Accion>;
  update(profileId: string, accionId: string, payload: AccionDTO): Promise<Accion>;
  delete(profileId: string, accionId: string): Promise<void>;
}
```

- `ValorNominalRepository` (transversal)

```typescript
interface ValorNominalRepository {
  get(profileId: string): Promise<ValorNominal | null>;
  update(profileId: string, payload: ValorNominalDTO): Promise<ValorNominal>;
}
```

**Enums:**

- `TipoAccionEnum` - Tipos de acciones (COMUN, PREFERENCIAL, SIN_DERECHO_A_VOTO)

---

### **Application Layer**

**DTOs:**

- `AccionDTO` - Acción individual (bidireccional)
- `ValorNominalDTO` - Valor nominal (transversal, bidireccional)

**Use Cases:**

- `ListAccionesUseCase` - Lista acciones
- `CreateAccionUseCase` - Crea acción
- `UpdateAccionUseCase` - Actualiza acción
- `DeleteAccionUseCase` - Elimina acción
- `GetValorNominalUseCase` - Obtiene valor nominal (transversal)
- `UpdateValorNominalUseCase` - Actualiza valor nominal (transversal)

**Flujo de Use Cases:**

```typescript
// List
ListAccionesUseCase.execute(profileId)
  → AccionesRepository.list(profileId)
  → Retorna Accion[]

// Create
CreateAccionUseCase.execute(profileId, payload)
  → AccionesRepository.create(profileId, payload)
  → Retorna Accion

// Valor Nominal
GetValorNominalUseCase.execute(profileId)
  → ValorNominalRepository.get(profileId)
  → Retorna ValorNominal | null

UpdateValorNominalUseCase.execute(profileId, payload)
  → ValorNominalRepository.update(profileId, payload)
  → Retorna ValorNominal
```

---

### **Infrastructure Layer**

**Repositories:**

- `AccionesHttpRepository` - Implementación HTTP
  - `GET /api/v2/society-profile/:id/actions` → List
  - `POST /api/v2/society-profile/:id/actions` → Create
  - `PUT /api/v2/society-profile/:id/actions/:actionId` → Update
  - `DELETE /api/v2/society-profile/:id/actions/:actionId` → Delete
- `ValorNominalHttpRepository` (transversal)
  - `GET /api/v2/society-profile/:id/nominal-value` → Get
  - `PUT /api/v2/society-profile/:id/nominal-value` → Update

**Mappers:**

- `AccionesMapper` - Transforma DTO ↔ Entity
  - Maneja tipos de acciones
  - Normaliza campos booleanos

---

### **Presentation Layer**

**Stores (Pinia - Option API):**

1. **`useRegistroAccionesStore`** (principal):

   - Estado: `acciones[]`, `status`
   - Actions: `loadAcciones()`, `create()`, `update()`, `delete()`
   - Getters:
     - `totalAcciones` - Suma total de acciones suscritas

2. **`useClasesAccionesStore`** (modal):

   - Estado del modal de clases
   - Gestión de clases de acciones

3. **`useAccionesComunesStore`** (modal):

   - Estado del modal de acciones comunes
   - Gestión de acciones comunes

4. **`useValorNominalStore`** (transversal):
   - Estado: `valor` (número)
   - Actions: `load()`, `update()`
   - Usado en múltiples pasos (3, 4, etc.)

**Components:**

- `AccionesManager.vue` - Componente principal
  - Lista de acciones/clases
  - Gestión de valor nominal
  - Modales para crear/editar clases y acciones comunes
  - Validaciones de capital social

---

## 🔄 Flujo Completo

### **1. Carga Inicial**

```typescript
// Componente se monta
AccionesManager.vue mounted
  ↓
loadAcciones() ejecuta
  ↓
ListAccionesUseCase.execute(profileId)
  ↓
AccionesHttpRepository.list(profileId)
  ↓
GET /api/v2/society-profile/:id/actions
  ↓
Backend responde (200 con array de acciones)
  ↓
Store actualiza: acciones = response[]
  ↓
// También carga valor nominal
loadValorNominal() ejecuta
  ↓
GetValorNominalUseCase.execute(profileId)
  ↓
ValorNominalHttpRepository.get(profileId)
  ↓
GET /api/v2/society-profile/:id/nominal-value
  ↓
Store actualiza: valorNominal = response.valor
  ↓
Componente renderiza lista y valor nominal
```

### **2. Crear Acción**

```typescript
// Usuario hace click en "Agregar Acción"
Modal se abre
  ↓
Usuario completa datos (tipo, nombre, cantidad, etc.)
  ↓
Validación
  ↓
Al guardar → store.create(payload)
  ↓
CreateAccionUseCase.execute(profileId, payload)
  ↓
AccionesHttpRepository.create(profileId, payload)
  ↓
POST /api/v2/society-profile/:id/actions
  ↓
Backend responde (200 con acción creada)
  ↓
Store actualiza: acciones.push(newAccion)
  ↓
Store recalcula: totalAcciones
  ↓
Lista se actualiza
```

### **3. Actualizar Valor Nominal**

```typescript
// Usuario modifica valor nominal
Form de valor nominal
  ↓
Al guardar → valorNominalStore.update(payload)
  ↓
UpdateValorNominalUseCase.execute(profileId, payload)
  ↓
ValorNominalHttpRepository.update(profileId, payload)
  ↓
PUT /api/v2/society-profile/:id/nominal-value
  ↓
Backend responde (200 con valor actualizado)
  ↓
Store actualiza: valorNominal = newValor
  ↓
Componente muestra nuevo valor
```

---

## 📋 Variables y Estado

### **Store Principal** (`useRegistroAccionesStore`)

```typescript
{
  acciones: Accion[],              // Lista de acciones
  status: 'idle' | 'loading' | 'success' | 'error',
}
```

**Getters:**

```typescript
{
  totalAcciones: ComputedRef<number>, // Suma de accionesSuscritas
}
```

### **Store Valor Nominal** (`useValorNominalStore` - transversal)

```typescript
{
  valor: number | null,            // Valor nominal
  isLoading: boolean,
  isSaving: boolean,
}
```

### **Store Modal Clases** (`useClasesAccionesStore`)

```typescript
{
  isOpen: boolean,
  selectedClase: Accion | null,
  formData: AccionDTO,
}
```

---

## 🔗 Dependencias

### **Pasos Previos Requeridos**

- ✅ **Paso 0: Crear Sociedad** (siempre requerido)
- ⚠️ **Valor Nominal**: Debe crearse ANTES de crear acciones (se crea automáticamente en `setupAccion()`)

### **Pasos Posteriores que Dependen de Este**

- ✅ **Paso 4: Asignación de Acciones** (requiere acciones)
  - Necesita acciones para asignar a accionistas

---

## 🧪 Testing

### **Tests Existentes**

- `infrastructure/repositories/__tests__/acciones.test.ts` ✅

### **Helpers de Test**

```typescript
// Crear contexto para este paso
const context = await createTestContextForStep("acciones");
// context = { societyId }
// Nota: setupAccion() ya crea valor nominal automáticamente

// Crear acción de prueba
const accion = createTestAccion(TipoAccionEnum.COMUN, 500);

// Limpiar después
await cleanupTestContext(context);
```

### **Dependencias para Testing**

- **Requiere**: Solo sociedad (Paso 0)
- **Crea**: Valor nominal (automático) + Acciones

### **Ejemplo de Test**

```typescript
describe("Acciones Repository", () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestContextForStep("acciones");
  });

  afterAll(async () => {
    await cleanupTestContext(context);
  });

  it("debe crear una acción", async () => {
    const repository = new AccionesHttpRepository();
    const accion = createTestAccion(TipoAccionEnum.COMUN, 500);

    await repository.create(context.societyId, accion);

    const acciones = await repository.list(context.societyId);
    expect(acciones.length).toBe(1);
    expect(acciones[0]?.accionesSuscritas).toBe(500);
  });
});
```

---

## 🛣️ Rutas y Navegación

**Ruta Base:**

```
/registros/sociedades/:id/acciones
```

**Navegación:**

- **Anterior**: Paso 2 (Accionistas) - `/registros/sociedades/:id/accionistas`
- **Siguiente**: Paso 4 (Asignación de Acciones) - `/registros/sociedades/:id/asignacion-acciones`

**Configuración:**

- Definida en `app/config/society-register-navigation.ts`
- Slug: `acciones`
- Título: "Acciones"

---

## ⚠️ Problemas Conocidos

1. **Valor Nominal Transversal**

   - Tiene su propio repository en capa transversal
   - Se usa en múltiples pasos (3, 4)
   - Puede causar confusión sobre dónde gestionarlo

2. **Múltiples stores de modales**

   - `useClasesAccionesStore` y `useAccionesComunesStore`
   - Podrían unificarse

3. **Validación de capital social**
   - No hay validación explícita de que el capital sea consistente
   - Depende de validaciones en el backend

---

## 🔧 Mejoras Futuras

1. **Unificar stores de modales**

   - Un solo store para todos los modales
   - Reducir duplicación

2. **Validaciones de capital social**

   - Validar que el capital sea consistente
   - Mostrar advertencias si hay inconsistencias

3. **Cálculo automático de capital**
   - Calcular capital social en tiempo real
   - Mostrar totales y desgloses

---

## 📚 Referencias

- **Investigación Completa**: `docs/input/03-investigacion-registro-sociedades-completa.md`
- **Estrategia de Testing**: `docs/input/06-estrategia-testing-vitest-hexagonal.md`
- **Helpers de Test**: `tests/helpers/test-context-helpers.ts`
- **Data Helpers**: `tests/helpers/seed-helpers.ts`

---

**Última actualización**: 2024  
**Mantenido por**: Equipo Frontend Probo v3

