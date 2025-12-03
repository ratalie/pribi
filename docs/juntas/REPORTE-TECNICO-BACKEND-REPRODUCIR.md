# 🔧 REPORTE TÉCNICO: Cómo Reproducir los Bugs

**Para:** Equipo de Backend  
**De:** Equipo de Frontend  
**Fecha:** 3 de Diciembre 2025

---

## 🎯 OBJETIVO

Este documento contiene los **comandos cURL exactos** para reproducir cada bug identificado en los tests de integración.

---

## 🐛 BUG #1: segundaConvocatoria NO se elimina en Universal

### **Pasos para Reproducir:**

**1. Crear una junta:**
```bash
curl -X POST http://localhost:3000/api/v2/society-profile/1/register-assembly \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Response esperado:**
```json
{
  "success": true,
  "data": {
    "flowStructureId": "123"
  }
}
```

**2. Actualizar con Junta GENERAL (con 2 convocatorias):**
```bash
curl -X PUT http://localhost:3000/api/v2/society-profile/1/register-assembly/123/meeting-details \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoJunta": "JUNTA_GENERAL",
    "esAnualObligatoria": false,
    "instaladaEnConvocatoria": "PRIMERA",
    "presidenteAsistio": false,
    "secretarioAsistio": false,
    "primeraConvocatoria": {
      "direccion": "Av. Principal 123, Lima",
      "modo": "IN_PERSON",
      "fecha": "2025-01-15T00:00:00.000Z",
      "hora": "2025-01-15T14:30:00.000Z"
    },
    "segundaConvocatoria": {
      "direccion": "https://zoom.us/j/123456789",
      "modo": "VIRTUAL",
      "fecha": "2025-01-18T00:00:00.000Z",
      "hora": "2025-01-18T14:30:00.000Z"
    }
  }'
```

**3. Cambiar a Junta UNIVERSAL (sin segundaConvocatoria):**
```bash
curl -X PUT http://localhost:3000/api/v2/society-profile/1/register-assembly/123/meeting-details \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoJunta": "JUNTA_UNIVERSAL",
    "esAnualObligatoria": false,
    "instaladaEnConvocatoria": "PRIMERA",
    "presidenteAsistio": false,
    "secretarioAsistio": false,
    "primeraConvocatoria": {
      "direccion": "Av. Principal 123, Lima",
      "modo": "IN_PERSON",
      "fecha": "2025-01-15T00:00:00.000Z",
      "hora": "2025-01-15T14:30:00.000Z"
    }
  }'
```

**4. Obtener los detalles:**
```bash
curl -X GET http://localhost:3000/api/v2/society-profile/1/register-assembly/123/meeting-details \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**❌ PROBLEMA:**
```json
{
  "meetingType": "JUNTA_UNIVERSAL",
  "firstCall": { ... },
  "secondCall": {  // ❌ ESTO NO DEBERÍA ESTAR
    "Address": "https://zoom.us/j/123456789",
    ...
  }
}
```

**✅ ESPERADO:**
```json
{
  "meetingType": "JUNTA_UNIVERSAL",
  "firstCall": { ... },
  "secondCall": null  // ← Debe ser null o no existir
}
```

---

## 🐛 BUG #2: Error de Validación con Autoridades

### **Pasos para Reproducir:**

**1. Crear junta (igual que arriba)**

**2. Actualizar con datos de autoridades:**
```bash
curl -X PUT http://localhost:3000/api/v2/society-profile/1/register-assembly/123/meeting-details \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoJunta": "JUNTA_UNIVERSAL",
    "esAnualObligatoria": false,
    "instaladaEnConvocatoria": "PRIMERA",
    "presidenteId": "uuid-presidente-123",
    "secretarioId": "uuid-secretario-456",
    "presidenteAsistio": true,
    "secretarioAsistio": false,
    "nombreOtroSecretario": "Juan Pérez Gómez",
    "primeraConvocatoria": {
      "direccion": "Av. Principal 123, Lima",
      "modo": "IN_PERSON",
      "fecha": "2025-01-15T00:00:00.000Z",
      "hora": "2025-01-15T14:30:00.000Z"
    }
  }'
```

**❌ PROBLEMA:**
```json
{
  "success": false,
  "message": "Error de validación",
  "code": 422
}
```

**PREGUNTA:**
¿Es válido enviar `secretarioId` Y `nombreOtroSecretario` al mismo tiempo?

**Casos posibles:**
1. `secretarioId` presente → `nombreOtroSecretario` debe ser null
2. `secretarioId` null → `nombreOtroSecretario` puede tener valor
3. ¿O el backend permite ambos?

---

## 🐛 BUG #3: Internal Server Error en Agenda Items

### **Pasos para Reproducir:**

**1. Crear junta:**
```bash
curl -X POST http://localhost:3000/api/v2/society-profile/1/register-assembly \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**2. Primer PUT (funciona):**
```bash
curl -X PUT http://localhost:3000/api/v2/society-profile/1/assembly/123/agenda-items \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
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
      "nombramientoApoderados": true,
      "nombramientoDirectores": false,
      "nombramientoNuevoDirectorio": false
    },
    "gestionSocialYResultadosEconomicos": {
      "pronunciamientoGestionSocialYResultados": false,
      "aplicacionResultados": false,
      "designacionAuditoresExternos": false
    }
  }'
```

**3. Segundo PUT al mismo flowId (falla):**
```bash
curl -X PUT http://localhost:3000/api/v2/society-profile/1/assembly/123/agenda-items \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "aumentoCapital": {
      "aportesDinerarios": false,
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
      "nombramientoApoderados": true,
      "nombramientoDirectores": false,
      "nombramientoNuevoDirectorio": false
    },
    "gestionSocialYResultadosEconomicos": {
      "pronunciamientoGestionSocialYResultados": false,
      "aplicacionResultados": false,
      "designacionAuditoresExternos": false
    }
  }'
```

**❌ PROBLEMA:**
```json
{
  "success": false,
  "message": "Internal server error",
  "code": 500
}
```

**PREGUNTA:**
- ¿Qué error aparece en los logs del servidor?
- ¿El endpoint hace INSERT o UPSERT?
- ¿Hay un constraint de UNIQUE que impide el segundo update?

---

## 🐛 BUG #4: BD Sucia con Juntas Antiguas

### **Pasos para Reproducir:**

**1. Listar juntas de la sociedad 1:**
```bash
curl -X GET http://localhost:3000/api/v2/society-profile/1/register-assembly/list \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**❌ PROBLEMA:**
```json
{
  "success": true,
  "data": [
    { "id": "1", "estado": "CREATED", ... },
    { "id": "2", "estado": "CREATED", ... },
    { "id": "3", "estado": "CREATED", ... },
    // ... 41 juntas más (44 total)
  ]
}
```

**✅ ESPERADO (para testing):**
```json
{
  "success": true,
  "data": []  // Vacío si es un test limpio
}
```

**RECOMENDACIÓN:**
- Crear BD de testing separada
- O implementar endpoint `POST /test/cleanup` que limpie datos de test
- O usar transacciones que se rollback después de cada test

---

## 📝 FORMATO DE PAYLOADS

### **MeetingDetails (PUT):**

```typescript
interface MeetingDetailsRequest {
  tipoJunta: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
  esAnualObligatoria: boolean;
  instaladaEnConvocatoria?: 'PRIMERA' | 'SEGUNDA';
  presidenteId?: string;
  secretarioId?: string;
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  nombreOtroPresidente?: string;
  nombreOtroSecretario?: string;
  primeraConvocatoria?: {
    direccion: string;
    modo: 'IN_PERSON' | 'VIRTUAL';
    fecha: string; // ISO 8601
    hora: string;  // ISO 8601
  };
  segundaConvocatoria?: {
    direccion: string;
    modo: 'IN_PERSON' | 'VIRTUAL';
    fecha: string;
    hora: string;
  };
}
```

### **AgendaItems (PUT):**

```typescript
interface AgendaItemsRequest {
  aumentoCapital: {
    aportesDinerarios: boolean;
    aporteNoDinerario: boolean;
    capitalizacionDeCreditos: boolean;
  };
  remocion: {
    remocionGerenteGeneral: boolean;
    remocionApoderados: boolean;
    remocionDirectores: boolean;
  };
  nombramiento: {
    nombramientoGerenteGeneral: boolean;
    nombramientoApoderados: boolean;
    nombramientoDirectores: boolean;
    nombramientoNuevoDirectorio: boolean;
  };
  gestionSocialYResultadosEconomicos: {
    pronunciamientoGestionSocialYResultados: boolean;
    aplicacionResultados: boolean;
    designacionAuditoresExternos: boolean;
  };
}
```

---

## 🔍 LOGS DEL SERVIDOR

**Por favor compartir logs del servidor para:**

1. **Agenda Items - 500 Error:**
   ```
   PUT /api/v2/society-profile/1/assembly/123/agenda-items
   (Segundo update al mismo flowId)
   ```

2. **Meeting Details - 422 Error:**
   ```
   PUT /api/v2/society-profile/1/register-assembly/123/meeting-details
   (Con presidenteId, secretarioId y nombreOtroSecretario)
   ```

Esto nos ayudará a entender si el problema es:
- Validación incorrecta
- Constraint de BD
- Lógica de negocio
- Otro

---

## ✅ CHECKLIST PARA BACKEND

- [ ] Revisar logs del servidor para el 500 Error
- [ ] Verificar que agenda-items use UPSERT (no INSERT)
- [ ] Eliminar `secondCall` cuando `meetingType === 'JUNTA_UNIVERSAL'`
- [ ] Documentar reglas de validación de autoridades
- [ ] Implementar BD de testing aislada (o cleanup endpoint)
- [ ] Re-ejecutar tests después de correcciones
- [ ] Confirmar que attendance se crea automáticamente al POST /register-assembly

---

**¿Necesitan más información? Estamos disponibles para pair programming** 🤝

