# 📋 GUÍA COMPLETA: REMOCIÓN DE APODERADOS Y DIRECTORES

## 🎯 Resumen Ejecutivo

Esta guía documenta el flujo completo para **remoción de apoderados** y **remoción de directores** en el sistema de juntas. El sistema incluye **sincronización automática** entre FlowActions y VoteItems, lo que significa que **no necesitas crear/eliminar VoteItems manualmente**.

---

## ✅ Características Principales

1. **Sincronización Automática**: Al marcar/desmarcar una entidad, el sistema crea/elimina automáticamente el VoteItem correspondiente
2. **Estados Claros**: Campos descriptivos (`isRemovalCandidate`, `isRemoved`, `removalStatus`)
3. **Votación Múltiple**: Cada entidad marcada tiene su propio VoteItem
4. **Sin Impacto en Registro**: Todos los cambios se realizan sobre el snapshot de la junta, no afectan el registro permanente

---

## 🔄 Flujo Completo: Remoción de Directores

### **Paso 1: Obtener Lista de Directores**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Remociones de directores listadas exitosamente.",
  "data": [
    {
      "id": "uuid-director-1",
      "person": {
        "id": "uuid-person-1",
        "type": "NATURAL",
        "natural": {
          "firstName": "Juan",
          "lastNamePaternal": "Pérez",
          "lastNameMaternal": "García"
        }
      },
      "directorRole": "TITULAR",
      "replacesId": null,

      // ✅ Campos de compatibilidad
      "isCandidate": false,
      "candidateStatus": null,
      "flowActionId": null,
      "flowActions": [],

      // ✅ Campos nuevos y descriptivos (para REMOVAL)
      "isRemovalCandidate": false, // true si está marcado para remoción
      "isRemoved": false, // true si ya fue votado
      "removalStatus": null // null | "PENDIENTE_VOTACION" | "REMOVIDO" | "NO_REMOVIDO"
    }
  ],
  "code": 200
}
```

**Estados posibles:**

| Estado                | `isRemovalCandidate` | `isRemoved` | `removalStatus`        | `candidateStatus` |
| --------------------- | -------------------- | ----------- | ---------------------- | ----------------- |
| No marcado            | `false`              | `false`     | `null`                 | `null`            |
| Marcado para remoción | `true`               | `false`     | `'PENDIENTE_VOTACION'` | `'CANDIDATE'`     |
| Removido exitosamente | `false`              | `true`      | `'REMOVIDO'`           | `'ELECTED'`       |
| No removido           | `false`              | `true`      | `'NO_REMOVIDO'`        | `'NOT_ELECTED'`   |

---

### **Paso 2: Marcar Director para Remoción**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
Content-Type: application/json

{
  "directorId": "uuid-director-1",
  "candidatoEstado": "CANDIDATO"
}
```

**Lo que sucede automáticamente:**

1. ✅ Se crea/activa `DirectorFlowAction` con:
   - `candidateStatus: CANDIDATE`
   - `status: true`

2. ✅ **Sincronización automática**: Se crea automáticamente un `VoteItem` en la sesión de votación con:
   - `label`: "¿Se aprueba la remoción del Director [Nombre]?"
   - `personId`: ID de la persona
   - `agreementType`: `SUBMITTED_TO_VOTES`
   - `order`: Siguiente orden disponible

**Respuesta:**

```json
{
  "success": true,
  "message": "Remocion de director actualizada exitosamente.",
  "code": 201
}
```

**⚠️ IMPORTANTE:** No necesitas crear el VoteItem manualmente. El sistema lo hace automáticamente.

---

### **Paso 3: Verificar que el VoteItem se Creó**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=REMOCION_DIRECTORES
```

**Respuesta:**

```json
{
  "id": "uuid-sesion-votacion",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-item-1",
      "orden": 0,
      "label": "¿Se aprueba la remoción del Director Juan Pérez García?",
      "personaId": "uuid-person-1",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": []
    }
  ]
}
```

**✅ El VoteItem está listo para recibir votos.**

---

### **Paso 4: Votar**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
Content-Type: application/json

{
  "contexto": "REMOCION_DIRECTORES",
  "items": [
    {
      "accion": "updateVote",
      "itemId": "uuid-item-1",
      "votos": [
        {
          "accion": "addVote",
          "id": "uuid-voto-1",
          "accionistaId": "uuid-accionista-1",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

---

### **Paso 5: Actualizar Resultado de la Votación**

Una vez que se completa la votación, actualiza el estado del director:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
Content-Type: application/json

{
  "directorId": "uuid-director-1",
  "candidatoEstado": "ELEGIDO"  // o "NO_ELEGIDO"
}
```

**Respuesta GET actualizada:**

```json
{
  "id": "uuid-director-1",
  "isRemovalCandidate": false,
  "isRemoved": true,
  "removalStatus": "REMOVIDO", // o "NO_REMOVIDO"
  "candidateStatus": "ELECTED" // o "NOT_ELECTED"
}
```

---

### **Paso 6: Desmarcar Director (si es necesario)**

Si necesitas desmarcar un director antes de votar:

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
Content-Type: application/json

{
  "directorId": "uuid-director-1",
  "candidatoEstado": "DESMARCAR"
}
```

**Lo que sucede automáticamente:**

1. ✅ Se desactiva `DirectorFlowAction` (`status: false`)
2. ✅ **Sincronización automática**: Se desactiva automáticamente el `VoteItem` correspondiente

**Respuesta GET actualizada:**

```json
{
  "id": "uuid-director-1",
  "isRemovalCandidate": false,
  "isRemoved": false,
  "removalStatus": null,
  "candidateStatus": null,
  "flowActionId": null
}
```

**✅ El VoteItem ya no aparece en las votaciones (status: false).**

---

## 🔄 Flujo Completo: Remoción de Apoderados

El flujo es **idéntico** al de remoción de directores, pero con estos cambios:

### **Endpoints**

- **GET**: `/api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney`
- **PUT**: `/api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney`
- **GET Votación**: `/api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=REMOCION_APODERADOS`

### **Estructura de Datos**

```json
{
  "id": "uuid-attorney-1",
  "attorneyClassId": "uuid-class-1",
  "person": {
    "id": "uuid-person-1",
    "type": "NATURAL",
    "natural": {
      "firstName": "María",
      "lastNamePaternal": "González",
      "lastNameMaternal": "López"
    }
  },

  // ✅ Campos de compatibilidad
  "isCandidate": false,
  "candidateStatus": null,
  "flowActionId": null,
  "attorneyFlowActions": [],

  // ✅ Campos nuevos y descriptivos (para REMOVAL)
  "isRemovalCandidate": false,
  "isRemoved": false,
  "removalStatus": null
}
```

### **Ejemplo: Marcar Apoderado**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
Content-Type: application/json

{
  "attorneyId": "uuid-attorney-1",
  "candidatoEstado": "CANDIDATO"
}
```

**✅ Se crea automáticamente el VoteItem con:**

- `label`: "¿Se aprueba la remoción del Apoderado [Nombre]?"

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    REMOCIÓN DE DIRECTORES/APODERADOS        │
└─────────────────────────────────────────────────────────────┘

1. GET /removal-director (o /removal-attorney)
   ↓
   Obtener lista con estados actuales
   ↓
2. PUT /removal-director { candidatoEstado: "CANDIDATO" }
   ↓
   ✅ Crea DirectorFlowAction (status: true, candidateStatus: CANDIDATE)
   ✅ Sincronización automática: Crea VoteItem
   ↓
3. GET /votes?contexto=REMOCION_DIRECTORES
   ↓
   Verificar que VoteItem fue creado automáticamente
   ↓
4. PUT /votes { contexto: "REMOCION_DIRECTORES", items: [...] }
   ↓
   Registrar votos de los accionistas
   ↓
5. PUT /removal-director { candidatoEstado: "ELEGIDO" }
   ↓
   Actualizar DirectorFlowAction (candidateStatus: ELECTED)
   ↓
6. GET /removal-director
   ↓
   Verificar estado final: isRemoved: true, removalStatus: "REMOVIDO"
```

---

## 🔍 Detalles Técnicos

### **Sincronización Automática**

**Cuándo se sincroniza:**

- ✅ Al marcar (`CANDIDATO`) → Crea VoteItem automáticamente
- ✅ Al desmarcar (`DESMARCAR`) → Desactiva VoteItem automáticamente
- ❌ Al actualizar resultado (`ELEGIDO`/`NO_ELEGIDO`) → No sincroniza (el VoteItem ya existe)

**Qué se sincroniza:**

- `FlowAction.status: true` + `candidateStatus: CANDIDATE` → Crea VoteItem
- `FlowAction.status: false` → Desactiva VoteItem

**Cómo funciona:**

1. El handler (`UpdateDirectorFlowActionHandler` / `UpdateAttorneyFlowActionHandler`) guarda el FlowAction
2. Llama automáticamente a `FlowActionVoteSyncService.syncVoteItem()`
3. El servicio:
   - Obtiene información de la persona (nombre completo)
   - Busca o crea la sesión de votación
   - Crea o desactiva el VoteItem según corresponda

---

### **Campos de Respuesta GET**

#### **Campos de Compatibilidad (mantener para no romper frontend existente)**

- `isCandidate`: `boolean` - true si está marcado como candidato
- `candidateStatus`: `string | null` - `CANDIDATE` | `ELECTED` | `NOT_ELECTED` | `null`
- `flowActionId`: `string | null` - ID del FlowAction activo

#### **Campos Nuevos y Descriptivos (recomendados)**

- `isRemovalCandidate`: `boolean` - true si está marcado para remoción (CANDIDATE)
- `isRemoved`: `boolean` - true si ya fue votado (ELECTED o NOT_ELECTED)
- `removalStatus`: `string | null` - `PENDIENTE_VOTACION` | `REMOVIDO` | `NO_REMOVIDO` | `null`

**Recomendación:** Usa los campos nuevos (`isRemovalCandidate`, `isRemoved`, `removalStatus`) para una mejor experiencia de usuario.

---

## ⚠️ Consideraciones Importantes

### **1. Votación Múltiple**

- Cada director/apoderado marcado tiene su **propio VoteItem**
- Puedes marcar múltiples entidades y cada una tendrá su votación independiente
- Los VoteItems se crean automáticamente al marcar

### **2. Desmarcar y Volver a Marcar**

- Si desmarcas una entidad, el VoteItem se desactiva (`status: false`)
- Si vuelves a marcar, se crea un **nuevo VoteItem** (no se reactiva el anterior)
- Esto evita problemas con votos históricos

### **3. Sesión de Votación**

- Si la sesión no existe, se crea automáticamente con `mode: SIMPLE`
- Si la sesión existe, se agregan los items automáticamente
- No necesitas crear la sesión manualmente

### **4. Sin Impacto en Registro Permanente**

- Todos los cambios se realizan sobre el **snapshot** de la junta
- El registro permanente de la sociedad **no se modifica**
- Los FlowActions y VoteItems son específicos de la junta actual

---

## ✅ Checklist de Implementación Frontend

- [x] ✅ **Sincronización automática** - El backend sincroniza automáticamente FlowActions con VoteItems
- [ ] Usar campos nuevos (`isRemovalCandidate`, `isRemoved`, `removalStatus`)
- [ ] Implementar UI para marcar/desmarcar directores/apoderados
- [ ] Mostrar estado de votación (pendiente, removido, no removido)
- [ ] Integrar con el sistema de votación para registrar votos
- [ ] Validar que no se vote sin FlowAction activo

**⚠️ NOTA:** Ya NO necesitas sincronizar manualmente los VoteItems. El backend lo hace automáticamente cuando marcas/desmarcas entidades.

---

## 📝 Ejemplo Completo: React Hook

```typescript
import { useState, useEffect } from 'react';

interface Director {
  id: string;
  person: {
    natural: {
      firstName: string;
      lastNamePaternal: string;
      lastNameMaternal: string;
    };
  };
  isRemovalCandidate: boolean;
  isRemoved: boolean;
  removalStatus: string | null;
  candidateStatus: string | null;
}

export function useRemovalDirectors(societyId: number, flowId: number) {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener lista de directores
  const obtenerLista = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-director`,
      );
      const data = await response.json();
      setDirectors(data.data);
    } catch (error) {
      console.error('Error al obtener directores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marcar director para remoción
  const marcarParaRemocion = async (directorId: string) => {
    try {
      await fetch(
        `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-director`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            directorId,
            candidatoEstado: 'CANDIDATO',
          }),
        },
      );

      // ✅ El VoteItem se crea automáticamente, no necesitas hacer nada más
      await obtenerLista(); // Refrescar lista
    } catch (error) {
      console.error('Error al marcar director:', error);
    }
  };

  // Desmarcar director
  const desmarcar = async (directorId: string) => {
    try {
      await fetch(
        `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-director`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            directorId,
            candidatoEstado: 'DESMARCAR',
          }),
        },
      );

      // ✅ El VoteItem se elimina automáticamente, no necesitas hacer nada más
      await obtenerLista(); // Refrescar lista
    } catch (error) {
      console.error('Error al desmarcar director:', error);
    }
  };

  // Actualizar resultado de votación
  const actualizarResultado = async (directorId: string, resultado: 'ELEGIDO' | 'NO_ELEGIDO') => {
    try {
      await fetch(
        `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-director`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            directorId,
            candidatoEstado: resultado,
          }),
        },
      );
      await obtenerLista(); // Refrescar lista
    } catch (error) {
      console.error('Error al actualizar resultado:', error);
    }
  };

  useEffect(() => {
    obtenerLista();
  }, [societyId, flowId]);

  return {
    directors,
    loading,
    marcarParaRemocion,
    desmarcar,
    actualizarResultado,
    refrescar: obtenerLista,
  };
}
```

---

## 🎯 Resumen de Endpoints

### **Remoción de Directores**

| Método | Endpoint            | Descripción                               |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/removal-director` | Listar directores con estados de remoción |
| PUT    | `/removal-director` | Marcar/actualizar/desmarcar director      |

### **Remoción de Apoderados**

| Método | Endpoint            | Descripción                               |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/removal-attorney` | Listar apoderados con estados de remoción |
| PUT    | `/removal-attorney` | Marcar/actualizar/desmarcar apoderado     |

### **Votaciones**

| Método | Endpoint                              | Descripción                                |
| ------ | ------------------------------------- | ------------------------------------------ |
| GET    | `/votes?contexto=REMOCION_DIRECTORES` | Obtener votación de remoción de directores |
| GET    | `/votes?contexto=REMOCION_APODERADOS` | Obtener votación de remoción de apoderados |
| PUT    | `/votes`                              | Agregar/actualizar/eliminar items y votos  |

---

## ✅ Conclusión

El sistema de remoción de apoderados y directores está completamente automatizado:

1. ✅ **Sincronización automática** entre FlowActions y VoteItems
2. ✅ **Estados claros** con campos descriptivos
3. ✅ **Votación múltiple** (un VoteItem por entidad)
4. ✅ **Sin impacto en registro permanente**

**El frontend solo necesita:**

- Marcar/desmarcar entidades (PUT)
- Obtener lista de entidades (GET)
- Registrar votos (PUT /votes)
- Actualizar resultados (PUT con ELEGIDO/NO_ELEGIDO)

**No necesitas:**

- ❌ Crear VoteItems manualmente
- ❌ Eliminar VoteItems manualmente
- ❌ Sincronizar FlowActions con VoteItems

**El sistema está listo para producción.** 🚀
