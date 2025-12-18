# 📋 PLAN DE INVESTIGACIÓN COMPLETO: REMOCIÓN DE APODERADOS Y DIRECTORES

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Objetivo:** Revisar exhaustivamente la implementación actual y asegurar que cada vista funcione correctamente según la documentación del backend

---

## 🎯 OBJETIVO GENERAL

Verificar que las implementaciones de **Remoción de Apoderados** y **Remoción de Directores** estén:
1. ✅ Completamente funcionales
2. ✅ Alineadas con la documentación del backend
3. ✅ Idénticas entre sí (gotas de agua)
4. ✅ Siguiendo la arquitectura hexagonal
5. ✅ Usando correctamente la sincronización automática del backend

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

### **Backend:**
- `docs/backend/correciones/REMOCION-APODERADOS-DIRECTORES-GUIA-COMPLETA.md`
  - ✅ Sincronización automática entre FlowActions y VoteItems
  - ✅ Campos nuevos: `isRemovalCandidate`, `isRemoved`, `removalStatus`
  - ✅ Campos de compatibilidad: `isCandidate`, `candidateStatus`, `flowActionId`
  - ✅ Flujo: GET → PUT (marcar) → GET votes → PUT votes → PUT (resultado)

---

## 🔍 FASE 1: INVESTIGACIÓN DE ARQUITECTURA HEXAGONAL

### **1.1 Domain Layer**

#### **Remoción de Apoderados:**
- [ ] Verificar si existe entidad `RemovalAttorney` en `domain/entities/`
- [ ] Verificar si existe puerto `RemovalAttorneyRepository` en `domain/ports/`
- [ ] Revisar estructura de datos y validaciones

#### **Remoción de Directores:**
- [ ] Verificar si existe entidad `RemovalDirector` en `domain/entities/`
- [ ] Verificar si existe puerto `RemovalDirectorRepository` en `domain/ports/`
- [ ] Revisar estructura de datos y validaciones
- [ ] Comparar con apoderados para identificar diferencias

**Archivos a revisar:**
- `app/core/hexag/juntas/domain/entities/`
- `app/core/hexag/juntas/domain/ports/`

---

### **1.2 Application Layer**

#### **Remoción de Apoderados:**
- [ ] Revisar DTOs en `application/dtos/removal-attorney.dto.ts`
  - [ ] `RemovalAttorneyResponseDTO` - ¿Incluye campos nuevos?
  - [ ] `CreateRemovalAttorneyDTO` - ¿Soporta todos los estados?
  - [ ] `UpdateRemovalAttorneyDTO` - ¿Soporta todos los estados?
- [ ] Revisar casos de uso:
  - [ ] `ListRemovalAttorneysUseCase`
  - [ ] `CreateRemovalAttorneyCandidateUseCase`
  - [ ] `UpdateRemovalAttorneyCandidateUseCase`
- [ ] Verificar que los DTOs mapeen correctamente los campos del backend

#### **Remoción de Directores:**
- [ ] Revisar DTOs en `application/dtos/removal-director.dto.ts`
  - [ ] `RemovalDirectorResponseDTO` - ¿Incluye campos nuevos?
  - [ ] `CreateRemovalDirectorDTO` - ¿Soporta todos los estados?
  - [ ] `UpdateRemovalDirectorDTO` - ¿Soporta todos los estados?
- [ ] Revisar casos de uso:
  - [ ] `ListRemovalDirectorsUseCase`
  - [ ] `CreateRemovalDirectorCandidateUseCase`
  - [ ] `UpdateRemovalDirectorCandidateUseCase`
- [ ] Comparar estructura con apoderados

**Archivos a revisar:**
- `app/core/hexag/juntas/application/dtos/removal-attorney.dto.ts`
- `app/core/hexag/juntas/application/dtos/removal-director.dto.ts`
- `app/core/hexag/juntas/application/use-cases/removal-attorney/`
- `app/core/hexag/juntas/application/use-cases/removal-director/`

---

### **1.3 Infrastructure Layer**

#### **Remoción de Apoderados:**
- [ ] Revisar mapper `RemovalAttorneyMapper`
  - [ ] ¿Mapea correctamente `person` → estructura esperada?
  - [ ] ¿Mapea campos nuevos (`isRemovalCandidate`, `isRemoved`, `removalStatus`)?
  - [ ] ¿Mapea campos de compatibilidad (`isCandidate`, `candidateStatus`)?
- [ ] Revisar repositorio `RemovalAttorneyHttpRepository`
  - [ ] ¿GET `/removal-attorney` funciona correctamente?
  - [ ] ¿PUT `/removal-attorney` funciona correctamente?
  - [ ] ¿Maneja todos los estados: `CANDIDATO`, `ELEGIDO`, `NO_ELEGIDO`, `DESMARCAR`?
  - [ ] ¿Maneja errores correctamente (401, 404, 422)?

#### **Remoción de Directores:**
- [ ] Revisar mapper `RemovalDirectorMapper`
  - [ ] ¿Mapea correctamente `person` → `persona`?
  - [ ] ¿Mapea campos nuevos (`isRemovalCandidate`, `isRemoved`, `removalStatus`)?
  - [ ] ¿Mapea campos de compatibilidad (`isCandidate`, `candidateStatus`)?
- [ ] Revisar repositorio `RemovalDirectorHttpRepository`
  - [ ] ¿GET `/removal-director` funciona correctamente?
  - [ ] ¿PUT `/removal-director` funciona correctamente?
  - [ ] ¿Maneja todos los estados: `CANDIDATO`, `ELEGIDO`, `NO_ELEGIDO`, `DESMARCAR`?
  - [ ] ¿Maneja errores correctamente (401, 404, 422)?
- [ ] Comparar implementación con apoderados

**Archivos a revisar:**
- `app/core/hexag/juntas/infrastructure/mappers/removal-attorney.mapper.ts`
- `app/core/hexag/juntas/infrastructure/mappers/removal-director.mapper.ts`
- `app/core/hexag/juntas/infrastructure/repositories/removal-attorney.http.repository.ts`
- `app/core/hexag/juntas/infrastructure/repositories/removal-director.http.repository.ts`

---

## 🔍 FASE 2: INVESTIGACIÓN DE PRESENTATION LAYER

### **2.1 Stores (Pinia - Option API)**

#### **Remoción de Apoderados:**
- [ ] Revisar `useRemocionApoderadosStore`
  - [ ] ¿Usa Option API (NO Composition API)?
  - [ ] ¿Tiene persistencia en localStorage?
  - [ ] ¿Estado: `candidatos`, `status`, `errorMessage`?
  - [ ] ¿Getters: `hasCandidatos`, `hasSeleccionados`, `getApoderadoById`?
  - [ ] ¿Actions: `loadApoderados`, `actualizarEstado`?
  - [ ] ¿Maneja todos los estados: `CANDIDATO`, `ELEGIDO`, `NO_ELEGIDO`, `DESMARCAR`?

#### **Remoción de Directores:**
- [ ] Revisar `useRemocionDirectoresStore`
  - [ ] ¿Usa Option API (NO Composition API)?
  - [ ] ¿Tiene persistencia en localStorage?
  - [ ] ¿Estado: `candidatos`, `status`, `errorMessage`?
  - [ ] ¿Getters: `hasCandidatos`, `hasSeleccionados`, `getDirectorById`?
  - [ ] ¿Actions: `loadDirectores`, `actualizarEstado`?
  - [ ] ¿Maneja todos los estados: `CANDIDATO`, `ELEGIDO`, `NO_ELEGIDO`, `DESMARCAR`?
- [ ] Comparar estructura con apoderados

#### **Votación de Apoderados:**
- [ ] Revisar `useVotacionRemocionApoderadosStore`
  - [ ] ¿Usa Option API (NO Composition API)?
  - [ ] ¿Estado: `sesionVotacion`, `status`, `errorMessage`?
  - [ ] ¿Getters: `hasVotacion`, `items`, `votos`, etc.?
  - [ ] ¿Actions: `loadVotacion`, `createVotacion`, `addVoteItemConVotos`, `updateItemConVotos`?
  - [ ] ¿Siempre incluye `VoteContext.REMOCION_APODERADOS`?
  - [ ] ¿Siempre incluye array `votos` (aunque esté vacío)?

#### **Votación de Directores:**
- [ ] Revisar `useVotacionRemocionDirectoresStore`
  - [ ] ¿Usa Option API (NO Composition API)?
  - [ ] ¿Estado: `sesionVotacion`, `status`, `errorMessage`?
  - [ ] ¿Getters: `hasVotacion`, `items`, `votos`, etc.?
  - [ ] ¿Actions: `loadVotacion`, `createVotacion`, `addVoteItemConVotos`, `updateItemConVotos`?
  - [ ] ¿Siempre incluye `VoteContext.REMOCION_DIRECTORES`?
  - [ ] ¿Siempre incluye array `votos` (aunque esté vacío)?
- [ ] Comparar estructura con apoderados

**Archivos a revisar:**
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/stores/useRemocionDirectoresStore.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/stores/useVotacionRemocionDirectoresStore.ts`

---

### **2.2 Composables/Controllers**

#### **Vista de Selección - Apoderados:**
- [ ] Revisar `useRemocionApoderadosPage`
  - [ ] ¿Carga apoderados con GET al montar?
  - [ ] ¿Filtra "Gerente General"?
  - [ ] ¿Watcher para PUT automático en checkbox?
  - [ ] ¿Flag `isInitializing` para evitar PUT durante carga?
  - [ ] ¿Función `guardarSeleccion` solo recarga (PUT ya se ejecutó)?
  - [ ] ¿Maneja errores y reversión de cambios?

#### **Vista de Selección - Directores:**
- [ ] Revisar `useRemocionDirectoresPage`
  - [ ] ¿Carga directores con GET al montar?
  - [ ] ¿Separa por rol (Titulares / Suplentes+Alternos)?
  - [ ] ¿Watcher para PUT automático en checkbox?
  - [ ] ¿Flag `isInitializing` para evitar PUT durante carga?
  - [ ] ¿Función `guardarSeleccion` solo recarga (PUT ya se ejecutó)?
  - [ ] ¿Maneja errores y reversión de cambios?
- [ ] Comparar implementación con apoderados

#### **Vista de Votación - Apoderados:**
- [ ] Revisar `useVotacionRemocionApoderadosController`
  - [ ] ¿Carga snapshot y asistencias?
  - [ ] ¿Recarga candidatos desde backend?
  - [ ] ¿Carga votación existente (GET `/votes?contexto=REMOCION_APODERADOS`)?
  - [ ] ¿Genera preguntas desde items de votación (prioridad 1)?
  - [ ] ¿Genera preguntas desde candidatos filtrados (prioridad 2)?
  - [ ] ¿Filtra por `isCandidate === true`?
  - [ ] ¿Usa `c.person.natural` o `c.person.juridic` correctamente?
  - [ ] ¿Obtiene nombre de clase desde snapshot?
  - [ ] ¿Función `guardarVotacion` hace GET antes de POST/PUT?
  - [ ] ¿Actualiza estados después de votar (ELEGIDO/NO_ELEGIDO)?
  - [ ] ¿No crea items automáticamente en `loadData` (solo en memoria)?

#### **Vista de Votación - Directores:**
- [ ] Revisar `useVotacionRemocionDirectoresController`
  - [ ] ¿Carga snapshot y asistencias?
  - [ ] ¿Recarga candidatos desde backend?
  - [ ] ¿Carga votación existente (GET `/votes?contexto=REMOCION_DIRECTORES`)?
  - [ ] ¿Genera preguntas desde items de votación (prioridad 1)?
  - [ ] ¿Genera preguntas desde candidatos filtrados (prioridad 2)?
  - [ ] ¿Filtra por `isCandidate === true`?
  - [ ] ¿Usa `c.persona` correctamente (no `c.person`)?
  - [ ] ¿Obtiene rol del director desde `c.rolDirector`?
  - [ ] ¿Función `guardarVotacion` hace GET antes de POST/PUT?
  - [ ] ¿Actualiza estados después de votar (ELEGIDO/NO_ELEGIDO)?
  - [ ] ¿No crea items automáticamente en `loadData` (solo en memoria)?
- [ ] Comparar implementación con apoderados

**Archivos a revisar:**
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/composables/useRemocionDirectoresPage.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/composables/useVotacionRemocionDirectoresController.ts`

---

### **2.3 Componentes Vue**

#### **Vista de Selección - Apoderados:**
- [ ] Revisar `remocion-apoderados/remocion.vue`
  - [ ] ¿Renderiza `SeleccionApoderadosSection`?
  - [ ] ¿Pasa `apoderados` como prop?
  - [ ] ¿Maneja `@update:checked-items`?
  - [ ] ¿Configura `useJuntasFlowNext` con `guardarSeleccion`?

#### **Vista de Selección - Directores:**
- [ ] Revisar `remocion-directores/remocion.vue`
  - [ ] ¿Renderiza `SeleccionDirectoresTitularesSection`?
  - [ ] ¿Renderiza `SeleccionDirectoresSuplentesSection`?
  - [ ] ¿Pasa `directores` como prop a ambas?
  - [ ] ¿Maneja `@update:checked-items` para ambas?
  - [ ] ¿Configura `useJuntasFlowNext` con `guardarSeleccion`?

#### **Componentes de Selección:**
- [ ] Revisar `SeleccionApoderadosSection.vue`
  - [ ] ¿Usa `CheckboxTable`?
  - [ ] ¿Emite `@update:checked-items`?
- [ ] Revisar `SeleccionDirectoresTitularesSection.vue`
  - [ ] ¿Filtra solo TITULAR?
  - [ ] ¿Usa `CheckboxTable`?
  - [ ] ¿Emite `@update:checked-items`?
- [ ] Revisar `SeleccionDirectoresSuplentesSection.vue`
  - [ ] ¿Filtra SUPLENTE y ALTERNO?
  - [ ] ¿Usa `CheckboxTable`?
  - [ ] ¿Emite `@update:checked-items`?

#### **Vista de Votación - Apoderados:**
- [ ] Revisar `remocion-apoderados/votacion.vue`
  - [ ] ¿Itera sobre `preguntas` con `v-for`?
  - [ ] ¿Renderiza `ItemVotacionCompleto` por cada pregunta?
  - [ ] ¿Pasa props correctas: `item-index`, `pregunta`, `votantes`, `votacion-store`?
  - [ ] ¿Maneja `@cambiar-tipo` y `@cambiar-voto`?
  - [ ] ¿Configura `useJuntasFlowNext` con `guardarVotacion`?

#### **Vista de Votación - Directores:**
- [ ] Revisar `remocion-directores/votacion.vue`
  - [ ] ¿Itera sobre `preguntas` con `v-for`?
  - [ ] ¿Renderiza `ItemVotacionCompleto` por cada pregunta?
  - [ ] ¿Pasa props correctas: `item-index`, `pregunta`, `votantes`, `votacion-store`?
  - [ ] ¿Maneja `@cambiar-tipo` y `@cambiar-voto`?
  - [ ] ¿Configura `useJuntasFlowNext` con `guardarVotacion`?
- [ ] Comparar implementación con apoderados

**Archivos a revisar:**
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/remocion.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/remocion.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/votacion.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/votacion.vue`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/components/organisms/SeleccionApoderadosSection.vue`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/components/organisms/SeleccionDirectoresTitularesSection.vue`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/components/organisms/SeleccionDirectoresSuplentesSection.vue`

---

## 🔍 FASE 3: INVESTIGACIÓN DE FLUJOS Y ENDPOINTS

### **3.1 Flujo de Selección**

#### **Apoderados:**
- [ ] **GET al cargar:**
  - [ ] ¿Se ejecuta `GET /removal-attorney` en `onMounted`?
  - [ ] ¿Se ejecuta en `onActivated`?
  - [ ] ¿Mapea correctamente la respuesta?
  - [ ] ¿Filtra "Gerente General"?
  - [ ] ¿Marca checkboxes según `isCandidate`?

- [ ] **PUT automático en checkbox:**
  - [ ] ¿Watcher detecta cambios en checkboxes?
  - [ ] ¿Ejecuta PUT inmediatamente al cambiar?
  - [ ] ¿No ejecuta PUT durante carga inicial (`isInitializing`)?
  - [ ] ¿Maneja errores y revierte cambios?

- [ ] **PUT al hacer "Siguiente":**
  - [ ] ¿`guardarSeleccion` solo recarga (PUT ya se ejecutó)?
  - [ ] ¿O ejecuta PUT para todos los cambios pendientes?

#### **Directores:**
- [ ] **GET al cargar:**
  - [ ] ¿Se ejecuta `GET /removal-director` en `onMounted`?
  - [ ] ¿Se ejecuta en `onActivated`?
  - [ ] ¿Mapea correctamente la respuesta?
  - [ ] ¿Separa por rol (Titulares / Suplentes+Alternos)?
  - [ ] ¿Marca checkboxes según `isCandidate`?

- [ ] **PUT automático en checkbox:**
  - [ ] ¿Watcher detecta cambios en checkboxes?
  - [ ] ¿Ejecuta PUT inmediatamente al cambiar?
  - [ ] ¿No ejecuta PUT durante carga inicial (`isInitializing`)?
  - [ ] ¿Maneja errores y revierte cambios?

- [ ] **PUT al hacer "Siguiente":**
  - [ ] ¿`guardarSeleccion` solo recarga (PUT ya se ejecutó)?
  - [ ] ¿O ejecuta PUT para todos los cambios pendientes?

---

### **3.2 Flujo de Votación**

#### **Apoderados:**
- [ ] **GET al cargar:**
  - [ ] ¿Se ejecuta `GET /votes?contexto=REMOCION_APODERADOS`?
  - [ ] ¿Se ejecuta `GET /removal-attorney` para recargar candidatos?
  - [ ] ¿Carga snapshot y asistencias?
  - [ ] ¿Genera preguntas desde items de votación (si existen)?
  - [ ] ¿Genera preguntas desde candidatos (si no hay items)?

- [ ] **Renderizado:**
  - [ ] ¿Renderiza un `ItemVotacionCompleto` por cada pregunta?
  - [ ] ¿Cada item tiene su propio método de votación?
  - [ ] ¿Cada item tiene su propia emisión de votos?
  - [ ] ¿Cada item tiene sus propios resultados?

- [ ] **PUT al hacer "Siguiente":**
  - [ ] ¿`guardarVotacion` hace GET primero?
  - [ ] ¿POST si no existe sesión?
  - [ ] ¿PUT si existe sesión?
  - [ ] ¿Siempre incluye `VoteContext.REMOCION_APODERADOS`?
  - [ ] ¿Siempre incluye array `votos` (aunque esté vacío)?
  - [ ] ¿Actualiza estados después (PUT `/removal-attorney` con ELEGIDO/NO_ELEGIDO)?

#### **Directores:**
- [ ] **GET al cargar:**
  - [ ] ¿Se ejecuta `GET /votes?contexto=REMOCION_DIRECTORES`?
  - [ ] ¿Se ejecuta `GET /removal-director` para recargar candidatos?
  - [ ] ¿Carga snapshot y asistencias?
  - [ ] ¿Genera preguntas desde items de votación (si existen)?
  - [ ] ¿Genera preguntas desde candidatos (si no hay items)?

- [ ] **Renderizado:**
  - [ ] ¿Renderiza un `ItemVotacionCompleto` por cada pregunta?
  - [ ] ¿Cada item tiene su propio método de votación?
  - [ ] ¿Cada item tiene su propia emisión de votos?
  - [ ] ¿Cada item tiene sus propios resultados?

- [ ] **PUT al hacer "Siguiente":**
  - [ ] ¿`guardarVotacion` hace GET primero?
  - [ ] ¿POST si no existe sesión?
  - [ ] ¿PUT si existe sesión?
  - [ ] ¿Siempre incluye `VoteContext.REMOCION_DIRECTORES`?
  - [ ] ¿Siempre incluye array `votos` (aunque esté vacío)?
  - [ ] ¿Actualiza estados después (PUT `/removal-director` con ELEGIDO/NO_ELEGIDO)?

---

## 🔍 FASE 4: INVESTIGACIÓN DE SINCRONIZACIÓN AUTOMÁTICA

### **4.1 Verificación de Sincronización**

Según la documentación, el backend sincroniza automáticamente:
- ✅ Al marcar (`CANDIDATO`) → Crea VoteItem automáticamente
- ✅ Al desmarcar (`DESMARCAR`) → Desactiva VoteItem automáticamente

**Investigación:**
- [ ] ¿El frontend confía en esta sincronización automática?
- [ ] ¿O está creando VoteItems manualmente?
- [ ] ¿Qué sucede si el backend crea el VoteItem automáticamente?
- [ ] ¿El frontend lo detecta correctamente en el GET `/votes`?

---

### **4.2 Campos Nuevos vs Campos de Compatibilidad**

**Campos Nuevos (recomendados):**
- `isRemovalCandidate`: boolean
- `isRemoved`: boolean
- `removalStatus`: string | null

**Campos de Compatibilidad:**
- `isCandidate`: boolean
- `candidateStatus`: string | null
- `flowActionId`: string | null

**Investigación:**
- [ ] ¿El frontend usa campos nuevos o campos de compatibilidad?
- [ ] ¿Los mappers mapean ambos?
- [ ] ¿Hay inconsistencia?

---

## 🔍 FASE 5: COMPARACIÓN APODERADOS vs DIRECTORES

### **5.1 Comparación Estructural**

| Aspecto | Apoderados | Directores | ¿Idéntico? |
|---------|-----------|-----------|------------|
| **Domain Layer** | | | |
| Entidad | `RemovalAttorney` | `RemovalDirector` | ✅ Similar |
| Puerto | `RemovalAttorneyRepository` | `RemovalDirectorRepository` | ✅ Similar |
| **Application Layer** | | | |
| DTOs | `RemovalAttorneyResponseDTO` | `RemovalDirectorResponseDTO` | ⚠️ Revisar |
| Casos de uso | `List`, `CreateCandidate`, `UpdateCandidate` | `List`, `CreateCandidate`, `UpdateCandidate` | ✅ Similar |
| **Infrastructure Layer** | | | |
| Mapper | `RemovalAttorneyMapper` | `RemovalDirectorMapper` | ⚠️ Revisar |
| Repositorio | `RemovalAttorneyHttpRepository` | `RemovalDirectorHttpRepository` | ⚠️ Revisar |
| **Presentation Layer** | | | |
| Store selección | `useRemocionApoderadosStore` | `useRemocionDirectoresStore` | ⚠️ Revisar |
| Store votación | `useVotacionRemocionApoderadosStore` | `useVotacionRemocionDirectoresStore` | ⚠️ Revisar |
| Composable selección | `useRemocionApoderadosPage` | `useRemocionDirectoresPage` | ⚠️ Revisar |
| Controller votación | `useVotacionRemocionApoderadosController` | `useVotacionRemocionDirectoresController` | ⚠️ Revisar |

---

### **5.2 Comparación de Flujos**

| Paso | Apoderados | Directores | ¿Idéntico? |
|------|-----------|-----------|------------|
| **Selección:** | | | |
| GET al cargar | `GET /removal-attorney` | `GET /removal-director` | ✅ Similar |
| PUT automático | Watcher en checkbox | Watcher en checkbox | ⚠️ Revisar |
| PUT al "Siguiente" | Solo recarga | Solo recarga | ⚠️ Revisar |
| **Votación:** | | | |
| GET al cargar | `GET /votes?contexto=REMOCION_APODERADOS` | `GET /votes?contexto=REMOCION_DIRECTORES` | ✅ Similar |
| Generar preguntas | Desde items o candidatos | Desde items o candidatos | ⚠️ Revisar |
| Renderizar | `ItemVotacionCompleto` por pregunta | `ItemVotacionCompleto` por pregunta | ⚠️ Revisar |
| PUT al "Siguiente" | GET → POST/PUT → Actualizar estados | GET → POST/PUT → Actualizar estados | ⚠️ Revisar |

---

## 🔍 FASE 6: INVESTIGACIÓN DE PROBLEMAS CONOCIDOS

### **6.1 Problemas Reportados**

1. **Vista de votación de directores no renderiza:**
   - [ ] ¿El computed `preguntas` se ejecuta?
   - [ ] ¿Los candidatos se cargan correctamente?
   - [ ] ¿El filtro `isCandidate === true` funciona?
   - [ ] ¿Se generan las preguntas correctamente?
   - [ ] ¿La vista itera sobre `preguntas`?

2. **PUT automático en checkbox:**
   - [ ] ¿Funciona en apoderados?
   - [ ] ¿Funciona en directores?
   - [ ] ¿Se ejecuta durante carga inicial?
   - [ ] ¿Maneja errores correctamente?

3. **Sincronización con backend:**
   - [ ] ¿El backend crea VoteItems automáticamente?
   - [ ] ¿El frontend los detecta correctamente?
   - [ ] ¿Hay conflictos entre creación manual y automática?

---

## 🔍 FASE 7: VERIFICACIÓN DE CASOS DE USO

### **7.1 Casos de Uso de Selección**

#### **Caso 1: Marcar un apoderado/director**
1. Usuario entra a vista de selección
2. Usuario marca checkbox
3. ✅ Watcher detecta cambio
4. ✅ PUT automático ejecutado
5. ✅ Backend crea FlowAction y VoteItem automáticamente
6. ✅ Estado actualizado

#### **Caso 2: Desmarcar un apoderado/director**
1. Usuario desmarca checkbox
2. ✅ Watcher detecta cambio
3. ✅ PUT automático ejecutado (DESMARCAR)
4. ✅ Backend desactiva FlowAction y VoteItem automáticamente
5. ✅ Estado actualizado

#### **Caso 3: Marcar múltiples apoderados/directores**
1. Usuario marca varios checkboxes
2. ✅ Cada cambio ejecuta PUT automático
3. ✅ Backend crea múltiples FlowActions y VoteItems
4. ✅ Todos los estados actualizados

---

### **7.2 Casos de Uso de Votación**

#### **Caso 1: Primera vez (sin votación existente)**
1. Usuario entra a vista de votación
2. ✅ GET `/votes?contexto=REMOCION_*` → 404
3. ✅ GET `/removal-*` → Carga candidatos
4. ✅ Genera preguntas desde candidatos filtrados
5. ✅ Renderiza `ItemVotacionCompleto` por cada pregunta
6. Usuario vota y hace clic en "Siguiente"
7. ✅ GET `/votes` → 404
8. ✅ POST `/votes` → Crea sesión con items
9. ✅ PUT `/removal-*` → Actualiza estados (ELEGIDO/NO_ELEGIDO)

#### **Caso 2: Votación existente**
1. Usuario entra a vista de votación
2. ✅ GET `/votes?contexto=REMOCION_*` → 200 (sesión existe)
3. ✅ GET `/removal-*` → Carga candidatos
4. ✅ Genera preguntas desde items de votación
5. ✅ Renderiza `ItemVotacionCompleto` por cada pregunta
6. Usuario vota y hace clic en "Siguiente"
7. ✅ GET `/votes` → 200
8. ✅ PUT `/votes` → Actualiza sesión con votos
9. ✅ PUT `/removal-*` → Actualiza estados (ELEGIDO/NO_ELEGIDO)

#### **Caso 3: Múltiples items (votación múltiple)**
1. Usuario tiene 3 apoderados/directores marcados
2. ✅ Backend creó 3 VoteItems automáticamente
3. ✅ GET `/votes` devuelve 3 items
4. ✅ Se generan 3 preguntas
5. ✅ Se renderizan 3 `ItemVotacionCompleto`
6. Usuario vota en cada uno
7. ✅ PUT `/votes` actualiza los 3 items
8. ✅ PUT `/removal-*` actualiza los 3 estados

---

## 📊 FASE 8: REPORTE DE HALLAZGOS

### **8.1 Estructura del Reporte**

Para cada fase, generar un reporte con:

1. **✅ Cumplimientos:**
   - Lista de lo que está correcto
   - Ejemplo: "✅ El store usa Option API correctamente"

2. **⚠️ Problemas Encontrados:**
   - Lista de problemas con ubicación específica
   - Formato: "⚠️ [Problema] en `[ruta/archivo]` - [Explicación]"
   - Ejemplo: "⚠️ El mapper no mapea campos nuevos en `app/core/hexag/juntas/infrastructure/mappers/removal-director.mapper.ts`"

3. **📋 Checklist de Correcciones Necesarias:**
   - [ ] [Tarea específica con ubicación]
   - [ ] [Tarea específica con ubicación]

4. **💡 Sugerencias de Mejora (Opcional):**
   - Sugerencias para mejorar la implementación

---

## 🎯 RESULTADO ESPERADO

Al finalizar la investigación, deberíamos tener:

1. ✅ **Reporte completo** de la implementación actual
2. ✅ **Lista de problemas** identificados con ubicaciones específicas
3. ✅ **Plan de corrección** priorizado
4. ✅ **Verificación** de que ambas funcionalidades son idénticas
5. ✅ **Confirmación** de que siguen la arquitectura hexagonal
6. ✅ **Validación** de que usan correctamente la sincronización automática del backend

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **Sincronización Automática:** El backend crea/elimina VoteItems automáticamente. El frontend NO debe crearlos manualmente.
- ⚠️ **Campos Nuevos:** Preferir usar `isRemovalCandidate`, `isRemoved`, `removalStatus` sobre `isCandidate`, `candidateStatus`.
- ⚠️ **Arquitectura Hexagonal:** Verificar que se respete en todas las capas.
- ⚠️ **Option API:** Todos los stores DEBEN usar Option API, NO Composition API.
- ⚠️ **Gotas de Agua:** Apoderados y Directores deben funcionar exactamente igual, excepto por las diferencias documentadas (separación por rol en directores).

---

## 🚀 SIGUIENTE PASO

Una vez completada la investigación, generar:
1. Reporte estructurado con hallazgos
2. Plan de corrección priorizado
3. Implementación de correcciones (si se aprueba)

