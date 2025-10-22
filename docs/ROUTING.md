# 🛣️ Sistema de Routing

Documentación completa del sistema de routing y arquitectura de módulos.

## Estrategia de Routing

Se implementó **file-based routing** con estructura separada para máxima legibilidad y mantenibilidad:

**Opción elegida:** Rutas separadas por funcionalidad (crear/editar)

### Ventajas de la Estrategia Elegida

- ✅ **Simplicidad**: Estructura mental clara
- ✅ **Mantenibilidad**: Archivos específicos por propósito
- ✅ **TypeScript**: Types dedicados por contexto
- ✅ **Testing**: Aislamiento de funcionalidades

## Estructura de Rutas - Registro Societario

```
app/pages/registro-societario/sociedades/
├── index.vue                        → /registro-societario/sociedades (lista)
├── crear/
│   ├── datos-sociedad.vue          → /registro-societario/sociedades/crear/datos-sociedad
│   ├── accionistas.vue             → /registro-societario/sociedades/crear/accionistas
│   ├── directorio.vue              → /registro-societario/sociedades/crear/directorio
│   └── ... (steps adicionales)
└── editar/
    └── [id]/
        ├── datos-sociedad.vue      → /registro-societario/sociedades/editar/123/datos-sociedad
        ├── accionistas.vue         → /registro-societario/sociedades/editar/123/accionistas
        ├── directorio.vue          → /registro-societario/sociedades/editar/123/directorio
        └── ... (steps adicionales)
```

```

app/pages/registro-societario/sucursales/
├── index.vue                        → /registro-societario/sucursales (lista)
├── crear/
│   ├── datos-sucursal.vue          → /registro-societario/sucursales/crear/datos-sucursal
│   ├── ubicacion.vue               → /registro-societario/sucursales/crear/ubicacion
│   ├── representantes.vue          → /registro-societario/sucursales/crear/representantes
│   └── ... (steps específicos)
└── editar/
    └── [id]/
        ├── datos-sucursal.vue      → /registro-societario/sucursales/editar/456/datos-sucursal
        ├── ubicacion.vue           → /registro-societario/sucursales/editar/456/ubicacion
        ├── representantes.vue      → /registro-societario/sucursales/editar/456/representantes
        └── ... (steps específicos)
```

## Patrón de Implementación

**Páginas de Routing**: Solo importan y renderizan componentes Step
**Componentes Step**: Contienen la lógica y UI específica del paso
**Enum Compartido**: `EntityModeEnum` para modos CREAR/EDITAR
**Captura de Parámetros**: ID automático en rutas de edición via `useRoute()`

## Integración con Módulos

Los componentes Step se organizan en módulos de negocio, permitiendo:

- **Reutilización** entre diferentes flujos
- **Mantenimiento** centralizado de lógica
- **Testing** específico por dominio
- **Escalabilidad** para nuevos módulos

### Ejemplo Práctico: Componente Step

**1. Crear el componente Step en el módulo:**

```vue
<!-- filepath: app/modules/registro-sociedades/components/AccionesStep.vue -->
<script setup lang="ts">
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

interface Props {
  mode: EntityModeEnum;
  societyId?: string;
}

defineProps<Props>();
</script>

<template>
  <div>Datos de acciones: {{ mode }}</div>
  <p v-if="mode === EntityModeEnum.EDITAR && societyId">ID: {{ societyId }}</p>
</template>
```

**2. Instanciar en página de crear:**

```vue
<!-- filepath: app/pages/registro-societario/crear/acciones.vue -->
<script setup lang="ts">
import AccionesStep from "~/modules/registro-sociedades/components/AccionesStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
</script>

<template>
  <AccionesStep :mode="EntityModeEnum.CREAR" />
</template>
```

**3. Instanciar en página de editar:**

```vue
<!-- filepath: app/pages/registro-societario/editar/[id]/acciones.vue -->
<script setup lang="ts">
import AccionesStep from "~/modules/registro-sociedades/components/AccionesStep.vue";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

const route = useRoute();
const societyId = route.params.id as string;
</script>

<template>
  <AccionesStep :mode="EntityModeEnum.EDITAR" :society-id="societyId" />
</template>
```

### Flujo Completo

1. **Módulo** (`app/modules/registro-sociedades/components/`) contiene la lógica
2. **Páginas de routing** (`app/pages/registro-societario/`) solo renderizan
3. **Enum compartido** distingue entre crear/editar
4. **Props automáticas** (societyId se pasa solo en editar)

---

[← Volver al README principal](../README.md)
