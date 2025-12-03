# ✅ CHECKLIST: Correcciones Necesarias en Backend

**Para:** Backend Team  
**Urgencia:** 🔴 Alta  
**Tiempo Estimado:** 2-4 horas

---

## 🔴 BUG #1: Internal Server Error en Agenda Items (CRÍTICO)

**Endpoint:** `PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items`

### **Problema:**
- ✅ Primer PUT: Funciona
- ❌ Segundo PUT (mismo flowId): Error 500

### **Causa Probable:**
Endpoint hace `INSERT` en lugar de `UPSERT`

### **Solución:**
```typescript
// ❌ INCORRECTO
async updateAgendaItems(flowId, data) {
  await db.agendaItems.create({ flowId, ...data });  // Falla si ya existe
}

// ✅ CORRECTO
async updateAgendaItems(flowId, data) {
  await db.agendaItems.upsert({
    where: { flowId },
    create: data,
    update: data,
  });
}
```

### **Cómo Probar:**
```bash
# 1. Crear junta
POST /register-assembly → flowId=123

# 2. Primer update (debe funcionar)
PUT /assembly/123/agenda-items → ✅ OK

# 3. Segundo update (debe funcionar, pero falla)
PUT /assembly/123/agenda-items → ❌ 500 Error
```

**Checklist:**
- [ ] Cambiar INSERT por UPSERT
- [ ] Probar segundo update
- [ ] Verificar que NO haya constraint UNIQUE problemático
- [ ] Compartir logs del error 500

---

## 🔴 BUG #2: segundaConvocatoria NO se Elimina (CRÍTICO)

**Endpoint:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details`

### **Problema:**
Cuando el frontend envía `tipoJunta: "JUNTA_UNIVERSAL"` (sin `segundaConvocatoria`), el backend NO la elimina de la BD.

### **Escenario:**
```
1. User crea Junta GENERAL (con 2 convocatorias) → ✅ OK
2. User cambia a Junta UNIVERSAL → ❌ segundaConvocatoria sigue en BD
3. User hace GET → ❌ Recibe segundaConvocatoria que no debería existir
```

### **Request que enviamos:**
```json
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "primeraConvocatoria": { ... }
  // ⚠️ NO enviamos "segundaConvocatoria"
}
```

### **Response incorrecta:**
```json
{
  "meetingType": "JUNTA_UNIVERSAL",
  "firstCall": { ... },
  "secondCall": { ... }  // ❌ NO DEBERÍA ESTAR
}
```

### **Solución:**
```typescript
async updateMeetingDetails(flowId, data) {
  if (data.tipoJunta === 'JUNTA_UNIVERSAL') {
    // Eliminar explícitamente segundaConvocatoria
    await db.meetingDetails.update({
      where: { flowId },
      data: {
        ...data,
        secondCall: null, // ← IMPORTANTE
      },
    });
  } else {
    // JUNTA_GENERAL: guardar ambas
    await db.meetingDetails.update({
      where: { flowId },
      data,
    });
  }
}
```

**Checklist:**
- [ ] Agregar lógica para eliminar `secondCall` en Universal
- [ ] Probar cambio de GENERAL → UNIVERSAL
- [ ] Probar update de Universal existente
- [ ] Verificar GET después del cambio

---

## 🟡 BUG #3: Error de Validación en Autoridades (MEDIO)

**Endpoint:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details`

### **Problema:**
El backend rechaza con **422 Unprocessable Entity** cuando enviamos datos de autoridades.

### **Request que enviamos:**
```json
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "presidenteId": "uuid-presidente-123",
  "secretarioId": "uuid-secretario-456",
  "presidenteAsistio": true,
  "secretarioAsistio": false,
  "nombreOtroSecretario": "Juan Pérez Gómez",
  "primeraConvocatoria": { ... }
}
```

### **Response:**
```json
{
  "success": false,
  "message": "Error de validación",
  "code": 422
}
```

### **Pregunta para Backend:**
¿Es válido enviar `secretarioId` Y `nombreOtroSecretario` juntos?

**Opciones:**
1. Son mutuamente excluyentes (solo uno a la vez)
2. Se pueden enviar ambos (backend decide cuál usar)
3. Hay otra regla de negocio

**Checklist:**
- [ ] Compartir detalle del error de validación
- [ ] Documentar reglas de negocio para autoridades
- [ ] Actualizar schema/DTO si es necesario
- [ ] Probar con diferentes combinaciones

---

## 🟡 BUG #4: Base de Datos Sucia (MEDIO)

**Endpoint:** `GET /api/v2/society-profile/:societyId/register-assembly/list`

### **Problema:**
La BD tiene **41 juntas viejas** que no se limpian.

### **Impacto:**
- Tests no son reproducibles
- Imposible saber si algo funciona
- Tests esperan empezar con BD limpia

### **Solución Opción A: BD de Testing**
```typescript
// En tests del backend
beforeAll(async () => {
  process.env.DATABASE_URL = 'postgresql://test_db';
  await db.migrate();
});

afterAll(async () => {
  await db.dropDatabase();
});
```

### **Solución Opción B: Endpoint de Cleanup**
```typescript
// Solo disponible en development
POST /api/v2/test/cleanup
{
  "clearJuntas": true,
  "clearSocieties": false,
  ...
}
```

**Checklist:**
- [ ] Implementar BD de testing aislada
- [ ] O implementar endpoint de cleanup
- [ ] Documentar cómo limpiar BD para tests
- [ ] Agregar a CI/CD pipeline

---

## ❓ INFORMACIÓN FALTANTE

### **Attendance (Asistencia)**

**Endpoint:** `GET /api/v2/society-profile/:societyId/register-assembly/:flowId/attendance`

### **Problema:**
El endpoint responde `200 OK` pero con array vacío `[]`

### **Según Documentación:**
> Los registros de asistencia se crean **automáticamente** al crear la junta (POST /register-assembly)

### **Realidad:**
```bash
POST /register-assembly → flowId=123
GET /attendance/123 → { data: [] }  # ❌ Vacío
```

### **Pregunta:**
¿Se implementó la creación automática de registros de asistencia?

**Checklist:**
- [ ] Verificar que POST /register-assembly cree registros de attendance
- [ ] Confirmar que se crea 1 registro por accionista del snapshot
- [ ] Documentar si cambió el comportamiento
- [ ] Probar GET /attendance después de crear junta

---

## 📋 RESUMEN DE CORRECCIONES

```
┌─────────────────────────────────────────────────┐
│  PRIORIDAD │  BUG                    │  TIEMPO  │
├─────────────────────────────────────────────────┤
│  🔴 ALTA   │  Agenda Items 500       │  1h      │
│  🔴 ALTA   │  secondCall no elimina  │  30min   │
│  🟡 MEDIA  │  Validación autoridades │  1h      │
│  🟡 MEDIA  │  BD Sucia               │  2h      │
│  🟢 BAJA   │  Attendance vacío       │  30min   │
├─────────────────────────────────────────────────┤
│  TOTAL ESTIMADO:                      │  5h      │
└─────────────────────────────────────────────────┘
```

---

## 🚀 DESPUÉS DE LAS CORRECCIONES

**Frontend ejecutará:**
```bash
TEST_USE_MSW=false npm run test:juntas:shared
```

**Esperamos:**
```
✅ Test Files:  3 passed (3)
✅ Tests:      62 passed (62)
⏱️  Duration:  ~3-5s
```

---

## 📞 SIGUIENTE PASO

1. **Backend revisa** este checklist
2. **Backend implementa** las 4 correcciones
3. **Backend avisa** cuando esté listo
4. **Frontend re-ejecuta** tests
5. **Confirmamos** que todo funcione al 100%

---

**¿Listos para empezar? 💪**

