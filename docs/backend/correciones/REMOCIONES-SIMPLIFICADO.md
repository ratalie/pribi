 # 🎯 REMOCIONES: Versión Simplificada

## 📋 Estructura Simplificada

### **Solo 3 Campos Necesarios**

```typescript
{
  isCandidate: boolean,              // ¿Está marcado/seleccionado?
  candidateStatus: string | null,    // Estado actual
  flowActionId: string | null,      // ID del FlowAction
}
```

---

## 🔄 Estados para Remociones

### **Flujo de Estados**

```
1. No marcado
   isCandidate: false
   candidateStatus: null
   ↓
2. Marcar (PUT con "CANDIDATO")
   isCandidate: true
   candidateStatus: "CANDIDATE"
   ↓
3. Votar (PUT /votes)
   ↓
4. Actualizar resultado:
   - Si se aprueba (PUT con "ELEGIDO"):
     isCandidate: true
     candidateStatus: "ELECTED"  // = REMOVED (removido)

   - Si se rechaza (PUT con "NO_ELEGIDO"):
     isCandidate: true
     candidateStatus: "NOT_ELECTED"  // = NOT_REMOVED (no removido)

   - Si se desmarca (PUT con "DESMARCAR"):
     isCandidate: false
     candidateStatus: null
```

---

## 📊 Interpretación de Estados en Remociones

| `isCandidate` | `candidateStatus` | Significado                             |
| ------------- | ----------------- | --------------------------------------- |
| `false`       | `null`            | No marcado para remoción                |
| `true`        | `"CANDIDATE"`     | Marcado, pendiente de votación          |
| `true`        | `"ELECTED"`       | **Removido** (aprobado en votación)     |
| `true`        | `"NOT_ELECTED"`   | **No removido** (rechazado en votación) |

**⚠️ NOTA:** En remociones, `ELECTED` significa "removido" y `NOT_ELECTED` significa "no removido". El enum se mantiene igual para compatibilidad con la base de datos.

---

## 🔄 Flujo Completo

### **1. Marcar para Remoción**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
{
  "directorId": "uuid-1",
  "candidatoEstado": "CANDIDATO"
}
```

**Respuesta GET:**

```json
{
  "isCandidate": true,
  "candidateStatus": "CANDIDATE",
  "flowActionId": "uuid-flow-action-1"
}
```

**✅ Se crea automáticamente el VoteItem**

---

### **2. Votar**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
{
  "contexto": "REMOCION_DIRECTORES",
  "items": [
    {
      "accion": "updateVote",
      "itemId": "uuid-item-1",
      "votos": [...]
    }
  ]
}
```

---

### **3. Actualizar Resultado: Removido**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
{
  "directorId": "uuid-1",
  "candidatoEstado": "ELEGIDO"
}
```

**Respuesta GET:**

```json
{
  "isCandidate": true,
  "candidateStatus": "ELECTED", // = REMOVED
  "flowActionId": "uuid-flow-action-1"
}
```

---

### **4. Actualizar Resultado: No Removido**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
{
  "directorId": "uuid-1",
  "candidatoEstado": "NO_ELEGIDO"
}
```

**Respuesta GET:**

```json
{
  "isCandidate": true,
  "candidateStatus": "NOT_ELECTED", // = NOT_REMOVED
  "flowActionId": "uuid-flow-action-1"
}
```

---

### **5. Desmarcar**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
{
  "directorId": "uuid-1",
  "candidatoEstado": "DESMARCAR"
}
```

**Respuesta GET:**

```json
{
  "isCandidate": false,
  "candidateStatus": null,
  "flowActionId": null
}
```

**✅ Se elimina automáticamente el VoteItem**

---

## ✅ Ventajas de la Simplificación

1. **Solo 2 campos principales**: `isCandidate` y `candidateStatus`
2. **Lógica clara**:
   - `isCandidate: true` = está en proceso
   - `candidateStatus: "CANDIDATE"` = pendiente votación
   - `candidateStatus: "ELECTED"` = removido (en remociones)
   - `candidateStatus: "NOT_ELECTED"` = no removido (en remociones)
3. **Menos código**: Eliminamos campos redundantes
4. **Frontend simple**: Solo necesita estos 2 campos

---

## 🎯 Mapeo de Valores

### **Input del Frontend → Estado Interno**

| Frontend envía | Se guarda como     | Significado en Remociones   |
| -------------- | ------------------ | --------------------------- |
| `"CANDIDATO"`  | `CANDIDATE`        | Marcado, pendiente votación |
| `"ELEGIDO"`    | `ELECTED`          | Removido (aprobado)         |
| `"NO_ELEGIDO"` | `NOT_ELECTED`      | No removido (rechazado)     |
| `"DESMARCAR"`  | `null` (desactiva) | Ya no está en proceso       |

### **Estado Interno → Respuesta GET**

| Estado en BD         | `candidateStatus` en GET | Significado        |
| -------------------- | ------------------------ | ------------------ |
| `CANDIDATE`          | `"CANDIDATE"`            | Pendiente votación |
| `ELECTED`            | `"ELECTED"`              | **Removido**       |
| `NOT_ELECTED`        | `"NOT_ELECTED"`          | **No removido**    |
| `null` (desactivado) | `null`                   | No marcado         |

---

## 📝 Ejemplo de Uso en Frontend

```typescript
// Verificar si está marcado
if (director.isCandidate) {
  // Está en proceso de remoción

  if (director.candidateStatus === 'CANDIDATE') {
    // Pendiente de votación
    mostrarEstado('Pendiente votación');
  } else if (director.candidateStatus === 'ELECTED') {
    // Removido
    mostrarEstado('Removido');
  } else if (director.candidateStatus === 'NOT_ELECTED') {
    // No removido
    mostrarEstado('No removido');
  }
} else {
  // No está marcado
  mostrarEstado('No marcado');
}
```

---

## ✅ Conclusión

Para remociones, el sistema es muy simple:

1. **Marcar**: `PUT` con `"CANDIDATO"` → `isCandidate: true, candidateStatus: "CANDIDATE"`
2. **Votar**: `PUT /votes` (automático con sincronización)
3. **Actualizar**: `PUT` con `"ELEGIDO"` o `"NO_ELEGIDO"` → `candidateStatus: "ELECTED"` o `"NOT_ELECTED"`
4. **Desmarcar**: `PUT` con `"DESMARCAR"` → `isCandidate: false, candidateStatus: null`

**Solo necesitas `isCandidate` y `candidateStatus` para manejar toda la lógica.** 🚀
