# 🎯 DOCUMENTO MAESTRO: COORDINACIÓN V2.5 ↔ V3 ↔ BACKEND

**Audiencia**: IA Frontend V2.5, IA Frontend V3, IA Backend V3  
**Fecha**: 2 de Diciembre 2025  
**Propósito**: Coordinar trabajo entre las 3 versiones para avanzar rápido y sin confusión  
**Autor**: Arquitecto Principal ProBO V3

---

## 📋 TABLA DE CONTENIDOS

1. [El Gran Descubrimiento: Patrón Lógico de Juntas](#patron-logico)
2. [Arquitectura Visual Actual V3](#arquitectura-visual)
3. [Planificación para Juntas](#plan-juntas)
4. [Planificación para Repositorio](#plan-repositorio)
5. [Planificación para Panel Administrativo](#plan-panel)
6. [Reglas de Coordinación](#reglas-coordinacion)

---

## 🎉 <a id="patron-logico"></a>EL GRAN DESCUBRIMIENTO: PATRÓN LÓGICO DE JUNTAS

### 🧠 Revelación Clave

En V2.5, creamos **11 pasos por cada tipo de junta**, creyendo que eran flujos COMPLETAMENTE diferentes:

- Aporte Dinerario: 11 pasos separados
- Capitalización Créditos: 11 pasos separados
- Nombramiento Gerente: 11 pasos separados
- Designación Directores: 11 pasos separados
- Estados Financieros: 11 pasos separados

**⚠️ ERROR CONCEPTUAL**: Estábamos creando **UNA JUNTA POR CADA TIPO**.

### ✅ La Verdad del Negocio

**UNA junta puede tener MÚLTIPLES puntos de acuerdo**:

```
Junta General de Accionistas del 15 de Enero 2025
├─ Punto 1: Aporte Dinerario
├─ Punto 2: Nombramiento de Gerente
├─ Punto 3: Estados Financieros
└─ Punto 4: Designación de Directorio

→ TODO esto es UNA SOLA JUNTA con 4 acuerdos
```

### 🔍 El Patrón Lógico Descubierto

Al analizar V2.5, descubrí que **TODOS los flujos tienen el MISMO patrón**:

```
V2.5 - Aporte Dinerario (11 pasos):
├─ Paso 1: Tipo de Junta          ─┐
├─ Paso 2: Convocatoria             │
├─ Paso 3: Representación (Poderes) │ ← PASOS COMUNES (compartidos)
├─ Paso 4: Asistencia               │   (Se repiten en TODOS los flujos)
├─ Paso 5: Presidente/Secretario   ─┘
├─ Paso 6: Aportantes              ─┐
├─ Paso 7: Aportes                  │ ← PASOS ESPECÍFICOS del punto de acuerdo
├─ Paso 8: Votación                 │   (Solo 2-3 pasos únicos)
├─ Paso 9: Resumen                 ─┘
├─ Paso 10: Preview                ← Resumen (compartido)
└─ Paso 11: Finalizar/Descarga     ← Descarga (compartido)

V2.5 - Capitalización Créditos (11 pasos):
├─ Paso 1-5: MISMOS pasos comunes  ← DUPLICADOS innecesariamente
├─ Paso 6: Acreedores              ─┐
├─ Paso 7: Capitalización           │ ← PASOS ESPECÍFICOS del punto de acuerdo
├─ Paso 8: Votación                ─┘
├─ Paso 9-11: MISMOS finales       ← DUPLICADOS innecesariamente

V2.5 - Nombramiento Gerente (11 pasos):
├─ Paso 1-5: MISMOS pasos comunes  ← DUPLICADOS innecesariamente
├─ Paso 6: Selección Gerente       ─┐
├─ Paso 7: Otorgamiento Poderes     │ ← PASOS ESPECÍFICOS del punto de acuerdo
├─ Paso 8: Votación                ─┘
├─ Paso 9-11: MISMOS finales       ← DUPLICADOS innecesariamente
```

### 🎯 Patrón Universal Identificado

**TODOS los puntos de acuerdo tienen exactamente EL MISMO patrón**:

```
PATRÓN UNIVERSAL DE PUNTO DE ACUERDO:

1. Vista General (index.vue)
   - Descripción del acuerdo
   - Contexto legal
   - Documentación previa

2. Paso Específico 1 (varía por tipo)
   - Aporte Dinerario: "Aportantes"
   - Capitalización: "Acreedores"
   - Nombramiento: "Selección"
   - Estados Financieros: "Estados"

3. Paso Específico 2 (varía por tipo)
   - Aporte Dinerario: "Aportes"
   - Capitalización: "Capitalización"
   - Nombramiento: "Poderes"
   - Estados Financieros: "Distribución"

4. Votación (SIEMPRE igual)
   - Selección de votantes
   - Registro de votos
   - Cálculo de mayorías

5. Resumen (SIEMPRE igual)
   - Preview de datos
   - Validación final
```

### 🚀 Transformación V2.5 → V3

#### V2.5 (Fragmentado)

```
11 pasos × 5 flujos = 55 pasos totales
- Mucha duplicación
- Difícil mantener
- Inconsistencias entre flujos
```

#### V3 (Unificado)

```
6 Pasos Principales:
  1. Selección de Agenda       ← NUEVO: Seleccionar QUÉ puntos tratar
  2. Detalles                  ← Pasos 1-2 de V2.5
  3. Instalación               ← Pasos 3-5 de V2.5
  4. Puntos de Acuerdo         ← Pasos 6-8 de V2.5 (cada punto)
     ├─ Aporte Dinerario
     │  ├─ index.vue           ← Vista general
     │  ├─ aportantes.vue      ← Paso 1 específico
     │  ├─ aportes.vue         ← Paso 2 específico
     │  ├─ votacion.vue        ← Paso 3 (universal)
     │  └─ resumen.vue         ← Paso 4 (universal)
     │
     ├─ Capitalización Créditos
     │  ├─ index.vue
     │  ├─ acreedores.vue      ← Paso 1 específico
     │  ├─ capitalizacion.vue  ← Paso 2 específico
     │  ├─ votacion.vue        ← Paso 3 (universal)
     │  └─ resumen.vue         ← Paso 4 (universal)
     │
     └─ ... (13+ puntos más)

  5. Resumen General          ← Paso 9-10 de V2.5 (consolidado)
  6. Descargar                ← Paso 11 de V2.5
```

**Reducción**: De 55 pasos duplicados → 6 pasos + ~13 puntos × 4-5 secciones = ~60 páginas únicas

---

## 🎨 <a id="arquitectura-visual"></a>ARQUITECTURA VISUAL ACTUAL V3

### Sistema de Sidebars Dual

V3 implementa un **sistema de doble sidebar**:

```
┌─────────────────────────────────────────────────────────────────┐
│                      HEADER (breadcrumbs, acciones)              │
├────────────┬──────────────────────────────┬──────────────────────┤
│  SIDEBAR   │                              │   RIGHT SIDEBAR      │
│   LEFT     │       CONTENIDO              │   (Condicional)      │
│            │                              │                      │
│ 1. Selec.  │  ┌─────────────────────┐    │  ┌────────────────┐  │
│    Agenda  │  │                     │    │  │ - Aportantes   │  │
│ ✓ 2. Det.  │  │   Formularios       │    │  │ - Aportes      │  │
│ ✓ 3. Inst. │  │   Tablas            │    │  │ - Votación     │  │
│ → 4. Puntos│  │   Componentes       │    │  │ - Resumen      │  │
│    Acuerdo │  │                     │    │  └────────────────┘  │
│   ▼ Aument │  └─────────────────────┘    │                      │
│     Capital│                              │  ← Aparece SOLO      │
│     • Aport│                              │    cuando estás en   │
│       Diner│                              │    un sub-step       │
│     • Capit│                              │    (Paso 4)          │
│   ▼ Nombra │                              │                      │
│     • Geren│                              │                      │
│   5. Resumen                              │                      │
│   6. Descar│                              │                      │
├────────────┴──────────────────────────────┴──────────────────────┤
│              FOOTER (botón "Siguiente")                          │
└─────────────────────────────────────────────────────────────────┘
```

### Comportamiento del Right Sidebar

**Cuando NO aparece** (Pasos 1, 2, 3, 5, 6):

- Solo sidebar izquierdo
- Contenido full-width
- Navegación simple

**Cuando SÍ aparece** (Paso 4 - Puntos de Acuerdo):

- Sidebar izquierdo + Right sidebar
- Contenido center
- Navegación jerárquica

**Ejemplo navegando**:

```
Usuario está en: /seleccion-agenda
→ Right sidebar: NO visible ❌

Usuario hace click en "Aporte Dinerario" del sidebar izquierdo
→ Navega a: /aporte-dinerario
→ Right sidebar: ✅ VISIBLE con secciones:
  - Aporte Dinerario (vista general)
  - Aportantes
  - Aportes
  - Votación
  - Resumen

Usuario hace click en "Aportantes" del right sidebar
→ Navega a: /aporte-dinerario/aportantes
→ Right sidebar: ✅ SIGUE VISIBLE (mismas secciones, "Aportantes" highlighted)
```

### Configuración de Secciones

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

  "capitalizacion-creditos": [
    { id: "capitalizacion-creditos", title: "Capitalización", navigationType: "route" },
    { id: "seleccion-acreedores", title: "Selección de Acreedores", navigationType: "route" },
    { id: "capitalizacion", title: "Capitalización", navigationType: "route" },
    { id: "votacion", title: "Votación", navigationType: "route" },
    { id: "resumen", title: "Resumen", navigationType: "route" },
  ],

  "nombramiento-gerente": [
    { id: "nombramiento-gerente", title: "Nombramiento de Gerente", navigationType: "route" },
    { id: "seleccion-gerente", title: "Selección de Gerente", navigationType: "route" },
    { id: "poderes-asignados", title: "Poderes Asignados", navigationType: "route" },
    { id: "votacion", title: "Votación", navigationType: "route" },
    { id: "resumen", title: "Resumen", navigationType: "route" },
  ],

  // ... (13+ puntos más con el MISMO patrón)
};
```

### ⭐ La Clave: Votación se Repite

**IMPORTANTE**: El paso "Votación" ES EL MISMO para TODOS los puntos de acuerdo.

```typescript
// ✅ Componente universal de Votación (reutilizable)
// app/components/juntas/VotacionUniversal.vue

interface VotacionProps {
  puntoAcuerdoId: string; // ← Lo único que cambia
  puntoAcuerdoNombre: string;
  accionistas: Accionista[];
  snapshot: SnapshotCompleteDTO;
}

// Lógica universal:
// 1. Mostrar accionistas del snapshot
// 2. Seleccionar votantes (pueden ser diferentes a los asistentes)
// 3. Registrar votos: A FAVOR | EN CONTRA | ABSTENCION
// 4. Calcular mayorías según quorum
// 5. Determinar si se aprobó
```

**Implicación**:

- ✅ Un solo componente `VotacionUniversal.vue`
- ✅ Un solo store `useVotacionStore` con método universal
- ✅ Un solo use case `SaveVotacionUseCase` que recibe `puntoAcuerdoId`
- ✅ Backend guarda votaciones en tabla única con referencia al punto

---

## 🏗️ <a id="arquitectura-visual"></a>ARQUITECTURA VISUAL ACTUAL V3

### Estado Real del Código (Diciembre 2025)

#### Estructura de Archivos

```
app/
├── layouts/
│   └── flow-layout-juntas.vue              # ✅ Layout maestro con doble sidebar
│
├── components/flow-layout-juntas/
│   ├── FlowLayoutJuntasSidebar.vue         # ✅ Sidebar izquierdo
│   ├── FlowLayoutJuntasHeader.vue          # ✅ Header
│   ├── FlowLayoutJuntasContentWrapper.vue  # ✅ Content + Right Sidebar
│   ├── FlowLayoutJuntasContent.vue         # ✅ Contenido principal
│   ├── WizardRightSidebar.vue              # ✅ Right sidebar
│   ├── FlowLayoutJuntasFooterWrapper.vue   # ✅ Footer (botón Siguiente)
│   ├── SidebarStepItem.vue                 # ✅ Item del sidebar izq
│   ├── RightSidebarSectionItem.vue         # ✅ Item del sidebar der
│   └── ... (15+ componentes auxiliares)
│
├── pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/
│   ├── seleccion-agenda/
│   │   └── index.vue                       # ✅ Paso 1: Selección de puntos
│   ├── detalles/
│   │   └── index.vue                       # ✅ Paso 2: Detalles de junta
│   ├── instalacion/
│   │   └── index.vue                       # ✅ Paso 3: Instalación
│   │
│   ├── puntos-acuerdo.vue                  # ✅ Paso 4: Vista general
│   │
│   ├── aporte-dinerario/                   # ✅ Paso 4.1: Aporte Dinerario
│   │   ├── index.vue                       # ← Vista general
│   │   ├── aportantes.vue                  # ← Sección 1
│   │   ├── aportes.vue                     # ← Sección 2
│   │   ├── votacion.vue                    # ← Sección 3
│   │   └── resumen.vue                     # ← Sección 4
│   │
│   ├── capitalizacion-creditos/            # ⚠️ Paso 4.2: Estructura creada
│   ├── nombramiento-gerente/               # ⚠️ Paso 4.3: Estructura creada
│   ├── nombramiento-apoderados/            # ⚠️ Paso 4.4: Estructura creada
│   ├── nombramiento-directores/            # ⚠️ Paso 4.5: Estructura creada
│   ├── nombramiento-directorio/            # ⚠️ Paso 4.6: Estructura creada
│   ├── remocion-gerente/                   # ⚠️ Paso 4.7: Estructura creada
│   ├── remocion-apoderados/                # ⚠️ Paso 4.8: Estructura creada
│   ├── remocion-directores/                # ⚠️ Paso 4.9: Estructura creada
│   ├── pronunciamiento-gestion/            # ⚠️ Paso 4.10: Estructura creada
│   ├── aplicacion-resultados/              # ⚠️ Paso 4.11: Estructura creada
│   ├── nombramiento-auditores/             # ⚠️ Paso 4.12: Estructura creada
│   ├── reparto-dividendos/                 # ⚠️ Paso 4.13: Estructura creada
│   └── estados-financieros/                # ⚠️ Paso 4.14: Estructura creada
│
│   ├── resumen/
│   │   └── index.vue                       # ✅ Paso 5: Resumen general
│   └── descargar.vue                       # ✅ Paso 6: Descarga documentos
│
├── config/
│   ├── flows/
│   │   └── junta-accionistas.flow.ts       # ✅ FlowConfig completo
│   ├── routes/
│   │   └── junta-accionistas.routes.ts     # ✅ 87 rutas enumeradas
│   └── juntas/
│       └── sections.config.ts              # ✅ Configuración de secciones
│
├── composables/
│   ├── useJuntasFlowNext.ts                # ✅ Handler botón "Siguiente"
│   ├── useJuntasNavbarRoutes.ts            # ✅ Datos para sidebar izq
│   ├── useJuntasSections.ts                # ✅ Secciones sidebar der
│   ├── useJuntasResumenSections.ts         # ✅ Secciones resumen
│   ├── useJuntasNavigation.ts              # ✅ Navegación entre secciones
│   └── ... (10+ composables auxiliares)
│
└── stores/
    ├── useJuntasFlowStore.ts               # ✅ Estado del flujo
    └── useJuntasNavbarStore.ts             # ✅ Estado del navbar
```

#### Estado de Implementación

| Componente               | Estado  | Completitud   | Notas                        |
| ------------------------ | ------- | ------------- | ---------------------------- |
| Layout dual sidebar      | ✅ 100% | Completo      | Funciona perfectamente       |
| Sidebar izquierdo        | ✅ 100% | Completo      | Con expansión/colapso        |
| Right sidebar            | ✅ 100% | Completo      | Aparece cuando debe          |
| Paso 1: Selección Agenda | ✅ 90%  | Casi completo | Falta persistencia MSW       |
| Paso 2: Detalles         | ⚠️ 70%  | Parcial       | Estructura lista, falta data |
| Paso 3: Instalación      | ⚠️ 60%  | Parcial       | Estructura lista, falta data |
| Paso 4: Aporte Dinerario | ⚠️ 40%  | Estructura    | Solo vistas vacías           |
| Paso 4: Otros 13 puntos  | ⚠️ 30%  | Estructura    | Solo carpetas creadas        |
| Paso 5: Resumen          | ⚠️ 50%  | Parcial       | Vista lista, falta data      |
| Paso 6: Descargar        | ❌ 0%   | No iniciado   | Usar V2.5 legacy             |

---

## 🚀 <a id="plan-juntas"></a>PLANIFICACIÓN PARA JUNTAS

### Objetivo

**Construir todos los puntos de acuerdo "a lo cholo a la mrd"** con MSW para adelantarnos al backend.

### Estrategia: DDD Hexagonal + MSW desde Día 1

#### Fase 1: Infraestructura Base (AHORA - 1 semana)

**Para CADA punto de acuerdo**, crear estructura hexagonal completa:

```
app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/
├── domain/
│   ├── entities/
│   │   ├── aportante.entity.ts              # ← Accionista que aporta
│   │   ├── aporte.entity.ts                 # ← Aporte monetario individual
│   │   └── resumen-aporte.entity.ts         # ← Resumen consolidado
│   └── ports/
│       └── aporte-dinerario.repository.ts   # ← Contrato
│
├── application/
│   ├── dtos/
│   │   ├── aportante.dto.ts                 # ← Request/Response
│   │   ├── aporte.dto.ts
│   │   └── resumen-aporte.dto.ts
│   └── use-cases/
│       ├── create-aportante.use-case.ts     # ← Crear aportante
│       ├── list-aportantes.use-case.ts      # ← Listar aportantes
│       ├── create-aporte.use-case.ts        # ← Crear aporte
│       ├── list-aportes.use-case.ts         # ← Listar aportes
│       └── get-resumen.use-case.ts          # ← Obtener resumen
│
└── infrastructure/
    ├── mappers/
    │   ├── aportante.mapper.ts              # ← DTO ↔ Entidad
    │   ├── aporte.mapper.ts
    │   └── resumen-aporte.mapper.ts
    ├── repositories/
    │   ├── aporte-dinerario.http.repository.ts  # ← Para cuando backend esté listo
    │   └── aporte-dinerario.msw.repository.ts   # ← ⭐ USAR AHORA
    └── mocks/
        ├── handlers/
        │   └── aporte-dinerario.handlers.ts # ← MSW handlers
        └── data/
            └── aporte-dinerario.state.ts    # ← Estado mock compartido
```

#### Fase 2: Presentación + Stores (1-2 semanas)

```
app/core/presentation/juntas/aporte-dinerario/
├── stores/
│   ├── useAportantesStore.ts               # ✅ Option API
│   ├── useAportesStore.ts                  # ✅ Option API
│   └── useResumenAporteStore.ts            # ✅ Option API
│
└── composables/
    ├── useAportantesController.ts          # ← Orquesta UI
    ├── useAportesController.ts
    └── useResumenAporteController.ts
```

**Ejemplo de Store**:

```typescript
// app/core/presentation/juntas/aporte-dinerario/stores/useAportantesStore.ts
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

#### Fase 3: MSW Testing (Paralelo - toda la implementación)

**⭐ CLAVE**: Mientras backend construye, nosotros trabajamos con MSW.

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/infrastructure/repositories/aporte-dinerario.msw.repository.ts

import type { AporteDinerarioRepository } from "../../domain/ports";
import type { Aportante, Aporte } from "../../domain/entities";
import {
  listAportantesMock,
  createAportanteMock,
  listAportesMock,
  createAporteMock,
} from "../mocks/data/aporte-dinerario.state";

export class AporteDinerarioMswRepository implements AporteDinerarioRepository {
  async listAportantes(societyId: string, flowId: string): Promise<Aportante[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return listAportantesMock(societyId, flowId);
  }

  async createAportante(
    societyId: string,
    flowId: string,
    aportante: Aportante
  ): Promise<Aportante> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return createAportanteMock(societyId, flowId, aportante);
  }

  async listAportes(societyId: string, flowId: string): Promise<Aporte[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return listAportesMock(societyId, flowId);
  }

  async createAporte(societyId: string, flowId: string, aporte: Aporte): Promise<Aporte> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return createAporteMock(societyId, flowId, aporte);
  }
}
```

```typescript
// app/core/hexag/juntas/puntos-acuerdo/aporte-dinerario/infrastructure/mocks/data/aporte-dinerario.state.ts

import {
  setRecord,
  getRecord,
  getAllRecords,
  generateUUID,
} from "~/core/hexag/registros/shared/mock-database";

// ⭐ Usar sistema mock compartido (el MISMO que Registro de Sociedades)
export async function listAportantesMock(
  societyId: string,
  flowId: string
): Promise<Aportante[]> {
  const key = `junta_${flowId}_aportantes`;
  const aportantes = (await getAllRecords<Aportante>(key)) ?? [];
  return aportantes.filter((a) => a.flowId === flowId);
}

export async function createAportanteMock(
  societyId: string,
  flowId: string,
  aportante: Aportante
): Promise<Aportante> {
  const key = `junta_${flowId}_aportantes`;
  const newAportante = {
    ...aportante,
    id: generateUUID(),
    flowId,
    createdAt: new Date(),
  };

  await setRecord(key, newAportante.id, newAportante);
  return newAportante;
}

// ... más funciones mock
```

### Ventajas de MSW

1. **✅ No depender del backend**: Desarrollar frontend completamente independiente
2. **✅ Testing realista**: Simula delays de red, errores, edge cases
3. **✅ Refactoring fácil**: Cuando backend esté listo, solo cambiar de MSW → HTTP
4. **✅ Datos consistentes**: Compartir state con Registro de Sociedades
5. **✅ Desarrollo rápido**: No esperar endpoints, avanzar "a lo cholo"

---

### Replicar 13+ Puntos de Acuerdo: Estrategia "Factory Pattern"

**No hacer uno por uno manualmente**. Usar patrón de factory:

#### 1. Crear Template Base

```typescript
// scripts/generate-punto-acuerdo.ts (script de generación)

interface PuntoAcuerdoConfig {
  id: string;
  nombre: string;
  categoria: string;
  secciones: {
    id: string;
    nombre: string;
    entidades: string[]; // Entidades específicas
  }[];
}

const PUNTOS_ACUERDO: PuntoAcuerdoConfig[] = [
  {
    id: "aporte-dinerario",
    nombre: "Aporte Dinerario",
    categoria: "Aumento de Capital",
    secciones: [
      { id: "aportantes", nombre: "Aportantes", entidades: ["Aportante"] },
      { id: "aportes", nombre: "Aportes", entidades: ["Aporte"] },
      { id: "votacion", nombre: "Votación", entidades: ["Votacion"] },
      { id: "resumen", nombre: "Resumen", entidades: [] },
    ],
  },
  {
    id: "capitalizacion-creditos",
    nombre: "Capitalización de Créditos",
    categoria: "Aumento de Capital",
    secciones: [
      { id: "acreedores", nombre: "Acreedores", entidades: ["Acreedor"] },
      { id: "capitalizacion", nombre: "Capitalización", entidades: ["Capitalizacion"] },
      { id: "votacion", nombre: "Votación", entidades: ["Votacion"] },
      { id: "resumen", nombre: "Resumen", entidades: [] },
    ],
  },
  // ... configurar los 13+ puntos
];

// El script genera automáticamente:
// - Estructura de carpetas hexagonal
// - Entidades con tipos básicos
// - DTOs bidireccionales
// - Use Cases CRUD
// - Repositories (HTTP + MSW)
// - Mappers
// - Stores (Option API)
// - Controllers
// - Páginas Vue
```

**Beneficio**: Generar 13 puntos en 1-2 horas vs 2-3 semanas manual.

#### 2. Refinar Uno por Uno

Una vez generados todos, refinar cada uno según lógica de negocio específica de V2.5:

```typescript
// Ejemplo: Refinar Aporte Dinerario

// 1. Revisar V2.5: src/components/Views/AportesAumentoCapital/AportanteAumentoCapital.vue
// 2. Extraer lógica de negocio específica
// 3. Agregar al Use Case en V3
// 4. Actualizar validaciones
// 5. Ajustar MSW mock según V2.5
```

---

### Mapeo V2.5 → V3: Pasos de Juntas

| V2.5 (11 pasos por flujo)     | V3 (6 pasos + sub-steps)             | Notas             |
| ----------------------------- | ------------------------------------ | ----------------- |
| Paso 1: Tipo de Junta         | Paso 2: Detalles → Tipo Junta        | Consolidado       |
| Paso 2: Convocatoria          | Paso 2: Detalles → Convocatoria      | Consolidado       |
| Paso 3: Poderes               | Paso 3: Instalación → Poderes        | Consolidado       |
| Paso 4: Asistencia            | Paso 3: Instalación → Asistencia     | Consolidado       |
| Paso 5: Presidente/Secretario | Paso 3: Instalación → Mesa Directiva | Consolidado       |
| Paso 6: [Específico 1]        | Paso 4: [Punto] → [Sección 1]        | Ej: Aportantes    |
| Paso 7: [Específico 2]        | Paso 4: [Punto] → [Sección 2]        | Ej: Aportes       |
| Paso 8: Votación              | Paso 4: [Punto] → Votación           | Universal         |
| Paso 9: Resumen Punto         | Paso 4: [Punto] → Resumen            | Por punto         |
| Paso 10: Preview              | Paso 5: Resumen General              | Todos los puntos  |
| Paso 11: Finalizar/Descarga   | Paso 6: Descargar                    | Una vez por junta |

### Componentes Reutilizables

**⭐ IMPORTANTE**: Algunos componentes se reutilizan en TODOS los puntos:

```
app/components/juntas/
├── universal/
│   ├── VotacionUniversal.vue              # ✅ Votación (todos los puntos)
│   ├── ResumenPuntoUniversal.vue          # ✅ Resumen por punto
│   ├── SeleccionPersonasUniversal.vue     # ✅ Seleccionar personas (genérico)
│   └── TablaVotacionUniversal.vue         # ✅ Tabla de votación
│
├── aporte-dinerario/
│   ├── FormularioAportante.vue            # ← Específico del punto
│   ├── FormularioAporte.vue               # ← Específico del punto
│   └── TablaAportes.vue                   # ← Específico del punto
│
└── capitalizacion-creditos/
    ├── FormularioAcreedor.vue
    ├── FormularioCapitalizacion.vue
    └── TablaCapitalizacion.vue
```

### Datos de Referencia de V2.5

**Para cada punto de acuerdo**, referenciar código V2.5:

| Punto de Acuerdo        | Ubicación V2.5                                                                | Componentes Clave                                          | Stores V2.5                     |
| ----------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------- |
| Aporte Dinerario        | `src/wizards/shareholders-meeting/capital-increase/monetary-contribution/`    | `AportanteAumentoCapital.vue`, `AportesAumentoCapital.vue` | `useAportesAumentoCapitalStore` |
| Capitalización Créditos | `src/wizards/shareholders-meeting/capital-increase/credit-application/`       | `AcreedoresCapitalizacion.vue`, `Capitalizacion.vue`       | `useCapitalizacionStore`        |
| Nombramiento Gerente    | `src/modules/sociedades/juntas/designacion-remocion/gerente-apoderados/`      | `DesignacionGerente.vue`, `OtorgamientoPoderes.vue`        | `useStoreDRGerenteApoderado`    |
| Designación Directores  | `src/wizards/shareholders-meeting/appointments/director-designation-removal/` | `DesignacionDirectores.vue`                                | `useDesigRemoDirectorStore`     |
| Estados Financieros     | `src/wizards/shareholders-meeting/financials/financial-statements/`           | `EstadosFinancieros.vue`, `RepartoDividendos.vue`          | `useEstadosFinancierosStore`    |

### Backend Estado: Qué Esperar

**Según `INFORME-BACKEND-V3-ESTADO-ACTUAL.md`**:

#### ✅ Lo que Backend YA TIENE (usar ahora)

```typescript
// Crear junta con snapshot automático
POST /api/v2/society-profile/:societyId/register-assembly
→ { flowStructureId: 1 }

// Obtener snapshot completo (⭐ TODO en una respuesta)
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
→ {
    shareholderId: "uuid",
    nominalValueId: "uuid",
    shareAllocationId: "uuid",
    meetingConfigId: "uuid",     // ← ⭐ CLAVE para siguientes pasos
    nominalValue: 100000,
    shareClasses: [...],         // ← Todas las acciones
    shareholders: [...],         // ← Todos los accionistas
    shareAllocations: [...],     // ← Todas las asignaciones
    directors: [...],            // ← Todos los directores
    attorneys: [...],            // ← Todos los apoderados
    quorums: {...},             // ← Configuración de quorum
    flowInfo: {...}
  }

// Detalles de junta
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details

// Asistencia (registros auto-creados)
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance

// Agenda items (selección de puntos)
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

#### ❌ Lo que Backend NO TIENE (usar MSW)

```typescript
// Aporte Dinerario - 0% implementado
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/contributors
GET  /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/contributors
PUT  /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/contributors/:id

POST /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/contributions
GET  /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/contributions
PUT  /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/contributions/:id

POST /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/vote
GET  /api/v2/society-profile/:societyId/register-assembly/:flowId/monetary-contributions/vote

// Capitalización Créditos - 0% implementado
// Nombramientos - 0% implementado
// Remociones - 0% implementado
// Estados Financieros - 0% implementado
```

### Estrategia de Sincronización con Backend

**Cuando backend complete endpoints**:

```typescript
// ANTES (MSW)
import { aporteDinerarioMswRepository } from "@/core/hexag/.../infrastructure";
const repository = aporteDinerarioMswRepository;

// DESPUÉS (HTTP) - Solo cambiar 1 línea
import { aporteDinerarioHttpRepository } from "@/core/hexag/.../infrastructure";
const repository = aporteDinerarioHttpRepository;

// ✅ Use Cases, Stores, Controllers NO cambian
// ✅ Solo cambiar qué repositorio inyectas
```

**Si backend cambia estructura de DTOs**:

```typescript
// Solo actualizar Mapper
export class AportanteMapper {
  static dtoToEntity(dto: AportanteDto): Aportante {
    // ✅ Ajustar mapeo según nuevo DTO del backend
    return {
      id: dto.id,
      // Nuevos campos...
    };
  }
}

// ✅ Domain (entidades) NO cambia
// ✅ Use Cases NO cambian
// ✅ Stores NO cambian
// ✅ Controllers NO cambian
// ✅ Componentes Vue NO cambian
```

**Si backend cambia lógica visual**:

⚠️ **ADVERTENCIA**: Si backend cambia algo visual (ej: agregar campo nuevo en formulario), entonces sí hay que tocar componentes Vue. **Pero esto es inevitable** en cualquier arquitectura.

---

## 📁 <a id="plan-repositorio"></a>PLANIFICACIÓN PARA REPOSITORIO

### Estado Actual V3

#### Lo que TENEMOS (90% hexagonal)

```
app/core/hexag/repositorio/
├── almacenamiento/          # ✅ 95% - Arquitectura completa
│   ├── domain/              # ✅ DocumentoSocietario, CarpetaSistema
│   ├── application/         # ✅ 5 use cases
│   └── infrastructure/      # ✅ HTTP + Mock repositories
│
├── documentos-generados/    # ✅ 90% - Arquitectura completa
│   ├── domain/              # ✅ DocumentoGenerado, CategoriaDocumentos
│   ├── application/         # ✅ 2 use cases
│   └── infrastructure/      # ✅ HTTP + Mock repositories
│
└── carpetas-personalizadas/ # ✅ 85% - Arquitectura completa
    ├── domain/              # ✅ CarpetaPersonalizada, EnlaceDocumento
    ├── application/         # ✅ 4 use cases
    └── infrastructure/      # ✅ HTTP + Mock repositories
```

#### Lo que FALTA (Presentación)

```
app/core/presentation/repositorio/
├── almacenamiento/
│   ├── stores/
│   │   └── useAlmacenamientoStore.ts       # ❌ NO EXISTE
│   ├── composables/
│   │   └── useAlmacenamientoController.ts  # ❌ NO EXISTE
│   └── components/
│       └── ... (componentes UI)            # ❌ NO EXISTEN
│
├── documentos-generados/
│   └── ... (similar)                       # ❌ NO EXISTE
│
└── carpetas-personalizadas/
    └── ... (similar)                       # ❌ NO EXISTE
```

### Lo que V2.5 TIENE (UI completa)

**Según `docs/repositorio/`**:

```
V2.5 tiene UI React/Vue completa:
✅ RepositoryLayout.tsx/vue           # Layout con sidebar
✅ RepositoryDashboard.tsx/vue        # Dashboard con métricas + gráficos
✅ DocumentosSocietariosView.tsx/vue  # Vista Google Drive
✅ DocumentosGeneradosView.tsx/vue    # Vista jerárquica
✅ CarpetasPersonalizadasView.tsx/vue # Vista colaborativa
✅ AdvancedSearchBar.tsx/vue          # Buscador avanzado
✅ ChatAI.tsx/vue                     # Chat con IA (SSE)
```

### Plan de Acción: Repositorio

#### Fase 1: Presentación Básica (1 semana)

**Crear Stores + Controllers + Páginas básicas**:

```typescript
// 1. Stores
app/core/presentation/repositorio/almacenamiento/stores/useAlmacenamientoStore.ts
app/core/presentation/repositorio/documentos-generados/stores/useDocumentosGeneradosStore.ts
app/core/presentation/repositorio/carpetas-personalizadas/stores/useCarpetasPersonalizadasStore.ts

// 2. Controllers
app/core/presentation/repositorio/almacenamiento/composables/useAlmacenamientoController.ts
// ... (similar)

// 3. Páginas
app/pages/repositorio/
├── dashboard.vue                           # Dashboard principal
├── societarios/
│   └── [nodeId].vue                        # Vista Google Drive
├── generados/
│   └── [nodeId].vue                        # Vista jerárquica
└── personalizadas/
    └── [carpetaId].vue                     # Detalle de carpeta
```

**Ejemplo de Store**:

```typescript
// app/core/presentation/repositorio/almacenamiento/stores/useAlmacenamientoStore.ts
import { defineStore } from "pinia";
import {
  ListDocumentosUseCase,
  UploadDocumentoUseCase,
} from "@/core/hexag/repositorio/almacenamiento/application/use-cases";
import { almacenamientoRepository } from "@/core/hexag/repositorio/almacenamiento/infrastructure";

export const useAlmacenamientoStore = defineStore("almacenamiento", {
  state: () => ({
    documentos: [] as DocumentoSocietario[],
    currentFolder: null as CarpetaSistema | null,
    breadcrumbs: [] as Breadcrumb[],
    loading: false,
  }),

  actions: {
    async loadDocumentos(societyId: string, parentId: string | null) {
      this.loading = true;
      try {
        const useCase = new ListDocumentosUseCase(almacenamientoRepository);
        this.documentos = await useCase.execute(societyId, parentId);
      } finally {
        this.loading = false;
      }
    },

    async uploadDocumento(societyId: string, parentId: string | null, file: File) {
      const useCase = new UploadDocumentoUseCase(almacenamientoRepository);
      const documento = await useCase.execute(societyId, parentId, file);
      this.documentos.push(documento);
      toast.success("Documento subido correctamente");
    },
  },
});
```

#### Fase 2: UI de V2.5 Adaptada (2 semanas)

**Migrar componentes React/Vue de V2.5 → Vue V3**:

1. **Dashboard**: Copiar diseño de V2.5

   - Selector de sociedad
   - 3 cards de navegación
   - 4 mini cards de métricas
   - 3 gráficos (usando Chart.js o Recharts)

2. **Vista Google Drive**: Adaptar de V2.5

   - Grid/List toggle
   - Breadcrumbs
   - Acciones (subir, crear, eliminar, descargar)
   - Preview modal

3. **Vista Jerárquica**: Adaptar de V2.5

   - Expansión/colapso de carpetas
   - Navegación de 3 niveles
   - Download por carpeta

4. **Carpetas Personalizadas**: Adaptar de V2.5
   - Lista de carpetas con métricas
   - Detalle con tabs (Documentos, Chat IA, Permisos)

#### ¿Qué tanto sirve lo que tenemos?

| Componente                  | Estado V3 | Utilidad    | Acción           |
| --------------------------- | --------- | ----------- | ---------------- |
| Arquitectura hexagonal      | ✅ 90%    | 🟢 MUY ÚTIL | Mantener         |
| Domain entities             | ✅ 100%   | 🟢 PERFECTO | No tocar         |
| Application use cases       | ✅ 95%    | 🟢 PERFECTO | No tocar         |
| Infrastructure repositories | ✅ 100%   | 🟢 PERFECTO | No tocar         |
| Mappers                     | ✅ 100%   | 🟢 PERFECTO | No tocar         |
| Stores                      | ❌ 0%     | 🔴 FALTA    | Crear con patrón |
| Controllers                 | ❌ 0%     | 🔴 FALTA    | Crear con patrón |
| Páginas Vue                 | ❌ 0%     | 🔴 FALTA    | Adaptar de V2.5  |
| Componentes UI              | ❌ 0%     | 🔴 FALTA    | Adaptar de V2.5  |

**Conclusión**: La base hexagonal está PERFECTA (90%). Solo falta presentación (10%).

### ¿Se ve igual a V2.5?

**Visual**: ❌ NO - V3 no tiene UI todavía  
**Funcional**: ✅ SÍ - Los use cases hacen lo mismo  
**Arquitectura**: ✅ MEJOR - V3 es hexagonal, V2.5 no

**Plan**: Copiar diseño visual de V2.5, conectar con arquitectura hexagonal de V3.

---

## 👥 <a id="plan-panel"></a>PLANIFICACIÓN PARA PANEL ADMINISTRATIVO

### Estado Actual V3

#### Lo que TENEMOS (85% hexagonal)

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts            # ✅ 100%
│   │   ├── role.entity.ts            # ✅ 100%
│   │   ├── permission.entity.ts      # ✅ 100%
│   │   └── study.entity.ts           # ✅ 100%
│   └── ports/
│       └── user.repository.ts        # ✅ 100%
│
├── application/
│   ├── dtos/
│   │   ├── user.dto.ts               # ✅ 100%
│   │   └── permission.dto.ts         # ✅ 100%
│   └── use-cases/
│       ├── get-users.use-case.ts            # ✅ 100%
│       ├── get-user-permissions.use-case.ts # ✅ 100%
│       └── update-user-permissions.use-case.ts # ✅ 100%
│
└── infrastructure/
    ├── repositories/
    │   ├── user-http.repository.ts   # ⚠️ 50% (solo GET)
    │   └── user-mock.repository.ts   # ✅ 100%
    └── mappers/
        └── user.mapper.ts            # ✅ 100%
```

### Lo que Backend TIENE (100% funcional)

**Según `INFORME-BACKEND-V3-ESTADO-ACTUAL.md`**:

```typescript
// ✅ Sistema completo de roles y permisos
GET    /api/v1/society-profile/society/:societyId/users?role=Externo
POST   /api/v1/society-profile/:societyProfileId/users/:userId     // Asignar usuario
DELETE /api/v1/society-profile/:societyProfileId/users/:userId     // Desasignar usuario

// ✅ 4 roles disponibles:
- Administrador (todas las acciones)
- Usuario (read, write, file)
- Lector (solo read)
- Externo (solo read)

// ✅ 9 flujos con permisos:
- SOCIETY_PROFILE, AUMENTO_DINERARIO, CAPITALIZACION_CREDITOS,
  DESIGNAR_DIRECTORES, DESIGNAR_GERENTE, ESTADOS_FINANCIEROS,
  SUNAT, ARCHIVES, SHARED_FLOW

// ✅ 5 acciones granulares por módulo:
- read, write, update, delete, file
```

### Lo que V2.5 TIENE

**❌ NADA** - V2.5 NO implementó panel administrativo.

### Plan de Acción: Panel Administrativo

#### Fase 1: UI Básica (3-5 días)

**Crear presentación simple**:

```
app/pages/panel-administrativo/
├── usuarios/
│   ├── index.vue             # Tabla de usuarios
│   └── [id]/
│       └── index.vue         # Detalle de usuario

app/core/presentation/panel-administrativo/
├── stores/
│   └── useUsersStore.ts      # Store con Option API
└── composables/
    └── useUsersController.ts # Controller
```

**Tabla de usuarios**:

```vue
<!-- app/pages/panel-administrativo/usuarios/index.vue -->
<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestión de Usuarios</h1>
      <USelectMenu v-model="selectedRole" :options="roles" placeholder="Filtrar por rol" />
    </div>

    <UTable :rows="filteredUsers" :columns="columns" @select="navigateToUser">
      <template #role-data="{ row }">
        <UBadge :color="getRoleColor(row.role.name)">
          {{ row.role.name }}
        </UBadge>
      </template>

      <template #status-data="{ row }">
        <UToggle v-model="row.status" @update:modelValue="toggleUserStatus(row.id)" />
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
  const usersStore = useUsersStore();
  const filteredUsers = computed(() => {
    if (!selectedRole.value) return usersStore.users;
    return usersStore.users.filter((u) => u.role.name === selectedRole.value);
  });

  onMounted(async () => {
    await usersStore.loadUsers();
  });
</script>
```

**Detalle con matrix de permisos**:

```vue
<!-- app/pages/panel-administrativo/usuarios/[id]/index.vue -->
<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Permisos de {{ user?.email }}</h1>

    <!-- Matrix de permisos -->
    <div class="grid gap-6">
      <div v-for="flow in flows" :key="flow.code" class="border rounded-lg p-4">
        <h3 class="font-semibold mb-4">{{ flow.name }}</h3>

        <div class="grid grid-cols-5 gap-2">
          <div v-for="action in actions" :key="action" class="flex items-center gap-2">
            <UCheckbox
              :model-value="hasPermission(flow.code, action)"
              @update:modelValue="togglePermission(flow.code, action)"
            />
            <span class="text-sm">{{ action }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <UButton @click="savePermissions">Guardar Cambios</UButton>
    </div>
  </div>
</template>
```

#### ¿Qué tanto sirve lo que tenemos?

| Componente            | Estado V3 | Utilidad    | Acción                            |
| --------------------- | --------- | ----------- | --------------------------------- |
| Domain entities       | ✅ 100%   | 🟢 PERFECTO | Mantener                          |
| Application use cases | ✅ 100%   | 🟢 PERFECTO | Mantener                          |
| Mock repository       | ✅ 100%   | 🟢 MUY ÚTIL | Usar para desarrollo              |
| HTTP repository       | ⚠️ 50%    | 🟡 ÚTIL     | Completar métodos POST/PUT/DELETE |
| Mappers               | ✅ 100%   | 🟢 PERFECTO | Mantener                          |
| Stores                | ❌ 0%     | 🔴 FALTA    | Crear con patrón                  |
| Controllers           | ❌ 0%     | 🔴 FALTA    | Crear con patrón                  |
| Páginas Vue           | ❌ 0%     | 🔴 FALTA    | Crear desde cero (NO hay en V2.5) |

**Conclusión**: La base hexagonal está PERFECTA (85%). Backend está 100% funcional. Solo falta:

1. Completar HTTP repository (2-3 endpoints)
2. Crear presentación (stores, controllers, páginas)

### ¿Cómo trabajaremos?

**Estrategia**:

1. **Usar Mock repository** para desarrollo (ya funciona perfecto)
2. **Crear UI simple** (tabla + detalle + matrix de permisos)
3. **Completar HTTP repository** cuando sea necesario (2-3 horas)
4. **NO complicar** con features avanzadas (auditoría, roles personalizados)

**Prioridad**: 🟢 BAJA (backend tiene 100%, no es urgente)

---

## 🎯 <a id="reglas-coordinacion"></a>REGLAS DE COORDINACIÓN ENTRE IAs

### Para IA Frontend V2.5

#### Cuando te pregunten sobre Juntas

**SIEMPRE responde con este patrón**:

```markdown
## Migración de [Punto de Acuerdo] a V3

### 1. Analizar V2.5

**Ubicación**: `src/wizards/shareholders-meeting/.../[punto]/`

**Pasos actuales** (11 total):

- Pasos 1-5: Comunes (YA implementados en V3 Paso 2-3)
- Paso 6: [Específico 1]
- Paso 7: [Específico 2]
- Paso 8: Votación (universal)
- Paso 9: Resumen (universal)
- Paso 10-11: Finales (YA implementados en V3 Paso 5-6)

**Extraer**:

- ✅ Lógica de negocio de Pasos 6-7 → Use Cases V3
- ✅ Validaciones → Domain V3
- ✅ Transformaciones → Mappers V3
- ✅ Componentes UI → Adaptar a Vue V3

### 2. Crear Estructura Hexagonal V3
```

app/core/hexag/juntas/puntos-acuerdo/[punto]/
├── domain/entities/
│ ├── [entidad1].entity.ts
│ └── [entidad2].entity.ts
├── domain/ports/
│ └── [punto].repository.ts
├── application/dtos/
│ └── [entidad].dto.ts
├── application/use-cases/
│ ├── create-[entidad].use-case.ts
│ └── list-[entidad].use-case.ts
└── infrastructure/
├── repositories/
│ ├── [punto].http.repository.ts
│ └── [punto].msw.repository.ts # ← ⭐ EMPEZAR AQUÍ
├── mappers/
│ └── [entidad].mapper.ts
└── mocks/
├── handlers/[punto].handlers.ts
└── data/[punto].state.ts

```

### 3. Datos de Referencia de V2.5

**Stores a revisar**:
- `[punto].store.ts` → Entidades V3
- `[punto].service.ts` → Use Cases V3

**Componentes a adaptar**:
- `[Componente].vue` → Componentes V3

**Validaciones a extraer**:
- Validaciones inline → Domain V3
```

#### Cuando te pregunten sobre Repositorio

**SIEMPRE responde**:

```markdown
## Repositorio V2.5 → V3

### Lo que V3 YA TIENE y NO debes duplicar

✅ **Arquitectura hexagonal completa** (90%)

- Domain, Application, Infrastructure listos
- Use Cases funcionales
- Repositories duales (HTTP + Mock)

### Lo que V3 NECESITA de V2.5

❌ **Capa de presentación** (10%)

- Stores (usar patrón hexagonal)
- Controllers
- Componentes UI (copiar diseño de V2.5)
- Páginas

### Estrategia de Migración

1. **Crear Stores** usando Use Cases existentes
2. **Copiar diseño visual** de V2.5 (React/Vue)
3. **Adaptar componentes** a Vue V3 + Nuxt 4
4. **Conectar con arquitectura hexagonal**

### NO hacer

❌ Reescribir use cases (ya están perfectos)
❌ Cambiar arquitectura hexagonal
❌ Mezclar lógica en stores
```

### Para IA Backend V3

#### Cuando desarrolles endpoints de Puntos de Acuerdo

**SIEMPRE seguir este patrón**:

````markdown
## Endpoint: [Punto de Acuerdo] - [Entidad]

### Patrón Universal

Todos los puntos de acuerdo siguen el MISMO patrón:

**Base URL**: `/api/v2/society-profile/:societyId/register-assembly/:flowId/[punto]/`

**Endpoints CRUD**:

```typescript
// Entidad principal (paso específico 1)
POST   /[punto]/[entidad1]
GET    /[punto]/[entidad1]
PUT    /[punto]/[entidad1]/:id
DELETE /[punto]/[entidad1]/:id

// Entidad secundaria (paso específico 2)
POST   /[punto]/[entidad2]
GET    /[punto]/[entidad2]
PUT    /[punto]/[entidad2]/:id
DELETE /[punto]/[entidad2]/:id

// Votación (universal)
POST   /[punto]/vote
GET    /[punto]/vote
PUT    /[punto]/vote

// Resumen (universal)
GET    /[punto]/summary
```
````

### Ejemplo: Aporte Dinerario

```typescript
POST   /monetary-contributions/contributors       // Crear aportante
GET    /monetary-contributions/contributors       // Listar aportantes
PUT    /monetary-contributions/contributors/:id   // Actualizar aportante
DELETE /monetary-contributions/contributors/:id   // Eliminar aportante

POST   /monetary-contributions/contributions      // Crear aporte
GET    /monetary-contributions/contributions      // Listar aportes
PUT    /monetary-contributions/contributions/:id
DELETE /monetary-contributions/contributions/:id

POST   /monetary-contributions/vote               // Guardar votación
GET    /monetary-contributions/vote               // Obtener votación

GET    /monetary-contributions/summary            // Resumen consolidado
```

### Validaciones con Zod

```typescript
// Cada entidad DEBE validar:
const aportanteSchema = z.object({
  id: z.string().uuid(),
  accionistaId: z.string().uuid(), // ← Del snapshot
  montoAporte: z.number().positive(),
  accionesRecibir: z.number().int().positive(),
  claseAccionId: z.string().uuid(), // ← Del snapshot
});

// Reglas de negocio:
// - accionistaId DEBE existir en snapshot
// - montoAporte > 0
// - accionesRecibir > 0
// - claseAccionId DEBE existir en snapshot
```

````

#### Lo que Frontend V3 espera

**IMPORTANTE**: Frontend V3 ya tiene las interfaces definidas (DTOs). **Respeta exactamente esa estructura**:

```typescript
// Frontend V3 espera esto:
export interface CreateAportanteDto {
  accionistaId: string;
  montoAporte: number;
  accionesRecibir: number;
  claseAccionId: string;
}

export interface AportanteResponseDto {
  id: string;
  accionistaId: string;
  accionistaNombre: string;  // ← Desnormalizado para UI
  montoAporte: number;
  accionesRecibir: number;
  claseAccionId: string;
  claseAccionNombre: string; // ← Desnormalizado para UI
}
````

**⚠️ Si cambias la estructura**, notifica al frontend V3 para actualizar DTOs y Mappers.

---

## 📊 RESUMEN EJECUTIVO: QUÉ HACE CADA UNO

### IA Frontend V2.5: Tu Rol

**Eres la fuente de verdad de**:

- ✅ Lógica de negocio probada (5 flujos completos funcionando)
- ✅ Componentes UI (diseño visual, validaciones UX)
- ✅ Sistema de generación de documentos (872 líneas probadas)
- ✅ Templates .docx (10+ templates)
- ✅ Stores legacy (para extraer lógica)

**Tu trabajo**:

1. **Proveer código de referencia** cuando IA V3 pregunte
2. **Explicar lógica de negocio** de cada paso
3. **Identificar validaciones** específicas por flujo
4. **Documentar componentes UI** para que V3 replique

**NO hagas**:

- ❌ Proponer arquitectura (V3 ya tiene hexagonal)
- ❌ Crear código V3 (no conoces Nuxt 4)
- ❌ Modificar backend (no es tu rol)

### IA Frontend V3: Tu Rol

**Eres el responsable de**:

- ✅ Arquitectura hexagonal (Domain → Application → Infrastructure → Presentation)
- ✅ FlowConfig system (5 niveles jerárquicos)
- ✅ Stores con Option API (OBLIGATORIO)
- ✅ Use Cases y Repositories
- ✅ MSW testing

**Tu trabajo**:

1. **Crear arquitectura hexagonal** para cada punto de acuerdo
2. **Implementar MSW repositories** para desarrollo sin backend
3. **Crear stores y controllers** conectados a use cases
4. **Adaptar componentes UI** de V2.5 a Vue V3 + Nuxt 4
5. **Coordinar con backend** sobre estructura de DTOs

**Pedir ayuda a**:

- IA V2.5: Lógica de negocio, validaciones, componentes UI
- IA Backend: Estructura de DTOs, endpoints, validaciones

### IA Backend V3: Tu Rol

**Eres el responsable de**:

- ✅ API V2 (arquitectura hexagonal NestJS)
- ✅ Sistema de snapshot inmutable
- ✅ Validaciones con Zod
- ✅ Persistencia en PostgreSQL
- ✅ Permisos granulares

**Tu trabajo**:

1. **Completar endpoints de puntos de acuerdo** (13+ puntos × 4 endpoints = ~50 endpoints)
2. **Seguir patrón universal** (contributors → contributions → vote → summary)
3. **Validar con Zod** estrictamente
4. **Respetar DTOs** que frontend V3 ya definió
5. **Notificar cambios** si necesitas modificar estructura

**Consultar a**:

- IA V2.5: Lógica de negocio, reglas de validación
- IA V3: Estructura de DTOs esperados

---

## 🎯 PLAN DE EJECUCIÓN COORDINADO

### Semana 1: Aporte Dinerario (Prioridad 1)

| Responsable | Tarea                                  | Tiempo   | Dependencias          |
| ----------- | -------------------------------------- | -------- | --------------------- |
| **IA V3**   | Crear arquitectura hexagonal completa  | 1 día    | IA V2.5 (lógica)      |
| **IA V3**   | Implementar MSW repositories           | 1 día    | -                     |
| **IA V3**   | Crear stores + controllers             | 1 día    | Use cases listos      |
| **IA V3**   | Adaptar componentes UI de V2.5         | 2 días   | IA V2.5 (componentes) |
| **Backend** | Implementar endpoints Aporte Dinerario | 3 días   | IA V3 (DTOs)          |
| **IA V3**   | Integrar HTTP repository               | 0.5 días | Backend listo         |

### Semana 2: Capitalización + Nombramiento Gerente (Prioridad 2)

| Responsable | Tarea                                   | Tiempo | Dependencias     |
| ----------- | --------------------------------------- | ------ | ---------------- |
| **IA V3**   | Replicar patrón de Aporte Dinerario × 2 | 2 días | Patrón validado  |
| **Backend** | Implementar endpoints × 2               | 4 días | Patrón validado  |
| **IA V3**   | Testing + ajustes                       | 1 día  | Endpoints listos |

### Semana 3-4: Resto de Puntos (11 restantes)

**Usar factory pattern** para generar los 11 puntos restantes:

1. **IA V3**: Genera estructura con script → 4 horas
2. **IA V2.5**: Provee lógica de negocio específica → Consulta
3. **Backend**: Implementa endpoints en batch → 1-2 semanas
4. **IA V3**: Refina componentes UI → 1 semana

### Repositorio: Plan Paralelo

| Responsable | Tarea                       | Tiempo |
| ----------- | --------------------------- | ------ |
| **IA V3**   | Crear stores + controllers  | 1 día  |
| **IA V3**   | Adaptar Dashboard de V2.5   | 1 día  |
| **IA V3**   | Adaptar Vista Google Drive  | 1 día  |
| **IA V3**   | Vista jerárquica + Carpetas | 1 día  |
| **IA V3**   | Chat IA (SSE integration)   | 1 día  |

**Total**: 5 días (1 semana) - Puede hacerse en paralelo con Juntas

### Panel Administrativo: Plan Paralelo

| Responsable | Tarea                     | Tiempo  |
| ----------- | ------------------------- | ------- |
| **IA V3**   | Completar HTTP repository | 2 horas |
| **IA V3**   | Crear store + controller  | 3 horas |
| **IA V3**   | Tabla de usuarios         | 4 horas |
| **IA V3**   | Detalle + Matrix permisos | 4 horas |

**Total**: ~2 días - Puede hacerse cuando haya tiempo libre

---

## 🔥 MENSAJES CLAVE PARA CADA IA

### 📢 Para IA V2.5:

> **"V3 está transformando tus 11 pasos por flujo en 6 pasos universales + sub-steps. Los pasos 1-5 (comunes) se consolidaron en 3 pasos. Los pasos 6-8 (específicos) son ahora sub-steps dentro del Paso 4. La lógica de negocio NO cambia, solo la organización. Ayúdanos compartiendo tu código de referencia cuando V3 pregunte sobre lógica específica de cada punto de acuerdo."**

### 📢 Para IA Backend V3:

> **"Frontend V3 está construyendo con MSW para no depender de ti. Cuando completes endpoints, frontend solo cambiará de MSW → HTTP repository (1 línea de código). Sigue el patrón universal para puntos de acuerdo: [entidad1] → [entidad2] → vote → summary. Usa los DTOs que frontend V3 ya definió. Si necesitas cambiar estructura, avisa ANTES de implementar."**

### 📢 Para IA Frontend V3 (tú mismo):

> **"Tienes arquitectura hexagonal perfecta en Registro de Sociedades. Replica EXACTAMENTE el mismo patrón para cada punto de acuerdo. Usa MSW para no depender de backend. Cuando backend esté listo, solo cambias repositorio (1 línea). Pregunta a V2.5 sobre lógica de negocio específica. Pregunta a Backend sobre estructura de DTOs esperados."**

---

## 📋 CHECKLIST DE VALIDACIÓN

### Antes de implementar un Punto de Acuerdo

- [ ] ¿Revisaste el código V2.5 correspondiente?
- [ ] ¿Identificaste las entidades de negocio?
- [ ] ¿Creaste estructura hexagonal completa (4 capas)?
- [ ] ¿Implementaste MSW repository primero?
- [ ] ¿Creaste stores con Option API (NO Composition)?
- [ ] ¿Los use cases están en Application (no en Store)?
- [ ] ¿Los mappers están en Infrastructure (no en Application)?
- [ ] ¿Consultaste DTOs esperados con Backend?
- [ ] ¿Adaptaste componentes UI de V2.5?
- [ ] ¿Agregaste el punto al `sections.config.ts`?

### Antes de integrar con Backend

- [ ] ¿Backend siguió el patrón universal?
- [ ] ¿DTOs del backend coinciden con frontend?
- [ ] ¿Probaste con Mock repository primero?
- [ ] ¿Solo cambiaste instancia de repository (MSW → HTTP)?
- [ ] ¿Use Cases, Stores, Controllers NO cambiaron?
- [ ] ¿Componentes UI NO cambiaron?

---

**Última actualización**: 2 de Diciembre 2025  
**Versión del documento**: 1.0.0  
**Estado**: Documento Maestro de Coordinación

**Este documento es la FUENTE DE VERDAD para coordinación entre las 3 IAs.**

