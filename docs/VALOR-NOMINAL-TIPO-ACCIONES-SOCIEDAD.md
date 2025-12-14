# 💰 Valor Nominal y Tipo de Acciones de la Sociedad

**Versión:** 2.0  
**Fecha:** 2025-12-12  
**Estado:** ✅ **Implementado**

---

## 🎯 VISIÓN GENERAL

Este documento explica cómo gestionar el **valor nominal** y el **tipo de acciones de la sociedad** en el sistema. El tipo de acciones permite diferenciar entre sociedades con acciones comunes sin derecho a voto y sociedades con clases de acciones.

---

## 📋 ENDPOINTS

### **Base URL:**
```
/api/v2/society-profile/:id/nominal-value
```

**Parámetros:**
- `id` (number): ID de la estructura del perfil de sociedad

---

## 🔄 OPERACIONES

### **1. Actualizar Valor Nominal y Tipo de Acciones**

```http
PUT /api/v2/society-profile/:id/nominal-value
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "valorNominal": 100,
  "tipoAccionesSociedad": "COMUNES_SIN_DERECHO_VOTO"
}
```

**Campos:**
- `valorNominal` (number, requerido): Valor nominal del capital social (debe ser mayor a cero)
- `tipoAccionesSociedad` (string, opcional): Tipo de acciones de la sociedad
  - `"COMUNES_SIN_DERECHO_VOTO"` → "comunes y sin derecho a voto"
  - `"CON_CLASES"` → "con clases"
  - `null` o omitir → Sin tipo definido

**Ejemplo:**
```typescript
const response = await fetch(
  `/api/v2/society-profile/${structureId}/nominal-value`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valorNominal: 100,
      tipoAccionesSociedad: 'COMUNES_SIN_DERECHO_VOTO',
    }),
  },
);
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Valor nominal actualizado correctamente.",
  "code": 200
}
```

---

### **2. Obtener Valor Nominal y Tipo de Acciones**

```http
GET /api/v2/society-profile/:id/nominal-value
```

**Headers:**
```
Authorization: Bearer {token}
```

**Ejemplo:**
```typescript
const response = await fetch(
  `/api/v2/society-profile/${structureId}/nominal-value`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Valor nominal obtenido correctamente",
  "data": {
    "valorNominal": 100,
    "tipoAccionesSociedad": "COMUNES_SIN_DERECHO_VOTO"
  },
  "code": 200
}
```

**Valores posibles de `tipoAccionesSociedad`:**
- `"COMUNES_SIN_DERECHO_VOTO"` → Sociedad con acciones comunes sin derecho a voto
- `"CON_CLASES"` → Sociedad con clases de acciones
- `null` → No definido

---

## 📊 EN EL SNAPSHOT COMPLETO

El campo `tipoAccionesSociedad` también está disponible en el snapshot completo de la junta:

```http
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

**Response (fragmento):**
```json
{
  "success": true,
  "data": {
    "nominalValue": 100,
    "tipoAccionesSociedad": "COMUNES_SIN_DERECHO_VOTO",
    "shareClasses": [...],
    "shareAllocations": [...],
    ...
  }
}
```

---

## 🎨 GUÍA DE INTEGRACIÓN FRONTEND

### **1. Tipos TypeScript**

```typescript
// 📁 types/nominal-value.types.ts

export type TipoAccionesSociedad = 'COMUNES_SIN_DERECHO_VOTO' | 'CON_CLASES' | null;

export interface ValorNominalDto {
  valorNominal: number;
  tipoAccionesSociedad?: TipoAccionesSociedad;
}

export interface ValorNominalResponse {
  valorNominal: number;
  tipoAccionesSociedad: TipoAccionesSociedad;
}
```

---

### **2. Mapeo de Valores (Frontend → Backend)**

```typescript
// Mapeo desde el frontend (español) al backend (enum)
const MAPEO_TIPO_ACCIONES = {
  'comunes y sin derecho a voto': 'COMUNES_SIN_DERECHO_VOTO',
  'con clases': 'CON_CLASES',
} as const;

// Mapeo inverso (backend → frontend)
const MAPEO_TIPO_ACCIONES_INVERSO = {
  COMUNES_SIN_DERECHO_VOTO: 'comunes y sin derecho a voto',
  CON_CLASES: 'con clases',
} as const;

// Función helper
function mapearTipoAcciones(
  valorFrontend: 'comunes y sin derecho a voto' | 'con clases' | null,
): TipoAccionesSociedad {
  if (!valorFrontend) return null;
  return MAPEO_TIPO_ACCIONES[valorFrontend];
}

function mapearTipoAccionesInverso(
  valorBackend: TipoAccionesSociedad,
): 'comunes y sin derecho a voto' | 'con clases' | null {
  if (!valorBackend) return null;
  return MAPEO_TIPO_ACCIONES_INVERSO[valorBackend];
}
```

---

### **3. Ejemplo de Uso Completo**

```typescript
// 📁 composables/useValorNominal.ts
import { useFetch } from '#app';

export const useValorNominal = () => {
  const actualizarValorNominal = async (
    structureId: number,
    valorNominal: number,
    tipoAccionesSociedad: TipoAccionesSociedad,
  ) => {
    const { data, error } = await useFetch(
      `/api/v2/society-profile/${structureId}/nominal-value`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: {
          valorNominal,
          tipoAccionesSociedad, // Puede ser null
        },
      },
    );

    if (error.value) {
      throw new Error('Error al actualizar valor nominal');
    }

    return data.value;
  };

  const obtenerValorNominal = async (structureId: number) => {
    const { data, error } = await useFetch(
      `/api/v2/society-profile/${structureId}/nominal-value`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (error.value) {
      throw new Error('Error al obtener valor nominal');
    }

    return data.value as ValorNominalResponse;
  };

  return {
    actualizarValorNominal,
    obtenerValorNominal,
  };
};
```

---

### **4. Ejemplo de Componente Vue**

```vue
<template>
  <div>
    <h3>Valor Nominal</h3>
    
    <input
      v-model.number="valorNominal"
      type="number"
      min="0.01"
      step="0.01"
      placeholder="Valor nominal"
    />

    <h4>Tipo de Acciones de la Sociedad</h4>
    
    <select v-model="tipoAccionesSociedad">
      <option :value="null">Seleccionar tipo</option>
      <option value="COMUNES_SIN_DERECHO_VOTO">
        Comunes y sin derecho a voto
      </option>
      <option value="CON_CLASES">Con clases</option>
    </select>

    <button @click="guardar">Guardar</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useValorNominal } from '@/composables/useValorNominal';

const props = defineProps<{
  structureId: number;
}>();

const { actualizarValorNominal, obtenerValorNominal } = useValorNominal();

const valorNominal = ref<number>(0);
const tipoAccionesSociedad = ref<TipoAccionesSociedad>(null);

onMounted(async () => {
  const data = await obtenerValorNominal(props.structureId);
  valorNominal.value = data.valorNominal;
  tipoAccionesSociedad.value = data.tipoAccionesSociedad;
});

const guardar = async () => {
  await actualizarValorNominal(
    props.structureId,
    valorNominal.value,
    tipoAccionesSociedad.value,
  );
  // Mostrar mensaje de éxito
};
</script>
```

---

## 📝 VALORES DEL ENUM

| Valor Backend | Descripción Frontend |
|---------------|---------------------|
| `COMUNES_SIN_DERECHO_VOTO` | "comunes y sin derecho a voto" |
| `CON_CLASES` | "con clases" |
| `null` | No definido / Sin seleccionar |

---

## ⚠️ VALIDACIONES

### **Valor Nominal:**
- ✅ Debe ser un número positivo (mayor a cero)
- ✅ Puede tener decimales (ej: 100.50)

### **Tipo de Acciones:**
- ✅ Solo acepta: `"COMUNES_SIN_DERECHO_VOTO"` o `"CON_CLASES"`
- ✅ Puede ser `null` o omitirse (opcional)
- ❌ Cualquier otro valor generará error de validación

---

## 🔄 FLUJO COMPLETO

### **Escenario: Actualizar valor nominal y tipo de acciones**

1. **Obtener valores actuales:**
```typescript
const data = await obtenerValorNominal(structureId);
// data = { valorNominal: 100, tipoAccionesSociedad: null }
```

2. **Mostrar en formulario:**
```typescript
// Usuario selecciona:
// - valorNominal: 150
// - tipoAccionesSociedad: "COMUNES_SIN_DERECHO_VOTO"
```

3. **Guardar cambios:**
```typescript
await actualizarValorNominal(
  structureId,
  150,
  'COMUNES_SIN_DERECHO_VOTO',
);
```

4. **Verificar en snapshot:**
```typescript
const snapshot = await obtenerSnapshotCompleto(societyId, flowId);
// snapshot.tipoAccionesSociedad = "COMUNES_SIN_DERECHO_VOTO"
```

---

## 📋 TABLA RESUMEN

| Acción | Método | Ruta | Body |
|--------|--------|------|------|
| **Actualizar** | `PUT` | `/nominal-value` | `{ valorNominal, tipoAccionesSociedad? }` |
| **Obtener** | `GET` | `/nominal-value` | - |

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- [Snapshot Completo](./register-assembly/SNAPSHOT_ENDPOINT_DOCUMENTATION.md)
- [Capital Social - Acciones](./register-society-profile/API_DOCUMENTATION.md)

---

**¡Documentación lista para el frontend, mi rey!** 🚀💪

