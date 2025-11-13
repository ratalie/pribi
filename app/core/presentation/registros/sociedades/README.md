# Presentación – Registro de Sociedades

Este módulo agrupa los componentes, stores y composables que consumen la capa hexagonal (`app/core/hexag/registros`).  
La intención es que el equipo de UI pueda seguir extendiendo vistas sin tocar el dominio.

## Estructura

```
app/core/presentation/registros/sociedades/
├── components/
│   └── DatosSociedadForm.vue    # Wrapper UI para crear/editar/preview
├── composables/
│   └── useDatosSociedadForm.ts  # Orquesta stores + modo (crear/editar/preview)
├── stores/
│   ├── sociedad-historial.store.ts
│   └── datos-sociedad.store.ts
```

- **Stores**: encapsulan el estado compartido (Pinia) y sólo hablan con casos de uso/ports.
- **Composables**: empaquetan la lógica para cada vista o formulario.
- **Components**: renderizan la UI reutilizable (formularios, vistas de resumen, etc.).

## Flujo de Datos Principales

1. `DatosSociedadForm.vue` se monta con `societyId` y `mode`.
2. El composable `useDatosSociedadForm` llama al store `useDatosSociedadStore`.
3. El store ejecuta los casos de uso (`Get/Create/Update`) que dependen del puerto `DatosSociedadRepository`.
4. Por defecto el repositorio apunta al adaptador HTTP, que en dev es interceptado por MSW.

## Modos soportados

- `EntityModeEnum.CREAR`: permite crear/actualizar los datos.
- `EntityModeEnum.EDITAR`: carga y permite actualizar.
- `EntityModeEnum.PREVISUALIZAR`: carga sólo lectura (sin mutaciones).

## Cómo usarlo en una vista

```vue
<script setup lang="ts">
import { EntityModeEnum } from '~/types/enums/EntityModeEnum';
import DatosSociedadForm from '~/core/presentation/registros/sociedades/components/DatosSociedadForm.vue';

const route = useRoute();
const societyId = computed(() => route.params.id as string);
</script>

<template>
  <DatosSociedadForm :society-id="societyId" :mode="EntityModeEnum.CREAR" />
</template>
```

## Vista Preview

`pages/registros/sociedades/[id]/preview.vue` utiliza los mismos componentes en modo `PREVISUALIZAR`, por lo que no se duplica lógica.  
Para añadir el resto de pasos, crea wrappers equivalentes (Accionistas, Acciones, etc.) y márcalos en el `ROADMAP`.

## Próximos pasos sugeridos

- Añadir wrappers/composables para los demás pasos del flujo.
- Integrar notificaciones (toast) con los stores (`load/create/update`).
- Escribir tests de integración con `@nuxt/test-utils` para garantizar que la vista preview hidrata todos los pasos.

> **Ubicación**: toda la lógica de presentación de sociedades debe vivir bajo `app/core/presentation/registros/sociedades/`.  
> Evita modificar los componentes legacy en `app/modules/registro-sociedades`; en lugar de eso, crea wrappers aquí.

