# 📋 Estudio DDD Hexagonal: Configuración de Directorio en Juntas

**Fecha:** 2025-01-XX  
**Objetivo:** Analizar la estructura actual de configuración de directorio en `nombramiento-directorio` para replicarla en `nombramiento-directores` con DDD hexagonal completo.

---

## 🎯 Resumen Ejecutivo

### Estado Actual

**En `nombramiento-directorio`:**

- ✅ Vista `configuracion.vue` existe (4 campos: cantidad, fecha inicio, fecha fin, duración)
- ✅ Vista `votacion-configuracion.vue` existe (votación para aprobar configuración)
- ⚠️ **NO usa DDD hexagonal** - Solo usa store simple de Pinia (`useDirectorioConfigStore`)
- ❌ **NO conecta al backend** - Solo `console.log` en submit
- ⚠️ Store solo guarda estado local (no persistencia real)

**En `nombramiento-directores`:**

- ✅ Vista `cantidad.vue` existe (pero está incompleta)
- ❌ Falta vista de votación (`votacion-cantidad.vue`)
- ❌ No usa DDD hexagonal
- ❌ No conecta al backend

---

## 📂 1. Estructura Actual: `nombramiento-directorio`

### 1.1. Archivos Relevantes

```
app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/
├── configuracion.vue          # ✅ Formulario con 4 campos
└── votacion-configuracion.vue # ✅ Votación para aprobar configuración

app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directorio/
└── composables/
    └── useDirectorioConfigStore.ts  # ⚠️ Store simple (NO DDD)
```

### 1.2. Store Actual (`useDirectorioConfigStore`)

**Ubicación:** `app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directorio/composables/useDirectorioConfigStore.ts`

**Estructura:**

```typescript
export const useDirectorioConfigStore = defineStore("directorioConfig", () => {
  const cantidadDirectores = ref<string>("");
  const duracionDirectorio = ref<string>("");
  const fechaInicio = ref<string>("");
  const fechaFin = ref<string>("");

  function setCantidadDirectores(value: string) { ... }
  function setDuracionDirectorio(value: string) { ... }
  function setFechaInicio(value: string) { ... }
  function setFechaFin(value: string) { ... }

  return { ... };
});
```

**Problemas identificados:**

- ❌ No conecta al backend (no hay llamadas HTTP)
- ❌ No usa DDD hexagonal
- ❌ Solo guarda estado local (no persiste cambios)
- ⚠️ Los valores se pierden al recargar la página

### 1.3. Vista `configuracion.vue`

**Campos del formulario:**

1. **Cantidad de Directores** (Select: 3, 4, 5)
2. **Fecha de Inicio** (DateInput)
3. **Duración del Directorio** (Select: 1, 2, 3 años)
4. **Fecha de Fin** (DateInput)

**Validación:** Usa Zod schemas

**Submit:** Solo `console.log` (❌ no guarda en backend)

**Store:** Usa `useDirectorioConfigStore` para sincronizar valores

### 1.4. Vista `votacion-configuracion.vue`

**Componente usado:** `MetodoVotacio.vue` (reutilizable)

**Props pasadas:**

- `title`: "Votación para la configuración del nuevo directorio"
- `subtitle`: "Votación para aprobar la configuración del nuevo directorio"
- `preguntas`: Pregunta dinámica con valores del store
- `accionistas`: Hardcodeados (⚠️ debería venir del snapshot)
- `mensajeUnanimidad`: Mensaje dinámico con valores del store

**Problemas identificados:**

- ❌ No conecta al backend
- ❌ Accionistas hardcodeados (no usa snapshot)
- ⚠️ No guarda resultados de votación

---

## 📂 2. DDD Hexagonal Existente (Solo para Registro de Sociedades)

### 2.1. Ubicación

**NO existe DDD hexagonal para juntas** - Solo existe para registro de sociedades:

```
app/core/hexag/registros/sociedades/pasos/directorio/
├── application/
│   ├── dtos/
│   │   └── directorio.dto.ts              # ✅ DTO completo
│   └── use-cases/
│       ├── get-directorio.use-case.ts     # ✅ GET
│       ├── create-directorio.use-case.ts  # ✅ CREATE
│       └── update-directorio.use-case.ts  # ✅ UPDATE
├── domain/
│   ├── entities/
│   │   └── directorio.entity.ts           # ✅ Entidad DirectorioConfig
│   └── ports/
│       └── directorio.repositorio.ts      # ✅ Interface Repository
└── infrastructure/
    ├── mappers/
    │   └── directorio.mapper.ts           # ✅ Backend ↔ Frontend
    └── repositories/
        └── directorio.http.repository.ts  # ✅ HTTP Repository
```

### 2.2. Endpoints Usados (Registro de Sociedades)

**⚠️ IMPORTANTE:** Estos endpoints son para **registro de sociedades**, NO para juntas:

```
GET    /api/v2/society-profile/:societyId/directorio
POST   /api/v2/society-profile/:societyId/directorio
PUT    /api/v2/society-profile/:societyId/directorio
```

**No incluyen `flowId`** - Son para la configuración base de la sociedad, no para un flujo específico de junta.

### 2.3. DTOs y Entidades

**DirectorioDTO** (`directorio.dto.ts`):

```typescript
export interface DirectorioDTO {
  id?: string;
  cantidadDirectores: number;
  conteoPersonalizado: boolean;
  minimoDirectores: number | null;
  maximoDirectores: number | null;
  inicioMandato: string;
  finMandato: string;
  quorumMinimo: number;
  mayoria: number;
  presidenteDesignado: boolean;
  secretarioAsignado: boolean;
  reeleccionPermitida: boolean;
  presidentePreside: boolean;
  presidenteDesempata: boolean;
  periodo: string;
  presidenteId: string | null;
}
```

**DirectorioConfig** (`directorio.entity.ts`):

```typescript
export interface DirectorioConfig {
  id: string;
  cantidadDirectores: number;
  conteoPersonalizado: boolean;
  minimoDirectores: number | null;
  maximoDirectores: number | null;
  inicioMandato: string;
  finMandato: string;
  quorumMinimo: number;
  mayoria: number;
  presidenteDesignado: boolean;
  secretarioAsignado: boolean;
  reeleccionPermitida: boolean;
  presidentePreside: boolean;
  presidenteDesempata: boolean;
  periodo: string;
  presidenteId: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## 📂 3. Análisis: ¿Qué Falta?

### 3.1. Para `nombramiento-directorio`

**Necesita:**

1. ❌ DDD hexagonal específico para juntas (con `flowId`)
2. ❌ Endpoint backend para actualizar directorio dentro de un flujo de junta
3. ❌ Repository que use `flowId` en la URL
4. ❌ Store que use el DDD hexagonal (no solo Pinia simple)

**Endpoint esperado:**

```
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directory
```

**O alternativamente:**

```
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directory-configuration
```

### 3.2. Para `nombramiento-directores`

**Diferencias con `nombramiento-directorio`:**

- Solo necesita campo **cantidad de directores** (no fecha inicio, fecha fin, duración)
- Los demás campos deben estar **bloqueados** (read-only)
- Debe mostrar mensaje: "Puedes seleccionar entre X a Y directores" (si `conteoPersonalizado === true`)

**Necesita:**

1. ❌ DDD hexagonal específico para juntas (compartido con `nombramiento-directorio`)
2. ❌ Vista `cantidad.vue` adaptada (solo campo cantidad, demás bloqueados)
3. ❌ Vista `votacion-cantidad.vue` (similar a `votacion-configuracion.vue`)
4. ❌ Store que use el DDD hexagonal
5. ❌ Lógica para calcular cupos disponibles

---

## 📂 4. Componentes Reutilizables

### 4.1. `MetodoVotacio.vue`

**Ubicación:** `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue`

**Uso actual:** Ya se usa en múltiples lugares:

- `nombramiento-directorio/votacion-configuracion.vue`
- `instalacion/votacion.vue`
- `pronunciamiento-gestion/votacion.vue`
- `aplicacion-resultados/votacion.vue`
- Y más...

**Props principales:**

```typescript
interface Props {
  modelValue?: string; // "unanimidad" | "mayoria"
  title?: string;
  subtitle?: string;
  mensajeUnanimidad?: string;
  preguntas?: string[];
  accionistas?: string[];
  votantes?: Votante[];
  getVoto?: (accionistaId: string) => "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | null;
  votacionStore?: any;
}
```

**✅ Conclusión:** Componente completamente reutilizable, no necesita cambios.

---

## 📂 5. Referencias de Navegación y Rutas

### 5.1. Configuración de Secciones

**Ubicación:** `app/config/juntas/sections.config.ts`

**Sección actual para `nombramiento-directorio`:**

```typescript
"nombramiento-directorio": [
  { id: "nombramiento-directorio", title: "Nombramiento de Directorio", ... },
  { id: "nombramiento", title: "Configuración del directorio", ... },
  { id: "cantidad", title: "Votacion para la configuración del directorio", ... },
  { id: "directores", title: "Designación de Directores", ... },
  { id: "votacion", title: "Votación para la designación", ... },
  { id: "presidente", title: "Presidente del directorio", ... },
  { id: "resumen", title: "Resumen", ... },
],
```

**⚠️ PROBLEMA:** Los nombres no coinciden con los archivos:

- Archivo: `configuracion.vue` → Sección: `nombramiento`
- Archivo: `votacion-configuracion.vue` → Sección: `cantidad`

**Sección actual para `nombramiento-directores`:**

```typescript
"nombramiento-directores": [
  { id: "nombramiento-directores", title: "Nombramiento de Directores", ... },
  { id: "nombramiento", title: "Nombramiento", ... },
  { id: "votacion", title: "Votación", ... },
  { id: "presidente", title: "Presidente", ... },
  { id: "resumen", title: "Resumen", ... },
],
```

**❌ FALTA:** Agregar secciones `cantidad` y `votacion-cantidad` (o `votacion-configuracion`)

### 5.2. Rutas de Navegación

**Ubicación:** `app/config/juntas/navigation-routes.config.ts`

**Función `getNombramientoDirectorioRoutes`:**

```typescript
export function getNombramientoDirectorioRoutes(basePath: string): Record<string, string> {
  return {
    "nombramiento-directorio": `${basePath}/nombramiento-directorio`,
    cantidad: `${basePath}/nombramiento-directorio/cantidad`,
    "votacion-configuracion": `${basePath}/nombramiento-directorio/votacion`, // ⚠️ Confuso
    nombramiento: `${basePath}/nombramiento-directorio/nombramiento`,
    votacion: `${basePath}/nombramiento-directorio/votacion`,
    // ...
  };
}
```

**⚠️ PROBLEMA:** `votacion-configuracion` apunta a `/votacion` (conflicto con otra vista)

---

## 📂 6. DDD Hexagonal Propuesto para Juntas

### 6.1. Estructura Propuesta

```
app/core/hexag/juntas/
├── application/
│   ├── dtos/
│   │   └── directory-configuration.dto.ts     # ⚠️ NUEVO
│   └── use-cases/
│       ├── directory-configuration/
│       │   ├── get-directory-configuration.use-case.ts    # ⚠️ NUEVO
│       │   ├── update-directory-configuration.use-case.ts # ⚠️ NUEVO
│       └── ...
├── domain/
│   ├── entities/
│   │   └── directory-configuration.entity.ts  # ⚠️ NUEVO
│   └── ports/
│       └── directory-configuration.repository.ts # ⚠️ NUEVO
└── infrastructure/
    ├── mappers/
    │   └── directory-configuration.mapper.ts  # ⚠️ NUEVO
    └── repositories/
        └── directory-configuration.http.repository.ts # ⚠️ NUEVO
```

### 6.2. Endpoint Backend Esperado

**⚠️ PENDIENTE CONFIRMACIÓN DEL BACKEND:**

```
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directory-configuration
```

**O alternativamente:**

```
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directory
```

**Body esperado:**

```json
{
  "cantidadDirectores": 5,
  "conteoPersonalizado": false,
  "minimoDirectores": null,
  "maximoDirectores": null,
  "inicioMandato": "2025-01-01",
  "finMandato": "2025-12-31",
  "periodo": "ONE_YEAR"
}
```

**Nota:** Para `nombramiento-directores`, solo se actualizará `cantidadDirectores` (los demás campos vienen del snapshot y son read-only).

### 6.3. Store Propuesto (Presentation Layer)

```
app/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/
└── stores/
    └── useDirectoryConfigurationStore.ts  # ⚠️ NUEVO (usa DDD hexagonal)
```

**Estructura del store:**

```typescript
export const useDirectoryConfigurationStore = defineStore(
  "directoryConfiguration",
  () => {
    const repository = new DirectoryConfigurationHttpRepository();
    const getUseCase = new GetDirectoryConfigurationUseCase(repository);
    const updateUseCase = new UpdateDirectoryConfigurationUseCase(repository);

    const configuration = ref<DirectoryConfiguration | null>(null);
    const status = ref<"idle" | "loading" | "error">("idle");
    const errorMessage = ref<string | null>(null);

    async function load(societyId: number, flowId: number) { ... }
    async function update(societyId: number, flowId: number, payload: DirectoryConfigurationDTO) { ... }

    return { ... };
  }
);
```

---

## 📂 7. Plan de Implementación

### Fase 1: Crear DDD Hexagonal (Compartido)

1. ✅ Crear DTOs (`directory-configuration.dto.ts`)
2. ✅ Crear Entidades (`directory-configuration.entity.ts`)
3. ✅ Crear Repository Interface (`directory-configuration.repository.ts`)
4. ✅ Crear Use Cases (GET, UPDATE)
5. ✅ Crear Mapper (Backend ↔ Frontend)
6. ✅ Crear HTTP Repository (con `flowId` en URL)

### Fase 2: Adaptar `nombramiento-directorio`

1. ✅ Crear Store en Presentation Layer (usa DDD hexagonal)
2. ✅ Actualizar `configuracion.vue` para usar el store
3. ✅ Conectar submit al backend (PUT endpoint)
4. ✅ Actualizar `votacion-configuracion.vue` para usar snapshot (accionistas)
5. ✅ Guardar resultados de votación

### Fase 3: Replicar en `nombramiento-directores`

1. ✅ Crear `cantidad.vue` (solo campo cantidad, demás bloqueados)
2. ✅ Crear `votacion-cantidad.vue` (similar a `votacion-configuracion.vue`)
3. ✅ Usar mismo DDD hexagonal (compartido)
4. ✅ Usar mismo store (compartido)
5. ✅ Agregar secciones a `sections.config.ts`
6. ✅ Corregir rutas en `navigation-routes.config.ts`

### Fase 4: Lógica de Cupos

1. ✅ Calcular cupos disponibles: `Tamaño Directorio - Directores Actuales`
2. ✅ Considerar directores removidos (filtrar del snapshot)
3. ✅ Considerar nueva cantidad (si se aprobó en votación)
4. ✅ Mostrar mensaje correcto en vista de votación de nombramiento

---

## 📂 8. Referencias Encontradas

### 8.1. Archivos de Código

1. **Vista configuración:**

   - `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/configuracion.vue`

2. **Vista votación:**

   - `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/votacion-configuracion.vue`

3. **Store actual:**

   - `app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directorio/composables/useDirectorioConfigStore.ts`

4. **DDD registro sociedades (referencia):**

   - `app/core/hexag/registros/sociedades/pasos/directorio/` (todos los archivos)

5. **Componente votación reutilizable:**

   - `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue`

6. **Configuración navegación:**
   - `app/config/juntas/sections.config.ts`
   - `app/config/juntas/navigation-routes.config.ts`

### 8.2. Documentación

1. **Estructura completa nombramiento directores:**

   - `docs/backend/directorio y directores/ESTRUCTURA-COMPLETA-NOMBRAMIENTO-DIRECTORES.md`

2. **Endpoints referencia:**

   - `docs/backend/snapshoot/ENDPOINTS-REFERENCIA-RAPIDA.md`

3. **Arquitectura juntas:**
   - `docs/backend/snapshoot/ARQUITECTURA-COMPLETA-JUNTAS.md`

---

## ❓ 9. Dudas Pendientes

1. **Endpoint Backend:**

   - ¿Cuál es el endpoint exacto para actualizar configuración de directorio en un flujo de junta?
   - ¿Incluye `flowId` en la URL?
   - ¿Es `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directory-configuration`?

2. **Payload:**

   - ¿El payload es igual al de registro de sociedades o tiene campos diferentes?
   - ¿Para `nombramiento-directores`, solo se envía `cantidadDirectores` o todos los campos?

3. **Persistencia:**

   - ¿La nueva cantidad aprobada se guarda en el snapshot o en un estado separado del flujo?
   - ¿Cómo se obtiene la cantidad vigente después de aprobar la votación?

4. **Votación:**
   - ¿Existe endpoint para guardar resultados de votación de configuración?
   - ¿O se guarda junto con la actualización del directorio?

---

## ✅ 10. Conclusión

**Estado actual:**

- ❌ No existe DDD hexagonal para configuración de directorio en juntas
- ⚠️ Solo existe DDD hexagonal para registro de sociedades (sin `flowId`)
- ❌ Las vistas actuales no conectan al backend
- ✅ Componentes de votación son reutilizables

**Próximos pasos:**

1. Confirmar endpoint backend con el equipo backend
2. Crear DDD hexagonal completo para juntas
3. Adaptar `nombramiento-directorio` para usar DDD hexagonal
4. Replicar en `nombramiento-directores` (adaptado para solo cantidad)

---

**Última actualización:** 2025-01-XX


