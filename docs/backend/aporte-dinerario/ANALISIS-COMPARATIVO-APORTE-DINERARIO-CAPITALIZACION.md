# 📊 Análisis Comparativo: Aporte Dinerario vs Capitalización de Créditos

**Fecha:** 2025-12-18  
**Objetivo:** Documentar el estado actual del backend para ambos módulos y determinar qué está disponible para conectar el frontend.

---

## 🎯 RESUMEN EJECUTIVO

### ✅ **Estado General: AMBOS MÓDULOS ESTÁN COMPLETOS EN v2**

Ambos módulos tienen implementación completa en **v2** con la misma estructura:

1. ✅ **Participantes/Acreedores** (Paso 1)
2. ✅ **Contribuciones/Capitalizaciones** (Paso 2)
3. ✅ **Votaciones** (Paso 3)

**Diferencia principal:** Las rutas de capitalización de créditos incluyen el prefijo `/credit-capitalization` en todos los endpoints.

---

## 📋 COMPARACIÓN DETALLADA

### **1. PARTICIPANTES / ACREEDORES (Paso 1)**

#### **Aporte Dinerario**
```
Base: /api/v2/society-profile/:societyId/register-assembly/:flowId
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/participants?isActive={boolean}` | Listar participantes |
| `POST` | `/participants` | Crear nuevo participante |
| `PUT` | `/participants` | Actualizar participante |
| `PATCH` | `/participants` | Toggle `isContributor` (array de UUIDs) |
| `DELETE` | `/participants` | Eliminar participante (array de UUIDs) |

**Ubicación en código:**
- `src/modules/flows-v2/register-assembly/4.aporte-dinerario/participants/`

---

#### **Capitalización de Créditos**
```
Base: /api/v2/society-profile/:societyId/register-assembly/:flowId
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/credit-capitalization/participants?isActive={boolean}` | Listar participantes |
| `POST` | `/credit-capitalization/participants` | Crear nuevo participante |
| `PUT` | `/credit-capitalization/participants` | Actualizar participante |
| `PATCH` | `/credit-capitalization/participants` | Toggle `isContributor` (array de UUIDs) |
| `DELETE` | `/credit-capitalization/participants` | Eliminar participante (array de UUIDs) |

**Ubicación en código:**
- `src/modules/flows-v2/register-assembly/5.credit-capitalization/participants/`

**⚠️ DIFERENCIA:** Las rutas incluyen el prefijo `/credit-capitalization` antes de `/participants`.

---

### **2. CONTRIBUCIONES / CAPITALIZACIONES (Paso 2)**

#### **Aporte Dinerario**
```
Base: /api/v2/society-profile/:societyId/register-assembly/:flowId
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/contributions` | Listar aportes |
| `POST` | `/contributions` | Crear aporte |
| `PUT` | `/contributions` | Actualizar aporte |
| `DELETE` | `/contributions` | Eliminar aportes (array de UUIDs) |

**Ubicación en código:**
- `src/modules/flows-v2/register-assembly/4.aporte-dinerario/contributions/`

**DTO esperado:**
```typescript
{
  id: string; // UUID generado en frontend
  accionistaId: string;
  accionId: string;
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string; // YYYY-MM-DD
  tasaCambio: number;
  montoConvertido: number;
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number;
  totalPasivo?: number;
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId?: string; // Opcional
}
```

---

#### **Capitalización de Créditos**
```
Base: /api/v2/society-profile/:societyId/register-assembly/:flowId
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/credit-capitalization/contributions` | Listar capitalizaciones |
| `POST` | `/credit-capitalization/contributions` | Crear capitalización |
| `PUT` | `/credit-capitalization/contributions` | Actualizar capitalización |
| `DELETE` | `/credit-capitalization/contributions` | Eliminar capitalizaciones (array de UUIDs) |

**Ubicación en código:**
- `src/modules/flows-v2/register-assembly/5.credit-capitalization/contributions/`

**⚠️ DIFERENCIA:** Las rutas incluyen el prefijo `/credit-capitalization` antes de `/contributions`.

**DTO esperado:**
```typescript
{
  id: string; // UUID generado en frontend
  accionistaId: string;
  accionId: string;
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string; // YYYY-MM-DD
  tasaCambio: number;
  montoConvertido: number;
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number;
  totalPasivo?: number;
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId: string; // ⚠️ REQUERIDO (a diferencia de aporte dinerario)
}
```

**⚠️ DIFERENCIA IMPORTANTE:** En capitalización de créditos, `comprobantePagoArchivoId` es **REQUERIDO**, mientras que en aporte dinerario es **opcional**.

---

### **3. VOTACIONES (Paso 3)**

#### **Aporte Dinerario**
```
Base: /api/v2/society-profile/:societyId/register-assembly/:flowId
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/votes?contexto=APORTES_DINERARIOS` | Obtener votación |
| `POST` | `/votes` | Crear sesión de votación |
| `PUT` | `/votes` | Actualizar votación |

**Contexto:** `APORTES_DINERARIOS`

**Ubicación en código:**
- `src/modules/flows-v2/shared/vote/` (módulo compartido)

---

#### **Capitalización de Créditos**
```
Base: /api/v2/society-profile/:societyId/register-assembly/:flowId
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/votes?contexto=CAPITALIZACION_DE_CREDITOS` | Obtener votación |
| `POST` | `/votes` | Crear sesión de votación |
| `PUT` | `/votes` | Actualizar votación |

**Contexto:** `CAPITALIZACION_DE_CREDITOS`

**Ubicación en código:**
- `src/modules/flows-v2/shared/vote/` (módulo compartido)

**✅ SIMILITUD:** Ambos usan el mismo módulo de votaciones, solo cambia el `contexto` en el query parameter.

---

## 🔄 FLUJO COMPLETO COMPARADO

### **Aporte Dinerario**

```
1. Activar punto de agenda
   PUT /agenda-items
   { aportesDinerarios: true }

2. Gestionar Participantes
   GET /participants
   POST /participants
   PATCH /participants (toggle isContributor)
   DELETE /participants

3. Gestionar Aportes
   GET /contributions
   POST /contributions
   PUT /contributions
   DELETE /contributions

4. Gestionar Votación
   GET /votes?contexto=APORTES_DINERARIOS
   POST /votes (si no existe)
   PUT /votes (actualizar votos)
```

---

### **Capitalización de Créditos**

```
1. Activar punto de agenda
   PUT /agenda-items
   { capitalizacionDeCreditos: true }

2. Gestionar Participantes (Acreedores)
   GET /credit-capitalization/participants
   POST /credit-capitalization/participants
   PATCH /credit-capitalization/participants (toggle isContributor)
   DELETE /credit-capitalization/participants

3. Gestionar Capitalizaciones
   GET /credit-capitalization/contributions
   POST /credit-capitalization/contributions
   PUT /credit-capitalization/contributions
   DELETE /credit-capitalization/contributions

4. Gestionar Votación
   GET /votes?contexto=CAPITALIZACION_DE_CREDITOS
   POST /votes (si no existe)
   PUT /votes (actualizar votos)
```

---

## 📝 ESTRUCTURA DE DATOS COMPARADA

### **Participante (Ambos módulos)**

```typescript
interface Participant {
  id: string;
  personId?: string; // Si es ACCIONISTA del snapshot
  typeShareholder: "ACCIONISTA" | "NUEVO_APORTANTE";
  isContributor: boolean; // true = puede hacer aportes/capitalizaciones
  status?: boolean;
  person: {
    id: string;
    tipo: "NATURAL" | "JURIDICA" | "SUCURSAL" | "FONDO_INVERSION" | "FIDEICOMISO" | "SUCESION_INDIVISA";
    // ... más campos según tipo
  };
  allocationShare?: Array<{
    id: string;
    action: { id: string; name: string; type: string };
    subscribedSharesQuantity: number;
    percentagePaidPerShare: number;
  }>;
}
```

**✅ IDÉNTICO:** La estructura de participantes es la misma en ambos módulos.

---

### **Contribución / Capitalización**

#### **Aporte Dinerario**
```typescript
interface Contribution {
  id: string;
  accionistaId: string;
  accion: {
    id: string;
    tipo: string;
    nombre?: string;
  };
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string; // ISO 8601
  tasaCambio?: number;
  montoConvertido?: number;
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number;
  totalPasivo?: number;
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId?: string; // ⚠️ OPCIONAL
}
```

#### **Capitalización de Créditos**
```typescript
interface Contribution {
  id: string;
  accionistaId: string;
  accion: {
    id: string;
    tipo: string;
    nombre?: string;
  };
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string; // ISO 8601
  tasaCambio?: number;
  montoConvertido?: number;
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number;
  totalPasivo?: number;
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId: string; // ⚠️ REQUERIDO
}
```

**⚠️ DIFERENCIA:** `comprobantePagoArchivoId` es opcional en aporte dinerario pero requerido en capitalización de créditos.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Aporte Dinerario**

- [x] **Paso 1: Participantes**
  - [x] GET `/participants`
  - [x] POST `/participants`
  - [x] PUT `/participants`
  - [x] PATCH `/participants` (toggle isContributor)
  - [x] DELETE `/participants`

- [x] **Paso 2: Aportes**
  - [x] GET `/contributions`
  - [x] POST `/contributions`
  - [x] PUT `/contributions`
  - [x] DELETE `/contributions`

- [x] **Paso 3: Votación**
  - [x] GET `/votes?contexto=APORTES_DINERARIOS`
  - [x] POST `/votes`
  - [x] PUT `/votes`

---

### **Capitalización de Créditos**

- [x] **Paso 1: Participantes (Acreedores)**
  - [x] GET `/credit-capitalization/participants`
  - [x] POST `/credit-capitalization/participants`
  - [x] PUT `/credit-capitalization/participants`
  - [x] PATCH `/credit-capitalization/participants` (toggle isContributor)
  - [x] DELETE `/credit-capitalization/participants`

- [x] **Paso 2: Capitalizaciones**
  - [x] GET `/credit-capitalization/contributions`
  - [x] POST `/credit-capitalization/contributions`
  - [x] PUT `/credit-capitalization/contributions`
  - [x] DELETE `/credit-capitalization/contributions`

- [x] **Paso 3: Votación**
  - [x] GET `/votes?contexto=CAPITALIZACION_DE_CREDITOS`
  - [x] POST `/votes`
  - [x] PUT `/votes`

---

## 🎯 CONCLUSIÓN

### ✅ **ESTADO ACTUAL: LISTO PARA CONECTAR**

**Ambos módulos están completamente implementados en v2** y listos para conectar el frontend.

### **Diferencias Clave:**

1. **Rutas:** Capitalización de créditos usa el prefijo `/credit-capitalization` en todos los endpoints.
2. **Comprobante:** En capitalización de créditos, `comprobantePagoArchivoId` es **requerido**.
3. **Contexto de Votación:** 
   - Aporte Dinerario: `APORTES_DINERARIOS`
   - Capitalización: `CAPITALIZACION_DE_CREDITOS`

### **Similitudes:**

1. ✅ Misma estructura de participantes
2. ✅ Misma estructura de contribuciones (excepto comprobante)
3. ✅ Mismo sistema de votaciones (solo cambia el contexto)
4. ✅ Mismos métodos HTTP y formatos de request/response

---

## 📚 REFERENCIAS

### **Documentación Existente:**

1. **Aporte Dinerario:**
   - `docs/frontend/CONEXION-BACKEND-APORTE-DINERARIO.MD` (documentación del frontend)
   - `docs/register-assembly/ENDPOINTS-APORTES-COMPLETO.md`
   - `docs/register-assembly/APORTES-DINERARIOS-COMPLETO.md`

2. **Capitalización de Créditos:**
   - `docs/REGISTER-ASSEMBLY-CAPITALIZACION-CREDITOS-COMPLETO-FRONTEND.md`

### **Código Backend:**

1. **Aporte Dinerario:**
   - `src/modules/flows-v2/register-assembly/4.aporte-dinerario/`

2. **Capitalización de Créditos:**
   - `src/modules/flows-v2/register-assembly/5.credit-capitalization/`

3. **Votaciones (Compartido):**
   - `src/modules/flows-v2/shared/vote/`

---

## 🚀 PRÓXIMOS PASOS PARA EL FRONTEND

1. **Reutilizar la lógica de Aporte Dinerario** para Capitalización de Créditos.
2. **Cambiar las rutas** agregando el prefijo `/credit-capitalization`.
3. **Validar que `comprobantePagoArchivoId` sea requerido** en capitalización.
4. **Usar el contexto correcto** en las votaciones: `CAPITALIZACION_DE_CREDITOS`.

---

**✅ Documentación lista para implementación en frontend**

