# 📝 Paso 1: Datos de Sociedad

**Paso**: 1 de 10  
**Ruta**: `/registros/sociedades/:id/datos-sociedad`  
**Slug**: `datos-sociedad`  
**Dependencias**: ✅ Paso 0 (Crear Sociedad)

---

## 🎯 Resumen

Este paso permite registrar los datos generales de una sociedad comercial, incluyendo información fiscal (RUC), razón social, dirección, y datos de registro en SUNARP (Registros Públicos).

**Campos principales:**

- RUC (búsqueda automática)
- Tipo de sociedad (S.A.C., S.A., E.I.R.L., etc.)
- Razón social y nombre comercial
- Dirección completa (distrito, provincia, departamento)
- Fechas de inscripción (RUC, escritura pública, registros públicos)
- Partida registral y oficina registral

---

## 📊 Flujo de Datos

```
Usuario → DatosSociedadForm.vue
  ↓
useDatosSociedad (composable)
  ↓
GetDatosSociedadUseCase / CreateDatosSociedadUseCase / UpdateDatosSociedadUseCase
  ↓
DatosSociedadRepository (port)
  ↓
DatosSociedadHttpRepository (infrastructure)
  ↓
Backend API: GET/PUT /api/v2/society-profile/:id/society
```

---

## 🏗️ Arquitectura por Capa

### **Domain Layer**

**Entidades:**

- `SociedadDatosGenerales` - Entidad principal con todos los campos

```typescript
interface SociedadDatosGenerales {
  idSociety: string;
  numeroRuc: string;
  tipoSocietario: string;
  razonSocial: string;
  nombreComercial: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  fechaInscripcionRuc: string;
  actividadExterior: string;
  fechaEscrituraPublica: string;
  fechaRegistrosPublicos: string;
  partidaRegistral: string;
  oficinaRegistral: string;
  updatedAt: string;
  createdAt: string;
}
```

**Schemas Zod:**

- `rucSchema` - Validación de RUC (11 dígitos)
- `tipoSociedadSchema` - Tipo de sociedad
- `razonSocialSchema` - Razón social
- `nombreComercialSchema` - Nombre comercial
- `direccionSchema` - Dirección
- `distritoSchema`, `provinciaSchema`, `departamentoSchema` - Ubicación
- `fechaInscripcionRucSchema` - Fecha de inscripción RUC
- `actividadExteriorSchema` - Actividad económica
- `fechaEscrituraPublicaSchema` - Fecha de escritura pública
- `fechaRegistrosPublicosSchema` - Fecha de registros públicos
- `partidaRegistralSchema` - Partida registral
- `oficinaRegistralSchema` - Oficina registral

**Ports (Interfaces):**

- `DatosSociedadRepository` - Contrato del repositorio

```typescript
interface DatosSociedadRepository {
  get(idSociety: string): Promise<SociedadDatosGenerales | null>;
  create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales>;
  update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales>;
}
```

**Enums:**

- No hay enums específicos (usa strings del backend)

---

### **Application Layer**

**DTOs:**

- `DatosSociedadDTO` - Bidireccional (request y response)

```typescript
interface DatosSociedadDTO {
  idSociety?: string; // Opcional en request
  numeroRuc: string;
  tipoSocietario: string;
  razonSocial: string;
  nombreComercial: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  fechaInscripcionRuc: string;
  actividadExterior: string;
  fechaEscrituraPublica: string;
  fechaRegistrosPublicos: string;
  partidaRegistral: string;
  oficinaRegistral: string;
}
```

**Use Cases:**

- `GetDatosSociedadUseCase` - Obtiene datos existentes
- `CreateDatosSociedadUseCase` - Crea nuevos datos
- `UpdateDatosSociedadUseCase` - Actualiza datos existentes

**Flujo de Use Cases:**

```typescript
// Get
GetDatosSociedadUseCase.execute(idSociety)
  → DatosSociedadRepository.get(idSociety)
  → Retorna SociedadDatosGenerales | null

// Create/Update (ambos usan PUT)
CreateDatosSociedadUseCase.execute(idSociety, payload)
  → DatosSociedadRepository.create(idSociety, payload)
  → Retorna SociedadDatosGenerales

UpdateDatosSociedadUseCase.execute(idSociety, payload)
  → DatosSociedadRepository.update(idSociety, payload)
  → Retorna SociedadDatosGenerales
```

---

### **Infrastructure Layer**

**Repositories:**

- `DatosSociedadHttpRepository` - Implementación HTTP
  - `GET /api/v2/society-profile/:id/society` → Get
  - `PUT /api/v2/society-profile/:id/society` → Create/Update
- `DatosSociedadMswRepository` - Implementación MSW (mocks)

**Mappers:**

- `DatosSociedadMapper` - Transforma DTO ↔ Entity

**Transformaciones:**

- `toDomain(response: BackendResponse)`: Backend → Entity
  - Maneja múltiples formatos de backend (legacy y nuevo)
  - Normaliza códigos (tipo sociedad, oficina registral)
  - Convierte campos del backend a formato de dominio
- `toPayload(entity: SociedadDatosGenerales)`: Entity → DTO
  - Convierte entidad a formato que espera el backend

---

### **Presentation Layer**

**Stores (Pinia - Option API):**

- No hay store específico para este paso
- Se usa directamente el composable

**Composables:**

- `useDatosSociedad` - Orquesta la lógica de UI

**Funcionalidad:**

- Estado reactivo: `datos`, `isLoading`, `isSaving`, `error`, `exists`
- Métodos:
  - `fetch()` - Carga datos existentes
  - `save()` - Guarda datos (auto-detecta create vs update)

**Características:**

- Maneja errores (404 = no existe, otros = error real)
- Auto-detecta si es create o update basado en `exists`
- Estado reactivo con computed refs

**Components:**

- `DatosSociedadForm.vue` - Formulario principal

**Funcionalidad:**

- Formulario reactivo con `vee-validate`
- Validación con schemas Zod
- Emite `completion-change` cuando se guarda exitosamente

**Flujo:**

1. Componente se monta con `societyId`
2. `useDatosSociedad` carga datos automáticamente
3. Usuario completa/edita formulario
4. Al hacer click en "Siguiente", valida y guarda
5. Si guarda exitosamente, emite evento para avanzar al siguiente paso

**Campos del Formulario:**

- RUC (búsqueda)
- Tipo de sociedad (select)
- Razón social (input)
- Nombre comercial (input)
- Dirección (input)
- Distrito, Provincia, Departamento (selects)
- Fecha inscripción RUC (date picker)
- Actividad exterior (input)
- Fecha escritura pública (date picker)
- Fecha registros públicos (date picker)
- Partida registral (input)
- Oficina registral (select)

---

## 🔄 Flujo Completo

### **1. Carga Inicial**

```typescript
// Componente se monta
DatosSociedadForm.vue mounted
  ↓
useDatosSociedad() inicializa
  ↓
fetch() ejecuta automáticamente
  ↓
GetDatosSociedadUseCase.execute(societyId)
  ↓
DatosSociedadHttpRepository.get(societyId)
  ↓
GET /api/v2/society-profile/:id/society
  ↓
Backend responde (200 con datos o 404 si no existe)
  ↓
DatosSociedadMapper.toDomain(response)
  ↓
Store actualiza: datos = mappedData, exists = true
  ↓
Componente renderiza formulario con datos
```

### **2. Guardado**

```typescript
// Usuario completa formulario y hace click en "Siguiente"
handleNext() ejecuta
  ↓
validate() (vee-validate + Zod)
  ↓
Si válido → save() ejecuta
  ↓
Si exists → UpdateDatosSociedadUseCase
Si no → CreateDatosSociedadUseCase
  ↓
DatosSociedadHttpRepository.create/update(societyId, payload)
  ↓
PUT /api/v2/society-profile/:id/society
  ↓
Backend responde (200 con datos actualizados)
  ↓
DatosSociedadMapper.toDomain(response)
  ↓
Store actualiza: datos = mappedData, isSaving = false
  ↓
Componente emite 'completion-change' → Navega al siguiente paso
```

---

## 📋 Variables y Estado

### **Composable State** (`useDatosSociedad`)

```typescript
{
  datos: ComputedRef<SociedadDatosGenerales | null>,  // Datos actuales
  isLoading: ComputedRef<boolean>,                   // Cargando datos
  isSaving: ComputedRef<boolean>,                      // Guardando datos
  error: ComputedRef<string | null>,                  // Error actual
  exists: ComputedRef<boolean>,                        // Si los datos ya existen
}
```

### **Form State** (`DatosSociedadForm.vue`)

```typescript
{
  formData: {
    numeroRuc: string,
    tipoSocietario: string,
    razonSocial: string,
    nombreComercial: string,
    direccion: string,
    distrito: string,
    provincia: string,
    departamento: string,
    fechaInscripcionRuc: string,
    actividadExterior: string,
    fechaEscrituraPublica: string,
    fechaRegistrosPublicos: string,
    partidaRegistral: string,
    oficinaRegistral: string,
  },
  isSubmitting: boolean,
  errors: Record<string, string>,
}
```

---

## 🔗 Dependencias

### **Pasos Previos Requeridos**

- ✅ **Paso 0: Crear Sociedad** (siempre requerido)
  - Debe existir `societyId` válido
  - El backend crea el perfil base

### **Pasos Posteriores que Dependen de Este**

- **Ninguno directamente** - Este es el primer paso de datos
- Los pasos siguientes (Accionistas, Acciones, etc.) pueden usar información de este paso pero no es requerida

---

## 🧪 Testing

### **Tests Existentes**

- `infrastructure/repositories/__tests__/datos-sociedad.test.ts` ✅

### **Helpers de Test**

```typescript
// Crear contexto para este paso
const context = await createTestContextForStep("datos-sociedad");
// context = { societyId }

// Crear datos de prueba
const datos = createDatosSociedadPayload();

// Limpiar después
await cleanupTestContext(context);
```

### **Dependencias para Testing**

- **Requiere**: Solo sociedad (Paso 0)
- **Crea**: Datos de sociedad completos

### **Ejemplo de Test**

```typescript
describe("Datos Sociedad Repository", () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestContextForStep("datos-sociedad");
  });

  afterAll(async () => {
    await cleanupTestContext(context);
  });

  it("debe crear datos de sociedad", async () => {
    const repository = new DatosSociedadHttpRepository();
    const datos = createDatosSociedadPayload();

    await repository.create(context.societyId, datos);

    const result = await repository.get(context.societyId);
    expect(result?.razonSocial).toBe(datos.razonSocial);
  });
});
```

---

## 🛣️ Rutas y Navegación

**Ruta Base:**

```
/registros/sociedades/:id/datos-sociedad
```

**Navegación:**

- **Anterior**: Paso 0 (Crear Sociedad) - `/registros/sociedades`
- **Siguiente**: Paso 2 (Accionistas) - `/registros/sociedades/:id/accionistas`

**Configuración:**

- Definida en `app/config/society-register-navigation.ts`
- Slug: `datos-sociedad`
- Título: "Datos de Sociedad"

---

## ⚠️ Problemas Conocidos

1. **Múltiples formatos de backend**

   - El mapper maneja formatos legacy y nuevo
   - Puede causar confusión si el backend cambia

2. **Auto-detección de create vs update**

   - Se basa en si existe o no (404)
   - Si hay error de red, puede confundirse

3. **Validación de RUC**
   - La búsqueda de RUC es externa
   - Si falla, el usuario debe ingresar manualmente

---

## 🔧 Mejoras Futuras

1. **Cache de datos**

   - Los datos se cargan cada vez que se monta el componente
   - Podría cachearse en store global

2. **Validación de RUC en tiempo real**

   - Validar formato mientras el usuario escribe
   - Mostrar sugerencias de búsqueda

3. **Autocompletado de dirección**
   - Integrar con API de geocodificación
   - Autocompletar distrito/provincia/departamento

---

## 📚 Referencias

- **Investigación Completa**: `docs/input/03-investigacion-registro-sociedades-completa.md`
- **Estrategia de Testing**: `docs/input/06-estrategia-testing-vitest-hexagonal.md`
- **Helpers de Test**: `tests/helpers/test-context-helpers.ts`
- **Data Helpers**: `tests/data/sociedades/test-data-sociedades.ts`

---

**Última actualización**: 2024  
**Mantenido por**: Equipo Frontend Probo v3

