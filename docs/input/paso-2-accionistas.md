# 👥 Paso 2: Accionistas

**Paso**: 2 de 10  
**Ruta**: `/registros/sociedades/:id/accionistas`  
**Slug**: `accionistas`  
**Dependencias**: ✅ Paso 0 (Crear Sociedad)

---

## 🎯 Resumen

Este paso permite gestionar la lista de accionistas de la sociedad. Soporta múltiples tipos de personas: natural, jurídica, sucursal, fideicomisos, fondos de inversión, y sucesiones indivisas.

**Características principales:**

- CRUD completo de accionistas
- Soporte para 6 tipos diferentes de personas
- Gestión de representantes (para personas jurídicas)
- Participación porcentual opcional
- Validaciones específicas por tipo de persona

---

## 📊 Flujo de Datos

```
Usuario → AccionistasManager.vue
  ↓
useAccionistasController (controller)
  ↓
useRegistroAccionistasStore (store)
  ↓
ListAccionistasUseCase / CreateAccionistaUseCase / UpdateAccionistaUseCase / DeleteAccionistaUseCase
  ↓
AccionistasRepository (port)
  ↓
AccionistasHttpRepository (infrastructure)
  ↓
Backend API: GET/POST/PUT/DELETE /api/v2/society-profile/:id/shareholders
```

---

## 🏗️ Arquitectura por Capa

### **Domain Layer**

**Entidades:**

- `Accionista` - Entidad principal

```typescript
interface Accionista {
  id: string;
  persona: Persona; // Union type de 6 tipos diferentes
  participacionPorcentual?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

- `Persona` - Union type con 6 variantes

```typescript
type Persona =
  | PersonaNatural
  | PersonaJuridica
  | PersonaSucursal
  | PersonaFideicomiso
  | PersonaFondoInversion
  | PersonaSucesionIndivisa;
```

**Tipos de Persona:**

1. **PersonaNatural**:

   - nombre, apellidoPaterno, apellidoMaterno
   - tipoDocumento (DNI), numeroDocumento
   - fechaNacimiento, nacionalidad, estadoCivil
   - direccion, distrito, provincia, departamento

2. **PersonaJuridica**:

   - razonSocial, numeroDocumento (RUC), tipoDocumento
   - direccion, distrito, provincia, departamento
   - constituida: boolean
   - representante: Representante (opcional)

3. **PersonaSucursal**:

   - nombreSucursal, numeroDocumento (RUC)
   - partidaRegistral
   - representante: Representante

4. **PersonaFideicomiso**:

   - razonSocial, numeroDocumento (RUC)
   - numeroRegistro
   - fiduciario: Representante
   - representante: Representante

5. **PersonaFondoInversion**:

   - razonSocial, numeroDocumento (RUC)
   - tipoFondo
   - fiduciario: Representante
   - representante: Representante

6. **PersonaSucesionIndivisa**:
   - razonSocial, numeroDocumento (RUC)
   - direccion, distrito, provincia, departamento
   - representante: Representante

**Ports (Interfaces):**

- `AccionistasRepository` - Contrato del repositorio

```typescript
interface AccionistasRepository {
  list(profileId: string): Promise<Accionista[]>;
  create(profileId: string, payload: AccionistaDTO): Promise<Accionista>;
  update(profileId: string, payload: AccionistaDTO): Promise<Accionista>;
  delete(profileId: string, accionistaId: string): Promise<void>;
}
```

**Enums:**

- `PersonaTipo` - Tipos de persona disponibles

---

### **Application Layer**

**DTOs:**

- `AccionistaDTO` - Bidireccional

```typescript
interface AccionistaDTO {
  id?: string; // Opcional en create
  persona: Persona; // Incluye todos los campos según tipo
  participacionPorcentual?: number;
}
```

**Use Cases:**

- `ListAccionistasUseCase` - Lista todos los accionistas
- `CreateAccionistaUseCase` - Crea nuevo accionista
- `UpdateAccionistaUseCase` - Actualiza accionista existente
- `DeleteAccionistaUseCase` - Elimina accionista

**Flujo de Use Cases:**

```typescript
// List
ListAccionistasUseCase.execute(profileId)
  → AccionistasRepository.list(profileId)
  → Retorna Accionista[]

// Create
CreateAccionistaUseCase.execute(profileId, payload)
  → AccionistasRepository.create(profileId, payload)
  → Retorna Accionista

// Update
UpdateAccionistaUseCase.execute(profileId, payload)
  → AccionistasRepository.update(profileId, payload)
  → Retorna Accionista

// Delete
DeleteAccionistaUseCase.execute(profileId, accionistaId)
  → AccionistasRepository.delete(profileId, accionistaId)
  → Retorna void
```

---

### **Infrastructure Layer**

**Repositories:**

- `AccionistasHttpRepository` - Implementación HTTP
  - `GET /api/v2/society-profile/:id/shareholders` → List
  - `POST /api/v2/society-profile/:id/shareholders` → Create
  - `PUT /api/v2/society-profile/:id/shareholders/:accionistaId` → Update
  - `DELETE /api/v2/society-profile/:id/shareholders/:accionistaId` → Delete
- `AccionistasMswRepository` - Implementación MSW (mocks)

**Mappers:**

- `AccionistasMapper` - Transforma DTO ↔ Entity

**Transformaciones:**

- `toDomain(payload)`: Backend → Entity
  - Detecta tipo de persona por campo `tipo`
  - Mapea cada tipo de persona con campos específicos
  - Normaliza representante (puede venir como `representante` o `representadoPor`)
  - Maneja campos opcionales según tipo
- `toPayload(dto)`: DTO → Backend
  - Deep clone para evitar mutaciones
  - Limpia campos opcionales (ej: apellidoMaterno si está vacío)
  - Normaliza formato según tipo de persona

---

### **Presentation Layer**

**Stores (Pinia - Option API):**

1. **`useRegistroAccionistasStore`** (store principal):

   - Estado: `accionistas[]`, `status`, `errorMessage`
   - Actions: `loadAccionistas()`, `create()`, `update()`, `remove()`
   - Gestiona CRUD completo
   - Usa use cases directamente

2. **Stores de formularios** (uno por tipo de persona):

   - `useAccionistaNaturalStore` - Form para persona natural
   - `useAccionistaJuridicoStore` - Form para persona jurídica
   - `useAccionistaSucursalStore` - Form para sucursal
   - `useAccionistaFideicomisosStore` - Form para fideicomisos
   - `useAccionistaFondosInversionStore` - Form para fondos
   - `useAccionistaSucesionesIndivisasStore` - Form para sucesiones

   Cada store de formulario:

   - Estado local del formulario
   - Validaciones específicas del tipo
   - Reset cuando se cambia de tipo

**Composables:**

- `useAccionistas` - Lógica de UI similar a `useDatosSociedad`
  - Estado: `accionistas[]`, `isLoading`, `isSaving`, `error`
  - Métodos: `fetchAll()`, `create()`, `update()`, `remove()`
  - Actualiza lista local después de operaciones

**Controllers:**

- `useAccionistasController` - Orquesta la carga inicial
  - Bootstrap automático al montar
  - Cache con TTL
  - Force initial para datos actualizados

**Components:**

1. **`AccionistasManager.vue`** (componente principal):

   - Lista de accionistas en tabla
   - Botones para agregar/editar/eliminar
   - Modal para crear/editar
   - Integración con stores y controller

2. **`AccionistaModal.vue`**:

   - Modal reutilizable para crear/editar
   - Selector de tipo de persona
   - Renderiza form específico según tipo

3. **`AccionistaForm.vue`** (genérico):

   - Router para renderizar form específico

4. **Forms específicos** (uno por tipo):
   - `AccionistaNaturalForm.vue`
   - `AccionistaJuridicoForm.vue`
   - `AccionistaSucursalForm.vue`
   - `AccionistaFideicomisoForm.vue`
   - `AccionistaFondoInversionForm.vue`
   - `AccionistaSucesionIndivisaForm.vue`

---

## 🔄 Flujo Completo

### **1. Carga Inicial**

```typescript
// Componente se monta
AccionistasManager.vue mounted
  ↓
useAccionistasController() inicializa
  ↓
loadAccionistas() ejecuta automáticamente
  ↓
ListAccionistasUseCase.execute(profileId)
  ↓
AccionistasHttpRepository.list(profileId)
  ↓
GET /api/v2/society-profile/:id/shareholders
  ↓
Backend responde (200 con array de accionistas)
  ↓
AccionistasMapper.toDomain(response[]) (por cada accionista)
  ↓
Store actualiza: accionistas = mappedData[]
  ↓
Componente renderiza tabla con lista
```

### **2. Crear Accionista**

```typescript
// Usuario hace click en "Agregar Accionista"
Modal se abre
  ↓
Usuario selecciona tipo de persona
  ↓
Form específico se renderiza (ej: AccionistaNaturalForm)
  ↓
Usuario completa datos
  ↓
Validación con schemas específicos del tipo
  ↓
Al guardar → store.create(payload)
  ↓
CreateAccionistaUseCase.execute(profileId, payload)
  ↓
AccionistasHttpRepository.create(profileId, payload)
  ↓
POST /api/v2/society-profile/:id/shareholders
  ↓
Backend responde (200 con accionista creado)
  ↓
AccionistasMapper.toDomain(response)
  ↓
Store actualiza: accionistas.push(newAccionista)
  ↓
Tabla se actualiza automáticamente
  ↓
Modal se cierra
```

### **3. Editar Accionista**

```typescript
// Usuario hace click en "Editar" en un accionista
Modal se abre con datos prellenados
  ↓
Form se renderiza con datos existentes
  ↓
Usuario modifica datos
  ↓
Validación
  ↓
Al guardar → store.update(payload)
  ↓
UpdateAccionistaUseCase.execute(profileId, payload)
  ↓
AccionistasHttpRepository.update(profileId, accionistaId, payload)
  ↓
PUT /api/v2/society-profile/:id/shareholders/:accionistaId
  ↓
Backend responde (200 con accionista actualizado)
  ↓
Store actualiza: accionistas[index] = updatedAccionista
  ↓
Tabla se actualiza
```

### **4. Eliminar Accionista**

```typescript
// Usuario hace click en "Eliminar"
Confirmación se muestra
  ↓
Usuario confirma
  ↓
store.remove(accionistaId)
  ↓
DeleteAccionistaUseCase.execute(profileId, accionistaId)
  ↓
AccionistasHttpRepository.delete(profileId, accionistaId)
  ↓
DELETE /api/v2/society-profile/:id/shareholders/:accionistaId
  ↓
Backend responde (200)
  ↓
Store actualiza: accionistas = accionistas.filter(a => a.id !== accionistaId)
  ↓
Tabla se actualiza
```

---

## 📋 Variables y Estado

### **Store Principal** (`useRegistroAccionistasStore`)

```typescript
{
  accionistas: Accionista[],        // Lista de accionistas
  status: 'idle' | 'loading' | 'success' | 'error',
  errorMessage: string | null,
}
```

### **Store de Formulario** (ej: `useAccionistaNaturalStore`)

```typescript
{
  formData: {
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    tipoDocumento: string,
    numeroDocumento: string,
    fechaNacimiento: string,
    nacionalidad: string,
    estadoCivil: string,
    direccion: string,
    distrito: string,
    provincia: string,
    departamento: string,
    participacionPorcentual?: number,
  },
  errors: Record<string, string>,
  isSubmitting: boolean,
}
```

### **Composable State** (`useAccionistas`)

```typescript
{
  accionistas: ComputedRef<Accionista[]>,
  isLoading: ComputedRef<boolean>,
  isSaving: ComputedRef<boolean>,
  error: ComputedRef<string | null>,
}
```

---

## 🔗 Dependencias

### **Pasos Previos Requeridos**

- ✅ **Paso 0: Crear Sociedad** (siempre requerido)
  - Debe existir `societyId` válido

### **Pasos Posteriores que Dependen de Este**

- ✅ **Paso 4: Asignación de Acciones** (requiere accionistas)
  - Necesita accionistas para asignar acciones

---

## 🧪 Testing

### **Tests Existentes**

- `infrastructure/repositories/__tests__/accionistas.test.ts` ✅

### **Helpers de Test**

```typescript
// Crear contexto para este paso
const context = await createTestContextForStep("accionistas");
// context = { societyId }

// Crear accionista de prueba
const accionista = createTestAccionistaNatural(1);

// Limpiar después
await cleanupTestContext(context);
```

### **Dependencias para Testing**

- **Requiere**: Solo sociedad (Paso 0)
- **Crea**: Accionistas (puede crear múltiples)

### **Ejemplo de Test**

```typescript
describe("Accionistas Repository", () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestContextForStep("accionistas");
  });

  afterAll(async () => {
    await cleanupTestContext(context);
  });

  it("debe crear un accionista", async () => {
    const repository = new AccionistasHttpRepository();
    const accionista = createTestAccionistaNatural(1);

    const result = await repository.create(context.societyId, accionista);

    expect(result.id).toBeDefined();
    expect(result.persona.nombre).toBe(accionista.persona.nombre);
  });
});
```

---

## 🛣️ Rutas y Navegación

**Ruta Base:**

```
/registros/sociedades/:id/accionistas
```

**Navegación:**

- **Anterior**: Paso 1 (Datos Sociedad) - `/registros/sociedades/:id/datos-sociedad`
- **Siguiente**: Paso 3 (Acciones) - `/registros/sociedades/:id/acciones`

**Configuración:**

- Definida en `app/config/society-register-navigation.ts`
- Slug: `accionistas`
- Título: "Accionistas"

---

## ⚠️ Problemas Conocidos

1. **Múltiples stores de formulario**

   - Hay un store por tipo de persona
   - Puede causar confusión sobre cuál usar

2. **Complejidad del mapper**

   - Maneja 6 tipos diferentes de persona
   - Transformaciones complejas según tipo

3. **Validaciones por tipo**
   - Cada tipo tiene validaciones específicas
   - Puede ser difícil mantener consistencia

---

## 🔧 Mejoras Futuras

1. **Unificar stores de formulario**

   - Un solo store que maneje todos los tipos
   - Reducir duplicación

2. **Mejorar validaciones**

   - Validaciones más estrictas por tipo
   - Mensajes de error más claros

3. **Búsqueda de RUC/DNI**
   - Integrar con APIs externas para autocompletar
   - Validar documentos en tiempo real

---

## 📚 Referencias

- **Investigación Completa**: `docs/input/03-investigacion-registro-sociedades-completa.md`
- **Estrategia de Testing**: `docs/input/06-estrategia-testing-vitest-hexagonal.md`
- **Helpers de Test**: `tests/helpers/test-context-helpers.ts`
- **Data Helpers**: `tests/helpers/seed-helpers.ts`

---

**Última actualización**: 2024  
**Mantenido por**: Equipo Frontend Probo v3

