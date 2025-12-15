# 📋 PLAN DE IMPLEMENTACIÓN: 3 Pasos de Gestión Social

**Fecha:** 2025-01-XX  
**Estado:** 🟡 En Planificación

---

## 🎯 OBJETIVO

Implementar la lógica y conexión al backend para los 3 puntos de agenda de Gestión Social:

1. **Pronunciamiento de la gestión social y resultados económicos**
2. **Aplicación de resultados**
3. **Designación y/o delegación en el directorio de la designación de auditores externos**

Cada paso tiene **2 vistas**:
- **Vista de Datos**: Llenar datos, subir archivos, etc.
- **Vista de Votación**: Reutilizar componentes existentes

---

## ✅ ANÁLISIS DEL ESTADO ACTUAL

### **1. Votación en Aporte Dinerario** ✅

**Estado:** ✅ **100% COMPONETIZADO Y REUTILIZABLE**

#### **Componentes Reutilizables:**
- ✅ `MetodoVotacio.vue` - Selector de método (unanimidad/mayoría)
- ✅ `UnanimidadVotacion.vue` - Vista de votación por unanimidad
- ✅ `MayoriaVotacion.vue` - Vista de votación por mayoría
- ✅ Arquitectura hexagonal completa (Domain, Application, Infrastructure, Presentation)

#### **Arquitectura Existente:**
```
app/core/hexag/juntas/
├── domain/
│   ├── entities/
│   │   ├── vote-entry.entity.ts ✅
│   │   ├── vote-item.entity.ts ✅
│   │   └── vote-session.entity.ts ✅
│   ├── enums/
│   │   ├── vote-context.enum.ts ✅ (falta agregar nuevos contextos)
│   │   ├── vote-mode.enum.ts ✅
│   │   ├── vote-value.enum.ts ✅
│   │   └── vote-agreement-type.enum.ts ✅
│   └── ports/
│       └── vote.repository.port.ts ✅
├── application/
│   ├── dtos/
│   │   └── vote.dto.ts ✅
│   └── use-cases/
│       ├── get-vote-session.use-case.ts ✅
│       ├── create-vote-session.use-case.ts ✅
│       └── update-vote-session.use-case.ts ✅
└── infrastructure/
    ├── mappers/
    │   └── vote.mapper.ts ✅
    └── repositories/
        └── vote.http.repository.ts ✅

app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/
├── stores/
│   ├── useVotacionStore.ts ✅
│   └── useVotacionAportesStore.ts ✅
└── composables/
    └── useVotacionController.ts ✅
```

**✅ CONCLUSIÓN:** Los componentes de votación están **100% reutilizables**. Solo necesitamos:
- Agregar nuevos contextos de votación
- Crear stores/controllers específicos para cada punto de agenda
- Reutilizar los componentes visuales existentes

---

### **2. Estado de las Vistas Existentes**

#### **Paso 1: Pronunciamiento de Gestión Social** 🟡

**Vistas:**
- ✅ `pronunciamiento.vue` - Vista de datos (existe, con componente `CargaResultadosGestionManager`)
- ✅ `votacion.vue` - Vista de votación (existe, pero sin lógica)

**Lógica:**
- ✅ Store: `usePronunciamientoStore.ts` (existe)
- ✅ Controller: `usePronunciamientoController.ts` (existe)
- ✅ Backend: Conectado a `/financial-report-document` ✅

**Falta:**
- ⚠️ Conectar votación con backend (contexto `GESTION_SOCIAL` o similar)
- ⚠️ Agregar contexto de votación al enum

---

#### **Paso 2: Aplicación de Resultados** 🟡

**Vistas:**
- ✅ `aplicacion.vue` - Vista de datos (existe, pero solo tiene `BlankContainer`)
- ✅ `votacion.vue` - Vista de votación (existe, pero sin lógica)

**Lógica:**
- ❌ Store: NO EXISTE
- ❌ Controller: NO EXISTE
- ❌ Backend: NO CONECTADO

**Falta:**
- ❌ Crear store para aplicación de resultados
- ❌ Crear controller para aplicación de resultados
- ❌ Conectar con backend `/application-of-results`
- ❌ Conectar votación con backend (contexto `DIVIDENDOS` según documentación)

---

#### **Paso 3: Designación de Auditores Externos** 🔴

**Vistas:**
- ❌ Vista de datos: NO EXISTE
- ❌ Vista de votación: NO EXISTE

**Lógica:**
- ❌ Store: NO EXISTE
- ❌ Controller: NO EXISTE
- ❌ Backend: NO CONECTADO

**Falta:**
- ❌ Crear todas las vistas
- ❌ Crear store para auditores externos
- ❌ Crear controller para auditores externos
- ❌ Conectar con backend `/external-auditors`
- ⚠️ Según documentación, este paso **NO tiene votación específica**

---

## 📋 PLAN DE IMPLEMENTACIÓN DETALLADO

### **FASE 1: Actualizar Contextos de Votación** 🟢

**Objetivo:** Agregar los nuevos contextos de votación al enum existente.

**Archivo:** `app/core/hexag/juntas/domain/enums/vote-context.enum.ts`

**Cambios:**
```typescript
export enum VoteContext {
  // ... existentes ...
  GESTION_SOCIAL = "GESTION_SOCIAL", // Para pronunciamiento
  DIVIDENDOS = "DIVIDENDOS", // Para aplicación de resultados (ya existe)
  // Auditores externos NO tiene votación según documentación
}
```

**Tiempo estimado:** 5 minutos

---

### **FASE 2: Paso 1 - Pronunciamiento de Gestión Social** 🟡

#### **2.1. Vista de Datos** ✅ (Ya está implementada)

**Estado:** ✅ **COMPLETO**
- ✅ Store: `usePronunciamientoStore.ts`
- ✅ Controller: `usePronunciamientoController.ts`
- ✅ Componente: `CargaResultadosGestionManager.vue`
- ✅ Backend: Conectado a `/financial-report-document`

**No requiere cambios.**

---

#### **2.2. Vista de Votación** ⚠️ (Falta conectar lógica)

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/pronunciamiento-gestion/votacion.vue`

**Cambios necesarios:**

1. **Crear Store de Votación:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/votacion/stores/useVotacionPronunciamientoStore.ts`
   - Reutilizar patrón de `useVotacionStore.ts` de aporte dinerario
   - Contexto: `VoteContext.GESTION_SOCIAL`

2. **Crear Controller de Votación:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/votacion/composables/useVotacionPronunciamientoController.ts`
   - Reutilizar patrón de `useVotacionController.ts` de aporte dinerario
   - Contexto: `VoteContext.GESTION_SOCIAL`

3. **Actualizar Página de Votación:**
   - Reemplazar datos hardcodeados por datos del controller
   - Conectar con `MetodoVotacio.vue` usando props `votantes` y `textoVotacion`
   - Agregar guardado al hacer "Siguiente"

**Tiempo estimado:** 2-3 horas

---

### **FASE 3: Paso 2 - Aplicación de Resultados** 🔴

#### **3.1. Vista de Datos** ❌ (Falta implementar)

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aplicacion-resultados/aplicacion.vue`

**Cambios necesarios:**

1. **Crear DTOs:**
   - Archivo: `app/core/hexag/juntas/application/dtos/application-of-results.dto.ts`
   - Según documentación backend:
     ```typescript
     export interface ApplicationOfResultsDTO {
       capitalSocialPagadoInicial: number;
       utilidadPerdidaAcumuladaInicial: number;
       resultadoEjercicioInicial: number;
       patrimonioNetoInicial: number;
       diferenciaPatrimonioCapitalPagado: number;
       utilidadDistribuibleAntesReservaLegal: number;
       capitalSocialSuscrito: number;
       reservaLegalActual: number;
       porcentajeReservaLegal: number;
       montoReservaLegal: number;
       nuevaReservaLegal: number;
       capitalSocialPagadoFinal: number;
       utilidadPerdidaAcumuladaFinal: number;
       resultadoEjercicioFinal: number;
       patrimonioNetoFinal: number;
       utilidadDistribuibleFinal: number;
       utilidadNoDistribuida: number;
       utilidadADistribuir: number;
     }
     ```

2. **Crear Entity:**
   - Archivo: `app/core/hexag/juntas/domain/entities/application-of-results.entity.ts`
   - Misma estructura que DTO

3. **Crear Repository Port:**
   - Archivo: `app/core/hexag/juntas/domain/ports/application-of-results.repository.port.ts`

4. **Crear Use Cases:**
   - `app/core/hexag/juntas/application/use-cases/get-application-of-results.use-case.ts`
   - `app/core/hexag/juntas/application/use-cases/create-application-of-results.use-case.ts`
   - `app/core/hexag/juntas/application/use-cases/update-application-of-results.use-case.ts`

5. **Crear Mapper:**
   - Archivo: `app/core/hexag/juntas/infrastructure/mappers/application-of-results.mapper.ts`

6. **Crear HTTP Repository:**
   - Archivo: `app/core/hexag/juntas/infrastructure/repositories/application-of-results.http.repository.ts`
   - Endpoint: `/api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results`

7. **Crear Store:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/stores/useAplicacionResultadosStore.ts`
   - Usar Option API de Pinia

8. **Crear Controller:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/composables/useAplicacionResultadosController.ts`

9. **Crear Componente de UI:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/components/AplicacionResultadosManager.vue`
   - Formulario con todos los campos según documentación
   - Secciones:
     - Valores preliminares
     - Cálculo de utilidades antes de la reserva legal
     - Cálculo de la reserva legal
     - Valores de la utilidad distribuible

10. **Actualizar Página:**
    - Reemplazar `BlankContainer` por `AplicacionResultadosManager`
    - Conectar con controller para cargar/guardar

**Tiempo estimado:** 6-8 horas

---

#### **3.2. Vista de Votación** ⚠️ (Falta conectar lógica)

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aplicacion-resultados/votacion.vue`

**Cambios necesarios:**

1. **Crear Store de Votación:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/votacion/stores/useVotacionAplicacionResultadosStore.ts`
   - Contexto: `VoteContext.DIVIDENDOS` (según documentación)

2. **Crear Controller de Votación:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/aplicacion-resultados/votacion/composables/useVotacionAplicacionResultadosController.ts`
   - Contexto: `VoteContext.DIVIDENDOS`

3. **Actualizar Página de Votación:**
   - Reemplazar datos hardcodeados por datos del controller
   - Conectar con `MetodoVotacio.vue`
   - Agregar guardado al hacer "Siguiente"

**Tiempo estimado:** 2-3 horas

---

### **FASE 4: Paso 3 - Designación de Auditores Externos** 🔴

#### **4.1. Vista de Datos** ❌ (Falta crear)

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/delegacion-auditores/index.vue` (o similar)

**Cambios necesarios:**

1. **Crear DTOs:**
   - Archivo: `app/core/hexag/juntas/application/dtos/external-auditors.dto.ts`
   - Según documentación backend:
     ```typescript
     export interface ExternalAuditorDTO {
       responsableDesignacion: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO";
       auditorExterno?: {
         nombreCompleto: string;
       };
     }
     ```

2. **Crear Entity:**
   - Archivo: `app/core/hexag/juntas/domain/entities/external-auditor.entity.ts`

3. **Crear Repository Port:**
   - Archivo: `app/core/hexag/juntas/domain/ports/external-auditor.repository.port.ts`

4. **Crear Use Cases:**
   - `app/core/hexag/juntas/application/use-cases/get-external-auditor.use-case.ts`
   - `app/core/hexag/juntas/application/use-cases/create-external-auditor.use-case.ts`
   - `app/core/hexag/juntas/application/use-cases/update-external-auditor.use-case.ts`

5. **Crear Mapper:**
   - Archivo: `app/core/hexag/juntas/infrastructure/mappers/external-auditor.mapper.ts`

6. **Crear HTTP Repository:**
   - Archivo: `app/core/hexag/juntas/infrastructure/repositories/external-auditor.http.repository.ts`
   - Endpoint: `/api/v2/society-profile/:societyId/register-assembly/:flowId/external-auditors`

7. **Crear Store:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/stores/useAuditoresExternosStore.ts`

8. **Crear Controller:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/composables/useAuditoresExternosController.ts`

9. **Crear Componente de UI:**
   - Archivo: `app/core/presentation/juntas/puntos-acuerdo/delegacion-auditores/components/AuditoresExternosManager.vue`
   - Formulario con:
     - Selector: Responsable de designación (Junta/Directorio)
     - Input: Nombre completo del auditor

10. **Crear Página:**
    - Archivo: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/delegacion-auditores/index.vue`
    - Usar `AuditoresExternosManager`

**Tiempo estimado:** 4-5 horas

---

#### **4.2. Vista de Votación** ⚠️ (Según documentación, NO tiene votación)

**⚠️ IMPORTANTE:** Según la documentación del backend, este paso **NO tiene contexto de votación específico**.

**Opciones:**
1. **No crear vista de votación** (recomendado según documentación)
2. **Crear vista de votación genérica** si el negocio lo requiere (consultar con usuario)

---

## 📊 RESUMEN DE IMPLEMENTACIÓN

| Paso | Vista Datos | Vista Votación | Tiempo Estimado |
|------|-------------|----------------|-----------------|
| **1. Pronunciamiento** | ✅ Completo | ⚠️ Falta conectar | 2-3 horas |
| **2. Aplicación Resultados** | ❌ Falta crear | ⚠️ Falta conectar | 8-11 horas |
| **3. Auditores Externos** | ❌ Falta crear | ⚠️ No aplica | 4-5 horas |
| **Fase 1: Contextos** | - | - | 5 minutos |
| **TOTAL** | | | **14-19 horas** |

---

## 🎯 COMPONENTES REUTILIZABLES

### ✅ **Ya Reutilizables (Sin cambios):**

1. **`MetodoVotacio.vue`** - Selector de método de votación
2. **`UnanimidadVotacion.vue`** - Vista de votación por unanimidad
3. **`MayoriaVotacion.vue`** - Vista de votación por mayoría
4. **Arquitectura hexagonal de votación** - Use cases, repositorios, mappers
5. **`FileUploadMultipleWithMetadata.vue`** - Subida de archivos (ya usado en pronunciamiento)

### ⚠️ **Necesita Adaptación:**

1. **Stores de votación** - Crear uno por cada punto de agenda (reutilizar patrón)
2. **Controllers de votación** - Crear uno por cada punto de agenda (reutilizar patrón)

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Contextos de Votación**
- [ ] Agregar `GESTION_SOCIAL` al enum `VoteContext`
- [ ] Verificar que `DIVIDENDOS` ya existe

### **Fase 2: Pronunciamiento - Votación**
- [ ] Crear `useVotacionPronunciamientoStore.ts`
- [ ] Crear `useVotacionPronunciamientoController.ts`
- [ ] Actualizar `pronunciamiento-gestion/votacion.vue`
- [ ] Probar guardado y carga de votación

### **Fase 3: Aplicación de Resultados - Datos**
- [ ] Crear DTOs
- [ ] Crear Entity
- [ ] Crear Repository Port
- [ ] Crear Use Cases
- [ ] Crear Mapper
- [ ] Crear HTTP Repository
- [ ] Crear Store
- [ ] Crear Controller
- [ ] Crear Componente UI
- [ ] Actualizar página `aplicacion.vue`
- [ ] Probar guardado y carga

### **Fase 4: Aplicación de Resultados - Votación**
- [ ] Crear `useVotacionAplicacionResultadosStore.ts`
- [ ] Crear `useVotacionAplicacionResultadosController.ts`
- [ ] Actualizar `aplicacion-resultados/votacion.vue`
- [ ] Probar guardado y carga de votación

### **Fase 5: Auditores Externos - Datos**
- [ ] Crear DTOs
- [ ] Crear Entity
- [ ] Crear Repository Port
- [ ] Crear Use Cases
- [ ] Crear Mapper
- [ ] Crear HTTP Repository
- [ ] Crear Store
- [ ] Crear Controller
- [ ] Crear Componente UI
- [ ] Crear página
- [ ] Probar guardado y carga

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Fase 1** (5 min) - Agregar contextos
2. **Fase 2** (2-3 horas) - Completar pronunciamiento (más rápido, ya tiene datos)
3. **Fase 3** (6-8 horas) - Aplicación de resultados - datos
4. **Fase 4** (2-3 horas) - Aplicación de resultados - votación
5. **Fase 5** (4-5 horas) - Auditores externos

**Total:** 14-19 horas de desarrollo

---

## 📚 REFERENCIAS

- **Documentación Backend:** `docs/backend/REGISTER-ASSEMBLY-3-PASOS-COMPLETO.md`
- **Arquitectura Votación:** `docs/juntas/aportes/RESUMEN-IMPLEMENTACION-VOTACIONES.md`
- **Componente Votación:** `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue`
- **Store Votación Ejemplo:** `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`
- **Controller Votación Ejemplo:** `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`

---

**¡Plan completo listo para implementar, mi rey!** 🚀💪



