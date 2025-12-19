# 🎯 FLUJO COMPLETO: DIRECTORES Y DIRECTORIO

**Versión:** 1.0  
**Fecha:** 2025-01-15  
**Estado:** ✅ **TODO IMPLEMENTADO**

---

## 📋 RESUMEN RÁPIDO

**3 Pasos Completos:**

1. ✅ **Configurar Directorio + Votación** → `PUT /directorio` (5 campos opcionales)
2. ✅ **Nombramiento de Directores + Votación** → `POST /designation-director` + votación acumulativa
3. ✅ **Presidente del Directorio** → `PUT /directorio` (campo `presidenteId`)

**Todo está listo para usar.** 🚀

---

## 🔧 PASO 1: CONFIGURAR DIRECTORIO + VOTACIÓN

### **Endpoint**

```
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
```

### **5 Campos Opcionales**

```json
{
  "cantidadDirectores": 5,              // Campo 1: Cantidad
  "inicioMandato": "2025-01-01",        // Campo 2: Fecha inicio
  "finMandato": "2025-12-31",           // Campo 3: Fecha fin
  "periodo": "ANUAL",                   // Campo 4: Duración (ANUAL, BIENAL, TRIENAL)
  "configurarDirectorio": true          // Campo 5: Activar votación (true/false)
}
```

### **Comportamiento**

- **Si `configurarDirectorio: true`** → Se crea automáticamente `voteDirectoryConfigurationId` (VoteSession)
- **Si `configurarDirectorio: false`** → Se elimina `voteDirectoryConfigurationId`

### **Ejemplo Completo**

```typescript
// 1. Configurar directorio y activar votación
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/directorio`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      cantidadDirectores: 5,
      inicioMandato: '2025-01-01',
      finMandato: '2025-12-31',
      periodo: 'ANUAL',
      configurarDirectorio: true, // ← Activa la votación
    }),
  },
);
```

### **Crear Votación de Configuración**

Una vez que `configurarDirectorio: true`, puedes crear la votación:

```typescript
// 2. Crear votación de configuración
const voteResponse = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: generateUUID(),
      contexto: 'CONFIGURACION_DIRECTORIO',
      modo: 'SIMPLE',
      items: [
        {
          id: generateUUID(),
          orden: 0,
          label: 'Aprobación de configuración de directorio',
          descripcion: 'Se aprueba la configuración del directorio con 5 directores, período anual del 01-01-2025 al 31-12-2025',
          tipoAprobacion: 'SOMETIDO_A_VOTACION',
          votos: [
            {
              id: generateUUID(),
              accionistaId: 'uuid-accionista-1',
              valor: 'A_FAVOR',
            },
          ],
        },
      ],
    }),
  },
);
```

---

## 👔 PASO 2: NOMBRAMIENTO DE DIRECTORES + VOTACIÓN

### **2.1. Activar Punto de Agenda**

```typescript
// Activar nombramiento de directores
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/agenda-items`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombramiento: {
        nombramientoDirectores: true,
      },
    }),
  },
);
```

### **2.2. Crear Candidatos**

```typescript
// Crear candidato a director
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/designation-director`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      director: {
        id: generateUUID(),
        person: {
          id: generateUUID(),
          tipo: 'NATURAL',
          nombre: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'García',
          tipoDocumento: 'DNI',
          numeroDocumento: '12345678',
          paisEmision: 'PE',
        },
        directorRole: 'TITULAR',
      },
      candidatoEstado: 'CANDIDATO',
    }),
  },
);
```

### **2.3. Votación Acumulativa (V1)**

```typescript
// Votar cantidad de directores
await fetch(
  `/v1/society-profile/${societyId}/flow/${flowId}/vote-count-director`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      directorCount: 5,
      voteAgreementType: 'SUBMITTED_TO_VOTES',
      votings: [
        {
          shareholderId: 'uuid-accionista-1',
          votes: [
            {
              directorId: 'uuid-director-1',
              voteCount: 10,
            },
          ],
        },
      ],
    }),
  },
);
```

### **2.4. Actualizar Resultados**

```typescript
// Marcar director como elegido
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/designation-director`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      directorId: 'uuid-director-1',
      candidatoEstado: 'ELEGIDO', // ELEGIDO o NO_ELEGIDO
    }),
  },
);
```

---

## 👑 PASO 3: PRESIDENTE DEL DIRECTORIO

### **Endpoint (Mismo que Paso 1)**

```
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
```

### **Asignar Presidente**

```typescript
// Asignar presidente (debe ser un director TITULAR elegido)
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/directorio`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      presidenteId: 'uuid-director-titular-elegido', // ← ID de un director TITULAR
    }),
  },
);
```

### **Validaciones**

- ✅ `presidenteId` debe ser un director **TITULAR**
- ✅ El director debe estar **elegido** (candidatoEstado: "ELEGIDO")
- ✅ El director debe existir en el directorio del snapshot

---

## 🔄 FLUJO COMPLETO EN ORDEN

### **Secuencia Recomendada**

```typescript
// 1. Activar punto de agenda
await activateAgendaItem(societyId, flowId, {
  nombramiento: { nombramientoDirectores: true },
});

// 2. Configurar directorio (opcional, pero recomendado)
await configureDirectory(societyId, flowId, {
  cantidadDirectores: 5,
  inicioMandato: '2025-01-01',
  finMandato: '2025-12-31',
  periodo: 'ANUAL',
  configurarDirectorio: true, // ← Activa votación de configuración
});

// 3. Crear votación de configuración (opcional)
await createVote(societyId, flowId, {
  contexto: 'CONFIGURACION_DIRECTORIO',
  modo: 'SIMPLE',
  items: [/* ... */],
});

// 4. Crear candidatos a directores
await createDirectorCandidate(societyId, flowId, {
  director: { /* ... */ },
  candidatoEstado: 'CANDIDATO',
});

// 5. Votar cantidad de directores (V1)
await voteDirectorCount(societyId, flowId, {
  directorCount: 5,
  votings: [/* ... */],
});

// 6. Actualizar resultados (marcar elegidos)
await updateDirectorStatus(societyId, flowId, {
  directorId: 'uuid-director-1',
  candidatoEstado: 'ELEGIDO',
});

// 7. Asignar presidente
await configureDirectory(societyId, flowId, {
  presidenteId: 'uuid-director-titular-elegido',
});
```

---

## 📊 ENDPOINTS RESUMIDOS

| Paso | Endpoint | Método | Descripción |
|------|----------|--------|-------------|
| **1.1** | `/agenda-items` | PUT | Activar nombramiento de directores |
| **1.2** | `/directorio` | PUT | Configurar directorio (5 campos) + activar votación |
| **1.3** | `/votes` | POST | Crear votación de configuración |
| **2.1** | `/designation-director` | POST | Crear candidato a director |
| **2.2** | `/vote-count-director` | POST | Votar cantidad de directores (V1) |
| **2.3** | `/designation-director` | PUT | Actualizar estado (ELEGIDO/NO_ELEGIDO) |
| **3.1** | `/directorio` | PUT | Asignar presidente |

---

## ✅ CHECKLIST FRONTEND

- [ ] 1. Activar `nombramientoDirectores` en agenda items
- [ ] 2. Configurar directorio con 5 campos (cantidad, fechas, duración, configurarDirectorio)
- [ ] 3. Crear votación de configuración (si `configurarDirectorio: true`)
- [ ] 4. Crear candidatos a directores
- [ ] 5. Votar cantidad de directores (V1)
- [ ] 6. Actualizar resultados (marcar elegidos)
- [ ] 7. Asignar presidente del directorio

---

## 🎯 NOTAS IMPORTANTES

### **1. Endpoint de Directorio**

- **Mismo endpoint** para configurar directorio Y asignar presidente
- **Campos opcionales**: Solo envías los que necesites
- **Actualiza el snapshot**: No afecta el directorio base de la sociedad

### **2. Votación de Configuración**

- Se crea/elimina automáticamente con `configurarDirectorio: true/false`
- Contexto: `"CONFIGURACION_DIRECTORIO"`
- Disponible cuando `nombramientoDirectores` o `nombramientoNuevoDirectorio` está activo

### **3. Presidente**

- Debe ser un director **TITULAR**
- Debe estar **elegido** (candidatoEstado: "ELEGIDO")
- Se asigna con el mismo endpoint de configuración

---

## 📚 REFERENCIAS

- **Endpoint Directorio:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio`
- **Endpoint Designación:** `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director`
- **Endpoint Votación:** `POST /api/v2/society-profile/:societyId/register-assembly/:flowId/votes`
- **Contexto Votación:** `"CONFIGURACION_DIRECTORIO"`
- **Documentación Completa:** `docs/FRONTEND-CONFIGURACION-DIRECTORIO-VOTACION.md`
- **Documentación Designación:** `docs/API-DESIGNACION-DIRECTORES-PAYLOAD.md`

---

**Última actualización:** 2025-01-15  
**Versión del API:** v2

