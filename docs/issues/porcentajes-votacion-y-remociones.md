# 📊 Investigación: Porcentajes de Votación y Estado de Remociones

**Fecha:** 2025-01-XX  
**Estado:** 🔍 En Investigación

---

## 🎯 PROBLEMA 1: Porcentajes No Funcionan en Aplicación de Resultados y Delegación de Auditores

### ✅ **Lo que funciona: Pronunciamiento de Gestión**

En `pronunciamiento-gestion`, el cálculo de porcentajes funciona correctamente porque:

1. **Controller calcula `accionesConDerechoVoto` correctamente:**
   ```typescript
   // useVotacionPronunciamientoController.ts
   function mapearVotantesDesdeSnapshot() {
     // ... cálculo desde snapshot
     return {
       id: asistencia.id,
       accionistaId: item.accionista.id,
       accionista: item.accionista,
       nombreCompleto: getNombreCompletoShareholder(item.accionista),
       tipoPersona: item.accionista.person.tipo,
       accionesConDerechoVoto: item.totalAccionesConDerechoVoto, // ✅ PRESENTE
     };
   }
   ```

2. **Se pasa correctamente a `MayoriaVotacion.vue`:**
   ```vue
   <!-- pronunciamiento-gestion/votacion.vue -->
   <MetodoVotacio
     :votantes="votantes"  <!-- ✅ Computed que incluye accionesConDerechoVoto -->
     :get-voto="getVoto"
   />
   ```

3. **`MayoriaVotacion.vue` usa `accionesConDerechoVoto` para calcular porcentajes:**
   ```typescript
   const getPorcentajeAFavor = (preguntaIndex: number) => {
     const totalAcciones = listaVotantes.value.reduce(
       (sum, votante) => sum + (votante.accionesConDerechoVoto || 0),
       0
     );
     // ...
   };
   ```

---

### ❌ **Lo que NO funciona: Aplicación de Resultados y Delegación de Auditores**

#### **Aplicación de Resultados**

**Ubicación:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/votacion/`

**Estado actual:**
- ✅ El controller (`useVotacionAplicacionResultadosController.ts`) **SÍ calcula** `accionesConDerechoVoto` correctamente (línea 179).
- ✅ El computed `votantes` **SÍ incluye** `accionesConDerechoVoto`.
- ✅ Se pasa a `MetodoVotacio` como prop `:votantes="votantes"`.

**⚠️ Posible problema:**
- El prop `votantes` es un `ComputedRef`, y `MetodoVotacio` podría no estar desenrollando el computed correctamente antes de pasarlo a `MayoriaVotacion`.

**Verificación necesaria:**
1. Verificar que `MetodoVotacio.vue` esté desenrollando el computed correctamente:
   ```vue
   <!-- MetodoVotacio.vue -->
   <MayoriaVotacion
     :votantes="votantesValue"  <!-- ¿Está desenrollando el computed? -->
   />
   ```

2. Verificar en consola del navegador que `listaVotantes` en `MayoriaVotacion.vue` tenga `accionesConDerechoVoto`:
   ```javascript
   console.log("[MayoriaVotacion] listaVotantes:", listaVotantes.value);
   // Debe mostrar: [{ ..., accionesConDerechoVoto: 100 }, ...]
   ```

#### **Delegación de Auditores**

**Ubicación:** `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/delegacion-auditores/votacion/`

**Estado actual:**
- ✅ El controller (`useVotacionAuditoresExternosController.ts`) **SÍ calcula** `accionesConDerechoVoto` correctamente (línea 180).
- ✅ El computed `votantes` **SÍ incluye** `accionesConDerechoVoto`.
- ✅ Se pasa a `MetodoVotacio` como prop `:votantes="votantes"`.

**⚠️ Mismo posible problema que Aplicación de Resultados.**

---

### 🔧 **Solución Propuesta**

**Opción 1: Verificar y corregir `MetodoVotacio.vue`**

Verificar que `MetodoVotacio.vue` esté desenrollando correctamente el computed:

```vue
<!-- MetodoVotacio.vue -->
<script setup lang="ts">
  // ...
  const votantesValue = computed(() => {
    if (typeof props.votantes === 'function') {
      return props.votantes();
    }
    if (props.votantes && typeof props.votantes === 'object' && 'value' in props.votantes) {
      return props.votantes.value; // ✅ Desenrollar ComputedRef
    }
    return props.votantes;
  });
</script>

<template>
  <MayoriaVotacion
    :votantes="votantesValue"
  />
</template>
```

**Opción 2: Agregar logs de debug**

Agregar logs en `MayoriaVotacion.vue` para verificar que `listaVotantes` tenga `accionesConDerechoVoto`:

```typescript
const listaVotantes = computed(() => {
  const votantes = props.votantes;
  console.log("[MayoriaVotacion] props.votantes:", votantes);
  console.log("[MayoriaVotacion] Tipo:", typeof votantes);
  
  // Desenrollar si es ComputedRef
  const votantesValue = typeof votantes === 'function' 
    ? votantes() 
    : (votantes && 'value' in votantes ? votantes.value : votantes);
  
  console.log("[MayoriaVotacion] votantesValue:", votantesValue);
  votantesValue?.forEach((v, i) => {
    console.log(`[MayoriaVotacion] Votante ${i}:`, {
      nombre: v.nombreCompleto,
      accionesConDerechoVoto: v.accionesConDerechoVoto, // ✅ Verificar que esté presente
    });
  });
  
  return votantesValue || [];
});
```

---

### 📝 **Nota sobre Delegación de Directores**

**⚠️ IMPORTANTE:** `nombramiento-directorio` usa un componente **completamente diferente** (`MayoriaVotacionDirectorio.vue`) que implementa votación **acumulativa** (asignación de votos numéricos a candidatos), NO votación por porcentajes.

Por lo tanto, **NO aplica el mismo fix**. Este componente tiene su propia lógica y no necesita `accionesConDerechoVoto` para porcentajes.

---

## 🎯 PROBLEMA 2: Investigación sobre Remociones

### 📋 **Estado Actual de Remociones en v3**

#### **1. Remoción de Gerente General**

**Ubicación:**
- Página: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-gerente/`
- Controller: `app/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/composables/useVotacionRemocionController.ts`
- Store: `app/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/stores/useVotacionRemocionStore.ts`

**Estado:** ✅ **Implementado**

**Endpoints Backend:**
- `GET /votes?contexto=REMOCION_GERENTE` - Obtener votación
- `PUT /votes` - Guardar/actualizar votación

**Flujo:**
1. Activar punto de agenda: `PUT /agenda-items` con `remocion.remocionGerenteGeneral: true`
2. Realizar votación (no hay endpoints para crear/listar candidatos, solo votación)

**Pasos para conectar:**
1. ✅ Verificar que el punto de agenda esté activado
2. ✅ Cargar votación existente (si existe)
3. ✅ Permitir votar (A_FAVOR, EN_CONTRA, ABSTENCION)
4. ✅ Guardar votación con contexto `REMOCION_GERENTE`

---

#### **2. Remoción de Apoderados**

**Ubicación:**
- Página: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/`
- Controller: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`
- Store: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts`

**Estado:** ⚠️ **Parcialmente Implementado**

**Endpoints Backend:**
- `GET /removal-attorney` - Listar apoderados disponibles para remoción
- `POST /removal-attorney` - Crear candidato a remoción
- `PUT /removal-attorney` - Actualizar estado de candidato (ELEGIDO, NO_ELEGIDO)

**⚠️ IMPORTANTE:** La remoción de apoderados **NO tiene un contexto de votación específico** como directores o gerente. Se maneja a través del sistema de poderes de representación.

**Pasos para conectar:**
1. ✅ Activar punto de agenda: `PUT /agenda-items` con `remocion.remocionApoderados: true`
2. ✅ Listar apoderados: `GET /removal-attorney`
3. ✅ Crear candidatos: `POST /removal-attorney` con `candidatoEstado: "CANDIDATO"` o `"DESIGNADO_DIRECTAMENTE"`
4. ⚠️ **FALTA:** Implementar votación (no hay contexto específico, verificar cómo se maneja)
5. ✅ Actualizar estado: `PUT /removal-attorney` con `candidatoEstado: "ELEGIDO"` o `"NO_ELEGIDO"`

**Notas:**
- Los apoderados se filtran del snapshot, excluyendo "Gerente General" y "Otros Apoderados"
- Solo se pueden remover apoderados que **ya existen** en el registro

---

#### **3. Remoción de Directores**

**Ubicación:**
- Página: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/`
- Store: (Verificar si existe store específico)

**Estado:** ⚠️ **Parcialmente Implementado**

**Endpoints Backend:**
- `GET /removal-director` - Listar directores disponibles para remoción
- `POST /removal-director` - Crear candidato a remoción
- `PUT /removal-director` - Actualizar estado de candidato (ELEGIDO, NO_ELEGIDO)
- `GET /votes?contexto=REMOCION_DIRECTORES` - Obtener votación
- `PUT /votes` - Guardar/actualizar votación

**Pasos para conectar:**
1. ✅ Activar punto de agenda: `PUT /agenda-items` con `remocion.remocionDirectores: true`
2. ✅ Listar directores: `GET /removal-director`
3. ✅ Crear candidatos: `POST /removal-director` con `candidatoEstado: "CANDIDATO"` o `"DESIGNADO_DIRECTAMENTE"`
4. ✅ Realizar votación: `GET /votes?contexto=REMOCION_DIRECTORES` y `PUT /votes`
5. ✅ Actualizar estado: `PUT /removal-director` con `candidatoEstado: "ELEGIDO"` o `"NO_ELEGIDO"`

**Notas:**
- Solo se pueden remover directores que **ya existen** en el directorio
- Los directores tienen estados: `CANDIDATO`, `REMOVED`, `ELECTED`, `NOT_ELECTED`

---

### 📊 **Resumen de Pasos para Conectar Cada Remoción**

#### **Remoción de Gerente General**

```
1. Activar punto de agenda
   PUT /agenda-items
   { remocion: { remocionGerenteGeneral: true } }

2. Cargar votación existente (si existe)
   GET /votes?contexto=REMOCION_GERENTE

3. Permitir votar
   - Usar componente MayoriaVotacion o UnanimidadVotacion
   - Guardar votos en store local

4. Guardar votación
   PUT /votes
   {
     contexto: "REMOCION_GERENTE",
     modo: "SIMPLE",
     items: [{ ... }]
   }
```

#### **Remoción de Apoderados**

```
1. Activar punto de agenda
   PUT /agenda-items
   { remocion: { remocionApoderados: true } }

2. Listar apoderados disponibles
   GET /removal-attorney

3. Seleccionar apoderados a remover
   - Mostrar tabla con apoderados del snapshot
   - Filtrar excluyendo "Gerente General" y "Otros Apoderados"

4. Crear candidatos a remoción
   POST /removal-attorney
   {
     attorneyId: "uuid",
     candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE"
   }

5. ⚠️ VERIFICAR: ¿Cómo se maneja la votación?
   - No hay contexto específico de votación
   - Posiblemente se maneja a través del sistema de poderes

6. Actualizar estado después de votación (si aplica)
   PUT /removal-attorney
   {
     attorneyId: "uuid",
     candidatoEstado: "ELEGIDO" | "NO_ELEGIDO"
   }
```

#### **Remoción de Directores**

```
1. Activar punto de agenda
   PUT /agenda-items
   { remocion: { remocionDirectores: true } }

2. Listar directores disponibles
   GET /removal-director

3. Seleccionar directores a remover
   - Mostrar tabla con directores existentes
   - Permitir seleccionar múltiples

4. Crear candidatos a remoción
   POST /removal-director
   {
     directorId: "uuid",
     candidatoEstado: "CANDIDATO" | "DESIGNADO_DIRECTAMENTE"
   }

5. Realizar votación
   GET /votes?contexto=REMOCION_DIRECTORES
   PUT /votes
   {
     contexto: "REMOCION_DIRECTORES",
     modo: "SIMPLE",
     items: [{ ... }]
   }

6. Actualizar estado después de votación
   PUT /removal-director
   {
     directorId: "uuid",
     candidatoEstado: "ELEGIDO" | "NO_ELEGIDO"
   }
```

---

### 🔍 **Archivos Clave para Revisar**

#### **Remoción de Gerente General**
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-gerente/votacion.vue`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/composables/useVotacionRemocionController.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-gerente/votacion/stores/useVotacionRemocionStore.ts`

#### **Remoción de Apoderados**
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/remocion.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/votacion.vue`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/composables/useVotacionRemocionApoderadosController.ts`
- `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/votacion/stores/useVotacionRemocionApoderadosStore.ts`

#### **Remoción de Directores**
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/remocion.vue`
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-directores/votacion.vue`
- (Verificar si existe controller/store específico)

---

### 📚 **Documentación de Referencia**

- Backend: `docs/issues/remociones/V25-DOCUMENTACION-BACKEND-NOMBRAMIENTO-REMOCION-GERENTES-APODERADOS.md`
- Frontend: `docs/issues/remociones/REGISTER-ASSEMBLY-REMOCION-COMPLETO-FRONTEND.md`

---

## ✅ **Próximos Pasos**

1. **Para Porcentajes:**
   - [ ] Verificar `MetodoVotacio.vue` desenrolla correctamente el computed
   - [ ] Agregar logs de debug en `MayoriaVotacion.vue` para verificar `accionesConDerechoVoto`
   - [ ] Corregir si es necesario

2. **Para Remociones:**
   - [ ] Revisar implementación actual de cada remoción
   - [ ] Verificar que todos los endpoints estén conectados
   - [ ] Completar flujos faltantes (especialmente votación de apoderados)
   - [ ] Agregar validaciones y manejo de errores

---

**Última actualización:** 2025-01-XX

