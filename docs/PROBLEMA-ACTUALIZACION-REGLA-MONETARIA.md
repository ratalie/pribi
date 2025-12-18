# 🔍 Problema: Actualización de Regla Monetaria - 404 Not Found

## 📋 Descripción del Problema

Al intentar actualizar una regla monetaria mediante el endpoint `PUT /api/v2/society-profile/:id/powers-regime/powers-grants`, se recibe un error **404 Not Found** con el mensaje:

```
"Regla {reglaId} no encontrada"
```

## 🔍 Análisis del Problema

### **Payload del Frontend (Correcto):**

```json
{
  "id": "83c9b661-509b-4e03-a9bf-0d63bbdb4d32",
  "esIrrevocable": false,
  "fechaInicio": "2025-12-18T06:55:22.737Z",
  "tieneReglasFirma": true,
  "reglasMonetarias": [
    {
      "accion": "update",
      "id": "9ac302e9-c422-4fe8-82da-b3939d40f17c",
      "tipoMoneda": "PEN",
      "montoDesde": 30,
      "tipoLimite": "MONTO",
      "montoHasta": 40,
      "tipoFirma": "SOLA_FIRMA"
    }
  ]
}
```

### **Estado Actual del PowerGrant:**

Según el GET `/api/v2/society-profile/:id/powers-regime/powers-grants`, el powerGrant con ID `83c9b661-509b-4e03-a9bf-0d63bbdb4d32` tiene:

```json
{
  "id": "83c9b661-509b-4e03-a9bf-0d63bbdb4d32",
  "tieneReglasFirma": false,
  "reglasMonetarias": []  // ⚠️ VACÍO - No tiene reglas
}
```

### **Causa del Error:**

El frontend está intentando **actualizar** (`accion: "update"`) una regla con ID `9ac302e9-c422-4fe8-82da-b3939d40f17c` que **NO EXISTE** en el powerGrant.

El backend está funcionando correctamente: cuando intentas actualizar una regla que no existe, responde con **404 Not Found**.

---

## ✅ Solución: Lógica en el Frontend

### **Problema Identificado:**

El frontend debe verificar si la regla existe antes de decidir qué acción tomar.

### **Solución Recomendada:**

Antes de enviar el payload, el frontend debe:

1. **Verificar si la regla existe** en el powerGrant actual
2. **Decidir la acción correcta:**
   - Si la regla **existe** → usar `accion: "update"`
   - Si la regla **NO existe** → usar `accion: "add"`

### **Ejemplo de Lógica en Frontend:**

```typescript
// Pseudocódigo
const powerGrant = await getPowerGrant(powerGrantId);
const reglaExiste = powerGrant.reglasMonetarias.some(
  r => r.id === reglaId
);

const accion = reglaExiste ? 'update' : 'add';

const payload = {
  id: powerGrantId,
  reglasMonetarias: [
    {
      accion: accion, // ✅ "add" o "update" según corresponda
      id: reglaId,
      // ... resto de campos
    }
  ]
};
```

---

## 🔧 Comportamiento Actual del Backend

### **Endpoint:** `PUT /api/v2/society-profile/:id/powers-regime/powers-grants`

### **Acciones Soportadas:**

1. **`accion: "add"`** → Crea una nueva regla monetaria
2. **`accion: "update"`** → Actualiza una regla existente (debe existir)
3. **`accion: "remove"`** → Elimina una regla existente (debe existir)
4. **`accion: "updateSigners"`** → Actualiza los firmantes de una regla existente

### **Validaciones del Backend:**

- ✅ Si `accion: "update"` y la regla **NO existe** → **404 Not Found**
- ✅ Si `accion: "update"` y la regla **existe** → Actualiza correctamente
- ✅ Si `accion: "add"` → Crea la regla sin importar si existe o no (usa upsert)

---

## 📝 Resumen

| Aspecto | Estado |
|---------|--------|
| **Payload del Frontend** | ✅ Correcto |
| **Backend** | ✅ Funcionando correctamente |
| **Problema** | ⚠️ Lógica del frontend: intenta actualizar regla inexistente |
| **Solución** | ✅ Frontend debe verificar existencia antes de decidir acción |

---

## 🎯 Recomendación

**No modificar el backend.** El comportamiento actual es correcto y esperado:
- Si intentas actualizar algo que no existe → Error 404 (correcto)
- Si quieres crear algo nuevo → Usa `accion: "add"`

El frontend debe implementar la lógica para decidir correctamente entre `"add"` y `"update"` basándose en el estado actual del powerGrant.

---

## 📚 Referencias

- **Endpoint:** `PUT /api/v2/society-profile/:id/powers-regime/powers-grants`
- **Handler:** `UpdateGrantPowerHandler`
- **Entidad:** `PowerGrant.updateRegla()`
- **Error:** `NotFoundException` en `getRuleById()`

