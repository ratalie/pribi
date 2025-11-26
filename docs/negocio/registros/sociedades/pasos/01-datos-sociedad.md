# 📋 Paso 1: Datos de Sociedad - Documentación Completa

## 🎯 Descripción

Este paso captura los **datos principales** de la sociedad: RUC, razón social, dirección, tipo de sociedad, fechas de registro, etc.

**Tipo**: Formulario único (1 registro por sociedad)

---

## 📁 Estructura del Módulo

```
app/core/hexag/registros/sociedades/pasos/datos-sociedad/
├── domain/
│   ├── entities/
│   │   └── datos-sociedad.entity.ts      # Entidad: SociedadDatosGenerales
│   ├── schemas/
│   │   ├── datos-sociedad.schema.ts     # Schema principal (Zod)
│   │   ├── ruc.schema.ts                 # Validación RUC
│   │   ├── razon-social.schema.ts        # Validación Razón Social
│   │   ├── tipo-sociedad.schema.ts       # Validación Tipo Sociedad
│   │   ├── direccion.schema.ts           # Validación Dirección
│   │   ├── distrito.schema.ts            # Validación Distrito
│   │   ├── provincia.schema.ts           # Validación Provincia
│   │   ├── departamento.schema.ts        # Validación Departamento
│   │   ├── nombre-comercial.schema.ts    # Validación Nombre Comercial
│   │   ├── fecha-inscripcion-ruc.schema.ts
│   │   ├── fecha-escritura-publica.schema.ts
│   │   ├── fecha-registros-publicos.schema.ts
│   │   ├── partida-registral.schema.ts
│   │   ├── oficina-registral.schema.ts
│   │   ├── actividad-exterior.schema.ts
│   │   ├── helpers.ts                    # Helpers de validación
│   │   └── index.ts
│   ├── ports/
│   │   └── datos-sociedad.repository.ts  # Contrato del repositorio
│   └── index.ts
├── application/
│   ├── dtos/
│   │   └── datos-sociedad.dto.ts         # DTO (request/response)
│   ├── use-cases/
│   │   ├── get-datos-sociedad.use-case.ts
│   │   ├── create-datos-sociedad.use-case.ts
│   │   ├── update-datos-sociedad.use-case.ts
│   │   └── index.ts
│   └── index.ts
└── infrastructure/
    ├── repositories/
    │   └── datos-sociedad.http.repository.ts  # Implementación HTTP
    ├── mappers/
    │   └── datos-sociedad.mapper.ts     # DTO ↔ Entidad
    ├── mocks/
    │   ├── data/
    │   │   └── datos-sociedad.state.ts   # Estado mock
    │   └── handlers/
    │       └── datos-sociedad.handlers.ts  # Handlers MSW
    └── index.ts

app/core/presentation/registros/sociedades/pasos/datos-sociedad/
├── DatosSociedadForm.vue                 # Componente principal
└── useDatosSociedad.ts                   # Composable (controller)
```

---

## 🏗️ Capa Domain (Hexagonal)

### **Entidad: `SociedadDatosGenerales`**

```typescript
// domain/entities/datos-sociedad.entity.ts
export interface SociedadDatosGenerales {
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

**Características:**
- ✅ Representa el modelo de negocio puro
- ✅ Sin dependencias externas
- ✅ Incluye metadatos (`createdAt`, `updatedAt`)

### **Schemas de Validación (Zod)**

**Schema Principal:**
```typescript
// domain/schemas/datos-sociedad.schema.ts
export const datosSociedadSchema = z.object({
  ruc: rucSchema,
  tipoSociedad: tipoSociedadSchema,
  razonSocial: razonSocialSchema,
  nombreComercial: nombreComercialSchema,
  direccion: direccionSchema,
  distrito: distritoSchema,
  provincia: provinciaSchema,
  departamento: departamentoSchema,
  fechaInscripcionRuc: fechaInscripcionRucSchema,
  actividadExterior: actividadExteriorSchema,
  fechaEscrituraPublica: fechaEscrituraPublicaSchema,
  fechaRegistrosPublicos: fechaRegistrosPublicosSchema,
  oficinaRegistral: oficinaRegistralSchema,
  partidaRegistral: partidaRegistralSchema,
});
```

**Schemas Individuales:**
- `ruc.schema.ts`: Validación de RUC (formato, longitud)
- `razon-social.schema.ts`: Validación de Razón Social (requerido, longitud)
- `tipo-sociedad.schema.ts`: Validación de Tipo de Sociedad (enum)
- `direccion.schema.ts`: Validación de Dirección
- `distrito.schema.ts`, `provincia.schema.ts`, `departamento.schema.ts`: Validación de ubicación
- Y más...

**Características:**
- ✅ Validaciones reutilizables
- ✅ Mensajes de error personalizados
- ✅ Validación en tiempo de ejecución

### **Puerto (Contrato): `DatosSociedadRepository`**

```typescript
// domain/ports/datos-sociedad.repository.ts
export interface DatosSociedadRepository {
  get(idSociety: string): Promise<SociedadDatosGenerales | null>;
  create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales>;
  update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales>;
}
```

**Características:**
- ✅ Define el contrato (interfaz)
- ✅ No tiene implementación (eso es Infrastructure)
- ✅ Permite intercambiar implementaciones (HTTP, MSW, etc.)

---

## 📦 Capa Application (Hexagonal)

### **DTO: `DatosSociedadDTO`**

```typescript
// application/dtos/datos-sociedad.dto.ts
export interface DatosSociedadDTO {
  idSociety?: string;              // Opcional (se genera en backend)
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

**Características:**
- ✅ Formato exacto que espera el backend
- ✅ Bidireccional (request y response)
- ✅ Sin metadatos (`createdAt`, `updatedAt`)

### **Casos de Uso**

#### **1. GetDatosSociedadUseCase**
```typescript
// application/use-cases/get-datos-sociedad.use-case.ts
export class GetDatosSociedadUseCase {
  constructor(private readonly repository: DatosSociedadRepository) {}

  execute(idSociety: string): Promise<SociedadDatosGenerales | null> {
    return this.repository.get(idSociety);
  }
}
```

#### **2. CreateDatosSociedadUseCase**
```typescript
// application/use-cases/create-datos-sociedad.use-case.ts
export class CreateDatosSociedadUseCase {
  constructor(private readonly repository: DatosSociedadRepository) {}

  async execute(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    return this.repository.create(idSociety, payload);
  }
}
```

#### **3. UpdateDatosSociedadUseCase**
```typescript
// application/use-cases/update-datos-sociedad.use-case.ts
export class UpdateDatosSociedadUseCase {
  constructor(private readonly repository: DatosSociedadRepository) {}

  async execute(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    return this.repository.update(idSociety, payload);
  }
}
```

**Características:**
- ✅ Lógica de negocio pura
- ✅ No hace IO directamente (usa repositorio)
- ✅ Fácil de testear

---

## 🔌 Capa Infrastructure (Hexagonal)

### **Repositorio HTTP: `DatosSociedadHttpRepository`**

```typescript
// infrastructure/repositories/datos-sociedad.http.repository.ts
export class DatosSociedadHttpRepository implements DatosSociedadRepository {
  async get(idSociety: string): Promise<SociedadDatosGenerales | null> {
    // GET /api/v2/society-profile/{id}/society
    const response = await $fetch(...);
    return this.mapper.toEntity(response);
  }

  async create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    // POST /api/v2/society-profile/{id}/society
    const response = await $fetch(...);
    return this.mapper.toEntity(response);
  }

  async update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    // PUT /api/v2/society-profile/{id}/society
    const response = await $fetch(...);
    return this.mapper.toEntity(response);
  }
}
```

**Endpoints:**
- `GET /api/v2/society-profile/{id}/society`
- `POST /api/v2/society-profile/{id}/society`
- `PUT /api/v2/society-profile/{id}/society`

**Características:**
- ✅ Implementa el contrato del puerto
- ✅ Aplica headers de autenticación automáticamente
- ✅ Usa mapper para convertir DTO ↔ Entidad

### **Mapper: `DatosSociedadMapper`**

```typescript
// infrastructure/mappers/datos-sociedad.mapper.ts
export class DatosSociedadMapper {
  toEntity(dto: DatosSociedadDTO): SociedadDatosGenerales {
    // Convierte DTO → Entidad
  }

  toDTO(entity: SociedadDatosGenerales): DatosSociedadDTO {
    // Convierte Entidad → DTO
  }
}
```

**Características:**
- ✅ Traduce entre capas (DTO ↔ Entidad)
- ✅ Maneja transformaciones de formato
- ✅ Normaliza datos del backend

### **Mocks (MSW)**

**Estado Mock:**
```typescript
// infrastructure/mocks/data/datos-sociedad.state.ts
export const datosSociedadState = {
  // Estado en memoria para desarrollo
};
```

**Handlers MSW:**
```typescript
// infrastructure/mocks/handlers/datos-sociedad.handlers.ts
export const datosSociedadHandlers = [
  rest.get('/api/v2/society-profile/:id/society', ...),
  rest.post('/api/v2/society-profile/:id/society', ...),
  rest.put('/api/v2/society-profile/:id/society', ...),
];
```

**Características:**
- ✅ Permite desarrollo sin backend
- ✅ Datos de prueba predefinidos
- ✅ Intercepta requests HTTP

---

## 🎨 Capa Presentation (Vue/Nuxt)

### **Composable: `useDatosSociedad`**

```typescript
// presentation/pasos/datos-sociedad/useDatosSociedad.ts
export function useDatosSociedad(options: UseDatosSociedadOptions) {
  const repository = new DatosSociedadHttpRepository();
  const getUseCase = new GetDatosSociedadUseCase(repository);
  const createUseCase = new CreateDatosSociedadUseCase(repository);
  const updateUseCase = new UpdateDatosSociedadUseCase(repository);

  const datos = ref<SociedadDatosGenerales | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<Error | null>(null);

  const fetch = async () => {
    // Carga datos usando GetDatosSociedadUseCase
  };

  const save = async (payload: DatosSociedadDTO) => {
    // Guarda usando Create/Update según exista
  };

  return {
    datos,
    isLoading,
    isSaving,
    error,
    exists: computed(() => datos.value !== null),
    fetch,
    save,
  };
}
```

**Características:**
- ✅ Controller de la vista
- ✅ Gestiona estado local (loading, error)
- ✅ Expone métodos para la UI

### **Componente: `DatosSociedadForm.vue`**

```vue
<!-- presentation/pasos/datos-sociedad/DatosSociedadForm.vue -->
<script setup lang="ts">
import { useDatosSociedad } from './useDatosSociedad';
import { Form } from 'vee-validate';

const props = defineProps<{
  societyId: string;
  mode?: EntityModeEnum;
}>();

const { datos, isLoading, isSaving, fetch, save } = useDatosSociedad({
  societyId: props.societyId,
});

// Cargar datos al montar
onMounted(() => {
  if (props.mode !== EntityModeEnum.CREAR) {
    fetch();
  }
});
</script>

<template>
  <Form @submit="handleSubmit">
    <!-- Campos del formulario -->
  </Form>
</template>
```

**Características:**
- ✅ Componente Vue reutilizable
- ✅ Usa `vee-validate` para validación
- ✅ Soporta modos: CREAR, EDITAR, PREVISUALIZAR

---

## 🔄 Flujo Completo

```
1. Usuario abre formulario
   ↓
2. Componente monta → useDatosSociedad.fetch()
   ↓
3. Composable → GetDatosSociedadUseCase.execute()
   ↓
4. Use Case → DatosSociedadRepository.get()
   ↓
5. Repository HTTP → GET /api/v2/society-profile/{id}/society
   ↓
6. Backend responde con DTO
   ↓
7. Repository → Mapper.toEntity() → Entidad
   ↓
8. Use Case retorna Entidad
   ↓
9. Composable actualiza estado (datos.value)
   ↓
10. Componente reacciona y muestra datos
```

---

## 🔄 Reutilización para Juntas de Accionistas

### ✅ **Qué se puede REUTILIZAR:**

1. **Patrón Arquitectónico**
   - ✅ Estructura de carpetas (domain/application/infrastructure)
   - ✅ Separación de responsabilidades
   - ✅ Uso de casos de uso

2. **Schemas de Validación**
   - ✅ `direccion.schema.ts` (si juntas necesita dirección)
   - ✅ `distrito.schema.ts`, `provincia.schema.ts`, `departamento.schema.ts`
   - ✅ Helpers de validación

3. **Componentes Base**
   - ✅ `TextInputZod`, `DateInputZod`, `SelectInputZod`
   - ✅ `CardTitle`, `BaseModal`
   - ✅ Patrón de formulario con `vee-validate`

4. **Composable Pattern**
   - ✅ Estructura de `useDatosSociedad` (loading, error, fetch, save)
   - ✅ Patrón de controller

### ❌ **Qué hay que CREAR NUEVO:**

1. **Domain**
   - ❌ Nueva entidad: `JuntaDetalles` (o similar)
   - ❌ Nuevos schemas específicos de juntas
   - ❌ Nuevo puerto: `JuntaDetallesRepository`

2. **Application**
   - ❌ Nuevos DTOs: `JuntaDetallesDTO`
   - ❌ Nuevos casos de uso: `GetJuntaDetallesUseCase`, `CreateJuntaDetallesUseCase`, etc.

3. **Infrastructure**
   - ❌ Nuevo repositorio HTTP: `JuntaDetallesHttpRepository`
   - ❌ Nuevo mapper: `JuntaDetallesMapper`
   - ❌ Nuevos mocks: handlers MSW para juntas

4. **Presentation**
   - ❌ Nuevo componente: `JuntaDetallesForm.vue`
   - ❌ Nuevo composable: `useJuntaDetalles.ts`

---

## 📝 Resumen

| Aspecto | Estado |
|---------|--------|
| **Domain** | ✅ Completo (entidad, schemas, puerto) |
| **Application** | ✅ Completo (DTOs, 3 casos de uso) |
| **Infrastructure** | ✅ Completo (repositorio HTTP, mapper, mocks) |
| **Presentation** | ✅ Completo (componente, composable) |
| **Reutilizable** | ✅ Patrones, schemas de ubicación, componentes base |
| **Nuevo para Juntas** | ❌ Todo el módulo específico de juntas |

---

**Siguiente paso**: Documentar Paso 2 (Accionistas) - Tabla + Modal

