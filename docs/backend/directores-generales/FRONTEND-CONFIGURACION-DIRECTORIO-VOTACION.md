# 📘 GUÍA FRONTEND: CONFIGURACIÓN DE DIRECTORIO Y VOTACIÓN

**Versión:** 1.0  
**Fecha:** 2025-01-15  
**Estado:** ✅ **Completo**

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Endpoint de Configuración de Directorio](#endpoint-de-configuración-de-directorio)
3. [Votación de Configuración de Directorio](#votación-de-configuración-de-directorio)
4. [Flujos Completos](#flujos-completos)
5. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎯 RESUMEN EJECUTIVO

### **¿Qué es esto?**

Sistema para configurar el directorio y votar por esa configuración en juntas de accionistas.

### **Dos Componentes Principales:**

1. **Configuración del Directorio** - Endpoint `PUT` que acepta solo los campos que necesites
2. **Votación de Configuración** - Sistema de votación para aprobar/rechazar la configuración

### **Flujos que lo Usan:**

- ✅ **Nombramiento de Directores** - Puede configurar cantidad y presidente
- ✅ **Nuevo Directorio** - Puede configurar todos los campos (cantidad, período, fechas, etc.)

---

## 🔧 ENDPOINT DE CONFIGURACIÓN DE DIRECTORIO

### **Endpoint**

```
PUT /api/v2/society-profile/:structureId/directorio
```

**Path Parameters:**

- `structureId` (number): ID de la estructura del perfil de sociedad

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

### **⚠️ IMPORTANTE: Campos Opcionales**

**Todos los campos son opcionales.** Puedes enviar solo los campos que necesites según la vista:

- **Vista 1:** Solo `cantidadDirectores` y `presidenteId` (2 campos)
- **Vista 2:** Solo `cantidadDirectores`, `periodo`, `inicioMandato`, `finMandato` (4 campos)
- **Vista 3:** Todos los campos (14 campos)

**El backend actualiza solo los campos que envías, los demás se mantienen.**

---

## 📝 CAMPOS DISPONIBLES

### **Campos Básicos**

| Campo                 | Tipo    | Descripción                 | Requerido                              |
| --------------------- | ------- | --------------------------- | -------------------------------------- |
| `cantidadDirectores`  | number  | Cantidad fija de directores | ✅ Si `conteoPersonalizado` es `false` |
| `conteoPersonalizado` | boolean | Si usar rango de directores | Opcional                               |
| `minimoDirectores`    | number  | Mínimo de directores        | ✅ Si `conteoPersonalizado` es `true`  |
| `maximoDirectores`    | number  | Máximo de directores        | ✅ Si `conteoPersonalizado` es `true`  |

### **Campos de Período**

| Campo           | Tipo | Descripción                               | Requerido |
| --------------- | ---- | ----------------------------------------- | --------- |
| `periodo`       | enum | `"ANUAL"`, `"BIENAL"`, `"TRIENAL"`, etc.  | Opcional  |
| `inicioMandato` | date | Fecha de inicio (formato: `"2025-01-01"`) | Opcional  |
| `finMandato`    | date | Fecha de fin (formato: `"2025-12-31"`)    | Opcional  |

### **Campos de Gobernanza**

| Campo                 | Tipo          | Descripción                           | Requerido |
| --------------------- | ------------- | ------------------------------------- | --------- |
| `quorumMinimo`        | number        | Quórum mínimo para sesiones           | Opcional  |
| `mayoria`             | number        | Mayoría requerida para decisiones     | Opcional  |
| `presidenteDesignado` | boolean       | Si el presidente es designado         | Opcional  |
| `secretarioAsignado`  | boolean       | Si hay secretario asignado            | Opcional  |
| `reeleccionPermitida` | boolean       | Si se permite reelección              | Opcional  |
| `presidentePreside`   | boolean       | Si el presidente preside sesiones     | Opcional  |
| `presidenteDesempata` | boolean       | Si el presidente desempata votaciones | Opcional  |
| `presidenteId`        | string (UUID) | ID del director presidente            | Opcional  |

---

## 📋 EJEMPLOS DE PAYLOAD

### **Ejemplo 1: Solo Cantidad y Presidente (Flujo 1 - Nombramiento Directores)**

```json
PUT /api/v2/society-profile/5/directorio

{
  "cantidadDirectores": 5,
  "presidenteId": "789c357a-f528-4eba-b5d3-53a3ef9bf121"
}
```

**Uso:** Vista simple donde solo se cambia la cantidad de directores y se asigna presidente.

---

### **Ejemplo 2: Solo 4 Campos (Flujo 2 - Nuevo Directorio)**

```json
PUT /api/v2/society-profile/5/directorio

{
  "cantidadDirectores": 5,
  "periodo": "ANUAL",
  "inicioMandato": "2025-01-01",
  "finMandato": "2025-12-31"
}
```

**Uso:** Vista donde se configura cantidad, duración y fechas del mandato.

---

### **Ejemplo 3: Solo Cantidad**

```json
PUT /api/v2/society-profile/5/directorio

{
  "cantidadDirectores": 5
}
```

**Uso:** Vista donde solo se cambia la cantidad de directores.

---

### **Ejemplo 4: Solo Presidente**

```json
PUT /api/v2/society-profile/5/directorio

{
  "presidenteId": "789c357a-f528-4eba-b5d3-53a3ef9bf121"
}
```

**Uso:** Vista donde solo se asigna presidente.

---

### **Ejemplo 5: Configuración Completa (Flujo 2 - Nuevo Directorio)**

```json
PUT /api/v2/society-profile/5/directorio

{
  "cantidadDirectores": 5,
  "conteoPersonalizado": false,
  "periodo": "ANUAL",
  "inicioMandato": "2025-01-01",
  "finMandato": "2025-12-31",
  "quorumMinimo": 50,
  "mayoria": 51,
  "presidenteDesignado": true,
  "secretarioAsignado": true,
  "reeleccionPermitida": false,
  "presidentePreside": true,
  "presidenteDesempata": true,
  "presidenteId": "789c357a-f528-4eba-b5d3-53a3ef9bf121"
}
```

**Uso:** Vista completa donde se configuran todos los parámetros del directorio.

---

## ✅ RESPUESTA EXITOSA

```json
{
  "success": true,
  "message": "Directorio actualizado correctamente.",
  "code": 200
}
```

---

## ⚠️ VALIDACIONES

### **1. Validación de `presidenteId`**

Si envías `presidenteId`, debe ser un director **TITULAR** activo. Si no, recibirás:

```json
{
  "statusCode": 404,
  "message": "Tiene que ser un director titular",
  "error": "Not Found"
}
```

### **2. Validación Condicional de `conteoPersonalizado`**

- Si `conteoPersonalizado` es `true` → Se requiere `minimoDirectores` y `maximoDirectores`
- Si `conteoPersonalizado` es `false` (o no se envía) → Se puede enviar `cantidadDirectores`

**Ejemplo de Error:**

```json
{
  "statusCode": 400,
  "message": "Se requiere minimoDirectores y maximoDirectores cuando conteoPersonalizado es true",
  "error": "Bad Request"
}
```

---

## 🗳️ VOTACIÓN DE CONFIGURACIÓN DE DIRECTORIO

### **Contexto de Votación**

```
'CONFIGURACION_DIRECTORIO'
```

### **Activación Automática**

La votación de configuración se activa **automáticamente** cuando:

- Se activa `nombramientoDirectores` **O**
- Se activa `nombramientoNuevoDirectorio`

**No necesitas activarla manualmente.** El backend crea el `voteDirectoryConfigurationId` automáticamente.

---

## 📝 ENDPOINT DE VOTACIÓN

### **Crear/Actualizar Votación**

```
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Path Parameters:**

- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo/junta

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

### **Payload para Crear Votación**

```json
{
  "id": "uuid-generado-por-frontend",
  "contexto": "CONFIGURACION_DIRECTORIO",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-item-1",
      "orden": 0,
      "label": "Aprobación de configuración de directorio",
      "descripcion": "Se aprueba la configuración del directorio con 5 directores, período anual del 01-01-2025 al 31-12-2025",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-voto-1",
          "accionistaId": "uuid-accionista-1",
          "valor": "A_FAVOR"
        },
        {
          "id": "uuid-voto-2",
          "accionistaId": "uuid-accionista-2",
          "valor": "EN_CONTRA"
        },
        {
          "id": "uuid-voto-3",
          "accionistaId": "uuid-accionista-3",
          "valor": "ABSTENCION"
        }
      ]
    }
  ]
}
```

### **Campos Explicados**

**Sesión de Votación:**

- `id`: UUID generado por el frontend para la sesión
- `contexto`: `"CONFIGURACION_DIRECTORIO"` (fijo)
- `modo`: `"SIMPLE"` (A FAVOR/EN CONTRA/ABSTENCIÓN) o `"CUMULATIVO"` (votos numéricos)

**Item de Votación:**

- `id`: UUID generado por el frontend para el item
- `orden`: Número de orden (0, 1, 2, ...)
- `label`: Título de lo que se está votando
- `descripcion`: Descripción detallada (opcional)
- `tipoAprobacion`: `"SOMETIDO_A_VOTACION"` o `"APROBADO_POR_TODOS"` (opcional)
- `votos`: Array de votos de los accionistas

**Voto:**

- `id`: UUID generado por el frontend para el voto
- `accionistaId`: UUID del accionista que vota
- `valor`:
  - Si `modo` es `"SIMPLE"`: `"A_FAVOR"` | `"EN_CONTRA"` | `"ABSTENCION"`
  - Si `modo` es `"CUMULATIVO"`: número positivo (ej: `5`, `10`, `100`)

---

## 🔄 FLUJOS COMPLETOS

### **Flujo 1: Nombramiento de Directores**

```
1. Activar agenda
   → PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
   → { "nombramiento": { "nombramientoDirectores": true } }
   → ✅ Se crea automáticamente: voteDirectoryConfigurationId

2. Configurar directorio (OPCIONAL)
   → PUT /api/v2/society-profile/:structureId/directorio
   → { "cantidadDirectores": 5, "presidenteId": "..." }
   → Solo envías los campos que necesites

3. Votar configuración (OPCIONAL)
   → POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
   → { "contexto": "CONFIGURACION_DIRECTORIO", "modo": "SIMPLE", "items": [...] }

4. Crear candidatos
   → POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
   → { "director": {...}, "candidatoEstado": "CANDIDATO" }

5. Votar cantidad de directores
   → POST /v1/society-profile/:id/flow/:flowId/vote-count-director
   → { "directorCount": 5, "votings": [...] }

6. Actualizar resultados
   → PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
   → { "directorId": "...", "candidatoEstado": "ELEGIDO" }
```

---

### **Flujo 2: Nuevo Directorio**

```
1. Activar agenda
   → PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
   → { "nombramiento": { "nombramientoNuevoDirectorio": true } }
   → ✅ Se crea automáticamente: voteDirectoryConfigurationId

2. Configurar directorio (OPCIONAL pero RECOMENDADO)
   → PUT /api/v2/society-profile/:structureId/directorio
   → { "cantidadDirectores": 5, "periodo": "ANUAL", "inicioMandato": "2025-01-01", "finMandato": "2025-12-31" }
   → Solo envías los campos que necesites (mínimo 4: cantidad, periodo, fechas)

3. Votar configuración (OPCIONAL)
   → POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
   → { "contexto": "CONFIGURACION_DIRECTORIO", "modo": "SIMPLE", "items": [...] }

4. Crear candidatos
   → POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
   → { "director": {...}, "candidatoEstado": "CANDIDATO" }

5. Votar directorio completo
   → POST /v1/society-profile/:id/flow/:flowId/vote-agreement
   → { "details": [...] }

6. Actualizar resultados
   → PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
   → { "directorId": "...", "candidatoEstado": "ELEGIDO" }
```

---

## 📊 EJEMPLOS COMPLETOS DE USO

### **Ejemplo 1: Vista Simple - Solo Cantidad y Presidente**

```typescript
// 1. Configurar directorio (solo 2 campos)
const response = await fetch(`/api/v2/society-profile/${structureId}/directorio`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    cantidadDirectores: 5,
    presidenteId: '789c357a-f528-4eba-b5d3-53a3ef9bf121',
  }),
});

if (response.ok) {
  console.log('✅ Directorio configurado correctamente');
}
```

---

### **Ejemplo 2: Vista Completa - 4 Campos (Nuevo Directorio)**

```typescript
// 1. Configurar directorio (4 campos)
const response = await fetch(`/api/v2/society-profile/${structureId}/directorio`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    cantidadDirectores: 5,
    periodo: 'ANUAL',
    inicioMandato: '2025-01-01',
    finMandato: '2025-12-31',
  }),
});

if (response.ok) {
  console.log('✅ Directorio configurado correctamente');
}
```

---

### **Ejemplo 3: Crear Votación de Configuración**

```typescript
// 2. Crear votación de configuración
const voteResponse = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: generateUUID(), // Generar UUID para la sesión
      contexto: 'CONFIGURACION_DIRECTORIO',
      modo: 'SIMPLE',
      items: [
        {
          id: generateUUID(), // Generar UUID para el item
          orden: 0,
          label: 'Aprobación de configuración de directorio',
          descripcion:
            'Se aprueba la configuración del directorio con 5 directores, período anual del 01-01-2025 al 31-12-2025',
          tipoAprobacion: 'SOMETIDO_A_VOTACION',
          votos: [
            {
              id: generateUUID(), // Generar UUID para el voto
              accionistaId: 'uuid-accionista-1',
              valor: 'A_FAVOR',
            },
            {
              id: generateUUID(),
              accionistaId: 'uuid-accionista-2',
              valor: 'EN_CONTRA',
            },
          ],
        },
      ],
    }),
  },
);

if (voteResponse.ok) {
  console.log('✅ Votación creada correctamente');
}
```

---

### **Ejemplo 4: Actualizar Votación (Agregar/Modificar Votos)**

```typescript
// 3. Actualizar votación (agregar más votos)
const updateResponse = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contexto: 'CONFIGURACION_DIRECTORIO',
      items: [
        {
          accion: 'updateVote',
          itemId: 'uuid-item-1', // ID del item existente
          votos: [
            {
              accion: 'addVote',
              id: generateUUID(),
              accionistaId: 'uuid-accionista-3',
              value: 'ABSTENCION',
            },
          ],
        },
      ],
    }),
  },
);

if (updateResponse.ok) {
  console.log('✅ Votación actualizada correctamente');
}
```

---

## 🔍 VERIFICAR SI LA VOTACIÓN ESTÁ ACTIVA

### **Endpoint para Verificar Agenda Items**

```
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "nombramiento": {
      "nombramientoDirectores": true,
      "nombramientoNuevoDirectorio": false
    }
    // ... otros campos
  }
}
```

**Si `nombramientoDirectores` o `nombramientoNuevoDirectorio` es `true`, entonces `voteDirectoryConfigurationId` ya existe y puedes crear la votación.**

---

## ⚠️ ERRORES COMUNES

### **Error 1: Votación no activa**

```json
{
  "statusCode": 404,
  "message": "Configuración de directorio no es un punto de agenda",
  "error": "Not Found"
}
```

**Solución:** Asegúrate de que `nombramientoDirectores` o `nombramientoNuevoDirectorio` esté activo en los puntos de agenda.

---

### **Error 2: Presidente no válido**

```json
{
  "statusCode": 404,
  "message": "Tiene que ser un director titular",
  "error": "Not Found"
}
```

**Solución:** Verifica que el `presidenteId` sea un director **TITULAR** activo.

---

### **Error 3: Validación de conteoPersonalizado**

```json
{
  "statusCode": 400,
  "message": "Se requiere minimoDirectores y maximoDirectores cuando conteoPersonalizado es true",
  "error": "Bad Request"
}
```

**Solución:** Si envías `conteoPersonalizado: true`, también debes enviar `minimoDirectores` y `maximoDirectores`.

---

## 📚 REFERENCIAS

- **Endpoint de Configuración:** `PUT /api/v2/society-profile/:structureId/directorio`
- **Endpoint de Votación:** `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes`
- **Contexto de Votación:** `"CONFIGURACION_DIRECTORIO"`
- **Documentación Completa:** `docs/FLUJOS-CONFIGURACION-DIRECTORIO-COMPLETA.md`
- **Plan de Implementación:** `docs/PLAN-IMPLEMENTACION-VOTACION-CONFIGURACION-DIRECTORIO.md`

---

## ✅ CHECKLIST PARA EL FRONTEND

- [ ] 1. Verificar que `nombramientoDirectores` o `nombramientoNuevoDirectorio` esté activo
- [ ] 2. Configurar directorio con solo los campos necesarios (PUT /directorio)
- [ ] 3. Crear votación de configuración (POST /votes con contexto `CONFIGURACION_DIRECTORIO`)
- [ ] 4. Agregar votos de los accionistas
- [ ] 5. Actualizar votación si es necesario (PUT /votes)
- [ ] 6. Procesar resultados de la votación

---

**Última actualización:** 2025-01-15  
**Versión del API:** v2

