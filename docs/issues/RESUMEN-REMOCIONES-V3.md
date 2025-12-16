# 📊 Resumen: Estado de Remociones en v3

**Fecha:** 2025-01-XX

---

## ✅ **1. REMOCIÓN DE GERENTE GENERAL**

### Estado: ✅ **CONECTADO AL BACKEND**

**Vista:** `remocion-gerente/votacion.vue`  
**Controller:** `useVotacionRemocionController.ts`  
**Contexto:** `REMOCION_GERENTE` ✅

**Flujo:**
```
1. Cargar votación → GET /votes?contexto=REMOCION_GERENTE
2. Votar → Estado local
3. Guardar → PUT /votes (con contexto REMOCION_GERENTE)
```

**✅ NO REQUIERE CAMBIOS**

---

## ⚠️ **2. REMOCIÓN DE APODERADOS**

### Estado: ⚠️ **VISTA LISTA, FALTA CONECTAR BACKEND**

**Vistas:**
- ✅ `remocion-apoderados/remocion.vue` - Selección implementada (muestra tabla con checkboxes)
- ✅ `remocion-apoderados/votacion.vue` - Votación múltiple implementada

**Controller:** `useVotacionRemocionApoderadosController.ts`  
**Contexto:** `REMOCION_APODERADOS` ✅ (existe en enum)

**Endpoints Backend (v2.5):**
- ✅ `GET /removal-attorney` - Listar apoderados
- ✅ `POST /removal-attorney` - Crear candidato
- ✅ `PUT /removal-attorney` - Actualizar estado
- ✅ `PUT /votes` - Guardar votación (con múltiples items)

**❌ FALTA CONECTAR:**

1. **Infrastructure:**
   - [ ] Crear `RemovalAttorneyHttpRepository`
   - [ ] Crear DTOs (request/response)
   - [ ] Crear mappers

2. **Application:**
   - [ ] Crear casos de uso (List, CreateCandidate, UpdateCandidate)

3. **Presentation:**
   - [ ] Crear `useRemocionApoderadosStore`
   - [ ] Conectar vista de selección → Guardar candidatos en backend
   - [ ] Conectar vista de votación → Guardar múltiples items en backend

**Flujo Completo Necesario:**
```
1. Seleccionar apoderados (checkboxes) → Guardar en store local
2. Al hacer "Siguiente" → POST /removal-attorney (crear candidatos)
3. Mostrar votación múltiple (una pregunta por apoderado)
4. Votar → Estado local (votos por item)
5. Al hacer "Siguiente" → PUT /votes (con múltiples items)
6. Actualizar estados → PUT /removal-attorney (ELEGIDO/NO_ELEGIDO)
```

---

## ❌ **3. REMOCIÓN DE DIRECTORES**

### Estado: ❌ **VISTA VACÍA, FALTA TODO**

**Vistas:**
- ❌ `remocion-directores/remocion.vue` - Vista vacía (solo BlankContainer)
- ❌ `remocion-directores/votacion.vue` - Vista vacía (solo BlankContainer)

**Contexto:** `REMOCION_DIRECTORES` ✅ (existe en enum)

**Endpoints Backend (v2.5):**
- ✅ `GET /removal-director` - Listar directores
- ✅ `POST /removal-director` - Crear candidato
- ✅ `PUT /removal-director` - Actualizar estado
- ✅ `GET /votes?contexto=REMOCION_DIRECTORES` - Cargar votación
- ✅ `PUT /votes` - Guardar votación (con múltiples items)

**❌ FALTA TODO:**

1. **Infrastructure:**
   - [ ] Crear `RemovalDirectorHttpRepository`
   - [ ] Crear DTOs (request/response)
   - [ ] Crear mappers

2. **Application:**
   - [ ] Crear casos de uso (List, CreateCandidate, UpdateCandidate)

3. **Presentation:**
   - [ ] Crear `useRemocionDirectoresStore`
   - [ ] Implementar vista de selección completa
   - [ ] Implementar vista de votación completa
   - [ ] Conectar todo al backend

**Flujo Completo Necesario:**
```
1. Cargar directores → GET /removal-director
2. Seleccionar directores (checkboxes) → Guardar en store local
3. Al hacer "Siguiente" → POST /removal-director (crear candidatos)
4. Mostrar votación múltiple (una pregunta por director)
5. Cargar votación existente → GET /votes?contexto=REMOCION_DIRECTORES
6. Votar → Estado local (votos por item)
7. Al hacer "Siguiente" → PUT /votes (con múltiples items)
8. Actualizar estados → PUT /removal-director (ELEGIDO/NO_ELEGIDO)
```

---

## 🎯 **DIFERENCIAS CLAVE**

### **Gerente General:**
- ✅ **Votación única** (una sola pregunta)
- ✅ Ya está conectado

### **Apoderados y Directores:**
- ⚠️ **Votaciones múltiples** (una pregunta por cada apoderado/director seleccionado)
- ⚠️ Requieren:
  1. Selección (checkboxes)
  2. Crear candidatos en backend (POST)
  3. Votación múltiple (múltiples items)
  4. Guardar votación (PUT con array de items)
  5. Actualizar estados (PUT con ELEGIDO/NO_ELEGIDO)

---

## 📋 **CHECKLIST RÁPIDO**

### **Remoción de Apoderados:**
- [ ] Crear repositorio HTTP
- [ ] Crear casos de uso
- [ ] Crear store
- [ ] Conectar selección al backend
- [ ] Conectar votación múltiple al backend

### **Remoción de Directores:**
- [ ] Crear repositorio HTTP
- [ ] Crear casos de uso
- [ ] Crear store
- [ ] Implementar vista de selección
- [ ] Implementar vista de votación
- [ ] Conectar todo al backend

---

## 🔗 **REFERENCIAS**

- **Plan detallado:** `docs/issues/PLAN-CONEXION-REMOCIONES-BACKEND.md`
- **Documentación backend:** `docs/issues/remociones/REGISTER-ASSEMBLY-REMOCION-COMPLETO-FRONTEND.md`
- **Contextos de votación:** `app/core/hexag/juntas/domain/enums/vote-context.enum.ts`

---

**Última actualización:** 2025-01-XX

