# 🎯 ACCIONES NECESARIAS: ACTUALIZACIÓN BACKEND - REMOCIONES

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Objetivo:** Adaptar el frontend a la última actualización del backend que incluye sincronización automática y campos nuevos

---

## 📋 RESUMEN DE CAMBIOS DEL BACKEND

### **1. Sincronización Automática** ⚠️ **CRÍTICO**
- ✅ El backend **crea automáticamente** VoteItems cuando marcas una entidad (`CANDIDATO`)
- ✅ El backend **desactiva automáticamente** VoteItems cuando desmarcas (`DESMARCAR`)
- ❌ **El frontend NO debe crear VoteItems manualmente**

### **2. Campos Nuevos** ⚠️ **RECOMENDADO**
El backend ahora devuelve campos más descriptivos:
- `isRemovalCandidate`: boolean - true si está marcado para remoción
- `isRemoved`: boolean - true si ya fue votado
- `removalStatus`: string | null - `PENDIENTE_VOTACION` | `REMOVIDO` | `NO_REMOVIDO` | `null`

### **3. Campos de Compatibilidad** ✅ **MANTENER**
El backend mantiene los campos antiguos para compatibilidad:
- `isCandidate`: boolean
- `candidateStatus`: string | null
- `flowActionId`: string | null

---

## 🚨 PROBLEMA ACTUAL

### **1. Frontend está creando VoteItems manualmente** ❌

**Ubicación:**
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/composables/useVotacionRemocionDirectoresController.ts`

**Código problemático:**
```typescript
// ❌ PROBLEMA: Estamos creando VoteItems manualmente
await votacionStore.createVotacion(...);
await votacionStore.addVoteItemConVotos(...);
```

**Solución:**
- ✅ El backend ya creó los VoteItems automáticamente cuando marcamos las entidades
- ✅ Solo necesitamos hacer GET `/votes` para obtenerlos
- ✅ Solo necesitamos hacer PUT `/votes` para actualizar los votos (NO crear items)

---

### **2. DTOs no incluyen campos nuevos** ❌

**Ubicación:**
- `app/core/hexag/juntas/application/dtos/removal-attorney.dto.ts`
- `app/core/hexag/juntas/application/dtos/removal-director.dto.ts`

**Problema:**
- Los DTOs solo tienen campos de compatibilidad (`isCandidate`, `candidateStatus`)
- No tienen campos nuevos (`isRemovalCandidate`, `isRemoved`, `removalStatus`)

---

### **3. Mappers no mapean campos nuevos** ❌

**Ubicación:**
- `app/core/hexag/juntas/infrastructure/mappers/removal-director.mapper.ts`
- (No existe mapper para apoderados, probablemente se mapea directamente)

**Problema:**
- Los mappers no extraen los campos nuevos del backend
- Solo mapean campos de compatibilidad

---

## ✅ PLAN DE ACCIONES

### **ACCIÓN 1: Agregar Campos Nuevos a los DTOs**

#### **1.1 Remoción de Apoderados**

**Archivo:** `app/core/hexag/juntas/application/dtos/removal-attorney.dto.ts`

**Cambios:**
```typescript
export interface RemovalAttorneyResponseDTO {
  // ... campos existentes ...

  // ✅ Campos de compatibilidad (mantener)
  isCandidate: boolean;
  candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null;
  flowActionId: string | null;

  // ✅ Campos nuevos (AGREGAR)
  isRemovalCandidate?: boolean; // true si está marcado para remoción
  isRemoved?: boolean; // true si ya fue votado
  removalStatus?: "PENDIENTE_VOTACION" | "REMOVIDO" | "NO_REMOVIDO" | null;
}
```

---

#### **1.2 Remoción de Directores**

**Archivo:** `app/core/hexag/juntas/application/dtos/removal-director.dto.ts`

**Cambios:**
```typescript
export interface RemovalDirectorResponseDTO {
  // ... campos existentes ...

  // ✅ Campos de compatibilidad (mantener)
  isCandidate: boolean;
  candidateStatus?: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null;
  flowActionId?: string | null;

  // ✅ Campos nuevos (AGREGAR)
  isRemovalCandidate?: boolean; // true si está marcado para remoción
  isRemoved?: boolean; // true si ya fue votado
  removalStatus?: "PENDIENTE_VOTACION" | "REMOVIDO" | "NO_REMOVIDO" | null;
}
```

---

### **ACCIÓN 2: Actualizar Mappers para Incluir Campos Nuevos**

#### **2.1 Remoción de Directores**

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/removal-director.mapper.ts`

**Cambios:**
```typescript
static fromBackendResponse(backendData: any): RemovalDirectorResponseDTO {
  // ... mapeo existente ...

  return {
    // ... campos existentes ...
    
    // ✅ Campos de compatibilidad (mantener)
    isCandidate: backendData.isCandidate || false,
    candidateStatus: candidateStatus || null,
    flowActionId: firstFlowAction?.id || null,

    // ✅ Campos nuevos (AGREGAR)
    isRemovalCandidate: backendData.isRemovalCandidate ?? backendData.isCandidate ?? false,
    isRemoved: backendData.isRemoved ?? (candidateStatus === "ELECTED" || candidateStatus === "NOT_ELECTED"),
    removalStatus: backendData.removalStatus || 
      (candidateStatus === "CANDIDATE" ? "PENDIENTE_VOTACION" : 
       candidateStatus === "ELECTED" ? "REMOVIDO" : 
       candidateStatus === "NOT_ELECTED" ? "NO_REMOVIDO" : null),
  };
}
```

---

#### **2.2 Remoción de Apoderados**

**Verificar:** ¿Existe mapper para apoderados o se mapea directamente en el repositorio?

**Si existe mapper:**
- Agregar mapeo de campos nuevos igual que en directores

**Si NO existe mapper:**
- Verificar en `RemovalAttorneyHttpRepository` cómo se mapea
- Agregar mapeo de campos nuevos allí

---

### **ACCIÓN 3: Eliminar Creación Manual de VoteItems** ⚠️ **CRÍTICO**

#### **3.1 Remoción de Apoderados**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`

**Problema actual:**
```typescript
// ❌ PROBLEMA: Estamos creando VoteItems manualmente
if (!existeEnBackend) {
  await votacionStore.createVotacion(...); // ❌ NO NECESARIO
  for (let i = 1; i < items.length; i++) {
    await votacionStore.addVoteItemConVotos(...); // ❌ NO NECESARIO
  }
}
```

**Solución:**
```typescript
// ✅ SOLUCIÓN: El backend ya creó los VoteItems automáticamente
// Solo necesitamos hacer GET para obtenerlos y PUT para actualizar votos

// Si no existe sesión, significa que no hay candidatos marcados
// En ese caso, mostrar mensaje o redirigir a selección
if (!existeEnBackend) {
  // Verificar si hay candidatos marcados
  const candidatosFiltrados = remocionStore.candidatos.filter((c) => c.isCandidate === true);
  if (candidatosFiltrados.length === 0) {
    throw new Error("No hay apoderados seleccionados para remoción. Por favor, seleccione al menos uno.");
  }
  // Si hay candidatos pero no hay sesión, el backend debería haberla creado
  // Esperar un momento y recargar, o mostrar error
  throw new Error("La sesión de votación no existe. Por favor, recargue la página.");
}

// ✅ Si existe sesión, solo actualizar votos (NO crear items)
// El backend ya creó los items automáticamente
```

---

#### **3.2 Remoción de Directores**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/composables/useVotacionRemocionDirectoresController.ts`

**Aplicar la misma solución que en apoderados**

---

### **ACCIÓN 4: Actualizar Lógica de `loadData` para Confiar en Sincronización Automática**

#### **4.1 Remoción de Apoderados**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`

**Problema actual:**
```typescript
// ❌ PROBLEMA: Estamos creando items en memoria si no existen
if (votacionStore.hasVotacion && votacionStore.items.length === 0 && candidatosFiltrados.length > 0) {
  // Crear items desde candidatos filtrados
  const items = candidatosFiltrados.map(...);
  votacionStore.sesionVotacion.items = items; // ❌ NO NECESARIO
}
```

**Solución:**
```typescript
// ✅ SOLUCIÓN: El backend ya creó los items automáticamente
// Si hay candidatos marcados pero no hay items, significa que:
// 1. El backend aún no ha sincronizado (esperar y recargar)
// 2. Hay un error de sincronización (mostrar error)

if (votacionStore.hasVotacion && votacionStore.items.length === 0 && candidatosFiltrados.length > 0) {
  console.warn(
    "[VotacionRemocionApoderados] ⚠️ Hay candidatos marcados pero no hay items de votación. " +
    "El backend debería haber creado los items automáticamente. Recargando..."
  );
  // Recargar votación (el backend debería haber creado los items)
  await votacionStore.loadVotacion(societyId.value, flowId.value);
  
  // Si aún no hay items después de recargar, hay un problema
  if (votacionStore.items.length === 0) {
    throw new Error(
      "Los items de votación no se crearon automáticamente. " +
      "Por favor, verifique que los apoderados estén correctamente marcados."
    );
  }
}
```

---

#### **4.2 Remoción de Directores**

**Aplicar la misma solución que en apoderados**

---

### **ACCIÓN 5: Actualizar `guardarVotacion` para NO Crear Items**

#### **5.1 Remoción de Apoderados**

**Archivo:** `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`

**Problema actual:**
```typescript
// ❌ PROBLEMA: Estamos creando sesión e items si no existen
if (!existeEnBackend) {
  await votacionStore.createVotacion(...); // ❌ NO NECESARIO
  for (let i = 1; i < items.length; i++) {
    await votacionStore.addVoteItemConVotos(...); // ❌ NO NECESARIO
  }
}
```

**Solución:**
```typescript
// ✅ SOLUCIÓN: El backend ya creó la sesión y los items automáticamente
// Solo necesitamos actualizar los votos

if (!existeEnBackend) {
  // Si no existe sesión, verificar si hay candidatos marcados
  const candidatosFiltrados = remocionStore.candidatos.filter((c) => c.isCandidate === true);
  if (candidatosFiltrados.length === 0) {
    throw new Error("No hay apoderados seleccionados para remoción.");
  }
  
  // El backend debería haber creado la sesión automáticamente
  // Intentar recargar una vez más
  await votacionStore.loadVotacion(societyId.value, flowId.value);
  
  if (!votacionStore.hasVotacion) {
    throw new Error(
      "La sesión de votación no existe. " +
      "El backend debería haberla creado automáticamente al marcar los apoderados. " +
      "Por favor, recargue la página o contacte al administrador."
    );
  }
}

// ✅ Si existe sesión, solo actualizar votos (NO crear items)
// El backend ya creó los items automáticamente
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  if (!item) continue;

  // ✅ Solo actualizar votos, NO crear items
  await votacionStore.updateItemConVotos(
    societyId.value,
    flowId.value,
    item.id,
    item.label,
    item.descripción,
    item.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION,
    item.votos.map((v) => ({
      id: v.id,
      accionistaId: v.accionistaId,
      valor: v.valor,
    }))
  );
}
```

---

#### **5.2 Remoción de Directores**

**Aplicar la misma solución que en apoderados**

---

### **ACCIÓN 6: (Opcional) Usar Campos Nuevos en el Frontend**

#### **6.1 Actualizar Lógica para Usar `isRemovalCandidate` en lugar de `isCandidate`**

**Archivos:**
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/composables/useRemocionDirectoresPage.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/composables/useVotacionRemocionDirectoresController.ts`

**Cambios:**
```typescript
// ❌ ANTES: Usar campo de compatibilidad
checked: candidato.isCandidate || false

// ✅ DESPUÉS: Usar campo nuevo (con fallback a compatibilidad)
checked: candidato.isRemovalCandidate ?? candidato.isCandidate ?? false
```

---

#### **6.2 Mostrar Estado de Votación usando `removalStatus`**

**Opcional:** Agregar UI para mostrar el estado de votación:
- `PENDIENTE_VOTACION` → "Pendiente de votación"
- `REMOVIDO` → "Removido exitosamente"
- `NO_REMOVIDO` → "No removido"

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Actualizar DTOs y Mappers** (Prioridad: Alta)

- [ ] Agregar campos nuevos a `RemovalAttorneyResponseDTO`
- [ ] Agregar campos nuevos a `RemovalDirectorResponseDTO`
- [ ] Actualizar `RemovalDirectorMapper` para mapear campos nuevos
- [ ] Verificar/crear mapper para apoderados y mapear campos nuevos

---

### **Fase 2: Eliminar Creación Manual de VoteItems** (Prioridad: Crítica) ⚠️

- [ ] Eliminar `createVotacion` en `useVotacionRemocionApoderadosController`
- [ ] Eliminar `addVoteItemConVotos` en `useVotacionRemocionApoderadosController`
- [ ] Eliminar `createVotacion` en `useVotacionRemocionDirectoresController`
- [ ] Eliminar `addVoteItemConVotos` en `useVotacionRemocionDirectoresController`
- [ ] Actualizar `loadData` para confiar en sincronización automática
- [ ] Actualizar `guardarVotacion` para solo actualizar votos (NO crear items)

---

### **Fase 3: Actualizar Lógica para Usar Campos Nuevos** (Prioridad: Media)

- [ ] Actualizar `useRemocionApoderadosPage` para usar `isRemovalCandidate`
- [ ] Actualizar `useRemocionDirectoresPage` para usar `isRemovalCandidate`
- [ ] Actualizar controllers de votación para usar `isRemovalCandidate`
- [ ] (Opcional) Agregar UI para mostrar `removalStatus`

---

## 🎯 RESULTADO ESPERADO

Después de implementar estas acciones:

1. ✅ **El frontend confía en la sincronización automática del backend**
2. ✅ **No se crean VoteItems manualmente**
3. ✅ **Los DTOs incluyen campos nuevos**
4. ✅ **Los mappers mapean campos nuevos**
5. ✅ **El frontend puede usar campos nuevos (opcional)**
6. ✅ **Ambas funcionalidades (apoderados y directores) funcionan idénticamente**

---

## ⚠️ NOTAS IMPORTANTES

1. **Sincronización Automática:**
   - El backend crea VoteItems automáticamente al marcar (`CANDIDATO`)
   - El backend desactiva VoteItems automáticamente al desmarcar (`DESMARCAR`)
   - El frontend NO debe crear VoteItems manualmente

2. **Campos Nuevos:**
   - Son opcionales (el backend los devuelve, pero podemos seguir usando campos de compatibilidad)
   - Son más descriptivos y claros
   - Recomendado usarlos para mejor UX

3. **Compatibilidad:**
   - Los campos de compatibilidad (`isCandidate`, `candidateStatus`) siguen funcionando
   - Podemos usar ambos (nuevos y compatibilidad) con fallback

---

## 🚀 SIGUIENTE PASO

Una vez aprobado este plan, proceder con la implementación en el orden de prioridad:
1. Fase 1: Actualizar DTOs y Mappers
2. Fase 2: Eliminar creación manual de VoteItems (CRÍTICO)
3. Fase 3: Actualizar lógica para usar campos nuevos (opcional)

