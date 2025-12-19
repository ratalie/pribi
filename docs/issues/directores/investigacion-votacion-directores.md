# 🔍 INVESTIGACIÓN: Votación de Directores - Nombramiento de Directores

**Fecha:** 2025-01-19  
**Estado:** 🔄 En investigación  
**Ruta actual:** `/operaciones/sociedades/6/junta-accionistas/4/nombramiento-directores/nombramiento`

---

## 📋 OBJETIVO

Conectar la vista de **Votación para la designación de directores** con el backend, implementando la lógica de votación acumulativa donde:

1. Se muestran los candidatos (directores con `isCandidate: true` y `directorRole: "TITULAR"`)
2. Cada accionista reparte sus votos entre los candidatos
3. Al final se seleccionan los directores con mayor voto según la cantidad configurada

---

## 🎯 FLUJO ACTUAL

### **1. Vista de Cantidad (`cantidad.vue`)**

- Permite configurar la cantidad de directores (opcional)
- Si se configura → se guarda en `directoryConfigStore.configuration.cantidadDirectores`
- Si no se configura → se usa el valor del snapshot

### **2. Vista de Nombramiento (`nombramiento.vue`)**

- Muestra directores del snapshot (read-only)
- Permite crear nuevos directores (candidatos)
- Sincroniza datos con `useDirectoresStore` para compartir con votación
- **Cantidad de directores** se obtiene de:
  ```typescript
  const cantidadDirectores = computed(() => {
    return snapshotStore.snapshot?.directory?.cantidadDirectores || 5;
  });
  ```
  ⚠️ **PROBLEMA:** No considera si se modificó en `cantidad.vue`

### **3. Vista de Votación (`votacion.vue`)**

- Usa componente `MetodoVotacionDirectorio`
- Tiene dos modos: **unanimidad** y **mayoría**
- Para **mayoría**: votación acumulativa donde cada accionista reparte votos
- Usa `useDirectoresStore` para obtener candidatos y cantidad

---

## 🔍 ANÁLISIS DE DATOS DEL BACKEND

### **GET `/designation-director` - Respuesta actual:**

```json
{
  "data": [
    {
      "id": "uuid-director-1",
      "directorId": "uuid-director-1",
      "person": { "nombre": "Yull", "apellidoPaterno": "Gasdfar", ... },
      "directorRole": "TITULAR",
      "isCandidate": true,  // ✅ Este es un candidato
      "candidateStatus": "CANDIDATE",
      "flowActionId": "uuid-flow-action-1"
    },
    {
      "id": "uuid-director-2",
      "directorId": "uuid-director-2",
      "person": { "nombre": "Carlos", ... },
      "directorRole": "TITULAR",
      "isCandidate": false,  // ❌ No es candidato (viene del snapshot)
      "candidateStatus": null
    }
  ]
}
```

**Candidatos para votación:**

- ✅ Directores con `isCandidate: true` y `directorRole: "TITULAR"`
- ✅ Estos son los que el usuario creó en la vista de nombramiento
- ❌ Directores del snapshot (`isCandidate: false`) NO entran a votación

---

## 📊 CANTIDAD DE DIRECTORES

### **Origen de la cantidad:**

1. **Si se modificó en `cantidad.vue`:**

   - Se guarda en: `directoryConfigStore.configuration.cantidadDirectores`
   - Endpoint: `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio`
   - Campo: `cantidadDirectores`

2. **Si NO se modificó:**
   - Se toma del snapshot: `snapshotStore.snapshot.directory.cantidadDirectores`
   - Este es el valor original de la sociedad (no cambia)

### **Lógica correcta:**

```typescript
const cantidadDirectores = computed(() => {
  // 1. Prioridad: Si se configuró en cantidad.vue
  if (directoryConfigStore.configuration?.cantidadDirectores) {
    return directoryConfigStore.configuration.cantidadDirectores;
  }

  // 2. Fallback: Snapshot (valor original de la sociedad)
  return snapshotStore.snapshot?.directory?.cantidadDirectores || 5;
});
```

---

## 🗳️ VOTACIÓN ACUMULATIVA (V2) ⚠️ CORREGIDO

### **⚠️ IMPORTANTE: Se usa V2, NO V1**

**Anteriormente se pensaba que era V1, pero en realidad se usa V2 con modo CUMULATIVE.**

### **Endpoint Backend (V2):**

```
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

### **Contexto y Modo:**

- **Contexto:** `"DESIGNACION_DIRECTORES"` (diferente a `"CONFIGURACION_DIRECTORIO"`)
- **Modo:** `"CUMULATIVE"` (votos numéricos acumulativos)

### **Flujo:**

1. **Obtener sesión de votación:**

   ```
   GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=DESIGNACION_DIRECTORES
   ```

2. **Crear votación acumulativa con items:**

```json
{
  "id": "uuid-sesion-obtenida-del-get",
  "contexto": "DESIGNACION_DIRECTORES",
  "modo": "CUMULATIVE",
  "items": [
    {
      "id": "uuid-item-1",
      "orden": 0,
      "label": "Juan Pérez García",
      "descripcion": "Candidato a director titular",
      "personaId": "uuid-persona-candidato-1",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-voto-1",
          "accionistaId": "uuid-accionista-1",
          "valor": 100
        },
        {
          "id": "uuid-voto-2",
          "accionistaId": "uuid-accionista-2",
          "valor": 50
        }
      ]
    },
    {
      "id": "uuid-item-2",
      "orden": 1,
      "label": "María López Sánchez",
      "descripcion": "Candidata a director titular",
      "personaId": "uuid-persona-candidato-2",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-voto-3",
          "accionistaId": "uuid-accionista-1",
          "valor": 50
        }
      ]
    }
  ]
}
```

### **Campos Explicados:**

- **`id`**: UUID de la sesión obtenido del GET anterior
- **`contexto`**: `"DESIGNACION_DIRECTORES"` (fijo para esta votación)
- **`modo`**: `"CUMULATIVE"` (votos numéricos acumulativos)
- **`items`**: Array con un item por cada candidato
  - **`id`**: UUID del item (generado frontend)
  - **`orden`**: Número de orden (0, 1, 2, ...)
  - **`label`**: Nombre del candidato
  - **`descripcion`**: Descripción opcional
  - **`personaId`**: ID de PersonV2 del candidato (opcional pero recomendado)
  - **`tipoAprobacion`**: `"SOMETIDO_A_VOTACION"` o `"APROBADO_POR_TODOS"`
  - **`votos`**: Array de votos acumulativos
    - **`id`**: UUID del voto (generado frontend)
    - **`accionistaId`**: UUID del accionista (ShareholderV2.id)
    - **`valor`**: **NÚMERO** de votos (ej: `100`, `50`, `200`) ⚠️ NO string

### **Lógica de votación:**

1. Cada accionista tiene X acciones con derecho a voto
2. Cada accionista reparte sus votos entre los candidatos (puede dar todos a uno o distribuir)
3. Se suman los votos por candidato
4. Los N candidatos con más votos son elegidos (donde N = cantidadDirectores)

---

## 🔄 FLUJO COMPLETO DE VOTACIÓN

### **Paso 1: Cargar candidatos**

```typescript
// GET /designation-director
const directores = await nombramientoStore.loadDirectoresDesignados(societyId, flowId);

// Filtrar solo candidatos (TITULAR + isCandidate: true)
const candidatos = directores.filter(
  (d) => d.directorRole === "TITULAR" && d.isCandidate === true
);
```

### **Paso 2: Cargar accionistas (votantes)**

```typescript
// Desde snapshot + asistencias
const votantes = mapearVotantesDesdeSnapshot(); // Accionistas que asistieron con sus acciones
```

### **Paso 3: Capturar votos**

- Cada accionista reparte sus votos entre los candidatos
- Validación: Total de votos repartidos = acciones con derecho a voto del accionista

### **Paso 4: Enviar votación al backend**

```typescript
// POST /v1/society-profile/:societyId/flow/:flowId/vote-count-director
await fetch(`/v1/society-profile/${societyId}/flow/${flowId}/vote-count-director`, {
  method: "POST",
  body: JSON.stringify({
    directorCount: cantidadDirectores,
    voteAgreementType: "SUBMITTED_TO_VOTES",
    votings: [
      {
        shareholderId: accionista.id,
        votes: candidatos.map((c) => ({
          directorId: c.id, // ID del DirectorFlowAction
          voteCount: votosAsignados[c.id] || 0,
        })),
      },
    ],
  }),
});
```

### **Paso 6: Calcular y marcar elegidos**

- Backend devuelve resultados o los calculamos en frontend
- Marcar directores elegidos con `PUT /designation-director`:

  ```typescript
  // Para cada director elegido
  await nombramientoStore.updateEstadoDirector(
    societyId,
    flowId,
    director.id, // designationId
    "ELEGIDO"
  );

  // Para los no elegidos
  await nombramientoStore.updateEstadoDirector(societyId, flowId, director.id, "NO_ELEGIDO");
  ```

---

## 🎯 VARIABLES CLAVE

### **1. Cantidad de Directores**

- **Origen:** `directoryConfigStore.configuration?.cantidadDirectores` O `snapshotStore.snapshot.directory.cantidadDirectores`
- **Uso:** Determina cuántos directores se elegirán al final

### **2. Candidatos**

- **Origen:** `GET /designation-director` → Filtrar `isCandidate: true` y `directorRole: "TITULAR"`
- **Uso:** Lista de directores entre los que se vota

### **3. Votantes (Accionistas)**

- **Origen:** Snapshot (shareholders) + Asistencias (quienes asistieron)
- **Cálculo:** Acciones con derecho a voto por accionista
- **Uso:** Cada uno reparte sus votos entre candidatos

### **4. Votos por Candidato**

- **Cálculo:** Suma de votos de todos los accionistas para cada candidato
- **Uso:** Determinar quiénes son elegidos (top N según cantidadDirectores)

---

## 📝 PREGUNTAS PENDIENTES

1. ✅ **¿La cantidad viene de cantidad.vue o snapshot?**

   - **Respuesta:** Prioridad a `directoryConfigStore.configuration?.cantidadDirectores`, fallback a `snapshotStore.snapshot.directory.cantidadDirectores`

2. ✅ **¿Quiénes son candidatos?**

   - **Respuesta:** Directores con `isCandidate: true` y `directorRole: "TITULAR"` (obtenidos de `GET /designation-director`)

3. ✅ **¿Qué endpoint se usa para la votación acumulativa?**

   - **Respuesta:** V2 con `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes`
   - **Contexto:** `"DESIGNACION_DIRECTORES"`
   - **Modo:** `"CUMULATIVE"` (votos numéricos)
   - **⚠️ NO se usa V1** `/vote-count-director`, se usa V2 con modo CUMULATIVE
   - **Cálculo:** El frontend debe calcular quiénes son elegidos (top N según cantidadDirectores) y marcarlos

4. ✅ **¿Cómo se obtienen las acciones con derecho a voto de cada accionista?**

   - **Respuesta:** Desde snapshot:
     - `snapshot.shareAllocations` → Asignaciones de acciones a accionistas
     - `snapshot.shareClasses` → Tipos de acciones (con `conDerechoVoto: true`)
     - Filtrar asignaciones cuyo `accionId` tenga `conDerechoVoto: true`
     - Sumar `cantidadSuscrita` para obtener total de votos del accionista

5. ❓ **¿Hay validaciones adicionales en el backend?**
   - **Ejemplo:** ¿El total de votos debe ser igual a las acciones del accionista?
   - **Estado:** Pendiente de verificar con el backend

---

## 🔍 ANÁLISIS DE COMPONENTES UI

### **1. UnanimidadVotacionDirectorio.vue**

- Muestra lista de candidatos con checkboxes
- Usuario selecciona hasta `cantidadDisponibles` candidatos
- Usa `directoresStore.directoresTitularesCandidatos` para obtener candidatos
- Usa `directoresStore.cantidadDisponibles` para el límite
- Envía candidatos seleccionados al store

### **2. MayoriaVotacionDirectorio.vue**

- Muestra tabla con accionistas y candidatos
- Cada accionista reparte sus votos entre los candidatos
- Validación: Total de votos asignados ≤ votos totales del accionista
- Calcula empate automáticamente cuando todos completan sus votos
- Usa datos hardcodeados actualmente (necesita conectar con snapshot)

### **3. Problemas identificados:**

1. **Cantidad de directores incorrecta:**

   - `nombramiento.vue` solo usa snapshot, no considera si se modificó en `cantidad.vue`
   - Necesita usar `directoryConfigStore.configuration?.cantidadDirectores` con fallback

2. **Accionistas hardcodeados:**

   - `votacion.vue` y `MayoriaVotacionDirectorio.vue` usan datos hardcodeados
   - Necesita obtener desde snapshot + asistencias

3. **Candidatos no conectados:**

   - `useDirectoresStore` espera datos desde `nombramiento.vue`
   - Los candidatos vienen de `GET /designation-director` pero no se están pasando correctamente

4. **Backend V1 no conectado:**
   - Falta implementar repository/use case para `POST /v1/society-profile/:societyId/flow/:flowId/vote-count-director`
   - Falta lógica para calcular elegidos y marcarlos como `ELEGIDO`

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Crear archivo de investigación (este documento)
2. ⏳ Corregir obtención de cantidad (priorizar directoryConfigStore sobre snapshot)
3. ⏳ Conectar candidatos desde `useNombramientoDirectoresStore` a la vista de votación
4. ⏳ Conectar accionistas desde snapshot + asistencias (similar a otras votaciones)
5. ✅ Repository/use case ya existe para V2 (usar el mismo de otras votaciones)
6. ⏳ Adaptar para usar contexto `"DESIGNACION_DIRECTORES"` y modo `"CUMULATIVE"`
7. ⏳ Implementar lógica para calcular elegidos (top N según cantidadDirectores)
8. ⏳ Implementar marcado de estados (ELEGIDO/NO_ELEGIDO) después de votar
9. ⏳ Conectar guardado completo cuando se hace click en "Siguiente"

---

## 📚 REFERENCIAS

- **Documentación Backend:** `docs/backend/directores-generales/guia nueva directores directorio.md`
- **Documentación Votación Acumulativa V2:** `docs/backend/directores-generales/FRONTEND-VOTACION-ACUMULATIVA-DIRECTORES-V2-COMPLETA.md`
- **Documentación Flujo Completo:** `docs/backend/directores-generales/FLUJO-COMPLETO-DIRECTORES-DIRECTORIO.md`
- **Vista Nombramiento:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/nombramiento.vue`
- **Vista Votación:** `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/nombramiento-directores/votacion.vue`
- **Store Directores:** `app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore.ts`

## ⚠️ CORRECCIONES IMPORTANTES

1. **NO se usa V1:** El endpoint `/v1/society-profile/:societyId/flow/:flowId/vote-count-director` NO se usa
2. **Se usa V2 con CUMULATIVE:** Usar `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes` con:
   - `contexto: "DESIGNACION_DIRECTORES"` (diferente a `"CONFIGURACION_DIRECTORIO"`)
   - `modo: "CUMULATIVE"` (votos numéricos)
3. **Valor del voto es NÚMERO:** El campo `valor` en los votos es un número (100, 50, 200), NO string
4. **PersonaId opcional:** El campo `personaId` en items es opcional pero recomendado (ID de PersonV2 del candidato)
5. **AccionistaId es ShareholderV2.id:** El `accionistaId` en votos debe ser `ShareholderV2.id`, NO `Person.id`

---

**Última actualización:** 2025-01-19

