# 🚀 Comandos para Ejecutar la Implementación del Discriminante

## ✅ **Paso 1: Verificar que la Migración se Aplicó Correctamente**

```bash
# Verificar que la migración está aplicada
npx prisma migrate status
```

**Resultado esperado:** Debe mostrar que la migración `20251218022822_add_source_flow_discriminant` está aplicada.

---

## ✅ **Paso 2: Generar Prisma Client (si es necesario)**

```bash
# Generar el cliente de Prisma con los nuevos campos
npx prisma generate
```

**Nota:** Esto ya se ejecutó automáticamente cuando aplicamos la migración, pero si hay problemas, ejecútalo manualmente.

---

## ✅ **Paso 3: Compilar el Proyecto**

```bash
# Compilar TypeScript para verificar que no hay errores
npm run build
```

**Resultado esperado:** Debe compilar sin errores.

---

## ✅ **Paso 4: Iniciar el Servidor (si no está corriendo)**

```bash
# Iniciar el servidor en modo desarrollo
npm run start:dev
```

**O si prefieres modo producción:**

```bash
npm run start:prod
```

---

## ✅ **Paso 5: Verificar que el Servidor Inicia Correctamente**

Revisa los logs del servidor. Debe iniciar sin errores de dependencias.

---

## 📋 **Resumen de Cambios Implementados**

### **Base de Datos:**

- ✅ Campos `sourceFlow`, `sourceFlowId`, `sourceCreatedAt` agregados a `Attorney` y `DirectorV2`
- ✅ Migración aplicada

### **Código:**

- ✅ Entidades de dominio actualizadas
- ✅ Repositorios actualizados
- ✅ Handlers de creación actualizados (sociedad y junta)
- ✅ Servicio `GetMeetingDateService` creado
- ✅ Queries y SELECTs actualizados
- ✅ Snapshot filtra por `sourceFlow`
- ✅ Clonación mantiene campos discriminantes

---

## 🧪 **Cómo Probar**

### **1. Crear un Apoderado en Registro de Sociedad:**

```bash
POST /api/v2/society-profile/:societyId/attorney
```

**Resultado esperado:** El apoderado debe tener:

```json
{
  "sourceFlow": "SOCIETY",
  "sourceFlowId": "10", // structureId
  "sourceCreatedAt": "2024-01-01T00:00:00.000Z" // registrationDate del RUC
}
```

### **2. Crear un Apoderado en Junta:**

```bash
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
```

**Resultado esperado:** El apoderado debe tener:

```json
{
  "sourceFlow": "ASSEMBLY",
  "sourceFlowId": "21", // flowStructureId
  "sourceCreatedAt": "2024-01-15T10:30:00.000Z" // Fecha de la junta según tipo
}
```

### **3. Obtener Snapshot:**

```bash
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

**Resultado esperado:**

- ✅ Siempre incluye apoderados/directores con `sourceFlow: "SOCIETY"`
- ✅ Incluye apoderados/directores de juntas anteriores (`sourceFlow: "ASSEMBLY"` con `sourceFlowId != flowStructureId actual`)
- ❌ Excluye apoderados/directores de la junta actual (`sourceFlow: "ASSEMBLY"` con `sourceFlowId == flowStructureId actual`)
- ✅ El `gerenteGeneral` SIEMPRE es el de SOCIETY (nunca de una junta)

### **4. Obtener Flow Actions (Remociones/Designaciones):**

```bash
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Resultado esperado:** Debe incluir campos discriminantes en cada apoderado/director:

```json
{
  "data": [
    {
      "id": "uuid",
      "sourceFlow": "SOCIETY",
      "sourceFlowId": "10",
      "sourceCreatedAt": "2024-01-01T00:00:00.000Z",
      "isCandidate": true,
      "candidateStatus": "CANDIDATE"
    }
  ]
}
```

---

## ⚠️ **Notas Importantes**

1. **Registros Antiguos:** Los apoderados/directores creados antes de esta implementación tendrán `sourceFlow: null`. El sistema usa lógica de fallback basada en `createdAt <= snapshotCreatedAt`.

2. **Fechas de Junta:** Si la junta aún no tiene `meetingConfig` configurado, se usa `createdAt` del `meetingConfig` como fallback.

3. **Clonación:** Al clonar el snapshot, los apoderados/directores clonados mantienen `sourceFlow: "SOCIETY"` para preservar el origen.

---

## 🔍 **Verificar en Base de Datos**

Puedes verificar directamente en la BD:

```sql
-- Ver apoderados con sus campos discriminantes
SELECT id, "sourceFlow", "sourceFlowId", "sourceCreatedAt", "createdAt"
FROM "Attorney"
WHERE status = true
ORDER BY "createdAt" DESC
LIMIT 10;

-- Ver directores con sus campos discriminantes
SELECT id, "sourceFlow", "sourceFlowId", "sourceCreatedAt", "createdAt"
FROM "DirectorV2"
WHERE status = true
ORDER BY "createdAt" DESC
LIMIT 10;
```

---

## ✅ **Checklist Final**

- [ ] Migración aplicada correctamente
- [ ] Prisma Client generado
- [ ] Proyecto compila sin errores
- [ ] Servidor inicia correctamente
- [ ] Crear apoderado en sociedad funciona
- [ ] Crear apoderado en junta funciona
- [ ] Snapshot filtra correctamente
- [ ] Flow Actions incluyen campos discriminantes

---

¡Listo para probar! 🚀
# 📋 Lógica de Filtrado del Snapshot

## 🎯 Objetivo

El snapshot debe mantener **consistencia** y **no mezclarse** con los cambios de la junta actual. Debe mostrar:
- ✅ Estado original de la sociedad (SOCIETY)
- ✅ Cambios de juntas anteriores (ya aplicados)
- ❌ NO cambios de la junta actual (aún no aplicados)

---

## 📊 Lógica de Filtrado

### **Para Apoderados y Directores:**

```typescript
// 1. ✅ SIEMPRE incluir sourceFlow: "SOCIETY"
if (sourceFlow === 'SOCIETY') {
  return true; // ✅ Incluir
}

// 2. ✅ Incluir sourceFlow: "ASSEMBLY" de juntas anteriores
if (sourceFlow === 'ASSEMBLY' && sourceFlowId !== currentFlowStructureId) {
  return true; // ✅ Incluir (junta anterior)
}

// 3. ❌ Excluir sourceFlow: "ASSEMBLY" de la junta actual
if (sourceFlow === 'ASSEMBLY' && sourceFlowId === currentFlowStructureId) {
  return false; // ❌ Excluir (junta actual)
}

// 4. Si sourceFlow es null (registro antiguo), usar lógica de fallback
if (sourceFlow === null && createdAt <= snapshotCreatedAt) {
  return true; // ✅ Incluir (del snapshot original)
}
```

---

## 🔍 Ejemplo Práctico

### **Escenario:**
- **Sociedad creada:** 2024-01-01
  - Apoderado A (SOCIETY, sourceFlowId: "10")
  - Apoderado B (SOCIETY, sourceFlowId: "10")
  
- **Junta 1 (flowStructureId: 21):** 2024-06-01
  - Apoderado C (ASSEMBLY, sourceFlowId: "21")
  
- **Junta 2 (flowStructureId: 25):** 2024-12-01 (ACTUAL)
  - Apoderado D (ASSEMBLY, sourceFlowId: "25")

### **Snapshot de Junta 2 (flowStructureId: 25):**

**Incluye:**
- ✅ Apoderado A (SOCIETY)
- ✅ Apoderado B (SOCIETY)
- ✅ Apoderado C (ASSEMBLY, sourceFlowId: "21" ≠ "25") ← Junta anterior

**Excluye:**
- ❌ Apoderado D (ASSEMBLY, sourceFlowId: "25" === "25") ← Junta actual

---

## 👔 Gerente General

### **Regla Especial:**

El `gerenteGeneral` **SIEMPRE** debe ser el de SOCIETY:

```typescript
const gerenteGeneral = attorneys.find((attorney) => {
  const isGerenteGeneral = attorneyClass?.name === 'Gerente General';
  // ✅ Solo incluir si es Gerente General Y es de SOCIETY
  return isGerenteGeneral && attorney.sourceFlow === 'SOCIETY';
});
```

**Razón:** El gerente general es un cargo permanente de la sociedad, no puede ser reemplazado por cambios de una junta hasta que se apliquen.

---

## 📤 Estructura de Respuesta del Snapshot

```json
{
  "attorneys": [
    {
      "id": "uuid-1",
      "sourceFlow": "SOCIETY",
      "sourceFlowId": "10",
      "sourceCreatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "sourceFlow": "SOCIETY",
      "sourceFlowId": "10",
      "sourceCreatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-3",
      "sourceFlow": "ASSEMBLY",
      "sourceFlowId": "21",  // ← Junta anterior (diferente a la actual)
      "sourceCreatedAt": "2024-06-01T10:30:00.000Z"
    }
    // ❌ NO incluye apoderados con sourceFlowId: "25" (junta actual)
  ],
  "gerenteGeneral": {
    "id": "uuid-1",
    "sourceFlow": "SOCIETY",  // ✅ SIEMPRE de SOCIETY
    "sourceFlowId": "10",
    "sourceCreatedAt": "2024-01-01T00:00:00.000Z"
  },
  "directors": [
    {
      "id": "uuid-4",
      "sourceFlow": "SOCIETY",
      "sourceFlowId": "10",
      "sourceCreatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## ✅ Beneficios

1. **Consistencia:** El snapshot no cambia durante la junta actual
2. **Histórico:** Muestra cambios de juntas anteriores ya aplicados
3. **Claridad:** Separa claramente lo que es de la sociedad vs. lo que es de juntas
4. **Gerente General:** Siempre muestra el gerente general original de la sociedad

---

## 🔄 Flujo Completo

```
1. Crear Junta → Se clona snapshot (SOCIETY)
2. Durante Junta → Se crean apoderados/directores (ASSEMBLY, sourceFlowId: junta actual)
3. Snapshot → Solo muestra SOCIETY + juntas anteriores (excluye junta actual)
4. Aplicar Cambios → Los apoderados/directores de la junta se convierten en parte de la sociedad
5. Nueva Junta → El snapshot incluye los cambios de la junta anterior
```

---

## 📝 Notas

- Los apoderados/directores de la junta actual solo aparecen en los endpoints de Flow Actions (remociones/designaciones)
- El snapshot es inmutable durante la junta actual
- El gerente general siempre es el de SOCIETY, independientemente de cambios en juntas

