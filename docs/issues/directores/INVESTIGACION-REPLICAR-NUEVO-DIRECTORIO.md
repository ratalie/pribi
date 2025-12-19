# 🔍 INVESTIGACIÓN: REPLICAR FLUJO DE NUEVO DIRECTORIO EN NOMBRAMIENTO DE DIRECTORES

**Versión:** 1.0  
**Fecha:** 2025-01-19  
**Estado:** 🔍 **En Investigación**

---

## 📋 RESUMEN EJECUTIVO

**Objetivo:** Replicar el flujo completo de "Nuevo Directorio" (`nombramiento-directorio`) en "Nombramiento de Directores" (`nombramiento-directores`), adaptado a que **TODO es nuevo** (no hay titulares del snapshot, no hay suplentes, nada).

---

## 🎯 COMPARACIÓN DE FLUJOS

### **Flujo: Nuevo Directorio** (`nombramiento-directorio`)

```
1. index.vue                    → Vista general
2. configuracion.vue            → Configurar directorio (switch + 4 campos)
3. votacion-configuracion.vue   → Votación para aprobar configuración
4. directores.vue / designacion.vue → Designar directores (puede haber titulares del snapshot)
5. votacion.vue                 → Votación para la designación
6. presidente.vue               → Asignar presidente (muestra elegidos + titulares del snapshot)
7. resumen.vue                  → Resumen completo
```

**Características:**

- ✅ Hay directores del snapshot (titulares, suplentes, alternos)
- ✅ Puede haber directores ya existentes
- ✅ Configuración completa del directorio (4 campos: cantidad, duración, fechas)

---

### **Flujo: Nombramiento de Directores** (`nombramiento-directores`) - **ACTUAL**

```
1. index.vue                    → Vista general
2. cantidad.vue                 → Configurar cantidad (switch + campo cantidad)
3. votacion-cantidad.vue        → Votación para aprobar cantidad
4. nombramiento.vue             → Crear candidatos (TODO es nuevo)
5. votacion.vue                 → Votación acumulativa para elegir directores
6. presidente.vue               → Asignar presidente (actualmente muestra elegidos + titulares del snapshot)
7. resumen.vue                  → Resumen completo
```

**Características:**

- ✅ TODO es nuevo (no hay titulares del snapshot)
- ✅ Solo candidatos nuevos
- ✅ Solo cantidad de directores (no duración ni fechas)

---

## ✅ LO QUE YA FUNCIONA EN NOMBRAMIENTO-DIRECTORES

### **1. cantidad.vue** ✅

- Switch `configurarDirectorio`
- Campo `cantidadDirectores`
- Conectado a `useDirectoryConfigurationStore`
- Guarda con `PUT /directorio` incluyendo `configurarDirectorio: true/false`

### **2. votacion-cantidad.vue** ✅

- Votación para aprobar cantidad de directores
- Contexto: `CONFIGURACION_DIRECTORIO`
- Modo: `SIMPLE`
- Usa `useVotacionCantidadController` y `useVotacionCantidadStore`

### **3. nombramiento.vue** ✅

- Crea nuevos candidatos a directores
- Solo directores TITULARES (no suplentes ni alternos)
- Todo es nuevo (`isCandidate: true`)
- Usa `useNombramientoDirectoresStore`

### **4. votacion.vue** ✅

- Votación acumulativa (V2)
- Contexto: `DESIGNACION_DIRECTORES`
- Modo: `CUMULATIVO`
- Usa `useVotacionDirectoresController` y `useVotacionDirectoresStore`
- Calcula elegidos y actualiza estados

### **5. presidente.vue** ⚠️ **NECESITA AJUSTE**

- Actualmente muestra: elegidos + titulares del snapshot
- **Debe mostrar SOLO:** elegidos (todo es nuevo, no hay titulares del snapshot)
- Estados en resultados: SOLO "SELECCIONADO" y "NO SELECCIONADO" (sin "TITULAR")

### **6. resumen.vue** ❓ **NECESITA REVISAR**

- Necesita mostrar solo los directores elegidos (nuevos)
- Sin mencionar titulares del snapshot

---

## 🔧 DIFERENCIAS CLAVE A IMPLEMENTAR

### **Diferencia 1: Configuración del Directorio**

**Nuevo Directorio:**

- 4 campos: `cantidadDirectores`, `duracionDirectorio`, `fechaInicio`, `fechaFin`
- Switch: `configurarDirectorio`

**Nombramiento Directores (actual):**

- 1 campo: `cantidadDirectores`
- Switch: `configurarDirectorio`

**✅ Ya está implementado correctamente** - Solo necesitamos cantidad, no duración ni fechas.

---

### **Diferencia 2: Directores del Snapshot**

**Nuevo Directorio:**

- Usa `directoresDisponiblesDelSnapshot` (directores del snapshot filtrados)
- Puede haber titulares, suplentes, alternos ya existentes
- `opcionesPresidente` incluye: elegidos + titulares del snapshot

**Nombramiento Directores:**

- **NO debe usar** `directoresDisponiblesDelSnapshot`
- **NO hay** directores del snapshot (todo es nuevo)
- `opcionesPresidente` debe incluir: **SOLO elegidos**

**⚠️ AJUSTE NECESARIO EN:**

- `presidente.vue`: Remover lógica de titulares del snapshot

---

### **Diferencia 3: Estados en Resultados de Votación**

**Nuevo Directorio:**

- Estados: "SELECCIONADO", "NO SELECCIONADO", "TITULAR"
- Muestra tanto elegidos como titulares del snapshot

**Nombramiento Directores:**

- Estados: **SOLO** "SELECCIONADO", "NO SELECCIONADO"
- **NO debe mostrar** "TITULAR" (todo es nuevo)

**⚠️ AJUSTE NECESARIO EN:**

- `presidente.vue`: Remover estado "TITULAR" y lógica de titulares del snapshot

---

## 📝 PLAN DE IMPLEMENTACIÓN

### **Paso 1: Revisar y Ajustar `presidente.vue`**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/presidente.vue`

**Cambios necesarios:**

1. **`opcionesPresidente` computed:**

   ```typescript
   // ❌ ACTUAL: Incluye elegidos + titulares del snapshot
   const opcionesPresidente = computed(() => {
     const directoresElegidos = nombramientoStore.directoresTitularesCandidatos.filter(...);
     const titularesDelSnapshot = nombramientoStore.directoresDisponiblesDelSnapshot.filter(...);
     return [...directoresElegidos, ...titularesDelSnapshot];
   });

   // ✅ NUEVO: Solo elegidos (todo es nuevo)
   const opcionesPresidente = computed(() => {
     const directoresElegidos = nombramientoStore.directoresTitularesCandidatos.filter(
       (d) => d.candidateStatus === "ELECTED" || d.designationStatus === "ELEGIDO"
     );
     return directoresElegidos.map(...);
   });
   ```

2. **`candidatosConVotos` computed:**

   ```typescript
   // ❌ ACTUAL: Incluye candidatos + titulares del snapshot
   const candidatosConVotos = computed(() => {
     const directoresElegidos = nombramientoStore.directoresTitularesCandidatos;
     const titularesDelSnapshot = nombramientoStore.directoresDisponiblesDelSnapshot.filter(...);
     return [...candidatosMapeados, ...titularesMapeados];
   });

   // ✅ NUEVO: Solo candidatos (elegidos/no elegidos)
   const candidatosConVotos = computed(() => {
     const directoresElegidos = nombramientoStore.directoresTitularesCandidatos;
     // NO incluir titulares del snapshot
     return directoresElegidos.map(...);
   });
   ```

3. **`resultadosVotacion` computed:**

   ```typescript
   // ❌ ACTUAL: Incluye estado "TITULAR" para titulares del snapshot
   // ✅ NUEVO: Solo "SELECCIONADO" y "NO SELECCIONADO"
   // Remover lógica de titularesDelSnapshot
   // Remover estado "TITULAR"
   ```

4. **Estilos de estados:**
   ```typescript
   // ❌ ACTUAL: 3 estados (SELECCIONADO, NO SELECCIONADO, TITULAR)
   // ✅ NUEVO: 2 estados (SELECCIONADO, NO SELECCIONADO)
   // Remover estilo azul para "TITULAR"
   ```

---

### **Paso 2: Revisar `resumen.vue`**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/resumen.vue`

**Verificar:**

- ✅ Solo muestra directores elegidos (nuevos)
- ✅ NO menciona titulares del snapshot
- ✅ NO muestra suplentes ni alternos (solo titulares nuevos)

---

### **Paso 3: Verificar Navegación y Configuración**

**Archivo:** `app/config/juntas/sections.config.ts`

**Verificar secciones:**

```typescript
"nombramiento-directores": [
  { id: "nombramiento-directores", title: "Nombramiento de Directores", ... },
  { id: "cantidad", title: "Configuración del directorio", ... },
  { id: "votacion-cantidad", title: "Votación para la configuración del directorio", ... },
  { id: "nombramiento", title: "Designación de Directores", ... },
  { id: "votacion", title: "Votación para la designación", ... },
  { id: "presidente", title: "Presidente del directorio", ... },
  { id: "resumen", title: "Resumen", ... },
]
```

**✅ Ya está correcto**

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### **1. Ajustar `presidente.vue`** ⚠️ **PENDIENTE**

- [ ] Remover `titularesDelSnapshot` de `opcionesPresidente`
- [ ] Remover `titularesDelSnapshot` de `candidatosConVotos`
- [ ] Remover estado "TITULAR" de `resultadosVotacion`
- [ ] Remover estilo azul para "TITULAR"
- [ ] Verificar que solo muestra elegidos (candidateStatus: "ELECTED" o designationStatus: "ELEGIDO")

### **2. Revisar `resumen.vue`** ❓ **PENDIENTE**

- [ ] Verificar que solo muestra directores elegidos
- [ ] Verificar que NO menciona titulares del snapshot
- [ ] Verificar que NO muestra suplentes ni alternos

### **3. Verificar Funcionalidad Completa** ✅

- [ ] `cantidad.vue` funciona correctamente
- [ ] `votacion-cantidad.vue` funciona correctamente
- [ ] `nombramiento.vue` funciona correctamente (solo crea nuevos)
- [ ] `votacion.vue` funciona correctamente (votación acumulativa)
- [ ] `presidente.vue` muestra solo elegidos
- [ ] `resumen.vue` muestra resumen completo

---

## 📊 ARCHIVOS A MODIFICAR

### **1. `presidente.vue`** ⚠️ **PRINCIPAL**

**Ubicación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/presidente.vue`

**Cambios:**

- Simplificar `opcionesPresidente` (solo elegidos)
- Simplificar `candidatosConVotos` (solo candidatos, sin titulares del snapshot)
- Simplificar `resultadosVotacion` (solo 2 estados: SELECCIONADO/NO SELECCIONADO)
- Remover estilos para "TITULAR"

---

### **2. `resumen.vue`** ❓ **REVISAR**

**Ubicación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/resumen.vue`

**Verificar:**

- Que solo muestre directores elegidos
- Que no mencione titulares del snapshot

---

## 🔄 COMPARACIÓN CON NUEVO DIRECTORIO

| Aspecto                    | Nuevo Directorio                       | Nombramiento Directores               |
| -------------------------- | -------------------------------------- | ------------------------------------- |
| **Configuración**          | 4 campos (cantidad, duración, fechas)  | 1 campo (cantidad) ✅                 |
| **Titulares del Snapshot** | ✅ Sí (se muestran)                    | ❌ No (todo es nuevo)                 |
| **Candidatos**             | Pueden ser nuevos O del snapshot       | ✅ Solo nuevos                        |
| **Estados en Resultados**  | SELECCIONADO, NO SELECCIONADO, TITULAR | ✅ Solo SELECCIONADO, NO SELECCIONADO |
| **Opciones de Presidente** | Elegidos + Titulares del snapshot      | ✅ Solo elegidos                      |

---

## 📚 REFERENCIAS

- **Flujo Nuevo Directorio:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/`
- **Flujo Nombramiento Directores:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/`
- **Store de Configuración:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useDirectoryConfigurationStore.ts`
- **Store de Nombramiento:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useNombramientoDirectoresStore.ts`

---

## ✅ CONCLUSIÓN

**Lo que ya funciona:**

- ✅ Configuración de cantidad (cantidad.vue)
- ✅ Votación de configuración (votacion-cantidad.vue)
- ✅ Creación de candidatos (nombramiento.vue)
- ✅ Votación acumulativa (votacion.vue)

**Lo que falta:**

- ⚠️ Ajustar `presidente.vue` para que NO muestre titulares del snapshot
- ❓ Revisar `resumen.vue` para asegurar que solo muestre elegidos

**Cambios necesarios:** Solo en `presidente.vue` (simplificar lógica) y revisar `resumen.vue`.

---

**Última actualización:** 2025-01-19
