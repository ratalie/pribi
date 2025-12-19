# 🔍 INVESTIGACIÓN: FLUJO COMPLETO DE NUEVO DIRECTORIO

**Versión:** 1.0  
**Fecha:** 2025-01-19  
**Estado:** 🔍 **En Investigación**

---

## 📋 RESUMEN EJECUTIVO

**Objetivo:** Verificar el estado de implementación del flujo completo de "Nuevo Directorio" (`nombramiento-directorio`) y determinar qué falta o necesita ajustes.

**Flujo esperado:**
1. Configuración del directorio
2. Votación para la configuración del directorio
3. Designación de Directores
4. Votación para la designación
5. Presidente del directorio

---

## 📊 ESTADO ACTUAL DE CADA PASO

### **1. Configuración del Directorio** ✅ **IMPLEMENTADO**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/configuracion.vue`

**Características:**
- ✅ Switch `configurarDirectorio`
- ✅ 4 campos: `cantidadDirectores`, `duracionDirectorio`, `fechaInicio`, `fechaFin`
- ✅ Conectado a `useDirectoryConfigurationStore`
- ✅ Guarda con `PUT /directorio` incluyendo `configurarDirectorio: true/false`
- ✅ Schema de validación con Zod
- ✅ Prellenado de datos existentes

**Store utilizado:**
- `useDirectoryConfigurationStore` (compartido con nombramiento-directores)

**Estado:** ✅ **COMPLETO - Funciona correctamente**

---

### **2. Votación para la Configuración del Directorio** ✅ **IMPLEMENTADO**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/votacion-configuracion.vue`

**Características:**
- ✅ Usa `useVotacionConfiguracionController`
- ✅ Usa `useVotacionConfiguracionStore`
- ✅ Contexto: `CONFIGURACION_DIRECTORIO`
- ✅ Modo: `SIMPLE`
- ✅ Componente: `MetodoVotacio` (unanimidad/mayoría)
- ✅ Mensaje de unanimidad con los 4 campos (cantidad, duración, fechas)

**Controller:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directorio/votacion-configuracion/composables/useVotacionConfiguracionController.ts`
- ✅ Carga datos (snapshot, asistencias, configuración)
- ✅ Carga/crea sesión de votación
- ✅ Genera texto de votación con 4 campos
- ✅ Guarda votos (unanimidad/mayoría)

**Store:** `app/core/presentation/juntas/puntos-acuerdo/nombramiento-directorio/votacion-configuracion/stores/useVotacionConfiguracionStore.ts`
- ✅ Gestión de sesión de votación
- ✅ Create/Update votación
- ✅ Agregar votos individuales

**Estado:** ✅ **COMPLETO - Funciona correctamente**

---

### **3. Designación de Directores** ❌ **NECESITA CONEXIÓN AL BACKEND**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/directores.vue`

**Problemas detectados:**
- ❌ **Datos hardcodeados** (líneas 192-244): `directoresData` tiene datos estáticos
- ❌ **Cards de información hardcodeadas** (líneas 12, 22, 31, 35): Cantidad, duración y fechas están hardcodeadas
- ❌ **No conectado al backend**: No usa `useNombramientoDirectoresStore` ni `useNombramientoDirectoresPage`
- ❌ **No carga configuración**: No muestra datos reales de `useDirectoryConfigurationStore`
- ❌ **No crea directores**: Los handlers `handleDirectorSaved` y `handleSuplenteAlternoSaved` solo modifican el array local

**Lo que debe hacer:**
- ✅ Cargar configuración del directorio (cantidad, duración, fechas)
- ✅ Cargar directores designados desde backend (`GET /designation-director`)
- ✅ Crear nuevos directores (`POST /designation-director`)
- ✅ Actualizar directores existentes (`PUT /designation-director`)
- ✅ Eliminar directores (`DELETE /designation-director`)
- ✅ Mostrar directores del snapshot (si los hay) + directores nuevos
- ✅ Permitir crear titulares, suplentes y alternos

**Store a usar:**
- `useNombramientoDirectoresStore` (compartido con nombramiento-directores)
- `useDirectoryConfigurationStore` (para mostrar configuración)

**Composable a usar:**
- `useNombramientoDirectoresPage` (similar al usado en nombramiento-directores, pero adaptado para nuevo directorio)

**Estado:** ❌ **NECESITA IMPLEMENTACIÓN**

---

### **4. Votación para la Designación** ⚠️ **PARCIALMENTE IMPLEMENTADO**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/votacion.vue`

**Problemas detectados:**
- ⚠️ Solo mapea accionistas desde snapshot (líneas 70-163)
- ⚠️ No usa controller ni store específico
- ⚠️ No carga votación existente
- ⚠️ No tiene lógica de guardado
- ⚠️ Usa componente `MetodoVotacionDirectorio` pero sin lógica completa

**Lo que debe hacer:**
- ✅ Cargar candidatos desde `useNombramientoDirectoresStore`
- ✅ Cargar votación existente (contexto: `DESIGNACION_DIRECTORES`, modo: `CUMULATIVO`)
- ✅ Cargar votos guardados y mostrarlos
- ✅ Guardar votación (usando operaciones `updateVote` con `addVote`/`updateVote`/`removeVote`)
- ✅ Calcular elegidos
- ✅ Actualizar estados (ELEGIDO/NO_ELEGIDO)

**Controller a usar:**
- **OPCIÓN 1:** Reutilizar `useVotacionDirectoresController` (compartido con nombramiento-directores)
- **OPCIÓN 2:** Crear `useVotacionDirectoresNuevoDirectorioController` específico

**Store a usar:**
- `useVotacionDirectoresStore` (compartido, contexto: `DESIGNACION_DIRECTORES`)

**Estado:** ⚠️ **NECESITA IMPLEMENTACIÓN COMPLETA**

---

### **5. Presidente del Directorio** ❌ **NECESITA CONEXIÓN AL BACKEND**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/presidente.vue`

**Problemas detectados:**
- ❌ Usa `nombrePresidente` (string) en lugar de `presidenteId` (línea 25)
- ❌ No está conectado al backend (`useDirectoryConfigurationStore`)
- ❌ No carga datos reales de directores elegidos
- ❌ Lógica básica pero sin integración

**Lo que debe hacer:**
- ✅ Cargar directores elegidos desde `useNombramientoDirectoresStore`
- ✅ Cargar configuración del directorio para obtener `presidenteId` actual
- ✅ Mostrar opciones: elegidos + titulares del snapshot (en nuevo directorio SÍ hay titulares)
- ✅ Guardar presidente con `PUT /directorio` (campo `presidenteId`)
- ✅ Mostrar resultados de votación con estados: SELECCIONADO, NO SELECCIONADO, TITULAR

**Estado:** ❌ **NECESITA IMPLEMENTACIÓN**

---

## 🔄 COMPARACIÓN: NUEVO DIRECTORIO vs NOMBRAMIENTO DIRECTORES

| Paso | Nuevo Directorio | Nombramiento Directores | Estado |
|------|------------------|------------------------|--------|
| **1. Configuración** | 4 campos (cantidad, duración, fechas) | 1 campo (cantidad) | ✅ Ambos OK |
| **2. Votación Configuración** | ✅ Implementado | ✅ Implementado | ✅ Ambos OK |
| **3. Designación Directores** | ❌ Datos hardcodeados | ✅ Conectado al backend | ❌ Falta en nuevo directorio |
| **4. Votación Designación** | ⚠️ Incompleto | ✅ Implementado | ⚠️ Falta en nuevo directorio |
| **5. Presidente** | ❌ Sin conexión backend | ✅ Conectado (acabamos de arreglar) | ❌ Falta en nuevo directorio |

---

## 📝 PLAN DE IMPLEMENTACIÓN

### **Paso 1: Designación de Directores (`directores.vue`)** ❌ **PRIORITARIO**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/directores.vue`

**Tareas:**
1. Reemplazar datos hardcodeados por carga desde backend
2. Conectar a `useNombramientoDirectoresPage` (reutilizar de nombramiento-directores)
3. Cargar configuración del directorio para mostrar en cards
4. Implementar creación de directores (POST)
5. Implementar actualización de directores (PUT)
6. Implementar eliminación de directores (DELETE)
7. Mostrar directores del snapshot + nuevos designados
8. Permitir crear titulares, suplentes y alternos

**Composable a usar:**
- `useNombramientoDirectoresPage` (ya existe, reutilizable)

**Store a usar:**
- `useNombramientoDirectoresStore` (ya existe)
- `useDirectoryConfigurationStore` (ya existe)

---

### **Paso 2: Votación para la Designación (`votacion.vue`)** ⚠️ **PRIORITARIO**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/votacion.vue`

**Tareas:**
1. Conectar a `useVotacionDirectoresController` (reutilizar)
2. Cargar candidatos desde `useNombramientoDirectoresStore`
3. Cargar votación existente (contexto: `DESIGNACION_DIRECTORES`, modo: `CUMULATIVO`)
4. Mostrar votos guardados
5. Guardar votación con operaciones correctas (`updateVote` con `addVote`/`updateVote`/`removeVote`)
6. Calcular elegidos
7. Actualizar estados (ELEGIDO/NO_ELEGIDO)

**Controller a usar:**
- `useVotacionDirectoresController` (ya existe, reutilizable)

**Store a usar:**
- `useVotacionDirectoresStore` (ya existe)
- `useDirectoresStore` (para UI, ya existe)

---

### **Paso 3: Presidente del Directorio (`presidente.vue`)** ❌ **IMPORTANTE**

**Archivo:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directorio/presidente.vue`

**Tareas:**
1. Cambiar `nombrePresidente` a `presidenteId`
2. Conectar a `useDirectoryConfigurationStore` para cargar/guardar
3. Conectar a `useNombramientoDirectoresStore` para obtener elegidos
4. Mostrar opciones: elegidos + titulares del snapshot (en nuevo directorio SÍ hay titulares)
5. Guardar presidente con `PUT /directorio` (campo `presidenteId`)
6. Mostrar resultados con estados: SELECCIONADO, NO SELECCIONADO, TITULAR

**Diferencias con nombramiento-directores:**
- En nuevo directorio: SÍ hay titulares del snapshot (se muestran)
- En nombramiento-directores: NO hay titulares del snapshot (solo elegidos)

**Estado esperado en resultados:**
- SELECCIONADO (elegidos)
- NO SELECCIONADO (no elegidos)
- TITULAR (titulares del snapshot - solo en nuevo directorio)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **1. Designación de Directores (`directores.vue`)** ❌

- [ ] Eliminar datos hardcodeados
- [ ] Conectar a `useNombramientoDirectoresPage`
- [ ] Cargar configuración del directorio (cantidad, duración, fechas) para mostrar en cards
- [ ] Cargar directores desde backend (`GET /designation-director`)
- [ ] Implementar creación de directores (`POST /designation-director`)
- [ ] Implementar actualización de directores (`PUT /designation-director`)
- [ ] Implementar eliminación de directores (`DELETE /designation-director`)
- [ ] Mostrar directores del snapshot + nuevos designados
- [ ] Permitir crear titulares, suplentes y alternos
- [ ] Conectar modales `DesignarDirectorModal` y `DesignarSuplenteAlternoModal` al backend

### **2. Votación para la Designación (`votacion.vue`)** ⚠️

- [ ] Conectar a `useVotacionDirectoresController`
- [ ] Cargar candidatos desde store
- [ ] Cargar votación existente (si hay)
- [ ] Mostrar votos guardados en UI
- [ ] Guardar votación con operaciones correctas
- [ ] Calcular elegidos
- [ ] Actualizar estados (ELEGIDO/NO_ELEGIDO)
- [ ] Manejar unanimidad y mayoría

### **3. Presidente del Directorio (`presidente.vue`)** ❌

- [ ] Cambiar `nombrePresidente` a `presidenteId`
- [ ] Conectar a `useDirectoryConfigurationStore`
- [ ] Conectar a `useNombramientoDirectoresStore`
- [ ] Mostrar opciones: elegidos + titulares del snapshot
- [ ] Guardar presidente con `PUT /directorio`
- [ ] Mostrar resultados con 3 estados (SELECCIONADO, NO SELECCIONADO, TITULAR)

---

## 📚 REFERENCIAS Y ARCHIVOS A REUTILIZAR

### **Composables Reutilizables:**
- ✅ `useNombramientoDirectoresPage` (designación de directores)
- ✅ `useVotacionDirectoresController` (votación de designación)
- ✅ `useDirectoryConfigurationStore` (configuración)

### **Stores Reutilizables:**
- ✅ `useNombramientoDirectoresStore` (gestión de directores)
- ✅ `useVotacionDirectoresStore` (votación de designación)
- ✅ `useDirectoresStore` (UI de votación)

### **Componentes Reutilizables:**
- ✅ `DesignarDirectorModal` (crear/editar directores)
- ✅ `DesignarSuplenteAlternoModal` (crear/editar suplentes/alternos)
- ✅ `MetodoVotacionDirectorio` (votación acumulativa)
- ✅ `MayoriaVotacionDirectorio` (votación por mayoría)
- ✅ `UnanimidadVotacionDirectorio` (votación por unanimidad)

---

## 🎯 RESUMEN DE ESTADO

| Paso | Estado | Acción Requerida |
|------|--------|------------------|
| **1. Configuración** | ✅ Completo | Ninguna |
| **2. Votación Configuración** | ✅ Completo | Ninguna |
| **3. Designación Directores** | ❌ No implementado | **IMPLEMENTAR** - Conectar al backend |
| **4. Votación Designación** | ⚠️ Parcial | **COMPLETAR** - Conectar controller y store |
| **5. Presidente** | ❌ No implementado | **IMPLEMENTAR** - Conectar al backend |

---

## 📊 DIFERENCIAS CLAVE: NUEVO DIRECTORIO vs NOMBRAMIENTO DIRECTORES

| Aspecto | Nuevo Directorio | Nombramiento Directores |
|---------|------------------|------------------------|
| **Configuración** | 4 campos (cantidad, duración, fechas) | 1 campo (cantidad) |
| **Titulares del Snapshot** | ✅ Sí (se muestran) | ❌ No (todo es nuevo) |
| **Candidatos** | Pueden ser nuevos O del snapshot | ✅ Solo nuevos |
| **Estados en Resultados (Presidente)** | 3 estados (SELECCIONADO, NO SELECCIONADO, TITULAR) | 2 estados (SELECCIONADO, NO SELECCIONADO) |
| **Opciones de Presidente** | Elegidos + Titulares del snapshot | Solo elegidos |
| **Suplentes y Alternos** | ✅ Sí (se pueden crear) | ❌ No (solo titulares) |

---

**Última actualización:** 2025-01-19
