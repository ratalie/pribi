# 🚀 Plan de Migración a Arquitectura Hexagonal

## Filosofía del Plan 🎯

**No estamos "ayudando" o "parcheando" el código existente.**

**Estamos RECONSTRUYENDO de forma correcta cada pieza, guardándola en el lugar adecuado.**

### Principios:

1. ✅ **Identificar** qué se reutiliza
2. ✅ **Mover** componentes al lugar correcto con nombres claros
3. ✅ **Replicar** patrones consistentes
4. ✅ **Nombrar** correctamente cada archivo
5. ✅ **Usar** imports absolutos (`~/`) en lugar de relativos (`../../`)

---

## Estado Actual ✅

- ✅ Hexágono de datos-sociedad completo
- ✅ Hexágono de accionistas completo
- ✅ Hexágono de quorum-mayorias completo
- ✅ Agregar sociedad funcional
- ✅ Historial funcional
- ✅ Store usando casos de uso
- ⚠️ **Código disperso** con imports relativos (`../../`)
- ⚠️ **Componentes mezclados** entre legacy y nuevo
- ⚠️ **Schemas duplicados** en múltiples lugares

## Objetivos 🎯

1. **AUDITAR** todo el código existente y categorizar
2. **REORGANIZAR** archivos al lugar correcto
3. **ESTANDARIZAR** imports usando alias de Nuxt (`~/`, `@/`)
4. Implementar flujo completo de datos-sociedad (crear/editar)
5. Implementar flujo completo de accionistas (CRUD)
6. Eliminar código legacy
7. Establecer patrón replicable para otros pasos

---

## FASE 0: AUDITORÍA Y CATALOGACIÓN (2-3 horas) 🔍

**Objetivo:** Entender qué tenemos, dónde está y qué hacer con cada pieza.

### 0.1 Auditar imports relativos

**Buscar todos los imports problemáticos:**

```bash
# Encontrar todos los imports relativos profundos
grep -r "from ['\"]\.\.\/\.\.\/" app/ --include="*.vue" --include="*.ts"

# Encontrar imports sin alias
grep -r "from ['\"]\.\./" app/ --include="*.vue" --include="*.ts"
```

**Resultado esperado:** Lista completa de archivos con imports a corregir.

### 0.2 Catalogar componentes reutilizables

**Identificar componentes en:**

- `app/components/` → ¿Cuáles son globales? ¿Cuáles específicos?
- `app/modules/registro-sociedades/components/` → ¿Qué se puede reutilizar?
- `app/core/presentation/` → ¿Qué ya está bien ubicado?

**Decisiones a tomar:**

| Componente              | Ubicación Actual          | Ubicación Correcta            | Acción              |
| ----------------------- | ------------------------- | ----------------------------- | ------------------- |
| `CardTitle.vue`         | `components/base/cards/`  | ✅ Correcto                   | Mantener            |
| `TextInputZod.vue`      | `components/base/inputs/` | ✅ Correcto                   | Mantener            |
| `DatosSociedadStep.vue` | `modules/.../steps/`      | ❌ Legacy                     | ⚠️ Eliminar después |
| Schemas Zod             | `modules/.../schemas/`    | ❌ Debería estar en `domain/` | 🔄 Mover            |

### 0.3 Catalogar schemas y validaciones

**Encontrar todos los schemas:**

```bash
# Buscar archivos de schemas
find app/ -name "*schema*.ts" -o -name "*schemas.ts"
```

**Decisión por cada schema:**

| Schema                 | Ubicación Actual                          | ¿Domain o Shared? | Nueva Ubicación                                       |
| ---------------------- | ----------------------------------------- | ----------------- | ----------------------------------------------------- |
| `rucSchema`            | `modules/.../schemas/datosSociedad.ts`    | Domain            | `core/hexag/.../pasos/datos-sociedad/domain/schemas/` |
| `tipoAccionistaSchema` | `modules/.../schemas/modalAccionistas.ts` | Domain            | `core/hexag/.../pasos/accionistas/domain/schemas/`    |

### 0.4 Configurar alias en Nuxt

**Verificar `nuxt.config.ts`:**

```typescript
// Ya existe por defecto en Nuxt:
// ~/  -> app/
// @/  -> app/
// #imports -> .nuxt/imports
```

**Crear alias adicionales para hexágono:**

```typescript
export default defineNuxtConfig({
  alias: {
    // Alias para hexágono
    "@hexag": fileURLToPath(new URL("./app/core/hexag", import.meta.url)),
    "@presentation": fileURLToPath(new URL("./app/core/presentation", import.meta.url)),
    "@shared": fileURLToPath(new URL("./app/core/shared", import.meta.url)),
  },
});
```

### 0.5 Documentar patrones de imports

**Crear guía de imports:**

```typescript
// ✅ CORRECTO - Imports absolutos
import CardTitle from "~/components/base/cards/CardTitle.vue";
import { rucSchema } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas";
import { useDatosSociedad } from "@presentation/registros/sociedades/pasos/datos-sociedad/useDatosSociedad";

// ❌ INCORRECTO - Imports relativos profundos
import CardTitle from "../../components/base/cards/CardTitle.vue";
import { rucSchema } from "../../schemas/datosSociedad";
```

---

## FASE 1: Limpieza y Reorganización (3-4 horas) 🧹

### 1.1 Eliminar rutas duplicadas

**Archivos a eliminar:**

```bash
rm -rf app/pages/registros/sociedades/crear/
rm -rf app/pages/registros/sociedades/editar/
```

**Mantener solo:**

- `pages/registros/sociedades/[id]/` → Flujo único

### 1.2 Mover schemas a domain layer

**Crear estructura de schemas por paso:**

```
core/hexag/registros/sociedades/pasos/
├── datos-sociedad/domain/schemas/
│   ├── index.ts                         # Exporta todos
│   ├── ruc.schema.ts
│   ├── razon-social.schema.ts
│   ├── tipo-sociedad.schema.ts
│   ├── direccion.schema.ts
│   ├── fechas.schema.ts
│   └── oficina-registral.schema.ts
│
├── accionistas/domain/schemas/
│   ├── index.ts
│   ├── tipo-accionista.schema.ts
│   ├── persona-natural.schema.ts
│   ├── persona-juridica.schema.ts
│   └── fideicomiso.schema.ts
│
└── [otros-pasos]/domain/schemas/
```

**Mover y refactorizar desde:**

- `modules/registro-sociedades/schemas/datosSociedad.ts` → `datos-sociedad/domain/schemas/`
- `modules/registro-sociedades/schemas/modalAccionistas.ts` → `accionistas/domain/schemas/`
- `modules/registro-sociedades/schemas/modalPersonaJuridica.ts` → `accionistas/domain/schemas/`

**Ejemplo de refactorización:**

```typescript
// ❌ ANTES: modules/registro-sociedades/schemas/datosSociedad.ts
export const rucSchema = z.string().nonempty("El RUC es obligatorio")...;
export const razonSocialSchema = z.string().nonempty("La razón social...")...;
// ... 15 schemas más en un archivo

// ✅ DESPUÉS: datos-sociedad/domain/schemas/ruc.schema.ts
import { z } from "zod";

export const rucSchema = z
  .string()
  .nonempty("El RUC es obligatorio")
  .length(11, "El RUC debe tener exactamente 11 dígitos")
  .regex(/^20\d{9}$/, "El RUC debe empezar con 20");

// ✅ datos-sociedad/domain/schemas/index.ts
export { rucSchema } from './ruc.schema';
export { razonSocialSchema } from './razon-social.schema';
export { tipoSociedadSchema } from './tipo-sociedad.schema';
// ... exportar todos
```

### 1.3 Estandarizar todos los imports a aliases

**Script de búsqueda y reemplazo:**

```bash
# Encontrar todos los archivos con imports relativos
find app/ -name "*.vue" -o -name "*.ts" | xargs grep -l "from ['\"]\.\./"

# Crear script de reemplazo (manual por ahora)
```

**Patrones de reemplazo:**

```typescript
// ❌ ANTES - Imports relativos
import CardTitle from "../../components/base/cards/CardTitle.vue";
import { rucSchema } from "../../schemas/datosSociedad";
import { useRegistroAccionistasStore } from "../../stores/useRegistroAccionistasStore";

// ✅ DESPUÉS - Imports absolutos
import CardTitle from "~/components/base/cards/CardTitle.vue";
import { rucSchema } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas";
import { useRegistroAccionistasStore } from "~/modules/registro-sociedades/stores/useRegistroAccionistasStore";
```

**Aplicar cambios en:**

1. Todos los archivos en `app/modules/registro-sociedades/`
2. Todos los archivos en `app/core/presentation/`
3. Todos los archivos en `app/core/hexag/`

### 1.4 Identificar componentes globales vs específicos

**Componentes globales (mantener en `app/components/`):**

- ✅ `CardTitle.vue`
- ✅ `TextInputZod.vue`, `SelectInputZod.vue`, etc.
- ✅ `BaseButton.vue`, `ActionButton.vue`
- ✅ `PageTitle.vue`
- ✅ UI components de shadcn

**Componentes específicos de registros (mover):**

```
De: app/modules/registro-sociedades/components/
A: app/core/presentation/registros/sociedades/pasos/{paso}/components/
```

**Ejemplo:**

```
modules/registro-sociedades/components/forms/accionistas/AccionistaNaturalForm.vue
→ core/presentation/registros/sociedades/pasos/accionistas/components/AccionistaNaturalForm.vue
```

---

## FASE 2: Datos Sociedad - Presentation Layer (3-4 horas) 🎨

### 2.1 Crear estructura

```
core/presentation/registros/sociedades/pasos/datos-sociedad/
├── DatosSociedadForm.vue           # Componente principal (refactorizado)
├── useDatosSociedad.ts             # Composable limpio (NUEVO)
└── components/                      # Opcional
    ├── RucSection.vue
    └── DireccionSection.vue
```

### 2.2 Crear composable limpio

**Archivo:** `core/presentation/registros/sociedades/pasos/datos-sociedad/useDatosSociedad.ts`

```typescript
import { ref, computed } from "vue";
import {
  GetDatosSociedadUseCase,
  CreateDatosSociedadUseCase,
  UpdateDatosSociedadUseCase,
  type DatosSociedadDTO,
} from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure";
import type { SociedadDatosGenerales } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/domain";

export function useDatosSociedad(societyId: string) {
  // Dependency Injection
  const repository = new DatosSociedadHttpRepository();
  const getUseCase = new GetDatosSociedadUseCase(repository);
  const createUseCase = new CreateDatosSociedadUseCase(repository);
  const updateUseCase = new UpdateDatosSociedadUseCase(repository);

  // Estado reactivo
  const datos = ref<SociedadDatosGenerales | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<Error | null>(null);

  // Computed
  const exists = computed(() => datos.value !== null);

  // Métodos
  const fetch = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      datos.value = await getUseCase.execute(societyId);
    } catch (e) {
      error.value = e as Error;
      datos.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const save = async (payload: DatosSociedadDTO) => {
    isSaving.value = true;
    error.value = null;
    try {
      if (exists.value) {
        datos.value = await updateUseCase.execute(societyId, payload);
        return "updated";
      } else {
        datos.value = await createUseCase.execute(societyId, payload);
        return "created";
      }
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    datos,
    isLoading,
    isSaving,
    error,
    exists,
    fetch,
    save,
  };
}
```

### 2.3 Refactorizar DatosSociedadForm.vue

**Mover:**

- De: `core/presentation/registros/sociedades/components/DatosSociedadForm.vue`
- A: `core/presentation/registros/sociedades/pasos/datos-sociedad/DatosSociedadForm.vue`

**Simplificar:**

- Eliminar `useDatosSociedadController`
- Eliminar `useDatosSociedadForm`
- Usar solo `useDatosSociedad`
- Eliminar store `datos-sociedad.store.ts`

### 2.4 Actualizar página

**Archivo:** `pages/registros/sociedades/[id]/datos-sociedad.vue`

```vue
<script setup lang="ts">
  import DatosSociedadForm from "~/core/presentation/registros/sociedades/pasos/datos-sociedad/DatosSociedadForm.vue";

  definePageMeta({
    layout: "registros",
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <DatosSociedadForm :society-id="societyId" />
</template>
```

---

## FASE 3: Accionistas - Presentation Layer (5-6 horas) 🎨

### 3.1 Crear estructura

```
core/presentation/registros/sociedades/pasos/accionistas/
├── AccionistasManager.vue          # Componente principal
├── useAccionistas.ts               # Composable
└── components/
    ├── AccionistasList.vue         # Tabla
    ├── AccionistaForm.vue          # Formulario
    └── AccionistaModal.vue         # Modal crear/editar
```

### 3.2 Crear composable

**Archivo:** `useAccionistas.ts`

```typescript
import { ref } from "vue";
import {
  ListAccionistasUseCase,
  CreateAccionistaUseCase,
  UpdateAccionistaUseCase,
  DeleteAccionistaUseCase,
  type AccionistaDTO,
} from "~/core/hexag/registros/sociedades/pasos/accionistas/application";
import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure";
import type { Accionista } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain";

export function useAccionistas(societyId: string) {
  const repository = new AccionistasHttpRepository();
  const listUseCase = new ListAccionistasUseCase(repository);
  const createUseCase = new CreateAccionistaUseCase(repository);
  const updateUseCase = new UpdateAccionistaUseCase(repository);
  const deleteUseCase = new DeleteAccionistaUseCase(repository);

  const accionistas = ref<Accionista[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<Error | null>(null);

  const fetchAll = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      accionistas.value = await listUseCase.execute(societyId);
    } catch (e) {
      error.value = e as Error;
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (payload: AccionistaDTO) => {
    isSaving.value = true;
    try {
      const newAccionista = await createUseCase.execute(societyId, payload);
      accionistas.value.push(newAccionista);
      return newAccionista;
    } finally {
      isSaving.value = false;
    }
  };

  const update = async (id: string, payload: AccionistaDTO) => {
    isSaving.value = true;
    try {
      const updated = await updateUseCase.execute(societyId, id, payload);
      const index = accionistas.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        accionistas.value[index] = updated;
      }
      return updated;
    } finally {
      isSaving.value = false;
    }
  };

  const remove = async (id: string) => {
    isSaving.value = true;
    try {
      await deleteUseCase.execute(societyId, id);
      accionistas.value = accionistas.value.filter((a) => a.id !== id);
    } finally {
      isSaving.value = false;
    }
  };

  return {
    accionistas,
    isLoading,
    isSaving,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
}
```

### 3.3 Crear componentes

**AccionistasList.vue** - Tabla con acciones (ver, editar, eliminar)
**AccionistaForm.vue** - Formulario reutilizable
**AccionistaModal.vue** - Modal con lógica de crear/editar
**AccionistasManager.vue** - Orquestador principal

### 3.4 Crear página

**Archivo:** `pages/registros/sociedades/[id]/accionistas.vue`

```vue
<script setup lang="ts">
  import AccionistasManager from "~/core/presentation/registros/sociedades/pasos/accionistas/AccionistasManager.vue";

  definePageMeta({
    layout: "registros",
  });

  const route = useRoute();
  const societyId = route.params.id as string;
</script>

<template>
  <AccionistasManager :society-id="societyId" />
</template>
```

---

## FASE 4: Limpieza Final (1 hora) 🧹

### 4.1 Eliminar archivos legacy

```bash
# Eliminar módulo completo (después de migrar todo)
rm -rf app/modules/registro-sociedades/

# Eliminar páginas legacy
rm -rf app/pages/registro-societario/
```

### 4.2 Actualizar documentación

- Actualizar `ROADMAP.md`
- Marcar pasos completados
- Documentar patrón establecido

---

## RESUMEN DE ESFUERZO ⏱️

| Fase                                  | Tiempo Estimado | Dificultad   | Prioridad  |
| ------------------------------------- | --------------- | ------------ | ---------- |
| **Fase 0**: Auditoría y Catalogación  | 2-3 horas       | 🟢 Fácil     | 🔴 CRÍTICA |
| **Fase 1**: Limpieza y Reorganización | 3-4 horas       | 🟡 Media     | 🔴 CRÍTICA |
| **Fase 2**: Datos Sociedad            | 3-4 horas       | 🟡 Media     | 🟠 Alta    |
| **Fase 3**: Accionistas               | 5-6 horas       | 🟡 Media     | 🟠 Alta    |
| **Fase 4**: Limpieza final            | 1 hora          | 🟢 Fácil     | 🟢 Media   |
| **TOTAL**                             | **14-18 horas** | 🟡 **Media** | -          |

### ⚠️ Cambio de Enfoque

**ANTES:** Arreglar rápido y seguir adelante
**AHORA:** Reconstruir correctamente desde la base

**Razón:** Un día extra de trabajo inicial ahorrará semanas de frustración después.

---

## PATRÓN REPLICABLE 🔄

Una vez completadas las fases 2 y 3, tendrás un **patrón establecido** para replicar en:

- Acciones
- Asignación de acciones
- Directorio
- Apoderados
- Régimen de poderes
- Quorum y mayorías (ya tiene hexágono)
- Acuerdos societarios

**Tiempo por paso adicional:** ~2-3 horas

---

## ARCHIVOS QUE SE ELIMINAN ❌

```
app/modules/registro-sociedades/              # TODO
app/pages/registro-societario/                # TODO
app/pages/registros/sociedades/crear/         # Duplicado
app/pages/registros/sociedades/editar/        # Duplicado
app/core/presentation/.../stores/datos-sociedad.store.ts  # Reemplazado por composable
app/core/presentation/.../composables/useDatosSociedadController.ts  # Innecesario
app/core/presentation/.../composables/useDatosSociedadForm.ts        # Simplificado
```

---

## ARCHIVOS QUE SE CREAN ✅

```
core/hexag/.../pasos/datos-sociedad/domain/schemas/     # Schemas movidos
core/presentation/.../pasos/datos-sociedad/             # Presentation layer
core/presentation/.../pasos/accionistas/                # Presentation layer
pages/registros/sociedades/[id]/datos-sociedad.vue     # Página simplificada
pages/registros/sociedades/[id]/accionistas.vue        # Página simplificada
```

---

## GUÍA DE IMPORTS Y ORGANIZACIÓN 📚

### Aliases de Nuxt Configurados

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    "@": "./app", // Alias corto para app/
    "~": "./app", // Alias Nuxt estándar
    "@hexag": "./app/core/hexag", // Acceso directo a hexágono
    "@presentation": "./app/core/presentation",
    "@shared": "./app/core/shared",
  },
});
```

### Patrones de Import por Tipo de Archivo

#### **Componentes Globales:**

```typescript
// Desde cualquier lugar
import CardTitle from "~/components/base/cards/CardTitle.vue";
import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
import { Button } from "@/components/ui/button";
```

#### **Hexágono (Domain, Application, Infrastructure):**

```typescript
// Usar alias @hexag
import { DatosSociedadDTO } from "@hexag/registros/sociedades/pasos/datos-sociedad/application";
import { rucSchema } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas";
import { DatosSociedadHttpRepository } from "@hexag/registros/sociedades/pasos/datos-sociedad/infrastructure";

// O ruta completa con ~
import { AccionistaDTO } from "~/core/hexag/registros/sociedades/pasos/accionistas/application";
```

#### **Presentation Layer:**

```typescript
// Usar alias @presentation
import { useDatosSociedad } from "@presentation/registros/sociedades/pasos/datos-sociedad/useDatosSociedad";
import DatosSociedadForm from "@presentation/registros/sociedades/pasos/datos-sociedad/DatosSociedadForm.vue";
```

#### **Shared/Utilities:**

```typescript
import { formatDate } from "@shared/utils/date-formatters";
import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
```

#### **Types y Enums:**

```typescript
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
import type { TypeOption } from "~/types/TypeOptions";
```

### Estructura de Exportaciones por Capa

#### **Domain Layer - Siempre exportar por index.ts:**

```typescript
// domain/index.ts
export type { SociedadDatosGenerales } from "./entities/datos-sociedad.entity";
export type { DatosSociedadRepository } from "./ports/datos-sociedad.repository";
export * from "./schemas"; // Re-exporta todos los schemas
```

#### **Application Layer - Exportar use cases y DTOs:**

```typescript
// application/index.ts
export type { DatosSociedadDTO } from "./dtos/datos-sociedad.dto";
export {
  GetDatosSociedadUseCase,
  CreateDatosSociedadUseCase,
  UpdateDatosSociedadUseCase,
} from "./use-cases";
```

#### **Infrastructure Layer - Exportar repositorios:**

```typescript
// infrastructure/index.ts
export { DatosSociedadHttpRepository } from "./repositories/datos-sociedad.http.repository";
export { DatosSociedadMapper } from "./mappers/datos-sociedad.mapper";
export { datosSociedadHandlers } from "./mocks/handlers/datos-sociedad.handlers";
```

### Reglas de Oro 🌟

1. **NUNCA usar imports relativos profundos** (`../../..`)
2. **SIEMPRE usar aliases** (`~/`, `@/`, `@hexag`, `@presentation`)
3. **Exportar todo por index.ts** en cada capa
4. **Nombres descriptivos** en archivos y carpetas
5. **Un archivo = Una responsabilidad**

---

## CHECKLIST DE VALIDACIÓN ✅

### Fase 0 - Auditoría

- [ ] Lista completa de imports relativos generada
- [ ] Catálogo de componentes reutilizables creado
- [ ] Catálogo de schemas completado
- [ ] Aliases configurados en `nuxt.config.ts`
- [ ] Guía de imports documentada

### Fase 1 - Reorganización

- [ ] Rutas duplicadas eliminadas
- [ ] Schemas movidos a domain layer
- [ ] Todos los imports actualizados a aliases
- [ ] Componentes categorizados (global vs específico)
- [ ] Estructura de carpetas limpia

### Datos Sociedad

- [ ] Puede crear datos principales
- [ ] Puede editar datos existentes
- [ ] Validaciones funcionan correctamente
- [ ] Botones Guardar/Restablecer funcionan
- [ ] Navegación al siguiente paso funciona
- [ ] MSW y API HTTP funcionan indistintamente

### Accionistas

- [ ] Puede listar accionistas
- [ ] Puede crear accionista
- [ ] Puede editar accionista
- [ ] Puede eliminar accionista
- [ ] Modal funciona en ambos modos (crear/editar)
- [ ] Validaciones funcionan
- [ ] MSW y API HTTP funcionan indistintamente

### General

- [ ] No quedan imports a `modules/registro-sociedades`
- [ ] No quedan rutas legacy activas
- [ ] Todas las páginas usan layout correcto
- [ ] Navegación entre pasos funciona
- [ ] Documentación actualizada

---

## ¿CÓMO EMPEZAR? 🚀

### Paso 1: Preparación

```bash
# Crear rama nueva
git checkout -b refactor/hexagonal-clean-architecture

# Crear backup
git branch backup/before-refactor

# Asegurar dependencias actualizadas
npm install
```

### Paso 2: Fase 0 - AUDITORÍA (OBLIGATORIO)

```bash
# Generar reporte de imports relativos
grep -rn "from ['\"]\.\.\/\.\.\/" app/ --include="*.vue" --include="*.ts" > audit/relative-imports.txt

# Listar todos los schemas
find app/ -name "*schema*.ts" -o -name "*schemas.ts" > audit/schemas-list.txt

# Listar todos los componentes
find app/components -name "*.vue" > audit/components-global.txt
find app/modules -name "*.vue" > audit/components-modules.txt
find app/core/presentation -name "*.vue" > audit/components-presentation.txt
```

**⚠️ NO CONTINUAR sin completar la auditoría.**

### Paso 3: Configurar Aliases

```bash
# Editar nuxt.config.ts y agregar aliases
# Ver sección "Aliases de Nuxt Configurados" arriba
```

### Paso 4: Ejecutar Fases en Orden

**IMPORTANTE:** Una fase a la vez, validar antes de continuar.

```bash
# Fase 1: Limpieza
# - Eliminar rutas duplicadas
# - Mover schemas
# - Actualizar imports

npm run dev  # Validar que todo funciona
git add .
git commit -m "feat(refactor): Fase 1 - Limpieza y reorganización"

# Fase 2: Datos Sociedad
# ... implementar

npm run dev  # Validar
git add .
git commit -m "feat(refactor): Fase 2 - Datos Sociedad completo"

# ... continuar con otras fases
```

### Paso 5: Validación Continua

Después de cada cambio:

```bash
# Verificar compilación
npm run build

# Verificar tipos
npx nuxi typecheck

# Ejecutar desarrollo
npm run dev

# Probar funcionalidad específica
# - Agregar sociedad
# - Ver historial
# - Editar datos
```

---

## NOTAS IMPORTANTES ⚠️

- **NO eliminar** `modules/registro-sociedades` hasta migrar TODOS los pasos
- **Mantener MSW funcionando** en todo momento
- **Validar con API real** al finalizar cada paso
- **Documentar decisiones** en commits
- **Hacer backup** antes de eliminar archivos

---

## SIGUIENTE NIVEL 🎯

Una vez completado este plan, el proyecto tendrá:

✅ Arquitectura hexagonal pura
✅ Separation of concerns clara
✅ Patrón establecido y replicable
✅ Fácil de testear
✅ Fácil de mantener
✅ Fácil de escalar

**Tiempo para completar TODOS los pasos:** ~25-30 horas
