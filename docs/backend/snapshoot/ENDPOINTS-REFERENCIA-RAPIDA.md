# 🚀 REFERENCIA RÁPIDA DE ENDPOINTS

## 📋 Tabla de Contenidos

1. [Registro de Sociedad](#registro-de-sociedad)
2. [Gestión de Juntas](#gestión-de-juntas)
3. [Agenda Items](#agenda-items)
4. [Asistencia](#asistencia)
5. [Aporte Dinerario](#aporte-dinerario)
6. [Códigos de Estado](#códigos-de-estado)

---

## Registro de Sociedad

### 1. Crear Sociedad
```http
POST /api/v2/society-profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "code": 201,
  "data": {
    "id": 1
  }
}
```

---

### 2. Actualizar Datos de Sociedad
```http
PUT /api/v2/society-profile/:societyId/society
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipoSociedad": "S.A.",
  "razonSocial": "Mi Empresa SAC",
  "paisConstitucion": "PE"
}
```

---

### 3. Crear Accionista
```http
POST /api/v2/society-profile/:societyId/shareholder
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "uuid-accionista",
  "tipoAccionista": "FUNDADOR",
  "persona": {
    "id": "uuid-persona",
    "tipoPersona": "NATURAL",
    "personaNatural": {
      "primerNombre": "Juan",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "García",
      "tipoDocumento": "DNI",
      "numeroDocumento": "12345678",
      "paisEmision": "PE"
    }
  }
}
```

---

### 4. Crear Clase de Acción
```http
POST /api/v2/society-profile/:societyId/acction
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "uuid-accion",
  "claseAccion": "Clase A",
  "cantidadAcciones": 1000,
  "valorAccion": 100,
  "derecho": "VOTO_Y_ECONOMICO"
}
```

---

### 5. Asignar Acciones
```http
POST /api/v2/society-profile/:societyId/share-assignment
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "uuid-asignacion",
  "accionistaId": "uuid-accionista",
  "accionId": "uuid-accion",
  "cantidadAcciones": 500,
  "porcentajeCapital": 50
}
```

---

### 6. Definir Quórum
```http
PUT /api/v2/society-profile/:societyId/quorum
Authorization: Bearer {token}
Content-Type: application/json

{
  "primeraConvocatoria": 66.67,
  "segundaConvocatoria": 50,
  "mayoriaSimple": 50,
  "mayoriaAbsoluta": 66.67,
  "mayoriaCalificada": 75
}
```

---

### 7. Crear Director
```http
POST /api/v2/society-profile/:societyId/directorio/directores
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "uuid-director",
  "tipoDirector": "TITULAR",
  "persona": {
    "id": "uuid-persona",
    "tipoPersona": "NATURAL",
    "personaNatural": {
      "primerNombre": "María",
      "apellidoPaterno": "López",
      "apellidoMaterno": "Sánchez",
      "tipoDocumento": "DNI",
      "numeroDocumento": "87654321",
      "paisEmision": "PE"
    }
  }
}
```

---

### 8. Actualizar Directorio
```http
PUT /api/v2/society-profile/:societyId/directorio
Authorization: Bearer {token}
Content-Type: application/json

{
  "descripcion": "Directorio actualizado"
}
```

---

### 9. Eliminar Director
```http
DELETE /api/v2/society-profile/:societyId/directorio/directores
Authorization: Bearer {token}
Content-Type: application/json

["uuid-director-1", "uuid-director-2"]
```

---

### 10. Crear Apoderado
```http
POST /api/v2/society-profile/:societyId/attorney-register/attorneys
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "uuid-apoderado",
  "claseApoderadoId": "uuid-clase",
  "persona": {
    "id": "uuid-persona",
    "tipoPersona": "NATURAL",
    "personaNatural": {
      "primerNombre": "Carlos",
      "apellidoPaterno": "Ramírez",
      "apellidoMaterno": "Torres",
      "tipoDocumento": "DNI",
      "numeroDocumento": "11223344",
      "paisEmision": "PE"
    }
  }
}
```

---

## Gestión de Juntas

### 11. Crear Junta (Clonación)
```http
POST /api/v2/society-profile/:societyId/register-assembly
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "code": 201,
  "data": {
    "flowId": 1
  }
}
```

**⚠️ Importante:** Este endpoint:
- Clona todas las estructuras de la sociedad
- Crea nuevos IDs para todo
- Genera registros de asistencia automáticamente
- Retorna el `flowId` de la nueva junta

---

### 12. Listar Juntas
```http
GET /api/v2/society-profile/:societyId/register-assembly/list
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "flowId": 1,
      "meetingType": "JUNTA_UNIVERSAL",
      "statusProgression": "IN_PROGRESS",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 13. Obtener Snapshot Completo
```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareholderId": "uuid-1",
    "nominalValueId": "uuid-2",
    "shareAllocationId": "uuid-3",
    "meetingConfigId": "uuid-4",
    "directoryId": "uuid-5",
    "attorneyRegistryId": "uuid-6",
    "powerRegimenId": "uuid-7",
    "quorumId": "uuid-8",
    "nominalValue": 100,
    "shareClasses": [...],
    "shareholders": [...],
    "shareAllocations": [...],
    "directory": {...},
    "directors": [...],
    "attorneys": [...],
    "powers": {...},
    "quorums": {...},
    "societyData": {...},
    "meetingConfig": {
      "id": "uuid-4",
      "meetingType": "JUNTA_UNIVERSAL",
      "isAnnualMandatory": false
    },
    "flowInfo": {
      "flowStructureId": 1,
      "currentStep": "AGENDA_ITEMS",
      "statusProgression": "IN_PROGRESS"
    }
  }
}
```

**📌 Este endpoint es clave:** Úsalo para obtener toda la información de la junta.

---

## Agenda Items

### 14. Obtener Agenda Items
```http
GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "items": {
      "aportesDinerarios": false,
      "aporteNoDinerario": false,
      "capitalizacionDeCreditos": false,
      "remocionGerenteGeneral": false,
      "remocionApoderados": false,
      "remocionDirectores": false,
      "nombramientoGerenteGeneral": false,
      "nombramientoApoderados": false,
      "nombramientoDirectores": false,
      "nombramientoNuevoDirectorio": false,
      "pronunciamientoGestionSocialYResultados": false,
      "aplicacionResultados": false,
      "designacionAuditoresExternos": false
    }
  }
}
```

---

### 15. Actualizar Agenda Items
```http
PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
Authorization: Bearer {token}
Content-Type: application/json

{
  "aumentoCapital": {
    "aportesDinerarios": true,
    "aporteNoDinerario": false,
    "capitalizacionDeCreditos": false
  },
  "remocion": {
    "remocionGerenteGeneral": false,
    "remocionApoderados": false,
    "remocionDirectores": false
  },
  "nombramiento": {
    "nombramientoGerenteGeneral": false,
    "nombramientoApoderados": false,
    "nombramientoDirectores": false,
    "nombramientoNuevoDirectorio": false
  },
  "gestionSocialYResultadosEconomicos": {
    "pronunciamientoGestionSocialYResultados": false,
    "aplicacionResultados": false,
    "designacionAuditoresExternos": false
  }
}
```

**⚠️ Importante:** Debes habilitar `aportesDinerarios: true` antes de registrar aportes.

---

## Asistencia

### 16. Obtener Asistencia
```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-asistencia-1",
      "configJuntaId": "uuid-config",
      "accionista": {
        "id": "uuid-accionista",
        "persona": {
          "tipoPersona": "NATURAL",
          "personaNatural": {
            "primerNombre": "Juan",
            "apellidoPaterno": "Pérez",
            "apellidoMaterno": "García"
          }
        }
      },
      "accionesConDerechoVoto": 500,
      "porcentajeParticipacion": 50,
      "asistio": false,
      "representadoPorId": null,
      "esRepresentante": false
    }
  ]
}
```

**📌 Nota:** Los registros de asistencia se crean automáticamente al crear la junta.

---

### 17. Actualizar Asistencia
```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "uuid-asistencia-1",
  "attended": true,
  "representedById": null,
  "isRepresentative": false
}
```

---

## Aporte Dinerario

### 18. Listar Aportantes Potenciales
```http
GET /api/v2/society-profile/:societyId/assembly/:flowId/participants
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-accionista",
      "personId": "uuid-persona",
      "typeShareholder": "FUNDADOR",
      "isContributor": false,
      "persona": {
        "tipoPersona": "NATURAL",
        "personaNatural": {
          "primerNombre": "Juan",
          "apellidoPaterno": "Pérez"
        }
      }
    }
  ]
}
```

---

### 19. Marcar como Aportante
```http
PUT /api/v2/society-profile/:societyId/assembly/:flowId/participants/:participantId/contributor
Authorization: Bearer {token}
Content-Type: application/json

{
  "isContributor": true
}
```

---

### 20. Crear Aporte
```http
POST /api/v2/society-profile/:societyId/assembly/:flowId/contributions
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": "uuid-aporte",
  "accionistaId": "uuid-accionista",
  "accionId": "uuid-accion",
  "tipoMoneda": "PEN",
  "monto": 10000,
  "fechaContribucion": "2024-01-01T00:00:00Z",
  "tasaCambio": null,
  "montoConvertido": null,
  "accionesPorRecibir": 100,
  "precioPorAccion": 100,
  "pagadoCompletamente": true,
  "porcentajePagado": 100,
  "totalPasivo": 0,
  "capitalSocial": 8000,
  "premium": 1500,
  "reserva": 500,
  "comprobantePagoArchivoId": "uuid-archivo"
}
```

---

### 21. Listar Aportes
```http
GET /api/v2/society-profile/:societyId/assembly/:flowId/contributions
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-aporte",
      "accionistaId": "uuid-accionista",
      "accionId": "uuid-accion",
      "tipoMoneda": "PEN",
      "monto": 10000,
      "fechaContribucion": "2024-01-01T00:00:00Z",
      "accionesPorRecibir": 100,
      "precioPorAccion": 100,
      "pagadoCompletamente": true,
      "capitalSocial": 8000,
      "premium": 1500,
      "reserva": 500
    }
  ]
}
```

---

## Códigos de Estado

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos o faltantes |
| 401 | Unauthorized | Token de autenticación inválido o expirado |
| 403 | Forbidden | No tienes permisos para esta operación |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto con el estado actual (ej: duplicado) |
| 500 | Internal Server Error | Error del servidor |

---

## Flujo Recomendado

### Para Crear una Sociedad Completa:

```
1. POST /api/v2/society-profile
2. PUT /api/v2/society-profile/:id/society
3. POST /api/v2/society-profile/:id/shareholder (múltiples)
4. PUT /api/v2/society-profile/:id/nominal-value
5. POST /api/v2/society-profile/:id/acction (múltiples)
6. POST /api/v2/society-profile/:id/share-assignment (múltiples)
7. PUT /api/v2/society-profile/:id/quorum
8. POST /api/v2/society-profile/:id/directorio/directores (múltiples)
9. PUT /api/v2/society-profile/:id/directorio
10. POST /api/v2/society-profile/:id/attorney-register/classes
11. POST /api/v2/society-profile/:id/attorney-register/attorneys (múltiples)
12. POST /api/v2/society-profile/:id/power-regime/powers (múltiples)
```

### Para Gestionar una Junta:

```
1. POST /api/v2/society-profile/:id/register-assembly
   → Retorna flowId
   
2. GET /api/v2/society-profile/:id/register-assembly/:flowId/snapshot/complete
   → Obtener snapshot completo
   
3. PUT /api/v2/society-profile/:id/assembly/:flowId/agenda-items
   → Definir puntos de agenda
   
4. GET /api/v2/society-profile/:id/register-assembly/:flowId/attendance
   → Ver asistencia pre-creada
   
5. PUT /api/v2/society-profile/:id/register-assembly/:flowId/attendance
   → Marcar asistentes
   
6. GET /api/v2/society-profile/:id/assembly/:flowId/participants
   → Ver aportantes potenciales
   
7. PUT /api/v2/society-profile/:id/assembly/:flowId/participants/:pid/contributor
   → Marcar aportantes
   
8. POST /api/v2/society-profile/:id/assembly/:flowId/contributions
   → Registrar aportes
```

---

**Última actualización:** 2025-12-04  
**Versión:** 1.0

