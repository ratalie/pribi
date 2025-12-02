# ⚠️ ISSUE: Backend devuelve PascalCase en lugar de camelCase

**Fecha**: 2 de Diciembre 2025  
**Severidad**: Media  
**Estado**: ⚠️ Workaround implementado en frontend

---

## 🐛 PROBLEMA

### **Endpoint afectado:**
```
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
```

### **Comportamiento esperado:**
El backend debería devolver propiedades en **camelCase** según el estándar JavaScript/TypeScript:

```json
{
  "firstCall": {
    "address": "manza 125",   // ✅ camelCase
    "mode": "IN_PERSON",      // ✅ camelCase
    "date": "2025-12-02...",  // ✅ camelCase
    "time": "2025-12-02..."   // ✅ camelCase
  }
}
```

### **Comportamiento actual:**
El backend devuelve propiedades en **PascalCase**:

```json
{
  "firstCall": {
    "Address": "manza 125",   // ❌ PascalCase
    "Mode": "IN_PERSON",      // ❌ PascalCase
    "Date": "2025-12-02...",  // ❌ PascalCase
    "Time": "2025-12-02..."   // ❌ PascalCase
  }
}
```

---

## 💥 IMPACTO

### **Síntoma en frontend:**
1. Usuario marca **PRESENCIAL** y guarda con dirección "manza 125"
2. Al regresar a la página, se muestra **VIRTUAL** por defecto
3. El campo de link está vacío (porque buscaba `dto.address` que es `undefined`)

### **Causa:**
El mapper del frontend espera `dto.address` (camelCase) pero el backend devuelve `dto.Address` (PascalCase).

---

## ✅ SOLUCIÓN TEMPORAL (Frontend)

### **Archivo:** `app/core/hexag/juntas/infrastructure/mappers/meeting-details.mapper.ts`

```typescript
private static meetingCallDtoToEntity(dto: MeetingCallDto | any): Convocatoria {
  // ⚠️ WORKAROUND: Manejar PascalCase del backend
  const address = dto.address || dto.Address || '';
  const mode = dto.mode || dto.Mode || 'IN_PERSON';
  const date = dto.date || dto.Date;
  const time = dto.time || dto.Time;

  return {
    direccion: address,
    modo: mode === 'IN_PERSON' ? ModoReunion.PRESENCIAL : ModoReunion.VIRTUAL,
    fecha: date ? new Date(date) : new Date(),
    hora: time ? new Date(time) : new Date(),
  };
}
```

**Ventajas:**
- ✅ Funciona con ambos formatos (PascalCase y camelCase)
- ✅ No rompe si el backend se arregla en el futuro
- ✅ Solución inmediata sin esperar al backend

**Desventajas:**
- ⚠️ Workaround temporal, no es la solución correcta
- ⚠️ Oculta el problema real del backend

---

## 🔧 SOLUCIÓN CORRECTA (Backend)

### **Archivo afectado (backend):**
Probablemente en el mapper o serializer de NestJS que devuelve `GeneralMeetingConfigDto`.

### **Cambio necesario:**
```typescript
// ❌ ACTUAL (PascalCase)
{
  Address: "...",
  Mode: "...",
  Date: "...",
  Time: "..."
}

// ✅ CORRECTO (camelCase)
{
  address: "...",
  mode: "...",
  date: "...",
  time: "..."
}
```

### **¿Dónde arreglar?**
Revisar el Value Object o Entity en el backend que serializa `MeetingCall`.

**Posible ubicación:**
- `/home/yull23/legal-factory/backend/src/modules/flows-v2/register-assembly/2.meeting-details/domain/entities/meetin-calls.vo.ts` (probablemente)

---

## 📋 PLAN DE ACCIÓN

### **Inmediato (✅ HECHO):**
- [x] Implementar workaround en frontend
- [x] Documentar el problema
- [x] Verificar que funciona

### **Corto plazo (Backend):**
- [ ] Revisar el Value Object `MeetingCallsVO` en el backend
- [ ] Cambiar propiedades de PascalCase a camelCase
- [ ] Actualizar tests del backend
- [ ] Deploy del fix

### **Después del fix del backend:**
- [ ] Remover el workaround del frontend (opcional, no molesta dejarlo)
- [ ] Verificar que todo siga funcionando

---

## ✅ VERIFICACIÓN

```bash
# Verificar que el workaround funciona
npm run test:juntas:shared

# Resultado esperado: 62/62 tests pasando ✅
```

---

## 📝 NOTAS

1. Este problema probablemente afecta otros endpoints similares del backend
2. Es un problema de consistencia en la convención de nombres
3. El workaround es seguro y no introduce bugs

---

**Estado**: ⚠️ Problema documentado y workaround implementado  
**Acción requerida**: Arreglar el backend cuando sea posible

