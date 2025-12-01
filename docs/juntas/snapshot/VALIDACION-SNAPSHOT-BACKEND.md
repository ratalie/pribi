# 📊 Validación del Snapshot del Backend

**Fecha:** 2025-12-01  
**Snapshot Analizado:** Flow ID 6, Society ID (desconocido del JSON proporcionado)

---

## ✅ **1. ¿ESTÁ BIEN EL SNAPSHOT?**

### **✅ Campos Presentes y Correctos:**

1. **IDs del Snapshot** ✅

   - `shareholderId`, `nominalValueId`, `shareAllocationId`, `meetingConfigId`
   - `directoryId`, `attorneyRegistryId`, `powerRegimenId`, `quorumId`, `specialAgreementsId`
   - **Estado:** ✅ Todos presentes

2. **Valor Nominal** ✅

   - `nominalValue: 0`
   - **Estado:** ✅ Presente (aunque sea 0, está correcto)

3. **Clases de Acciones** ✅

   ```json
   "shareClasses": [{
     "id": "...",
     "tipo": "COMUN",
     "cantidadSuscrita": 500,
     "redimible": true,
     "conDerechoVoto": false
   }]
   ```

   - **Estado:** ✅ Estructura correcta según `Accion` interface

4. **Accionistas** ✅

   ```json
   "shareholders": [{
     "id": "...",
     "person": {
       "id": "...",
       "tipo": "NATURAL",
       "nombre": "Juan",
       "apellidoPaterno": "Pérez",
       "apellidoMaterno": "García",
       "tipoDocumento": "DNI",
       "numeroDocumento": "00000001"
     }
   }]
   ```

   - **Estado:** ✅ Estructura correcta según `Shareholder` interface
   - **Nota:** ✅ Incluye 2 accionistas como se esperaba

5. **Asignaciones de Acciones** ✅

   ```json
   "shareAllocations": [{
     "id": "...",
     "accionId": "...",
     "accionistaId": "...",
     "cantidadSuscrita": 300,
     "precioPorAccion": 1,
     "porcentajePagadoPorAccion": 100,
     "totalDividendosPendientes": 0,
     "pagadoCompletamente": true,
     "fechaCreacion": "2025-12-01T17:15:57.699Z",
     "fechaActualizacion": "2025-12-01T17:15:57.699Z"
   }]
   ```

   - **Estado:** ✅ Estructura correcta según `AsignacionAccion` interface
   - **Nota:** ✅ Incluye 2 asignaciones (300 + 200 = 500 acciones totales)

6. **Directorio (Configuración)** ✅

   ```json
   "directory": {
     "cantidadDirectores": 3,
     "conteoPersonalizado": false,
     "inicioMandato": "2025-01-01T05:00:00.000Z",
     "finMandato": "2026-01-01T05:00:00.000Z",
     "quorumMinimo": 2,
     "mayoria": 2,
     "presidenteDesignado": true,
     "secretarioAsignado": true,
     "reeleccionPermitida": true,
     "presidentePreside": true,
     "presidenteDesempata": true,
     "periodo": "ONE_YEAR",
     "presidenteId": "..."
   }
   ```

   - **Estado:** ✅ Estructura correcta según `Directorio` interface
   - **Nota:** ✅ Incluye `cantidadDirectores` (aunque no está en el DTO del frontend, es útil)

7. **Directores** ⚠️

   ```json
   "directors": []
   ```

   - **Estado:** ⚠️ Array vacío (pero está presente)
   - **Problema:** Según el log de consola (línea 831), dice "Directores: 0", pero el `directory` tiene `presidenteId`, lo que sugiere que SÍ hay directores pero no están en el array `directors`
   - **Análisis:** El backend debería incluir los directores en el array `directors` si hay un `presidenteId`

8. **Apoderados** ✅

   ```json
   "attorneys": []
   ```

   - **Estado:** ✅ Array vacío (correcto si no hay apoderados)

9. **Poderes** ✅

   ```json
   "powers": {
     "id": "...",
     "powers": [],
     "powerGrants": []
   }
   ```

   - **Estado:** ✅ Estructura correcta según `RegimenPoderes` interface

10. **Quorums** ✅

    ```json
    "quorums": {
      "primeraConvocatoriaSimple": 60,
      "primeraConvocatoriaCalificada": 60,
      "segundaConvocatoriaSimple": 66,
      "segundaConvocatoriaCalificada": 66,
      "quorumMinimoSimple": 50,
      "quorumMinimoCalificado": 60
    }
    ```

    - **Estado:** ✅ Estructura correcta según `Quorum` interface

11. **Acuerdos Societarios** ✅

    ```json
    "specialAgreements": {
      "derechoPreferencia": false,
      "archivoEstatutos": null,
      "archivoAccionistas": null,
      "archivoTerceros": null
    }
    ```

    - **Estado:** ✅ Estructura correcta según `AcuerdoEspecial` interface

12. **Configuración de Junta** ✅

    ```json
    "meetingConfig": {
      "id": "...",
      "meetingType": "JUNTA_UNIVERSAL",
      "isAnnualMandatory": false
    }
    ```

    - **Estado:** ✅ Estructura correcta según `MeetingConfig` interface

13. **Información del Flujo** ✅
    ```json
    "flowInfo": {
      "flowStructureId": 6,
      "currentStep": "INIT",
      "statusProgression": "CREATED"
    }
    ```
    - **Estado:** ✅ Estructura correcta según `FlowInfo` interface

---

## ⚠️ **2. ¿QUÉ FALTA O ESTÁ MAL?**

### **⚠️ PROBLEMA 1: `typeSociety` es null en `societyData`**

**Descripción:**
El snapshot **NO incluye** los datos básicos de la sociedad (RUC, razón social, tipo de sociedad, dirección, etc.).

**Evidencia:**

- El snapshot proporcionado no tiene campo `societyData`
- El DTO del frontend (`SnapshotCompleteDTO`) tampoco lo define
- Pero según la documentación (`ARQUITECTURA_SNAPSHOT_SOCIETARIO.md`), el snapshot debería incluir datos de referencia de la sociedad

**Datos que deberían estar:**

```typescript
societyData: {
  idSociety: string;
  numeroRuc: string;
  tipoSocietario: string;
  razonSocial: string;
  nombreComercial: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  fechaInscripcionRuc: string;
  actividadExterior: string;
  fechaEscrituraPublica: string;
  fechaRegistrosPublicos: string;
  partidaRegistral: string;
  oficinaRegistral: string;
}
```

**¿Por qué es necesario?**

- Para mostrar información de la sociedad en los pasos de la junta
- Para validaciones y referencias durante el flujo
- Para construir documentos y actas

**Responsabilidad:** 🔴 **BACKEND** (debe agregar `societyData` al snapshot)

---

### **⚠️ PROBLEMA 2: Array `directors` vacío pero hay `presidenteId`**

**Descripción:**
El `directory` tiene `presidenteId: "019adae9-f754-7012-b023-98572976838b"`, pero el array `directors` está vacío.

**Evidencia:**

- `directory.presidenteId` existe
- `directors: []` está vacío
- Según el log de consola, se crearon 3 directores durante el seed

**Análisis:**
Si hay un `presidenteId`, debería haber al menos un director en el array `directors` con ese ID.

**Responsabilidad:** 🔴 **BACKEND** (debe incluir los directores en el array `directors`)

---

### **✅ PROBLEMA 3: Campo `cantidadDirectores` en `directory`**

**Descripción:**
El `directory` incluye `cantidadDirectores: 3`, pero este campo no está definido en el DTO del frontend.

**Análisis:**

- **Backend:** Incluye el campo (útil para validaciones)
- **Frontend:** No está en el DTO, pero TypeScript lo aceptará como campo adicional
- **Recomendación:** Agregar `cantidadDirectores?: number` al DTO del frontend para tipado explícito

**Responsabilidad:** 🟡 **FRONTEND** (opcional, pero recomendado para tipado completo)

---

## 🎯 **3. RESPONSABILIDADES**

### **🔴 BACKEND (Responsable de):**

1. **Agregar `societyData` al snapshot**

   - Incluir todos los campos de `SociedadDatosGenerales`
   - Este campo es **CRÍTICO** para que el frontend pueda construir los pasos de la junta

2. **Incluir directores en el array `directors`**

   - Si hay `presidenteId`, debe haber al menos un director en `directors`
   - Si se crearon 3 directores durante el seed, deben aparecer en el snapshot

3. **Validar que todos los datos se repliquen correctamente**
   - Verificar que los IDs coincidan entre el snapshot y los datos originales
   - Asegurar que las relaciones (accionId, accionistaId, etc.) sean correctas

### **🟡 FRONTEND (Responsable de):**

1. **Actualizar el DTO para incluir `societyData`**

   - Agregar `societyData?: SociedadDatosGenerales` al `SnapshotCompleteDTO`
   - Actualizar los tipos en `FRONTEND_TYPES.ts`

2. **Agregar `cantidadDirectores` al DTO de `Directorio`** (opcional)

   - Para tipado completo y mejor documentación

3. **Actualizar el MSW mock para incluir `societyData`**
   - En `snapshot.state.ts`, construir `societyData` desde los datos mock

---

## 📋 **4. CHECKLIST DE VALIDACIÓN**

### **Campos Requeridos (Según DTO):**

- [x] `shareholderId`
- [x] `nominalValueId`
- [x] `shareAllocationId`
- [x] `meetingConfigId`
- [x] `directoryId` (opcional, presente)
- [x] `attorneyRegistryId` (opcional, presente)
- [x] `powerRegimenId` (opcional, presente)
- [x] `quorumId` (opcional, presente)
- [x] `specialAgreementsId` (opcional, presente)
- [x] `nominalValue`
- [x] `shareClasses` (array)
- [x] `shareholders` (array)
- [x] `shareAllocations` (array)
- [x] `directory` (objeto)
- [x] `directors` (array, pero vacío cuando debería tener datos)
- [x] `attorneys` (array)
- [x] `powers` (objeto)
- [x] `quorums` (objeto)
- [x] `specialAgreements` (objeto)
- [x] `meetingConfig` (objeto)
- [x] `flowInfo` (objeto)
- [x] **`societyData` (✅ Presente, pero `typeSociety` es null)**

### **Validaciones de Datos:**

- [x] IDs son UUIDs válidos
- [x] Fechas están en formato ISO
- [x] Tipos de datos son correctos (strings, numbers, booleans)
- [x] Arrays están presentes (aunque puedan estar vacíos)
- [x] Relaciones entre entidades son correctas (accionId existe en shareClasses, etc.)
- [ ] **Directores deberían estar en el array si hay presidenteId**
- [ ] **societyData debería estar presente**

---

## 📝 **5. RESUMEN EJECUTIVO**

### **✅ Lo que está bien:**

- Estructura general del snapshot es correcta
- Todos los campos principales están presentes
- Tipos de datos son correctos
- Relaciones entre entidades son válidas

### **❌ Lo que falta o está mal:**

1. **CRÍTICO:** Falta `societyData` (datos básicos de la sociedad)
2. **MEDIO:** Array `directors` está vacío aunque hay `presidenteId`
3. **MENOR:** Campo `cantidadDirectores` no está en el DTO del frontend

### **🎯 Acciones Requeridas:**

**BACKEND:**

1. Agregar `societyData` al snapshot
2. Incluir directores en el array `directors` cuando existan

**FRONTEND:**

1. Actualizar `SnapshotCompleteDTO` para incluir `societyData`
2. (Opcional) Agregar `cantidadDirectores` al DTO de `Directorio`
3. Actualizar MSW mock para incluir `societyData`

---

## 🔍 **6. COMPARACIÓN CON DATOS DEL SEED**

Según el log de consola (`docs/juntas/consola de creacion de sociedades.md`):

**Datos creados en el seed:**

- ✅ 2 accionistas (Juan Pérez, María González) → **Coincide con snapshot**
- ✅ 1 clase de acción (COMUN, 500 acciones) → **Coincide con snapshot**
- ✅ 2 asignaciones (300 + 200 = 500) → **Coincide con snapshot**
- ✅ 3 directores creados → **❌ NO aparecen en snapshot.directors**
- ✅ 1 apoderado creado → **❌ NO aparece en snapshot.attorneys** (pero el array está vacío, lo cual es aceptable si no se replicó)
- ✅ Directorio configurado con presidenteId → **✅ Aparece en snapshot.directory**
- ✅ Quorums configurados → **✅ Aparece en snapshot.quorums**

**Conclusión:**

- Los datos principales (accionistas, acciones, asignaciones) se replicaron correctamente
- Los directores NO se incluyeron en el array `directors` aunque se crearon
- Los apoderados NO se incluyeron (puede ser intencional si no se replican)

---

## 📚 **7. REFERENCIAS**

- **DTO Frontend:** `app/core/hexag/juntas/application/dtos/snapshot-complete.dto.ts`
- **Tipos Frontend:** `docs/juntas/snapshot/FRONTEND_TYPES.ts`
- **Documentación:** `docs/juntas/snapshot/FRONTEND_SNAPSHOT_COMPLETE_GUIDE.md`
- **Log de Consola:** `docs/juntas/consola de creacion de sociedades.md` (líneas 820-957)
