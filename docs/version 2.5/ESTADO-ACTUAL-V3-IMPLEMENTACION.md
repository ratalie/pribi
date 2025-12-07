# 🔍 ESTADO ACTUAL V3: IMPLEMENTACIÓN REAL DEL CÓDIGO

**Fecha**: 2 de Diciembre 2025  
**Propósito**: Documentar exactamente QUÉ ESTÁ IMPLEMENTADO en V3 y QUÉ FALTA  
**Para**: IA V2.5, IA Backend, Arquitecto Principal

---

## 📋 ÍNDICE

1. [Vista General del Proyecto](#vista-general)
2. [Juntas: Estado Detallado](#juntas-estado)
3. [Repositorio: Estado Detallado](#repositorio-estado)
4. [Panel Administrativo: Estado Detallado](#panel-estado)
5. [Sistema Visual: Cómo Funciona](#sistema-visual)

---

## 🎯 <a id="vista-general"></a>VISTA GENERAL DEL PROYECTO V3

### Estructura de Carpetas Real

```
app/
├── core/
│   ├── hexag/                              # ⭐ Arquitectura Hexagonal
│   │   ├── registros/                      # ✅ 100% implementado
│   │   │   └── sociedades/
│   │   │       └── pasos/                  # 8 pasos completos
│   │   │
│   │   ├── juntas/                         # ⚠️ 40% implementado
│   │   │   ├── domain/                     # ✅ Base completa
│   │   │   ├── application/                # ✅ DTOs + algunos use cases
│   │   │   └── infrastructure/             # ✅ Repositories base
│   │   │
│   │   ├── repositorio/                    # ✅ 90% implementado (sin presentación)
│   │   │   ├── almacenamiento/
│   │   │   ├── documentos-generados/
│   │   │   └── carpetas-personalizadas/
│   │   │
│   │   └── panel-administrativo/           # ✅ 85% implementado (sin presentación)
│   │
│   └── presentation/                       # ⭐ Capa de Presentación
│       ├── registros/                      # ✅ 100% implementado
│       │   └── sociedades/
│       │       └── [paso]/
│       │           ├── stores/
│       │           └── composables/
│       │
│       └── juntas/                         # ⚠️ 20% implementado
│           └── stores/
│               └── agenda-items.store.ts   # ← Solo 1 store creado
│
├── layouts/
│   ├── default.vue                         # ✅ Layout principal
│   ├── registros.vue                       # ✅ Layout con ProboSidebar
│   ├── flow-layout.vue                     # ✅ Layout para Registro Sociedades
│   └── flow-layout-juntas.vue              # ✅ Layout para Juntas (doble sidebar)
│
├── components/
│   ├── flow-layout-juntas/                 # ✅ 100% - 15 componentes
│   │   ├── FlowLayoutJuntasSidebar.vue
│   │   ├── WizardRightSidebar.vue
│   │   ├── FlowLayoutJuntasHeader.vue
│   │   ├── FlowLayoutJuntasFooterWrapper.vue
│   │   └── ... (11 componentes más)
│   │
│   └── juntas/                             # ⚠️ 30% - Componentes específicos
│       └── SeleccionPuntosAgenda.vue       # ← Solo 1 componente creado
│
├── pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/
│   ├── seleccion-agenda/
│   │   └── index.vue                       # ✅ 90% - Funcional (falta persistencia)
│   ├── detalles/
│   │   └── index.vue                       # ⚠️ 70% - Estructura (falta data)
│   ├── instalacion/
│   │   └── index.vue                       # ⚠️ 60% - Estructura (falta data)
│   ├── puntos-acuerdo.vue                  # ✅ 80% - Vista general
│   │
│   ├── aporte-dinerario/                   # ⚠️ 40% - Solo estructura
│   │   ├── index.vue                       # ⚠️ Vista vacía
│   │   ├── aportantes.vue                  # ⚠️ Vista vacía
│   │   ├── aportes.vue                     # ⚠️ Vista vacía
│   │   ├── votacion.vue                    # ⚠️ Vista vacía
│   │   └── resumen.vue                     # ⚠️ Vista vacía
│   │
│   ├── capitalizacion-creditos/            # ⚠️ 30% - Solo carpetas
│   ├── nombramiento-gerente/               # ⚠️ 30% - Solo carpetas
│   ├── ... (11+ carpetas creadas)
│   │
│   ├── resumen/
│   │   └── index.vue                       # ⚠️ 50% - Vista lista, falta data
│   └── descargar.vue                       # ❌ 0% - No iniciado
│
├── config/
│   ├── flows/
│   │   └── junta-accionistas.flow.ts       # ✅ 100% - FlowConfig completo
│   ├── routes/
│   │   └── junta-accionistas.routes.ts     # ✅ 100% - 87 rutas
│   └── juntas/
│       └── sections.config.ts              # ✅ 80% - 2 puntos configurados
│
├── composables/
│   ├── useJuntasFlowNext.ts                # ✅ 100%
│   ├── useJuntasNavbarRoutes.ts            # ✅ 100%
│   ├── useJuntasSections.ts                # ✅ 100%
│   ├── useJuntasNavigation.ts              # ✅ 100%
│   └── ... (10+ composables)               # ✅ 100%
│
└── stores/
    ├── useJuntasFlowStore.ts               # ✅ 100%
    ├── useJuntasNavbarStore.ts             # ✅ 100%
    └── useAgendaItemsStore.ts              # ✅ 80% (primer store hexagonal)
```

---

## 📋 <a id="juntas-estado"></a>JUNTAS: ESTADO DETALLADO

### Componentes del Sistema (100% funcionales)

#### 1. Layout Principal

**Archivo**: `app/layouts/flow-layout-juntas.vue`  
**Estado**: ✅ **100% COMPLETO**  
**Descripción**: Layout maestro con estructura dual sidebar

```vue
<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar Izquierdo -->
    <FlowLayoutJuntasSidebar />

    <div class="flex flex-col min-h-0 flex-1 overflow-hidden">
      <!-- Header -->
      <FlowLayoutJuntasHeader />

      <!-- Contenido + Right Sidebar -->
      <FlowLayoutJuntasContentWrapper>
        <slot />
      </FlowLayoutJuntasContentWrapper>

      <!-- Footer -->
      <FlowLayoutJuntasFooterWrapper />
    </div>
  </div>
</template>
```

**Características**:

- ✅ Sidebar izquierdo fijo (6 pasos principales)
- ✅ Right sidebar condicional (aparece en Paso 4)
- ✅ Header con breadcrumbs
- ✅ Footer con botón "Siguiente"
- ✅ Responsive (mobile con drawer)

#### 2. Sidebar Izquierdo

**Componentes**:

- `FlowLayoutJuntasSidebar.vue` (wrapper)
- `SingleWizardSidebarJuntas.vue` (contenido)
- `SidebarStepsList.vue` (lista de pasos)
- `SidebarStepItem.vue` (item individual)
- `SidebarSubStepCategory.vue` (categorías)

**Estado**: ✅ **100% COMPLETO**

**Funcionalidades**:

- ✅ Mostrar 6 pasos principales
- ✅ Expandir/colapsar Paso 4 (Puntos de Acuerdo)
- ✅ Agrupar sub-steps por categoría
- ✅ Filtrado dinámico según selección de Paso 1
- ✅ Estados visuales (completed, current, empty)
- ✅ Navegación entre pasos
- ✅ Checkmarks azules en pasos completados
- ✅ Líneas conectoras entre pasos

**Código clave**:

```typescript
// app/composables/useJuntasNavbarRoutes.ts
export const useJuntasNavbarRoutes = () => {
  const route = useRoute();
  const juntasFlowStore = useJuntasFlowStore();

  const steps = computed<NavigationStep[]>(() => {
    const context = {
      societyId: route.params.societyId as string,
      flowId: route.params.flowId as string,
    };

    // ⭐ Genera navegación filtrando sub-steps según selección de Paso 1
    return juntaNavigation(context);
  });

  return { steps, currentSubStepId };
};
```

```typescript
// app/config/junta-navigation.ts
export const juntaNavigation = (context) => {
  const juntasFlowStore = useJuntasFlowStore();
  const dynamicSubSteps = juntasFlowStore.getDynamicSubSteps; // ← Del Paso 1

  return BASE_STEPS.map((step) => {
    if (step.slug === "puntos-acuerdo") {
      // ⭐ Filtrar sub-steps según lo seleccionado
      const filteredSubSteps = BASE_SUB_STEPS.filter((sub) =>
        dynamicSubSteps.includes(sub.id)
      );

      return {
        ...step,
        subSteps: filteredSubSteps, // ← Solo los seleccionados
      };
    }

    return step;
  });
};
```

#### 3. Right Sidebar

**Componentes**:

- `WizardRightSidebar.vue` (wrapper)
- `RightSidebarHeader.vue` (header)
- `RightSidebarSectionItem.vue` (sección principal)
- `RightSidebarSubSectionItem.vue` (sub-sección)

**Estado**: ✅ **100% COMPLETO**

**Funcionalidades**:

- ✅ Aparece SOLO en Paso 4 (Puntos de Acuerdo)
- ✅ Muestra secciones del punto actual
- ✅ Navegación entre secciones
- ✅ Expansión/colapso de sub-secciones
- ✅ Estados visuales (completed, current, upcoming)
- ✅ Barra vertical morada en sección activa
- ✅ Soporte para anclas (scroll) y rutas

**Configuración de secciones**:

```typescript
// app/config/juntas/sections.config.ts
export const SUB_STEP_SECTIONS_MAP: Record<string, SectionItem[]> = {
  "aporte-dinerarios": [
    { id: "aporte-dinerario", title: "Aporte Dinerario", navigationType: "route" },
    { id: "seleccion-aportantes", title: "Selección de Aportantes", navigationType: "route" },
    { id: "aportes-dinerarios", title: "Aportes Dinerarios", navigationType: "route" },
    { id: "votacion", title: "Votación", navigationType: "route" },
    { id: "resumen", title: "Resumen", navigationType: "route" },
  ],

  "aplicacion-resultados": [
    {
      id: "aplicacion-resultados",
      title: "Aplicación de Resultados",
      navigationType: "route",
    },
    {
      id: "utilidades-montos",
      title: "Utilidades y Montos",
      navigationType: "anchor",
      subSections: [
        {
          id: "valores-preliminares",
          title: "Valores Preliminares",
          navigationType: "anchor",
        },
        { id: "calculo-utilidad", title: "Cálculo de Utilidad", navigationType: "anchor" },
        // ... más anclas
      ],
    },
    { id: "votacion", title: "Votación", navigationType: "route" },
    { id: "resumen", title: "Resumen", navigationType: "route" },
  ],

  // ⚠️ FALTA configurar 11+ puntos más
};
```

**Uso en componente**:

```typescript
// app/composables/useJuntasSections.ts
export function useJuntasSections(isResumenPage, currentSubStepId, detectedCurrentSection) {
  const sections = computed(() => {
    if (isResumenPage.value || !currentSubStepId.value) {
      return [];
    }

    // ⭐ Obtener secciones del config según sub-step actual
    const baseSections = getBaseSectionsForSubStep(currentSubStepId.value);

    // Aplicar estados (completed, current, upcoming)
    return applySectionStatuses(baseSections, detectedCurrentSection.value);
  });

  return { sections };
}
```

#### 4. Navegación

**Composables clave**:

```typescript
// app/composables/useJuntasNavigation.ts
export function useJuntasNavigation(isResumenPage, currentSubStepId) {
  const route = useRoute();

  // ⭐ Detectar sección actual desde la ruta
  const detectedCurrentSection = computed(() => {
    if (isResumenPage.value) {
      const hash = route.hash?.replace("#", "");
      const query = route.query.section as string;
      return hash || query || "detalles"; // Default: detalles
    }

    // Para sub-steps, detectar desde segments de URL
    const segments = route.path.split("/");
    const lastSegment = segments[segments.length - 1];

    // Mapear segment a sectionId
    const sectionIdMap: Record<string, string> = {
      aportantes: "seleccion-aportantes",
      aportes: "aportes-dinerarios",
      votacion: "votacion",
      resumen: "resumen",
    };

    return sectionIdMap[lastSegment] || lastSegment;
  });

  // ⭐ Handler para navegar entre secciones
  const handleSectionClick = (sectionId: string) => {
    // Navegar según navigationType (route o anchor)
    const section = findSection(sectionId);

    if (section?.navigationType === "route") {
      navigateTo(section.route);
    } else if (section?.navigationType === "anchor") {
      // Scroll a ancla
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    detectedCurrentSection,
    handleSectionClick,
  };
}
```

### Cómo Funciona el Sistema Actual

**Flujo completo de navegación**:

```
1. Usuario carga /seleccion-agenda
   → Layout: flow-layout-juntas
   → Sidebar izquierdo: Muestra 6 pasos (sin sub-steps porque no ha seleccionado aún)
   → Right sidebar: NO visible
   → Contenido: Formulario de selección de puntos

2. Usuario selecciona puntos: [Aporte Dinerario, Nombramiento Gerente]
   → Store: juntasFlowStore.updateDynamicSubSteps(['aporte-dinerarios', 'nombramiento-gerente'])
   → Sidebar izquierdo: Se actualiza reactivamente, Paso 4 muestra sub-steps seleccionados

3. Usuario hace click en "Siguiente"
   → useJuntasFlowNext ejecuta validación
   → Guarda selección en backend (agendaItemsStore.saveAgendaItems)
   → Navega a /detalles

4. Usuario completa Detalles e Instalación
   → Navega a /puntos-acuerdo (vista general del Paso 4)

5. Usuario hace click en "Aporte Dinerario" del sidebar izquierdo
   → Navega a /aporte-dinerario
   → Right sidebar: ✅ APARECE con secciones:
      - Aporte Dinerario (general)
      - Selección de Aportantes
      - Aportes Dinerarios
      - Votación
      - Resumen

6. Usuario hace click en "Aportantes" del right sidebar
   → Navega a /aporte-dinerario/aportantes
   → Right sidebar: SIGUE visible (mismas secciones, "Aportantes" highlighted)
   → Contenido: Formulario de aportantes (actualmente vacío)
```

---

## 📊 <a id="juntas-estado"></a>JUNTAS: ESTADO DETALLADO POR PASO

### Paso 1: Selección de Agenda

**Ruta**: `/seleccion-agenda`  
**Archivo**: `app/pages/.../seleccion-agenda/index.vue`  
**Estado**: ✅ **90% COMPLETO**

**Lo que TIENE**:

- ✅ Componente `SeleccionPuntosAgenda.vue` (formulario)
- ✅ Store hexagonal `useAgendaItemsStore` (Option API)
- ✅ Use Case `SaveAgendaItemsUseCase`
- ✅ Mapper `AgendaItemsMapper`
- ✅ Validación antes de avanzar
- ✅ Integración con sidebar (actualiza sub-steps dinámicamente)

**Lo que FALTA**:

- ⚠️ Persistencia en MSW (actualmente solo guarda en store)
- ⚠️ Cargar puntos pre-seleccionados (al editar junta)

**Código actual**:

```typescript
// app/pages/.../seleccion-agenda/index.vue
useJuntasFlowNext(async () => {
  const selectedPuntos = juntasFlowStore.getDynamicSubSteps;

  if (selectedPuntos.length === 0) {
    throw new Error("Debes seleccionar al menos un punto de agenda");
  }

  const payload = AgendaItemsMapper.frontendIdsToDTO(selectedPuntos);
  await agendaItemsStore.saveAgendaItems(societyId.value, flowIdNumber, payload);
});
```

```typescript
// app/core/presentation/juntas/stores/agenda-items.store.ts
export const useAgendaItemsStore = defineStore("agendaItems", {
  state: () => ({
    agendaItems: [] as AgendaItem[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async saveAgendaItems(societyId: number, flowId: number, dto: AgendaItemsDTO) {
      this.loading = true;
      try {
        const useCase = new SaveAgendaItemsUseCase(juntaRepository);
        await useCase.execute(societyId, flowId, dto);
        // Actualizar store local
        this.agendaItems = dto.items.filter((i) => i.selected);
        toast.success("Puntos de agenda guardados correctamente");
      } finally {
        this.loading = false;
      }
    },
  },
});
```

**Próximo paso**: Implementar MSW repository para guardar selección.

### Paso 2: Detalles

**Ruta**: `/detalles`  
**Archivo**: `app/pages/.../detalles/index.vue`  
**Estado**: ⚠️ **70% ESTRUCTURA**

**Lo que TIENE**:

- ✅ Estructura de página
- ✅ Layout con sidebars
- ✅ Hook de navegación configurado

**Lo que FALTA**:

- ❌ Componente de formulario (DetallesJunta.vue)
- ❌ Store hexagonal
- ❌ Use cases específicos (existen en core, no se usan)
- ❌ Integración con datos

**Lo que V2.5 tiene**:

```
V2.5 - Detalles tiene 2 pasos:
1. Tipo de Junta (General/Universal)
2. Convocatoria (fecha, hora, lugar, modo)

Componentes:
- src/wizards/shareholders-meeting/shared-workflow/tipo-junta/DesignarCargo.vue
- src/wizards/shareholders-meeting/shared-workflow/convocatoria/ConvocatoriaJunta.vue

Stores:
- src/store/juntas/aumento-capital/useTypeMeetingStore.ts
- Validaciones de fecha/hora
- Manejo de primera y segunda convocatoria
```

**Plan**:

1. Crear `DetallesJunta.vue` adaptando V2.5
2. Crear store hexagonal usando use cases existentes
3. Implementar MSW repository

### Paso 3: Instalación

**Ruta**: `/instalacion`  
**Estado**: ⚠️ **60% ESTRUCTURA**

**Lo que TIENE**:

- ✅ Estructura de página
- ✅ Layout configurado

**Lo que FALTA**:

- ❌ Componentes (3 sub-pasos)
- ❌ Stores
- ❌ Integración con snapshot

**Lo que V2.5 tiene**:

```
V2.5 - Instalación tiene 3 pasos:
1. Poderes de Representación
2. Asistencia de Accionistas
3. Presidente y Secretario

Componentes:
- src/wizards/.../PoderesRepresentacion.vue
- src/wizards/.../AsistenciaAccionistas.vue
- src/components/Views/DesignacionPresidenteSecretario/DesigPresidentSecretary.vue

Stores:
- src/store/juntas/useTablaPoderes.ts (complejo - 500+ líneas)
- src/components/Views/DesignacionPresidenteSecretario/usePresidentSecretary.store.ts

Lógica clave:
- Cálculo de quórum
- Validación de representación
- Tabla de asistencia con porcentajes
```

**Plan**:

1. Crear 3 componentes adaptando V2.5
2. Crear store hexagonal (descomponer TablaPoderes)
3. Implementar MSW repository
4. Usar datos del snapshot (accionistas del backend)

### Paso 4: Puntos de Acuerdo

**Ruta**: `/puntos-acuerdo`  
**Estado**: ⚠️ **30% ESTRUCTURA**

#### Sub-step: Aporte Dinerario

**Rutas**:

- `/aporte-dinerario` (index - vista general)
- `/aporte-dinerario/aportantes`
- `/aporte-dinerario/aportes`
- `/aporte-dinerario/votacion`
- `/aporte-dinerario/resumen`

**Estado**: ⚠️ **40% ESTRUCTURA**

**Lo que TIENE**:

- ✅ 5 páginas Vue creadas (vacías con placeholder)
- ✅ Right sidebar configurado (secciones mapeadas)
- ✅ Navegación entre secciones funcionando

**Lo que FALTA**:

- ❌ Arquitectura hexagonal completa
- ❌ Componentes de formulario
- ❌ Stores
- ❌ Use cases específicos
- ❌ MSW repositories
- ❌ Integración con datos

**Estructura actual**:

```vue
<!-- app/pages/.../aporte-dinerario/aportantes.vue -->
<template>
  <SlotWrapper>
    <TitleH2
      title="Aportantes"
      subtitle="Selecciona los aportantes que participarán en la junta de accionistas."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
      ← ⚠️ PLACEHOLDER VACÍO
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  useJuntasFlowNext(async () => {
    // ⚠️ TODO: Agregar validación y guardado
  });
</script>
```

**Lo que V2.5 tiene (para replicar)**:

```vue
<!-- V2.5 - src/components/Views/AportesAumentoCapital/AportanteAumentoCapital.vue -->
<template>
  <div>
    <h2>Selección de Aportantes</h2>

    <!-- Tabla de accionistas del snapshot -->
    <table>
      <tr v-for="accionista in accionistas" :key="accionista.id">
        <td>{{ accionista.nombre }}</td>
        <td>{{ accionista.participacion }}%</td>
        <td>
          <input type="checkbox" v-model="selectedAportantes" :value="accionista.id" />
        </td>
      </tr>
    </table>

    <!-- Botón agregar -->
    <button @click="agregarAportantes">Agregar Aportantes</button>
  </div>
</template>

<script setup lang="ts">
  // Store V2.5
  const aportesStore = useAportesAumentoCapitalStore();
  const accionistas = computed(() => aportesStore.accionistasSnapshot);

  const agregarAportantes = async () => {
    await aportesStore.saveAportantes(selectedAportantes.value);
  };
</script>
```

**Plan de migración**:

```typescript
// 1. Crear arquitectura hexagonal
app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/
├── domain/
│   ├── entities/
│   │   ├── aportante.entity.ts
│   │   └── aporte.entity.ts
│   └── ports/
│       └── aporte-dinerario.repository.ts
├── application/
│   ├── dtos/
│   │   ├── aportante.dto.ts
│   │   └── aporte.dto.ts
│   └── use-cases/
│       ├── create-aportante.use-case.ts
│       ├── list-aportantes.use-case.ts
│       ├── create-aporte.use-case.ts
│       └── list-aportes.use-case.ts
└── infrastructure/
    ├── repositories/
    │   └── aporte-dinerario.msw.repository.ts  ← ⭐ EMPEZAR AQUÍ
    ├── mappers/
    │   ├── aportante.mapper.ts
    │   └── aporte.mapper.ts
    └── mocks/
        ├── handlers/aporte-dinerario.handlers.ts
        └── data/aporte-dinerario.state.ts

// 2. Crear presentación
app/core/presentation/juntas/aporte-dinerario/
├── stores/
│   ├── useAportantesStore.ts
│   └── useAportesStore.ts
└── composables/
    ├── useAportantesController.ts
    └── useAportesController.ts

// 3. Crear componentes
app/components/juntas/aporte-dinerario/
├── FormularioAportante.vue
├── TablaAportantes.vue
├── FormularioAporte.vue
└── TablaAportes.vue

// 4. Actualizar páginas
app/pages/.../aporte-dinerario/
├── aportantes.vue  ← Reemplazar BlankContainer con FormularioAportante
├── aportes.vue     ← Reemplazar BlankContainer con FormularioAporte
└── votacion.vue    ← Usar VotacionUniversal.vue (componente reutilizable)
```

#### Otros 13+ Sub-steps

**Estado**: ⚠️ **30% ESTRUCTURA**

**Lo que TIENE**:

- ✅ Carpetas creadas
- ✅ Rutas en JuntaRoutes enum
- ⚠️ Páginas vacías (algunas ni existen)

**Lista completa**:

| Sub-step                | Carpeta | Páginas Creadas | Estado |
| ----------------------- | ------- | --------------- | ------ |
| Aporte Dinerario        | ✅      | ✅ 5 páginas    | 40%    |
| Capitalización Créditos | ✅      | ⚠️ Parcial      | 30%    |
| Nombramiento Gerente    | ✅      | ⚠️ Parcial      | 30%    |
| Nombramiento Apoderados | ✅      | ⚠️ Parcial      | 30%    |
| Nombramiento Directores | ✅      | ⚠️ Parcial      | 30%    |
| Nombramiento Directorio | ✅      | ⚠️ Parcial      | 30%    |
| Remoción Gerente        | ✅      | ⚠️ Parcial      | 30%    |
| Remoción Apoderados     | ✅      | ⚠️ Parcial      | 30%    |
| Remoción Directores     | ✅      | ⚠️ Parcial      | 30%    |
| Pronunciamiento Gestión | ✅      | ⚠️ Parcial      | 30%    |
| Aplicación Resultados   | ✅      | ⚠️ Parcial      | 30%    |
| Nombramiento Auditores  | ✅      | ⚠️ Parcial      | 30%    |
| Reparto Dividendos      | ✅      | ⚠️ Parcial      | 30%    |
| Estados Financieros     | ✅      | ⚠️ Parcial      | 30%    |

**Patrón universal para completar**:

```typescript
// Para CADA sub-step, replicar exactamente el patrón de Aporte Dinerario:

1. Crear app/core/hexag/juntas/puntos-acuerdo/[punto]/
   - domain/entities/
   - domain/ports/
   - application/dtos/
   - application/use-cases/
   - infrastructure/repositories/
   - infrastructure/mappers/
   - infrastructure/mocks/

2. Crear app/core/presentation/juntas/[punto]/
   - stores/
   - composables/

3. Crear app/components/juntas/[punto]/
   - Componentes específicos del formulario

4. Actualizar app/pages/.../[punto]/
   - index.vue
   - [seccion1].vue
   - [seccion2].vue
   - votacion.vue (usar componente universal)
   - resumen.vue (usar componente universal)

5. Actualizar app/config/juntas/sections.config.ts
   - Agregar secciones del punto
```

### Paso 5: Resumen

**Ruta**: `/resumen`  
**Estado**: ⚠️ **50% ESTRUCTURA**

**Lo que TIENE**:

- ✅ Página creada
- ✅ Right sidebar configurado (secciones especiales)
- ✅ Composable `useJuntasResumenSections` (genera secciones dinámicas)
- ✅ Navegación por anclas

**Lo que FALTA**:

- ❌ Componentes de resumen por cada sección
- ❌ Store que consolide datos de TODOS los puntos
- ❌ Vista consolidada

**Lógica especial del resumen**:

```typescript
// app/composables/useJuntasResumenSections.ts
export const useJuntasResumenSections = () => {
  const juntasFlowStore = useJuntasFlowStore();
  const route = useRoute();

  const sections = computed<SectionItem[]>(() => {
    const result: SectionItem[] = [];

    // 1. Agregar secciones base (Detalles, Instalación)
    result.push({
      id: "detalles",
      title: "Detalles de la Junta",
      navigationType: "anchor",
    });

    result.push({
      id: "instalacion",
      title: "Instalación de la Junta",
      navigationType: "anchor",
    });

    // 2. Agregar "Puntos de Acuerdo" como contenedor
    const puntosSeleccionados = juntasFlowStore.getDynamicSubSteps;
    const puntosAcuerdoItem: SectionItem = {
      id: "puntos-acuerdo",
      title: "Puntos de Acuerdo",
      navigationType: "anchor",
      subSections: puntosSeleccionados.map((puntoId) => ({
        id: puntoId,
        title: getTitleForPunto(puntoId), // Ej: "Aporte Dinerario"
        navigationType: "anchor",
      })),
    };

    result.push(puntosAcuerdoItem);

    return result;
  });

  return { sections };
};
```

**Right sidebar en Resumen**:

```
Right Sidebar (Resumen):
├─ Detalles de la Junta
├─ Instalación de la Junta
└─ Puntos de Acuerdo
   ├─ Aporte Dinerario        ← Solo si fue seleccionado
   ├─ Nombramiento Gerente    ← Solo si fue seleccionado
   └─ Estados Financieros     ← Solo si fue seleccionado
```

**Plan**:

1. Crear componentes de resumen por sección
2. Store que consolide datos
3. Vista con scroll a anclas

### Paso 6: Descargar

**Ruta**: `/descargar`  
**Estado**: ❌ **0% NO INICIADO**

**Plan**:

- ⚠️ USAR SISTEMA V2.5 LEGACY (generación de documentos)
- ⚠️ Crear adaptador V2.5 → V3

---

## 📁 <a id="repositorio-estado"></a>REPOSITORIO: ESTADO DETALLADO

### Arquitectura Hexagonal (90% completa)

#### Almacenamiento

**Archivos implementados**:

```
app/core/hexag/repositorio/almacenamiento/
├── domain/
│   ├── entities/
│   │   ├── documento-societario.entity.ts           # ✅ 100%
│   │   └── carpeta-sistema.entity.ts                # ✅ 100%
│   └── ports/
│       └── almacenamiento.repository.ts             # ✅ 100%
│
├── application/
│   ├── dtos/
│   │   └── documento-societario.dto.ts              # ✅ 100%
│   └── use-cases/
│       ├── list-documentos.use-case.ts              # ✅ 100%
│       ├── create-carpeta-sistema.use-case.ts       # ✅ 100%
│       ├── upload-documento.use-case.ts             # ✅ 100%
│       ├── download-documento.use-case.ts           # ✅ 100%
│       └── delete-documento.use-case.ts             # ✅ 100%
│
└── infrastructure/
    ├── repositories/
    │   ├── almacenamiento-http.repository.ts        # ✅ 100%
    │   └── almacenamiento-mock.repository.ts        # ✅ 100%
    └── mappers/
        └── documento-societario.mapper.ts           # ✅ 100%
```

**Código de ejemplo**:

```typescript
// domain/ports/almacenamiento.repository.ts
export interface AlmacenamientoRepository {
  listDocumentos(societyId: string, parentId: string | null): Promise<DocumentoSocietario[]>;
  getDocumento(societyId: string, documentoId: string): Promise<DocumentoSocietario | null>;
  createCarpeta(
    societyId: string,
    nombre: string,
    parentId: string | null
  ): Promise<CarpetaSistema>;
  uploadDocumento(
    societyId: string,
    file: File,
    parentId: string | null
  ): Promise<DocumentoSocietario>;
  downloadDocumento(societyId: string, documentoId: string): Promise<Blob>;
  deleteDocumento(societyId: string, documentoId: string): Promise<void>;
  navigateCarpeta(societyId: string, carpetaId: string): Promise<DocumentoSocietario[]>;
}
```

**⭐ CLAVE**: Esta arquitectura está PERFECTA. NO tocar. Solo crear presentación.

### Lo que FALTA (10% - Presentación)

```
app/core/presentation/repositorio/
├── almacenamiento/
│   ├── stores/
│   │   └── useAlmacenamientoStore.ts        # ❌ NO EXISTE
│   ├── composables/
│   │   └── useAlmacenamientoController.ts   # ❌ NO EXISTE
│   └── mappers/
│       └── almacenamiento-form.mapper.ts    # ❌ Opcional (si hay FormData)
│
app/components/repositorio/
├── DocumentosSocietariosView.vue            # ❌ NO EXISTE
├── FolderCard.vue                           # ❌ NO EXISTE
├── FileCard.vue                             # ❌ NO EXISTE
├── UploadArea.vue                           # ❌ NO EXISTE
└── BreadcrumbsNav.vue                       # ❌ NO EXISTE

app/pages/repositorio/
├── dashboard.vue                            # ❌ NO EXISTE
└── societarios/
    └── [[...path]].vue                      # ❌ NO EXISTE (navegación dinámica)
```

### Comparación con V2.5

| Funcionalidad         | V2.5        | V3 Hexagonal | V3 Presentación | Acción                     |
| --------------------- | ----------- | ------------ | --------------- | -------------------------- |
| Listar documentos     | ✅ Completo | ✅ Use Case  | ❌ No existe    | Crear store + componente   |
| Subir archivos        | ✅ Completo | ✅ Use Case  | ❌ No existe    | Crear componente upload    |
| Crear carpetas        | ✅ Completo | ✅ Use Case  | ❌ No existe    | Crear form + store         |
| Descargar archivos    | ✅ Completo | ✅ Use Case  | ❌ No existe    | Crear handler              |
| Eliminar              | ✅ Completo | ✅ Use Case  | ❌ No existe    | Crear confirmación + store |
| Navegación jerárquica | ✅ Completo | ✅ Use Case  | ❌ No existe    | Crear breadcrumbs + store  |
| Preview documentos    | ✅ Completo | ❌ No existe | ❌ No existe    | Agregar use case + modal   |
| Drag & Drop           | ✅ Completo | ❌ No existe | ❌ No existe    | Feature avanzado (Fase 2)  |

### ¿Qué tanto sirve lo que tenemos?

**Arquitectura hexagonal**: 🟢 **90% PERFECTA**

- Use cases cubren TODAS las operaciones básicas
- Repositories duales (HTTP + Mock) funcionan
- Mappers transforman correctamente
- **NO modificar, solo usar**

**Presentación**: 🔴 **0% FALTA TODO**

- Crear stores con Option API
- Crear controllers que usen use cases
- Crear componentes UI copiando diseño V2.5
- Crear páginas

### Plan de Implementación

#### Sprint 1: Dashboard (2 días)

```vue
<!-- app/pages/repositorio/dashboard.vue -->
<template>
  <div class="p-8">
    <!-- Selector de sociedad -->
    <USelectMenu v-model="selectedSociety" :options="societies" />

    <!-- 3 Cards de navegación -->
    <div class="grid grid-cols-3 gap-6 mt-6">
      <CardNavigation
        title="Documentos Societarios"
        icon="folder"
        @click="navigateTo('/repositorio/societarios')"
      />
      <CardNavigation
        title="Documentos Generados"
        icon="file-document"
        @click="navigateTo('/repositorio/generados')"
      />
      <CardNavigation
        title="Carpetas Personalizadas"
        icon="folder-star"
        @click="navigateTo('/repositorio/personalizadas')"
      />
    </div>

    <!-- Métricas -->
    <div class="grid grid-cols-4 gap-4 mt-8">
      <MetricCard label="Total Documentos" :value="stats.totalDocumentos" />
      <MetricCard label="Total Carpetas" :value="stats.totalCarpetas" />
      <MetricCard label="Espacio Usado" :value="formatBytes(stats.espacioUsado)" />
      <MetricCard label="Límite" :value="formatBytes(stats.limite)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const repositorioStore = useRepositorioStore();
  const stats = computed(() => repositorioStore.stats);

  onMounted(async () => {
    await repositorioStore.loadStats(selectedSociety.value);
  });
</script>
```

#### Sprint 2: Vista Google Drive (2 días)

```vue
<!-- app/pages/repositorio/societarios/[[...path]].vue -->
<template>
  <div class="p-8">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" />

    <!-- Toolbar -->
    <div class="flex justify-between mt-4">
      <div class="flex gap-2">
        <UButton @click="uploadModal = true">Subir Archivo</UButton>
        <UButton @click="createFolderModal = true">Nueva Carpeta</UButton>
      </div>

      <UToggle v-model="viewMode" :options="['grid', 'list']" />
    </div>

    <!-- Grid de documentos -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-4 gap-4 mt-6">
      <DocumentCard
        v-for="doc in documentos"
        :key="doc.id"
        :documento="doc"
        @click="handleDocumentClick(doc)"
        @delete="handleDelete(doc.id)"
        @download="handleDownload(doc.id)"
      />
    </div>

    <!-- Lista de documentos -->
    <UTable v-else :rows="documentos" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
  const almacenamientoStore = useAlmacenamientoStore();
  const documentos = computed(() => almacenamientoStore.documentos);

  const handleDocumentClick = async (doc: DocumentoSocietario) => {
    if (doc.tipo === "folder") {
      // Navegar a carpeta
      await almacenamientoStore.loadDocumentos(societyId, doc.id);
    } else {
      // Abrir preview
      previewModal.value = true;
      previewDocument.value = doc;
    }
  };

  onMounted(async () => {
    await almacenamientoStore.loadDocumentos(societyId, currentParentId);
  });
</script>
```

#### Sprint 3: Otras vistas (2 días)

- Vista Documentos Generados (jerárquica)
- Vista Carpetas Personalizadas (con tabs)

**Total**: 1 semana para repositorio completo.

---

## 👥 <a id="panel-estado"></a>PANEL ADMINISTRATIVO: ESTADO DETALLADO

### Arquitectura Hexagonal (85% completa)

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts                  # ✅ 100%
│   │   ├── role.entity.ts                  # ✅ 100%
│   │   ├── permission.entity.ts            # ✅ 100%
│   │   └── study.entity.ts                 # ✅ 100%
│   └── ports/
│       └── user.repository.ts              # ✅ 100%
│
├── application/
│   ├── dtos/
│   │   ├── user.dto.ts                     # ✅ 100%
│   │   └── permission.dto.ts               # ✅ 100%
│   └── use-cases/
│       ├── get-users.use-case.ts           # ✅ 100%
│       ├── get-user-permissions.use-case.ts # ✅ 100%
│       └── update-user-permissions.use-case.ts # ✅ 100%
│
└── infrastructure/
    ├── repositories/
    │   ├── user-http.repository.ts         # ⚠️ 50% (solo GET)
    │   └── user-mock.repository.ts         # ✅ 100%
    └── mappers/
        └── user.mapper.ts                  # ✅ 100%
```

**Código existente**:

```typescript
// domain/entities/user.entity.ts
export interface User {
  id: string;
  email: string;
  roleId: string;
  studyId: string;
  status: boolean;
  createdAt: Date;
  role: Role;
  study: Study;
}

export interface Role {
  id: string;
  name: RoleName; // "Administrador" | "Usuario" | "Lector" | "Externo"
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// domain/entities/permission.entity.ts
export type ActionType = "read" | "write" | "update" | "delete" | "file";
export type FlowCode = "JN" | "RS" | "SU" | "RE";

export interface UserFlowAccess {
  flowId: string;
  flowCode: FlowCode;
  flowName: string;
  permissions: {
    action: ActionType;
    granted: boolean;
  }[];
}
```

### Lo que Backend TIENE (100%)

**Según `INFORME-BACKEND-V3-ESTADO-ACTUAL.md`**:

```typescript
// ✅ Endpoints funcionales
GET    /api/v1/society-profile/society/:societyId/users?role=Externo
POST   /api/v1/society-profile/:societyProfileId/users/:userId
DELETE /api/v1/society-profile/:societyProfileId/users/:userId

// ✅ Roles implementados: 4
// ✅ Flujos con permisos: 9
// ✅ Acciones granulares: 5
// ✅ Sistema de guards automático
```

### ¿Qué tanto sirve lo que tenemos?

| Componente                | Estado  | Utilidad    | Acción                    |
| ------------------------- | ------- | ----------- | ------------------------- |
| User entity               | ✅ 100% | 🟢 PERFECTO | Mantener                  |
| Role entity               | ✅ 100% | 🟢 PERFECTO | Mantener                  |
| Permission entity         | ✅ 100% | 🟢 PERFECTO | Mantener                  |
| GetUsersUseCase           | ✅ 100% | 🟢 PERFECTO | Usar directo              |
| GetUserPermissionsUseCase | ✅ 100% | 🟢 PERFECTO | Usar directo              |
| Mock repository           | ✅ 100% | 🟢 MUY ÚTIL | Usar para desarrollo      |
| HTTP repository           | ⚠️ 50%  | 🟡 ÚTIL     | Completar POST/PUT/DELETE |
| Mapper                    | ✅ 100% | 🟢 PERFECTO | Mantener                  |
| Stores                    | ❌ 0%   | 🔴 FALTA    | Crear                     |
| Controllers               | ❌ 0%   | 🔴 FALTA    | Crear                     |
| Páginas                   | ❌ 0%   | 🔴 FALTA    | Crear                     |

**Conclusión**: Base hexagonal PERFECTA (85%). Backend 100% funcional. Solo falta:

1. Completar HTTP repository (3 métodos)
2. Crear presentación completa

### Plan de Implementación (2-3 días)

#### Día 1: Store + Controller

```typescript
// app/core/presentation/panel-administrativo/stores/useUsersStore.ts
export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadUsers(societyId: string, role?: RoleName) {
      this.loading = true;
      try {
        const useCase = new GetUsersUseCase(userRepository);
        this.users = await useCase.execute(societyId, role);
      } finally {
        this.loading = false;
      }
    },

    async assignUserToSociety(societyProfileId: string, userId: string) {
      const useCase = new AssignUserUseCase(userRepository);
      await useCase.execute(societyProfileId, userId);
      toast.success("Usuario asignado correctamente");
    },
  },
});
```

#### Día 2: UI - Tabla de Usuarios

```vue
<!-- app/pages/panel-administrativo/usuarios/index.vue -->
<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

    <!-- Filtros -->
    <div class="flex gap-4 mb-6">
      <USelectMenu v-model="filterRole" :options="roles" placeholder="Todos los roles" />
      <UInput
        v-model="searchQuery"
        placeholder="Buscar por email..."
        icon="i-heroicons-magnifying-glass"
      />
    </div>

    <!-- Tabla -->
    <UTable
      :rows="filteredUsers"
      :columns="[
        { key: 'email', label: 'Email' },
        { key: 'role.name', label: 'Rol' },
        { key: 'study.name', label: 'Estudio' },
        { key: 'status', label: 'Estado' },
        { key: 'actions', label: 'Acciones' },
      ]"
    >
      <template #role.name-data="{ row }">
        <UBadge :color="getRoleColor(row.role.name)">
          {{ row.role.name }}
        </UBadge>
      </template>

      <template #status-data="{ row }">
        <UBadge :color="row.status ? 'green' : 'red'">
          {{ row.status ? "Activo" : "Inactivo" }}
        </UBadge>
      </template>

      <template #actions-data="{ row }">
        <UButton size="sm" @click="navigateTo(`/panel-administrativo/usuarios/${row.id}`)">
          Ver Permisos
        </UButton>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
  const usersStore = useUsersStore();
  const users = computed(() => usersStore.users);

  const filteredUsers = computed(() => {
    let result = users.value;

    if (filterRole.value) {
      result = result.filter((u) => u.role.name === filterRole.value);
    }

    if (searchQuery.value) {
      result = result.filter((u) =>
        u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    return result;
  });

  onMounted(async () => {
    await usersStore.loadUsers(societyId.value);
  });
</script>
```

#### Día 3: UI - Detalle con Matrix de Permisos

```vue
<!-- app/pages/panel-administrativo/usuarios/[id]/index.vue -->
<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Permisos: {{ user?.email }}</h1>

    <!-- Info del usuario -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-600">Rol:</span>
          <UBadge class="ml-2">{{ user?.role.name }}</UBadge>
        </div>
        <div>
          <span class="text-sm text-gray-600">Estudio:</span>
          <span class="ml-2">{{ user?.study.name }}</span>
        </div>
      </div>
    </div>

    <!-- Matrix de permisos -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Permisos por Flujo</h2>

      <div class="space-y-6">
        <div v-for="flowAccess in permissions" :key="flowAccess.flowId" class="border-b pb-4">
          <h3 class="font-medium mb-3">{{ flowAccess.flowName }}</h3>

          <!-- Tabla de permisos -->
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left p-2">Acción</th>
                <th class="text-center p-2">Permitido</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="perm in flowAccess.permissions" :key="perm.action">
                <td class="p-2">{{ perm.action }}</td>
                <td class="text-center p-2">
                  <UCheckbox
                    :model-value="perm.granted"
                    @update:modelValue="togglePermission(flowAccess.flowId, perm.action)"
                    :disabled="isReadOnly"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6">
        <UButton @click="savePermissions" :loading="saving">Guardar Cambios</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const usersStore = useUsersStore();
  const user = computed(() => usersStore.selectedUser);
  const permissions = computed(() => user.value?.permissions || []);

  const savePermissions = async () => {
    await usersStore.updatePermissions(user.value!.id, permissions.value);
  };

  onMounted(async () => {
    await usersStore.loadUser(route.params.id as string);
  });
</script>
```

---

## 🎨 <a id="sistema-visual"></a>SISTEMA VISUAL: CÓMO FUNCIONA

### Flujo Completo de Navegación (Explicación Técnica)

#### 1. Inicialización del Layout

```vue
<!-- app/layouts/flow-layout-juntas.vue -->
<template>
  <div class="flex h-screen">
    <FlowLayoutJuntasSidebar />
    ← Auto-gestionado (importa composables internamente)

    <div class="flex flex-col flex-1">
      <FlowLayoutJuntasHeader />
      ← Auto-gestionado
      <FlowLayoutJuntasContentWrapper>
        ← Auto-gestionado
        <slot />
        ← Aquí se inyecta la página actual
      </FlowLayoutJuntasContentWrapper>
      <FlowLayoutJuntasFooterWrapper />
      ← Auto-gestionado
    </div>
  </div>
</template>
```

**Principio de diseño**: Cada componente es **auto-suficiente**. No recibe props del layout, importa sus propios composables.

#### 2. Sidebar Izquierdo - Cómo se Actualiza

```typescript
// app/components/flow-layout-juntas/FlowLayoutJuntasSidebar.vue
const { steps } = useJuntasNavbarRoutes(); // ← Reactivo

// useJuntasNavbarRoutes.ts
export const useJuntasNavbarRoutes = () => {
  const juntasFlowStore = useJuntasFlowStore();

  const steps = computed(() => {
    // ⭐ Este computed se re-ejecuta AUTOMÁTICAMENTE cuando:
    // - juntasFlowStore.selectedSubSteps cambia
    // - route.params cambia

    const dynamicSubSteps = juntasFlowStore.getDynamicSubSteps;

    return BASE_STEPS.map((step) => {
      if (step.slug === "puntos-acuerdo") {
        // ⭐ Filtrar sub-steps según lo seleccionado
        return {
          ...step,
          subSteps: BASE_SUB_STEPS.filter((sub) => dynamicSubSteps.includes(sub.id)),
        };
      }
      return step;
    });
  });

  return { steps };
};
```

**Secuencia de eventos**:

```
1. Usuario selecciona puntos en /seleccion-agenda
   └─> Componente: SeleccionPuntosAgenda.vue
       └─> Store: juntasFlowStore.updateDynamicSubSteps(['aporte-dinerarios'])
           └─> Computed: steps (en useJuntasNavbarRoutes) se re-ejecuta
               └─> Componente: SidebarStepsList.vue se re-renderiza
                   └─> UI: Paso 4 muestra "Aporte Dinerario" expandido
```

#### 3. Right Sidebar - Cuándo Aparece

```typescript
// app/components/flow-layout-juntas/FlowLayoutJuntasContentWrapper.vue
const { finalSections, hasRightSidebar } = useJuntasContentSidebar(
  isResumenPage,
  currentSubStepId,
  steps,
  resumenSections,
  sectionsWithCurrent
);

// useJuntasContentSidebar.ts
export const useJuntasContentSidebar = (...) => {
  const hasRightSidebar = computed(() => {
    // ⭐ Mostrar right sidebar si:
    // 1. Estamos en página de resumen, O
    // 2. Hay un sub-step activo (currentSubStepId)
    return isResumenPage.value || !!currentSubStepId.value;
  });

  const finalSections = computed(() => {
    if (isResumenPage.value) {
      return resumenSections.value;  // Secciones especiales de resumen
    }

    if (currentSubStepId.value) {
      return sectionsWithCurrent.value;  // Secciones del sub-step
    }

    return [];
  });

  return { finalSections, hasRightSidebar };
};
```

**Detección de sub-step actual**:

```typescript
// app/composables/useJuntasNavbarRoutes.ts
const currentSubStepId = computed(() => {
  const path = route.path;

  // ⭐ Detectar sub-step desde la URL
  const subStepMatch = path.match(/junta-accionistas\/[^\/]+\/([^\/]+)/);

  if (!subStepMatch) return undefined;

  const segment = subStepMatch[1];

  // Mapear segment a sub-step ID
  const segmentToSubStepId: Record<string, string> = {
    "aporte-dinerario": "aporte-dinerarios",
    "capitalizacion-creditos": "capitalizacion-creditos",
    "nombramiento-gerente": "nombramiento-gerente",
    // ... más mapeos
  };

  return segmentToSubStepId[segment];
});
```

#### 4. Navegación entre Secciones

```typescript
// app/composables/useJuntasNavigation.ts
export function useJuntasNavigation(isResumenPage, currentSubStepId) {
  const route = useRoute();
  const router = useRouter();

  const handleSectionClick = (sectionId: string) => {
    const sections = isResumenPage.value ? resumenSections : normalSections;
    const section = sections.find((s) => s.id === sectionId);

    if (!section) return;

    if (section.navigationType === "route") {
      // ⭐ Navegación a ruta
      const newRoute = buildSectionRoute(sectionId, route.params);
      router.push(newRoute);
    } else if (section.navigationType === "anchor") {
      // ⭐ Scroll a ancla
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });

        // Actualizar URL con hash (opcional)
        router.replace({ hash: `#${sectionId}` });
      }
    }
  };

  return { handleSectionClick };
}
```

#### 5. Botón "Siguiente"

```typescript
// app/composables/useJuntasFlowNext.ts
export function useJuntasFlowNext(handler: () => Promise<void>) {
  const juntasFlowStore = useJuntasFlowStore();
  const router = useRouter();
  const navbarStore = useJuntasNavbarStore();

  const handleNext = async () => {
    juntasFlowStore.isLoading = true;

    try {
      // ⭐ Ejecutar validación/guardado personalizado de la página
      await handler();

      // ⭐ Navegar al siguiente paso
      const currentRoute = router.currentRoute.value.path;
      const nextStep = navbarStore.getNextStepByCurrentStep(currentRoute);

      if (nextStep) {
        await router.push(nextStep.route);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      juntasFlowStore.isLoading = false;
    }
  };

  // ⭐ Registrar handler en el store
  onMounted(() => {
    juntasFlowStore.onClickNext = handleNext;
  });

  onUnmounted(() => {
    juntasFlowStore.clearValues();
  });
}
```

**Uso en página**:

```vue
<!-- app/pages/.../aportantes.vue -->
<script setup lang="ts">
  useJuntasFlowNext(async () => {
    // ⭐ Validación personalizada
    if (aportantes.value.length === 0) {
      throw new Error("Debes agregar al menos un aportante");
    }

    // ⭐ Guardar datos
    await aportantesStore.saveAportantes(societyId.value, flowId.value);

    // ⭐ Si pasa validación, se navega automáticamente al siguiente
  });
</script>
```

### Sistema de Stores: Estado Actual

**Implementados**:

| Store                  | Ubicación                              | Estado  | Usa Hexagonal |
| ---------------------- | -------------------------------------- | ------- | ------------- |
| `useJuntasFlowStore`   | `app/stores/`                          | ✅ 100% | Parcial       |
| `useJuntasNavbarStore` | `app/stores/`                          | ✅ 100% | No (UI puro)  |
| `useAgendaItemsStore`  | `app/core/presentation/juntas/stores/` | ✅ 80%  | ✅ SÍ         |

**Pendientes** (para cada punto de acuerdo):

```
app/core/presentation/juntas/aporte-dinerario/stores/
├── useAportantesStore.ts        # ❌ NO EXISTE
├── useAportesStore.ts           # ❌ NO EXISTE
└── useVotacionStore.ts          # ❌ NO EXISTE (o usar universal)

app/core/presentation/juntas/capitalizacion-creditos/stores/
├── useAcreedoresStore.ts        # ❌ NO EXISTE
├── useCapitalizacionStore.ts    # ❌ NO EXISTE
└── useVotacionStore.ts          # ❌ NO EXISTE (o usar universal)

// ... (13+ puntos más)
```

**Patrón para crear**:

```typescript
// Ejemplo: useAportantesStore.ts
import { defineStore } from "pinia";
import {
  GetAportantesUseCase,
  CreateAportanteUseCase,
} from "@/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/application/use-cases";
import { aporteDinerarioRepository } from "@/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/infrastructure";

export const useAportantesStore = defineStore("aportantes", {
  state: () => ({
    aportantes: [] as Aportante[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadAportantes(societyId: string, flowId: string) {
      this.loading = true;
      this.error = null;

      try {
        const useCase = new GetAportantesUseCase(aporteDinerarioRepository);
        this.aportantes = await useCase.execute(societyId, flowId);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createAportante(societyId: string, flowId: string, dto: CreateAportanteDto) {
      this.loading = true;
      this.error = null;

      try {
        const useCase = new CreateAportanteUseCase(aporteDinerarioRepository);
        const aportante = await useCase.execute(societyId, flowId, dto);
        this.aportantes.push(aportante);
        toast.success("Aportante agregado correctamente");
      } catch (error) {
        this.error = error.message;
        toast.error(error.message);
      } finally {
        this.loading = false;
      }
    },
  },
});
```

**⭐ IMPORTANTE**: Todos los stores siguen este MISMO patrón:

1. Option API (NO Composition)
2. Delegan a Use Cases
3. Solo manejan estado UI (loading, error)
4. Usan repositories (MSW al inicio, luego HTTP)

---

## 🎯 RESUMEN: QUÉ HACER AHORA

### Para Juntas (PRIORIDAD 1)

#### Semana 1: Aporte Dinerario Completo

**Día 1-2: Hexagonal**:

- [ ] Crear `app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/`
- [ ] domain/entities: Aportante, Aporte, VotacionAporte
- [ ] domain/ports: AporteDinerarioRepository
- [ ] application/dtos: AportanteDto, AporteDto
- [ ] application/use-cases: Create, List, Update, Delete (× 2 entidades)
- [ ] infrastructure/repositories: MSW repository
- [ ] infrastructure/mappers: AportanteMapper, AporteMapper
- [ ] infrastructure/mocks: Handlers + State

**Día 3: Presentación**:

- [ ] Stores: useAportantesStore, useAportesStore
- [ ] Controllers: useAportantesController, useAportesController

**Día 4-5: UI**:

- [ ] Componentes: FormularioAportante, TablaAportantes, FormularioAporte, TablaAportes
- [ ] Actualizar páginas (reemplazar BlankContainer)
- [ ] Integrar stores con componentes

#### Semana 2: Replicar Patrón × 3

**Capitalización, Nombramiento Gerente, Estados Financieros**:

- Usar patrón de Aporte Dinerario como template
- Adaptar entidades/DTOs según V2.5
- 2 días por punto = 6 días

#### Semana 3-4: Resto (11 puntos)

**Opción A**: Hacer uno por uno (11 días)  
**Opción B**: Factory pattern (generar estructura + refinar) (5 días)

**Recomendación**: Opción B para ir "a lo cholo a la mrd".

### Para Repositorio (PRIORIDAD 2 - Paralelo)

**5 días total**:

- Día 1: Store almacenamiento + controller
- Día 2: Dashboard
- Día 3: Vista Google Drive
- Día 4: Vista jerárquica
- Día 5: Carpetas personalizadas

### Para Panel Administrativo (PRIORIDAD 3 - Cuando hay tiempo)

**2-3 días total**:

- Medio día: Completar HTTP repository
- 1 día: Store + controller
- 1 día: Tabla de usuarios
- 1 día: Detalle + matrix de permisos

---

## 📊 TABLA FINAL: QUÉ ESTÁ Y QUÉ FALTA

### Juntas

| Componente               | Estado           | Líneas Código | Completitud | Próximo Paso      |
| ------------------------ | ---------------- | ------------- | ----------- | ----------------- |
| Layout dual sidebar      | ✅ Completo      | 500+          | 100%        | Mantener          |
| Sidebar izquierdo        | ✅ Completo      | 800+          | 100%        | Mantener          |
| Right sidebar            | ✅ Completo      | 400+          | 100%        | Mantener          |
| Navegación               | ✅ Completo      | 600+          | 100%        | Mantener          |
| Composables auxiliares   | ✅ Completo      | 1000+         | 100%        | Mantener          |
| Paso 1: Selección        | ✅ Casi completo | 200+          | 90%         | Agregar MSW       |
| Paso 2: Detalles         | ⚠️ Estructura    | 50            | 70%         | Crear componentes |
| Paso 3: Instalación      | ⚠️ Estructura    | 50            | 60%         | Crear componentes |
| Paso 4: Aporte Dinerario | ⚠️ Estructura    | 200           | 40%         | Hexagonal + UI    |
| Paso 4: Otros 13 puntos  | ⚠️ Carpetas      | 50            | 30%         | Replicar patrón   |
| Paso 5: Resumen          | ⚠️ Estructura    | 100           | 50%         | Crear componentes |
| Paso 6: Descargar        | ❌ No iniciado   | 0             | 0%          | Adaptador V2.5    |

**Total actual**: ~4,000 líneas (sistema visual)  
**Total faltante**: ~15,000 líneas estimadas (hexagonal + UI de 14 puntos)

### Repositorio

| Componente               | Estado       | Completitud | Próximo Paso          |
| ------------------------ | ------------ | ----------- | --------------------- |
| Hexagonal (3 submódulos) | ✅ Completo  | 90%         | Mantener              |
| Stores                   | ❌ No existe | 0%          | Crear (3 stores)      |
| Controllers              | ❌ No existe | 0%          | Crear (3 controllers) |
| Componentes UI           | ❌ No existe | 0%          | Adaptar V2.5          |
| Páginas                  | ❌ No existe | 0%          | Crear (4 páginas)     |

**Total actual**: ~2,000 líneas (hexagonal puro)  
**Total faltante**: ~3,000 líneas (presentación)

### Panel Administrativo

| Componente  | Estado           | Completitud | Próximo Paso         |
| ----------- | ---------------- | ----------- | -------------------- |
| Hexagonal   | ✅ Casi completo | 85%         | Completar HTTP repo  |
| Stores      | ❌ No existe     | 0%          | Crear (1 store)      |
| Controllers | ❌ No existe     | 0%          | Crear (1 controller) |
| Páginas     | ❌ No existe     | 0%          | Crear (2 páginas)    |

**Total actual**: ~1,000 líneas (hexagonal)  
**Total faltante**: ~1,500 líneas (presentación)

---

## 🚀 PLAN DE EJECUCIÓN

### Sprint 1 (Esta semana)

**Juntas: Aporte Dinerario**:

- [ ] Hexagonal completo (2 días)
- [ ] Presentación (1 día)
- [ ] UI adaptada de V2.5 (2 días)

**Total**: 5 días → 1 punto de acuerdo 100% funcional

### Sprint 2 (Próxima semana)

**Juntas: 3 puntos más**:

- [ ] Capitalización Créditos (2 días)
- [ ] Nombramiento Gerente (2 días)
- [ ] Estados Financieros (1 día)

**Total**: 5 días → 4 puntos completos

### Sprint 3 (Semana 3)

**Juntas: Resto (11 puntos)**:

- [ ] Factory pattern: generar estructura (1 día)
- [ ] Refinar uno por uno (2-3 días)

**Repositorio**:

- [ ] Presentación completa (5 días en paralelo)

**Total**: 5 días → 14 puntos + repositorio

### Sprint 4 (Semana 4)

**Refinamiento**:

- [ ] Testing de todos los puntos
- [ ] Ajustes visuales
- [ ] Documentación

**Panel Administrativo**:

- [ ] Presentación completa (2-3 días)

---

**Última actualización**: 2 de Diciembre 2025  
**Versión**: 1.0.0  
**Estado**: En Desarrollo Activo 🚀















