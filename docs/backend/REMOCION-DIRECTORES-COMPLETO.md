# 📋 Documentación Completa: Remoción de Directores

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Estado:** ✅ **Implementado**

---

## 🎯 VISIÓN GENERAL

Este documento detalla todos los endpoints y el proceso completo para gestionar la **remoción de directores** en el flujo de registro de asamblea.

**Características:**
- ✅ Solo se pueden remover directores que ya existen en el directorio de la sociedad
- ✅ Soporta remoción directa (sin votación) o mediante votación
- ✅ Integración completa con el sistema de votaciones
- ✅ Validaciones automáticas de permisos y estados

---

## 📋 ÍNDICE

1. [Paso 1: Activar Punto de Agenda](#1-paso-1-activar-punto-de-agenda)
2. [Paso 2: Listar Directores para Remoción](#2-paso-2-listar-directores-para-remoción)
3. [Paso 3: Crear Candidato a Remoción](#3-paso-3-crear-candidato-a-remoción)
4. [Paso 4: Votación de Remoción](#4-paso-4-votación-de-remoción)
5. [Paso 5: Actualizar Estado Después de Votación](#5-paso-5-actualizar-estado-después-de-votación)
6. [Estructuras de Datos](#6-estructuras-de-datos)
7. [Flujo Completo de Ejemplo](#7-flujo-completo-de-ejemplo)
8. [Validaciones y Errores](#8-validaciones-y-errores)

---

## 1. Paso 1: Activar Punto de Agenda

**⚠️ IMPORTANTE:** Antes de usar cualquier endpoint de remoción, debes activar el punto de agenda correspondiente.

### **Endpoint**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/agenda-items
```

**Parámetros de Ruta:**
- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo de la junta

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "remocion": {
    "remocionDirectores": true
  }
}
```

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Puntos de agenda actualizados correctamente",
  "code": 200
}
```

---

## 2. Paso 2: Listar Directores para Remoción

Obtiene todos los directores que pueden ser removidos.

### **Endpoint**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Parámetros de Ruta:**
- `societyId` (number): ID de la estructura del perfil de sociedad
- `flowId` (number): ID del flujo de la junta

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Remociones de directores listadas exitosamente.",
  "code": 200,
  "data": [
    {
      "id": "uuid-del-director",
      "persona": {
        "id": "uuid-de-persona",
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García",
        "tipoDocumento": "DNI",
        "numeroDocumento": "12345678",
        "paisEmision": "Perú"
      },
      "rolDirector": "TITULAR",
      "reemplazaId": null,
      "isCandidate": true,
      "flowActions": [
        {
          "candidateStatus": "CANDIDATE"
        }
      ]
    }
  ]
}
```

**Permisos Requeridos:**
- Flujo: `SOCIETY_PROFILE`
- Módulo: `SOCIETY`
- Acción: `READ`

---

## 3. Paso 3: Crear Candidato a Remoción

Agrega un director existente como candidato a remoción.

### **Endpoint**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Body:**

```json
{
  "directorId": "uuid-del-director-existente",
  "candidatoEstado": "CANDIDATO"
}
```

**Valores de `candidatoEstado`:**
- `"CANDIDATO"`: Se crea como candidato a votación de remoción
- `"DESIGNADO_DIRECTAMENTE"`: Se remueve directamente sin votación

**Respuesta Exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Remocion de director creado exitosamente.",
  "code": 201
}
```

**Permisos Requeridos:**
- Flujo: `SOCIETY_PROFILE`
- Módulo: `SOCIETY`
- Acción: `WRITE`

---

## 4. Paso 4: Votación de Remoción

### **4.1. Obtener Votación**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=REMOCION_DIRECTORES
```

**Query Parameters:**
- `contexto`: `"REMOCION_DIRECTORES"` (fijo)

**Respuesta:**

```json
{
  "success": true,
  "message": "Votaciones obtenidas correctamente",
  "data": {
    "id": "uuid-de-sesion-votacion",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-del-item",
        "orden": 0,
        "label": "¿Se aprueba la remoción de los directores propuestos?",
        "descripción": "Votación sobre la remoción de directores",
        "tipoAprobacion": "SOMETIDO_A_VOTACION",
        "votos": [
          {
            "id": "uuid-del-voto",
            "accionistaId": "uuid-del-accionista",
            "valor": "A_FAVOR"
          }
        ]
      }
    ]
  },
  "code": 200
}
```

### **4.2. Crear/Actualizar Votación**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "contexto": "REMOCION_DIRECTORES",
  "items": [
    {
      "accion": "add",
      "id": "uuid-generado-frontend",
      "orden": 0,
      "label": "¿Se aprueba la remoción de los directores propuestos?",
      "descripcion": "Votación sobre la remoción de directores",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-generado-frontend",
          "accionistaId": "uuid-del-accionista",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

**Valores de Voto (Modo SIMPLE):**
- `"A_FAVOR"`: A favor de la remoción
- `"EN_CONTRA"`: En contra de la remoción
- `"ABSTENCION"`: Abstención

---

## 5. Paso 5: Actualizar Estado Después de Votación

Actualiza el estado de un candidato después de la votación.

### **Endpoint**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Body:**

```json
{
  "directorId": "uuid-del-director",
  "candidatoEstado": "ELEGIDO"
}
```

**Valores de `candidatoEstado`:**
- `"ELEGIDO"`: Elegido para remoción en votación
- `"NO_ELEGIDO"`: No elegido para remoción

**Permisos Requeridos:**
- Flujo: `SOCIETY_PROFILE`
- Módulo: `SOCIETY`
- Acción: `UPDATE`

---

## 6. Estructuras de Datos

### **Enums**

**RolDirector:**
```typescript
enum RolDirector {
  TITULAR = 'TITULAR',
  SUPLENTE = 'SUPLENTE',
  ALTERNO = 'ALTERNO'
}
```

**CandidatoEstado (Crear):**
```typescript
enum CandidatoEstadoCreate {
  CANDIDATO = 'CANDIDATO',
  DESIGNADO_DIRECTAMENTE = 'DESIGNADO_DIRECTAMENTE'
}
```

**CandidatoEstado (Actualizar):**
```typescript
enum CandidatoEstadoUpdate {
  ELEGIDO = 'ELEGIDO',
  NO_ELEGIDO = 'NO_ELEGIDO'
}
```

**ValorVoto (Modo SIMPLE):**
```typescript
enum ValorVoto {
  A_FAVOR = 'A_FAVOR',
  EN_CONTRA = 'EN_CONTRA',
  ABSTENCION = 'ABSTENCION'
}
```

---

## 7. Flujo Completo de Ejemplo

### **Escenario: Remover 2 Directores mediante Votación**

**1. Activar punto de agenda:**
```http
PUT /api/v2/society-profile/1/register-assembly/5/agenda-items
{
  "remocion": { "remocionDirectores": true }
}
```

**2. Listar directores:**
```http
GET /api/v2/society-profile/1/register-assembly/5/removal-director
```

**3. Crear candidatos:**
```http
POST /api/v2/society-profile/1/register-assembly/5/removal-director
{
  "directorId": "uuid-director-1",
  "candidatoEstado": "CANDIDATO"
}
```

**4. Crear votación:**
```http
PUT /api/v2/society-profile/1/register-assembly/5/votes
{
  "contexto": "REMOCION_DIRECTORES",
  "items": [
    {
      "accion": "add",
      "id": "uuid-item-1",
      "orden": 0,
      "label": "¿Se aprueba la remoción del Director Juan Pérez?",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "uuid-voto-1",
          "accionistaId": "uuid-accionista-1",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

**5. Actualizar estado:**
```http
PUT /api/v2/society-profile/1/register-assembly/5/removal-director
{
  "directorId": "uuid-director-1",
  "candidatoEstado": "ELEGIDO"
}
```

---

## 8. Validaciones y Errores

### **Validaciones Comunes**

1. **Punto de Agenda:** Debe estar activado antes de usar los endpoints
2. **Directores:** Solo se pueden remover directores que existen en el directorio
3. **Votaciones:** El contexto debe ser `"REMOCION_DIRECTORES"`
4. **UUIDs:** Todos los IDs deben ser UUIDs válidos

### **Códigos de Error**

| Código | Descripción |
|--------|-------------|
| `400` | Bad Request - Director no existe |
| `401` | Unauthorized - Token inválido |
| `403` | Forbidden - Sin permisos |
| `404` | Not Found - Recurso no encontrado |
| `422` | Unprocessable Entity - Validación fallida |

---

## 9. Resumen de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/removal-director` | Listar directores para remoción |
| `POST` | `/removal-director` | Crear candidato a remoción |
| `PUT` | `/removal-director` | Actualizar estado después de votación |
| `GET` | `/votes?contexto=REMOCION_DIRECTORES` | Obtener votación |
| `PUT` | `/votes` | Crear/Actualizar votación |
| `PUT` | `/agenda-items` | Activar punto de agenda |

---

## 10. Notas Finales

1. **UUIDs:** Todos los IDs deben ser UUIDs válidos generados en el frontend
2. **Orden:** Siempre activar el punto de agenda primero
3. **Estados:** Se pueden actualizar múltiples veces hasta `"ELEGIDO"` o `"NO_ELEGIDO"`
4. **Votaciones:** Solo se pueden votar directores creados como `"CANDIDATO"`
5. **Remoción Directa:** Si se usa `"DESIGNADO_DIRECTAMENTE"`, no se requiere votación

---

**✅ Documentación lista para implementación en frontend**

**Última actualización:** Enero 2025
