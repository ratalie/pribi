# 📋 Plan de Implementación: Vista de Nombramiento de Apoderados

## 🎯 Objetivo

Implementar la vista de nombramiento de apoderados con funcionalidad completa:

1. GET de apoderados - mostrar todos (normales + "Otros Apoderados")
2. POST para crear nuevos apoderados
3. PUT con checkbox para seleccionar/aprobar (como en remoción)
4. Botón "Siguiente" solo direcciona

---

## 📊 Análisis de Referencias

### Remoción de Apoderados (Referencia para checkbox PUT)

- ✅ GET `/removal-attorney` → Lista todos los apoderados
- ✅ PUT `/removal-attorney` → Actualiza estado con checkbox (automático)
- ✅ Estados: `"CANDIDATO"` (marcar) | `"DESMARCAR"` (desmarcar)
- ✅ Watch en composable detecta cambios de checkbox
- ✅ PUT automático cuando cambia el checkbox

### Gerente General (Referencia para GET/POST)

- ✅ GET `/designation-attorney` → Obtiene apoderados designados
- ✅ POST `/designation-attorney` → Crea nuevo apoderado
- ✅ PUT `/designation-attorney` → Actualiza apoderado existente

---

## 🔧 Implementación Detallada

### **1. GET de Apoderados - Mostrar Todos**

**Store (`useNombramientoApoderadosStore.ts`):**

```typescript
async loadApoderadosDesignados(societyId: number, flowId: number) {
  // GET /designation-attorney
  const apoderados = await useCase.execute(societyId, flowId);

  // Excluir "Gerente General" (se maneja en su propio store)
  const gerenteGeneralClassId = this.getGerenteGeneralClassId();
  const apoderadosSinGerente = gerenteGeneralClassId
    ? apoderados.filter(a => a.attorneyClassId !== gerenteGeneralClassId)
    : apoderados;

  this.apoderadosDesignados = apoderadosSinGerente;
}
```

**Composable:**

```typescript
// Mapear apoderados a formato de tabla
const apoderadosTabla = computed(() => {
  return apoderadosDesignados.value.map(apod => {
    // Extraer datos de persona
    const nombre = /* obtener nombre de person */;
    const tipoDocumento = /* obtener tipoDocumento */;
    const numeroDocumento = /* obtener numeroDocumento */;

    // Obtener nombre de clase desde snapshot
    const nombreClase = /* obtener nombre desde snapshot.attorneyClasses */;

    return {
      id: apod.id,
      checked: apod.isCandidate || false, // ✅ Marcar si ya está como candidato
      clase_apoderado: nombreClase,
      nombre,
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento,
    };
  });
});
```

**Vista:**

- Usar `CheckboxTable` (igual que remoción)
- Mostrar TODOS los apoderados (normales + "Otros Apoderados")
- Agrupar en dos secciones si es necesario (apoderados normales / otros apoderados)

---

### **2. POST para Crear Nuevos Apoderados**

**Store:**

```typescript
async createApoderado(
  societyId: number,
  flowId: number,
  attorneyClassId: string,
  person: PersonNaturalDTO | PersonJuridicDTO
): Promise<DesignationAttorneyResponseDTO> {
  // POST /designation-attorney
  await useCase.execute(societyId, flowId, { attorneyClassId, person });

  // Recargar lista
  await this.loadApoderadosDesignados(societyId, flowId);
}
```

**Composable:**

```typescript
async function guardarApoderado() {
  if (!claseApoderadoSeleccionada.value) {
    throw new Error("Seleccione una clase");
  }

  // Construir person DTO
  const person = /* construir desde formulario */;

  // POST
  await nombramientoStore.createApoderado(
    societyId.value,
    flowId.value,
    claseApoderadoSeleccionada.value,
    person
  );

  // Limpiar formulario
  limpiarFormulario();
}
```

**Vista:**

- Botón "Agregar apoderado" → Abre modal
- Modal con formulario de persona (reutilizar de gerente)
- Select de clase de apoderado
- Botón "Guardar" → Llama a `guardarApoderado()`

---

### **3. PUT con Checkbox para Seleccionar (Como Remoción)**

**Store:**

```typescript
async actualizarEstado(
  societyId: number,
  flowId: number,
  attorneyId: string,
  candidatoEstado: "CANDIDATO" | "DESMARCAR"
): Promise<void> {
  // PUT /designation-attorney
  // ⚠️ IMPORTANTE: Verificar si el endpoint acepta candidatoEstado
  // Si no, usar UpdateDesignationAttorneyUseCase con UpdateDesignationAttorneyDTO
  await useCase.execute(societyId, flowId, {
    attorneyId,
    candidatoEstado,
  });

  // Recargar lista
  await this.loadApoderadosDesignados(societyId, flowId);
}
```

**Composable (Watch automático):**

```typescript
const previousCheckedState = ref<Map<string, boolean>>(new Map());
const isInitializing = ref(false);

watch(
  () => apoderados.value,
  (newApoderados) => {
    if (isInitializing.value) return;

    newApoderados.forEach((apoderado) => {
      const previousChecked = previousCheckedState.value.get(apoderado.id);

      if (previousChecked !== undefined && previousChecked !== apoderado.checked) {
        // ✅ PUT automático cuando cambia el checkbox
        const estado = apoderado.checked ? "CANDIDATO" : "DESMARCAR";
        nombramientoStore
          .actualizarEstado(societyId.value, flowId.value, apoderado.id, estado)
          .catch((error) => {
            // Revertir si falla
            apoderado.checked = previousChecked;
          });
      }

      previousCheckedState.value.set(apoderado.id, apoderado.checked);
    });
  },
  { deep: true }
);
```

**Vista:**

- Usar `CheckboxTable` con `@update:checked-items`
- El checkbox cambia → Watch detecta → PUT automático

---

### **4. Botón "Siguiente" Solo Direcciona**

**Vista:**

```typescript
useJuntasFlowNext(async () => {
  // No hacer nada, solo permite navegar
  // El flujo de navegación se encarga del routing
});
```

---

## 📁 Archivos a Modificar/Crear

### **Store (`useNombramientoApoderadosStore.ts`)**

- ✅ Ya existe - Agregar método `actualizarEstado()` para PUT

### **Composable (`useNombramientoApoderadosPage.ts`)**

- ✅ Ya existe - Modificar para:
  - Mapear apoderados a formato de tabla con `checked`
  - Agregar watch para cambios de checkbox
  - Manejar estado anterior para evitar loops

### **Vista (`nombramiento.vue`)**

- Modificar para:
  - Usar `CheckboxTable` en lugar de tablas separadas
  - Conectar con composable
  - Modal para crear nuevos apoderados
  - Botón siguiente solo direcciona

---

## 🔄 Flujo Completo

```
1. Usuario entra a vista
   ↓
2. GET /designation-attorney
   ↓
3. Mapear a formato de tabla con checked (basado en isCandidate)
   ↓
4. Mostrar en CheckboxTable
   ↓
5. Usuario marca/desmarca checkbox
   ↓
6. Watch detecta cambio → PUT automático
   ↓
7. Recargar lista (GET) para actualizar estado
   ↓
8. Usuario hace clic en "Agregar apoderado"
   ↓
9. Abre modal con formulario
   ↓
10. Usuario completa y guarda → POST
    ↓
11. Recargar lista (GET)
    ↓
12. Usuario hace clic en "Siguiente" → Solo navega (no hace nada)
```

---

## ✅ Checklist de Implementación

### Store

- [ ] Agregar método `actualizarEstado()` (PUT)
- [ ] Verificar que `loadApoderadosDesignados()` excluya "Gerente General"
- [ ] Incluir tanto apoderados normales como "Otros Apoderados"

### Composable

- [ ] Crear computed `apoderadosTabla` que mapee a formato de tabla
- [ ] Incluir `checked` basado en `isCandidate`
- [ ] Agregar watch para cambios de checkbox
- [ ] Implementar `previousCheckedState` para evitar loops
- [ ] Manejar `isInitializing` para no ejecutar watch durante carga inicial
- [ ] Función `guardarApoderado()` para POST

### Vista

- [ ] Reemplazar tablas separadas por `CheckboxTable`
- [ ] Conectar con composable
- [ ] Modal para crear apoderado (reutilizar formulario de gerente)
- [ ] Botón "Siguiente" solo direcciona (useJuntasFlowNext sin lógica)
- [ ] Mostrar todos los apoderados (normales + otros)

---

## 🚨 Consideraciones Importantes

### 1. **Endpoint PUT para Actualizar Estado**

- ⚠️ Verificar si `UpdateDesignationAttorneyUseCase` acepta `candidatoEstado`
- ⚠️ Si no, puede ser necesario usar otro endpoint o adaptar el DTO
- ⚠️ Comparar con remoción: usa `CreateRemovalAttorneyCandidateUseCase` que acepta estado

### 2. **Formato de Tabla**

- ✅ Usar mismo formato que remoción: `ApoderadosTableRow`
- ✅ Campo `checked` basado en `isCandidate`
- ✅ Incluir todos los campos: clase, nombre, tipo_documento, numero_documento

### 3. **Watch Automático**

- ⚠️ Importante prevenir loops infinitos con `previousCheckedState`
- ⚠️ Usar `isInitializing` para no ejecutar durante carga inicial
- ⚠️ Manejar errores y revertir cambios si falla el PUT

### 4. **Diferencias con Remoción**

- Remoción: Usa `RemovalAttorneyResponseDTO` con `isCandidate`
- Nombramiento: Usa `DesignationAttorneyResponseDTO` con `isCandidate`
- ✅ Misma lógica, solo cambian los tipos y endpoints

---

## 📚 Referencias de Código

### Remoción (Checkbox PUT)

- Composable: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/composables/useRemocionApoderadosPage.ts`
- Store: `app/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore.ts` (método `actualizarEstado`)
- Vista: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/remocion-apoderados/remocion.vue`

### Gerente (GET/POST)

- Store: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useNombramientoGerenteStore.ts`
- Composable: `app/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/composables/useNombramientoGerentePage.ts`

---

**Estado:** 📋 Plan listo para implementación  
**Prioridad:** Alta
