# 📋 Guía Frontend: Remoción de Apoderados y Directores

**Versión:** 2.0  
**Fecha:** Enero 2025  
**Estado:** ✅ **Simplificado - Solo GET y PUT**

---

## 🎯 RESUMEN RÁPIDO

1. **GET** → Obtener lista de apoderados/directores
2. **PUT** → Hacer TODO (marcar, desmarcar, cambiar estado) - **UN SOLO ENDPOINT**
3. **❌ NO USAR POST** → Ya no es necesario, PUT hace todo

---

## 👔 REMOCIÓN DE APODERADOS

### **1. Obtener Lista de Apoderados**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-apoderado",
      "isCandidate": false, // ← true si está marcado para remoción
      "candidateStatus": null, // ← null, "CANDIDATE", "ELECTED", "NOT_ELECTED"
      "flowActionId": null // ← null si no está marcado
      // ... otros campos del apoderado
    }
  ]
}
```

### **2. Hacer TODO con PUT (Un Solo Endpoint)**

**⚠️ IMPORTANTE:** **PUT hace TODO** - No necesitas POST ni múltiples endpoints:

- ✅ **Marcar como candidato** (primera vez)
- ✅ **Cambiar estado después de votar** (ELEGIDO/NO_ELEGIDO)
- ✅ **Desmarcar** (quitar de la votación)

**PUT crea si no existe y actualiza si ya existe** - Es inteligente, solo envía el estado que quieres.

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
```

**Body:**

```json
{
  "attorneyId": "uuid-del-apoderado",
  "candidatoEstado": "CANDIDATO" // Ver valores abajo
}
```

**Valores de `candidatoEstado`:**

| Valor          | Descripción                                  | Cuándo usar                      |
| -------------- | -------------------------------------------- | -------------------------------- |
| `"CANDIDATO"`  | Marcar como candidato para remoción          | Primera vez que lo marcas        |
| `"ELEGIDO"`    | Fue elegido para remoción (después de votar) | Después de la votación si ganó   |
| `"NO_ELEGIDO"` | No fue elegido (después de votar)            | Después de la votación si perdió |
| `"DESMARCAR"`  | Quitar de la votación                        | Cuando quieres desmarcarlo       |

**Ejemplos:**

**Marcar como candidato:**

```json
{
  "attorneyId": "019b2788-b214-70b5-bda0-88d19a07bc6e",
  "candidatoEstado": "CANDIDATO"
}
```

**Después de votar (elegido):**

```json
{
  "attorneyId": "019b2788-b214-70b5-bda0-88d19a07bc6e",
  "candidatoEstado": "ELEGIDO"
}
```

**Desmarcar:**

```json
{
  "attorneyId": "019b2788-b214-70b5-bda0-88d19a07bc6e",
  "candidatoEstado": "DESMARCAR"
}
```

---

## 👨‍💼 REMOCIÓN DE DIRECTORES

### **1. Obtener Lista de Directores**

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-director",
      "isCandidate": false, // ← true si está marcado para remoción
      "candidateStatus": null, // ← null, "CANDIDATE", "ELECTED", "NOT_ELECTED"
      "flowActionId": null // ← null si no está marcado
      // ... otros campos del director
    }
  ]
}
```

### **2. Actualizar Estado (PUT)**

```http
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
```

**Body:**

```json
{
  "directorId": "uuid-del-director",
  "candidatoEstado": "CANDIDATO" // Ver valores abajo
}
```

**Valores de `candidatoEstado`:** (Igual que apoderados)

| Valor          | Descripción                                  | Cuándo usar                      |
| -------------- | -------------------------------------------- | -------------------------------- |
| `"CANDIDATO"`  | Marcar como candidato para remoción          | Primera vez que lo marcas        |
| `"ELEGIDO"`    | Fue elegido para remoción (después de votar) | Después de la votación si ganó   |
| `"NO_ELEGIDO"` | No fue elegido (después de votar)            | Después de la votación si perdió |
| `"DESMARCAR"`  | Quitar de la votación                        | Cuando quieres desmarcarlo       |

---

## 🔄 FLUJO COMPLETO DE EJEMPLO

### **Escenario: Marcar 2 apoderados, votar, y desmarcar 1**

**1. Obtener lista (solo una vez al inicio):**

```http
GET /api/v2/society-profile/10/register-assembly/10/removal-attorney
```

**Respuesta:** Array con todos los apoderados y su estado actual (`isCandidate`, `candidateStatus`)

---

**2. Marcar primer apoderado (PUT crea automáticamente):**

```http
PUT /api/v2/society-profile/10/register-assembly/10/removal-attorney
Content-Type: application/json

{
  "attorneyId": "uuid-apoderado-1",
  "candidatoEstado": "CANDIDATO"
}
```

**Resultado:** `isCandidate: true`, `candidateStatus: "CANDIDATE"`

---

**3. Marcar segundo apoderado (PUT crea automáticamente):**

```http
PUT /api/v2/society-profile/10/register-assembly/10/removal-attorney
Content-Type: application/json

{
  "attorneyId": "uuid-apoderado-2",
  "candidatoEstado": "CANDIDATO"
}
```

**Resultado:** `isCandidate: true`, `candidateStatus: "CANDIDATE"`

---

**4. Realizar votación (usar endpoint de votaciones)**

---

**5. Actualizar estado después de votar (PUT actualiza automáticamente):**

```http
PUT /api/v2/society-profile/10/register-assembly/10/removal-attorney
Content-Type: application/json

{
  "attorneyId": "uuid-apoderado-1",
  "candidatoEstado": "ELEGIDO"  // Ganó la votación
}
```

**Resultado:** `isCandidate: true`, `candidateStatus: "ELECTED"`

```http
PUT /api/v2/society-profile/10/register-assembly/10/removal-attorney
Content-Type: application/json

{
  "attorneyId": "uuid-apoderado-2",
  "candidatoEstado": "NO_ELEGIDO"  // Perdió la votación
}
```

**Resultado:** `isCandidate: true`, `candidateStatus: "NOT_ELECTED"`

---

**6. Desmarcar el que perdió (PUT desactiva automáticamente):**

```http
PUT /api/v2/society-profile/10/register-assembly/10/removal-attorney
Content-Type: application/json

{
  "attorneyId": "uuid-apoderado-2",
  "candidatoEstado": "DESMARCAR"
}
```

**Resultado:** `isCandidate: false`, `candidateStatus: null` (ya no aparece en votación)

---

## ✅ REGLAS IMPORTANTES

1. **Solo usa GET y PUT** - No uses POST, PUT hace todo
2. **PUT es inteligente:**
   - ✅ **Crea si no existe** - Si el apoderado/director no está marcado, PUT lo marca automáticamente
   - ✅ **Actualiza si existe** - Si ya está marcado, PUT actualiza el estado
   - ✅ **Desactiva si es DESMARCAR** - Si envías "DESMARCAR", PUT lo quita de la votación
3. **Un solo endpoint para todo** - No necesitas diferentes endpoints, solo cambia el valor de `candidatoEstado`
4. **`isCandidate` se calcula automáticamente** - No lo envíes, el backend lo calcula basándose en si existe un flowAction activo
5. **`candidatoEstado` es el único campo que controlas** - Con este campo controlas todo el flujo

---

## 🎨 EJEMPLO DE CÓDIGO FRONTEND

### **Función Única para Todo (Recomendado)**

```typescript
// ✅ UNA SOLA FUNCIÓN PARA TODO - PUT hace todo automáticamente
const actualizarRemocion = async (
  attorneyId: string,
  candidatoEstado: 'CANDIDATO' | 'ELEGIDO' | 'NO_ELEGIDO' | 'DESMARCAR',
) => {
  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-attorney`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attorneyId,
        candidatoEstado,
      }),
    },
  );
  return response.json();
};

// Uso:
await actualizarRemocion('uuid-apoderado-1', 'CANDIDATO'); // Marcar
await actualizarRemocion('uuid-apoderado-1', 'ELEGIDO'); // Después de votar (ganó)
await actualizarRemocion('uuid-apoderado-1', 'DESMARCAR'); // Desmarcar
```

### **Funciones Separadas (Opcional)**

```typescript
// Obtener lista (solo una vez al inicio)
const obtenerLista = async () => {
  const response = await fetch(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-attorney`,
  );
  const { data } = await response.json();
  return data;
};

// Función genérica para actualizar (usa la misma función para todo)
const actualizarRemocion = async (
  attorneyId: string,
  candidatoEstado: 'CANDIDATO' | 'ELEGIDO' | 'NO_ELEGIDO' | 'DESMARCAR',
) => {
  await fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-attorney`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attorneyId,
      candidatoEstado,
    }),
  });
};

// Funciones de conveniencia (opcionales, todas usan la misma función)
const marcarCandidato = (attorneyId: string) => actualizarRemocion(attorneyId, 'CANDIDATO');

const marcarElegido = (attorneyId: string) => actualizarRemocion(attorneyId, 'ELEGIDO');

const marcarNoElegido = (attorneyId: string) => actualizarRemocion(attorneyId, 'NO_ELEGIDO');

const desmarcar = (attorneyId: string) => actualizarRemocion(attorneyId, 'DESMARCAR');
```

### **Ejemplo con React Hook**

```typescript
import { useState, useEffect } from 'react';

const useRemocionApoderados = (societyId: number, flowId: number) => {
  const [apoderados, setApoderados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener lista
  const obtenerLista = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-attorney`
    );
    const { data } = await response.json();
    setApoderados(data);
    setLoading(false);
  };

  // Actualizar estado (una función para todo)
  const actualizarEstado = async (
    attorneyId: string,
    candidatoEstado: 'CANDIDATO' | 'ELEGIDO' | 'NO_ELEGIDO' | 'DESMARCAR'
  ) => {
    await fetch(
      `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-attorney`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attorneyId,
          candidatoEstado,
        }),
      }
    );
    // Refrescar lista después de actualizar
    await obtenerLista();
  };

  useEffect(() => {
    obtenerLista();
  }, [societyId, flowId]);

  return {
    apoderados,
    loading,
    actualizarEstado,
    refrescar: obtenerLista,
  };
};

// Uso en componente:
const MiComponente = () => {
  const { apoderados, actualizarEstado } = useRemocionApoderados(10, 10);

  const handleMarcar = (attorneyId: string) => {
    actualizarEstado(attorneyId, 'CANDIDATO');
  };

  const handleDesmarcar = (attorneyId: string) => {
    actualizarEstado(attorneyId, 'DESMARCAR');
  };

  return (
    <div>
      {apoderados.map(apoderado => (
        <div key={apoderado.id}>
          <span>{apoderado.person.natural.firstName}</span>
          {apoderado.isCandidate ? (
            <button onClick={() => handleDesmarcar(apoderado.id)}>Desmarcar</button>
          ) : (
            <button onClick={() => handleMarcar(apoderado.id)}>Marcar</button>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## 📝 NOTAS FINALES

### **Para Directores (Idéntico)**

Todo funciona igual, solo cambia:

- Endpoint: `/removal-director` en lugar de `/removal-attorney`
- Campo: `directorId` en lugar de `attorneyId`

```typescript
// Ejemplo para directores
const actualizarRemocionDirector = async (
  directorId: string,
  candidatoEstado: 'CANDIDATO' | 'ELEGIDO' | 'NO_ELEGIDO' | 'DESMARCAR',
) => {
  await fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/removal-director`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      directorId, // ← Cambia aquí
      candidatoEstado,
    }),
  });
};
```

### **Puntos Clave**

- ✅ **Un solo endpoint PUT** - Hace todo (crear, actualizar, desmarcar)
- ✅ **No necesitas POST** - PUT crea automáticamente si no existe
- ✅ **`isCandidate` es calculado** - El backend lo calcula, no lo envíes
- ✅ **Valores exactos** - Usa strings exactos: `"CANDIDATO"`, `"ELEGIDO"`, `"NO_ELEGIDO"`, `"DESMARCAR"`
- ✅ **Mismo flujo para apoderados y directores** - Solo cambia el endpoint y el campo ID

---

## 🚀 RESUMEN ULTRA RÁPIDO

```typescript
// 1. GET una vez al inicio
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney

// 2. PUT para TODO (marcar, actualizar, desmarcar)
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
Body: { "attorneyId": "uuid", "candidatoEstado": "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR" }

// ¡Eso es todo! Un solo endpoint para todo.
```

---

**✅ Listo para implementar en frontend - Un solo endpoint PUT hace todo**
