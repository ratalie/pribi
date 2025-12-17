# ✅ VERIFICACIÓN: Remociones Versión Simplificada

**Fecha:** Enero 2025  
**Objetivo:** Confirmar que la implementación está alineada con la versión simplificada del backend

---

## 📋 Documentación de Referencia

**Backend Simplificado:** `docs/backend/correciones/REMOCIONES-SIMPLIFICADO.md`

### **Solo 3 Campos Necesarios:**
1. `isCandidate: boolean` - ¿Está marcado/seleccionado?
2. `candidateStatus: string | null` - Estado actual
3. `flowActionId: string | null` - ID del FlowAction

---

## ✅ VERIFICACIÓN COMPLETA

### **1. DTOs (Data Transfer Objects)**

#### **✅ RemovalAttorneyResponseDTO**
- ✅ `isCandidate: boolean` - Presente
- ✅ `candidateStatus: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null` - Presente
- ✅ `flowActionId: string | null` - Presente
- ⚠️ Campos nuevos (`isRemovalCandidate`, `isRemoved`, `removalStatus`) - Opcionales, no se usan

**Archivo:** `app/core/hexag/juntas/application/dtos/removal-attorney.dto.ts`

#### **✅ RemovalDirectorResponseDTO**
- ✅ `isCandidate: boolean` - Presente
- ✅ `candidateStatus?: "CANDIDATE" | "REMOVED" | "ELECTED" | "NOT_ELECTED" | null` - Presente
- ✅ `flowActionId?: string | null` - Presente
- ⚠️ Campos nuevos (`isRemovalCandidate`, `isRemoved`, `removalStatus`) - Opcionales, no se usan

**Archivo:** `app/core/hexag/juntas/application/dtos/removal-director.dto.ts`

---

### **2. Mappers**

#### **✅ RemovalAttorneyMapper**
- ✅ Mapea `isCandidate` desde `backendData.isCandidate`
- ✅ Mapea `candidateStatus` desde `backendData.candidateStatus` o `flowActions[0].candidateStatus`
- ✅ Mapea `flowActionId` desde `flowActions[0].id`
- ✅ NO intenta mapear campos nuevos que no existen en el backend

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/removal-attorney.mapper.ts`

#### **✅ RemovalDirectorMapper**
- ✅ Mapea `isCandidate` desde `backendData.isCandidate`
- ✅ Mapea `candidateStatus` desde `backendData.candidateStatus` o `flowActions[0].candidateStatus`
- ✅ Mapea `flowActionId` desde `flowActions[0].id`
- ✅ NO intenta mapear campos nuevos que no existen en el backend

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/removal-director.mapper.ts`

---

### **3. Endpoints PUT**

#### **✅ Remoción de Apoderados**
- ✅ Endpoint: `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney`
- ✅ Body: `{ attorneyId: string, candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR" }`
- ✅ Implementado en: `RemovalAttorneyHttpRepository.createCandidate()`

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/removal-attorney.http.repository.ts`

#### **✅ Remoción de Directores**
- ✅ Endpoint: `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director`
- ✅ Body: `{ directorId: string, candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR" }`
- ✅ Implementado en: `RemovalDirectorHttpRepository.createCandidate()`

**Archivo:** `app/core/hexag/juntas/infrastructure/repositories/removal-director.http.repository.ts`

---

### **4. Uso en Frontend**

#### **✅ Stores**
- ✅ `useRemocionApoderadosStore` usa `isCandidate` para verificar si está marcado
- ✅ `useRemocionDirectoresStore` usa `isCandidate` para verificar si está marcado
- ✅ Ambos stores usan `candidateStatus` para determinar el estado

**Archivos:**
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/stores/useRemocionDirectoresStore.ts`

#### **✅ Composables de Selección**
- ✅ `useRemocionApoderadosPage` usa `candidato.isCandidate` para marcar checkboxes
- ✅ `useRemocionDirectoresPage` usa `candidato.isCandidate` para marcar checkboxes
- ✅ Ambos usan `actualizarEstado()` con `candidatoEstado: "CANDIDATO" | "DESMARCAR"`

**Archivos:**
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/composables/useRemocionDirectoresPage.ts`

#### **✅ Controllers de Votación**
- ✅ `useVotacionRemocionApoderadosController` filtra por `c.isCandidate === true`
- ✅ `useVotacionRemocionDirectoresController` filtra por `c.isCandidate === true`
- ✅ Ambos actualizan estado con `"ELEGIDO"` o `"NO_ELEGIDO"` después de votar

**Archivos:**
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-directores/votacion/composables/useVotacionRemocionDirectoresController.ts`

---

### **5. Flujo Completo Verificado**

#### **✅ Paso 1: Marcar para Remoción**
```typescript
// Frontend envía:
PUT /removal-attorney { attorneyId: "uuid", candidatoEstado: "CANDIDATO" }
PUT /removal-director { directorId: "uuid", candidatoEstado: "CANDIDATO" }

// Backend devuelve (GET):
{ isCandidate: true, candidateStatus: "CANDIDATE", flowActionId: "uuid" }

// ✅ Frontend usa: candidato.isCandidate === true
```

#### **✅ Paso 2: Votar**
```typescript
// Frontend envía:
PUT /votes { contexto: "REMOCION_APODERADOS" | "REMOCION_DIRECTORES", items: [...] }

// ✅ El backend crea VoteItems automáticamente (sincronización automática)
// ✅ El frontend NO crea VoteItems manualmente
```

#### **✅ Paso 3: Actualizar Resultado**
```typescript
// Frontend envía:
PUT /removal-attorney { attorneyId: "uuid", candidatoEstado: "ELEGIDO" | "NO_ELEGIDO" }
PUT /removal-director { directorId: "uuid", candidatoEstado: "ELEGIDO" | "NO_ELEGIDO" }

// Backend devuelve (GET):
{ isCandidate: true, candidateStatus: "ELECTED" | "NOT_ELECTED", flowActionId: "uuid" }

// ✅ Frontend interpreta:
// - candidateStatus === "ELECTED" → Removido
// - candidateStatus === "NOT_ELECTED" → No removido
```

#### **✅ Paso 4: Desmarcar**
```typescript
// Frontend envía:
PUT /removal-attorney { attorneyId: "uuid", candidatoEstado: "DESMARCAR" }
PUT /removal-director { directorId: "uuid", candidatoEstado: "DESMARCAR" }

// Backend devuelve (GET):
{ isCandidate: false, candidateStatus: null, flowActionId: null }

// ✅ Frontend usa: candidato.isCandidate === false
```

---

## ✅ RESUMEN DE VERIFICACIÓN

| Componente | Estado | Notas |
|-----------|--------|-------|
| **DTOs** | ✅ Correcto | Tienen los 3 campos necesarios |
| **Mappers** | ✅ Correcto | Solo mapean los 3 campos del backend |
| **Repositorios** | ✅ Correcto | PUT endpoints funcionan correctamente |
| **Stores** | ✅ Correcto | Usan `isCandidate` y `candidateStatus` |
| **Composables** | ✅ Correcto | Usan `isCandidate` para checkboxes |
| **Controllers** | ✅ Correcto | Filtran por `isCandidate === true` |
| **Sincronización** | ✅ Correcto | Frontend NO crea VoteItems manualmente |

---

## 🎯 CONCLUSIÓN

✅ **La implementación está completamente alineada con la versión simplificada del backend.**

- ✅ Solo se usan los 3 campos necesarios: `isCandidate`, `candidateStatus`, `flowActionId`
- ✅ Los mappers solo mapean lo que el backend devuelve
- ✅ El frontend confía en la sincronización automática del backend
- ✅ Los endpoints PUT funcionan correctamente con `candidatoEstado`
- ✅ La lógica de estados es clara y simple

**🚀 Todo está listo para funcionar con el backend simplificado.**

