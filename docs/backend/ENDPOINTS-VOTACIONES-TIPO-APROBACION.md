# 📋 ENDPOINTS: tipoAprobacion en Votaciones

## ⚠️ IMPORTANTE: Cambio de Arquitectura

**ANTES:** `tipoAprobacion` estaba a nivel de `VoteSession` (sesión completa)  
**AHORA:** `tipoAprobacion` está a nivel de `VoteItem` (cada item individual)

Cada item puede tener su propio `tipoAprobacion` independiente.

---

## 🎯 Endpoints y Ejemplos

### **1. Crear Votación (POST)**

**Endpoint:**

```http
POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "id": "uuid-generado-frontend",
  "contexto": "APORTES_DINERARIOS",
  "modo": "SIMPLE",
  "items": [
    {
      "id": "uuid-item-generado-frontend",
      "orden": 0,
      "label": "Se aprueba el aumento de capital...",
      "tipoAprobacion": "SOMETIDO_A_VOTACION", // ✅ AQUÍ, en el item
      "votos": [
        {
          "id": "uuid-voto-generado-frontend",
          "accionistaId": "uuid-accionista-id",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

**Ejemplo TypeScript:**

```typescript
const crearVotacion = async (
  societyId: number,
  flowId: number,
  votantes: Asistente[],
  textoVotacion: string,
  tipoAprobacion: 'APROBADO_POR_TODOS' | 'SOMETIDO_A_VOTACION' = 'SOMETIDO_A_VOTACION',
) => {
  const votos =
    tipoAprobacion === 'SOMETIDO_A_VOTACION'
      ? votantes.map(votante => ({
          id: generateUUID(),
          accionistaId: votante.accionista.id,
          valor: 'A_FAVOR',
        }))
      : []; // Si es unanimidad, array vacío

  const payload = {
    id: generateUUID(),
    contexto: 'APORTES_DINERARIOS',
    modo: 'SIMPLE',
    items: [
      {
        id: generateUUID(),
        orden: 0,
        label: textoVotacion,
        tipoAprobacion, // ✅ AQUÍ, en el item
        votos,
      },
    ],
  };

  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json();
};
```

---

### **2. Actualizar tipoAprobacion de un Item (PUT)**

**Endpoint:**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "contexto": "APORTES_DINERARIOS",
  "items": [
    {
      "accion": "update",
      "id": "uuid-item-existente",
      "orden": 0,
      "label": "Se aprueba el aumento de capital...",
      "tipoAprobacion": "APROBADO_POR_TODOS" // ✅ Cambiar tipoAprobacion
    }
  ]
}
```

**Ejemplo TypeScript:**

```typescript
const cambiarTipoAprobacion = async (
  societyId: number,
  flowId: number,
  itemId: string,
  labelActual: string,
  ordenActual: number,
  nuevoTipo: 'APROBADO_POR_TODOS' | 'SOMETIDO_A_VOTACION',
) => {
  const payload = {
    contexto: 'APORTES_DINERARIOS',
    items: [
      {
        accion: 'update',
        id: itemId,
        orden: ordenActual, // Mantener orden existente
        label: labelActual, // Mantener label existente
        tipoAprobacion: nuevoTipo, // ✅ Actualizar tipoAprobacion
      },
    ],
  };

  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json();
};
```

---

### **3. Agregar Item con tipoAprobacion (PUT)**

**Endpoint:**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes
```

**Body:**

```json
{
  "contexto": "APORTES_DINERARIOS",
  "items": [
    {
      "accion": "add",
      "id": "uuid-item-generado-frontend",
      "orden": 0,
      "label": "Se aprueba el aumento de capital...",
      "tipoAprobacion": "SOMETIDO_A_VOTACION", // ✅ AQUÍ, en el item
      "votos": [
        {
          "id": "uuid-voto-generado-frontend",
          "accionistaId": "uuid-accionista-id",
          "valor": "A_FAVOR"
        }
      ]
    }
  ]
}
```

**Ejemplo TypeScript:**

```typescript
const agregarItemVotacion = async (
  societyId: number,
  flowId: number,
  textoVotacion: string,
  votantes: Asistente[],
  tipoAprobacion: 'APROBADO_POR_TODOS' | 'SOMETIDO_A_VOTACION' = 'SOMETIDO_A_VOTACION',
) => {
  const votos =
    tipoAprobacion === 'SOMETIDO_A_VOTACION'
      ? votantes.map(votante => ({
          id: generateUUID(),
          accionistaId: votante.accionista.id,
          valor: 'A_FAVOR',
        }))
      : [];

  const payload = {
    contexto: 'APORTES_DINERARIOS',
    items: [
      {
        accion: 'add',
        id: generateUUID(),
        orden: 0,
        label: textoVotacion,
        tipoAprobacion, // ✅ AQUÍ, en el item
        votos,
      },
    ],
  };

  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json();
};
```

---

### **4. Obtener Votación (GET)**

**Endpoint:**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=APORTES_DINERARIOS
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-sesion",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-item",
        "orden": 0,
        "label": "Se aprueba el aumento de capital...",
        "descripción": null,
        "personaId": null, // ⚠️ Este es diferente: asocia el item a una persona (opcional)
        "tipoAprobacion": "SOMETIDO_A_VOTACION", // ✅ AQUÍ, en cada item
        "votos": [
          {
            "id": "uuid-voto",
            "accionistaId": "uuid-accionista-id",
            "valor": "A_FAVOR"
          }
        ]
      }
    ]
  }
}
```

**Ejemplo TypeScript:**

```typescript
const obtenerVotacion = async (societyId: number, flowId: number) => {
  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes?contexto=APORTES_DINERARIOS`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (response.status === 404) {
    return null;
  }

  const { data } = await response.json();

  // ⚠️ IMPORTANTE: tipoAprobacion está en cada item
  data.items.forEach(item => {
    console.log(`Item ${item.id}: tipoAprobacion = ${item.tipoAprobacion}`);
  });

  return data;
};
```

---

## 📝 Resumen de Cambios

| Aspecto         | Antes                                      | Ahora                                              |
| --------------- | ------------------------------------------ | -------------------------------------------------- |
| **Ubicación**   | `VoteSession.tipoAprobacion`               | `VoteItem.tipoAprobacion`                          |
| **Alcance**     | Aplicaba a todos los items                 | Cada item tiene su propio tipo                     |
| **POST /votes** | `tipoAprobacion` en el body principal      | `tipoAprobacion` en cada `item`                    |
| **PUT /votes**  | `tipoAprobacion` en el body principal      | `tipoAprobacion` en el item con `accion: 'update'` |
| **GET /votes**  | `tipoAprobacion` en la respuesta principal | `tipoAprobacion` en cada `item` de la respuesta    |

---

## ✅ Checklist para Frontend

- [ ] Remover `tipoAprobacion` del body principal en `POST /votes`
- [ ] Agregar `tipoAprobacion` en cada `item` al crear votación
- [ ] Actualizar lógica para leer `tipoAprobacion` desde `item.tipoAprobacion` en lugar de `votacion.tipoAprobacion`
- [ ] Actualizar función de cambio de tipo para usar `accion: 'update'` con `tipoAprobacion` en el item
- [ ] Verificar que cada item puede tener su propio `tipoAprobacion` independiente

---

## 🔗 Referencias

- **Guía Completa:** [`GUIA-FRONTEND-VOTACIONES-APORTE-DINERARIO.md`](./GUIA-FRONTEND-VOTACIONES-APORTE-DINERARIO.md)
- **Aclaraciones:** [`ACLARACIONES-IMPORTANTES-VOTACIONES.md`](./ACLARACIONES-IMPORTANTES-VOTACIONES.md)
