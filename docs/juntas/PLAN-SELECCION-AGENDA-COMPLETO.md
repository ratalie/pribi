# 📋 Plan Completo: Selección de Puntos de Agenda

## ✅ Estado Actual

### Rutas Actualizadas
- ✅ Estructura de rutas: `/operaciones/junta-accionistas/[societyId]/[flowId]/seleccion-agenda`
- ✅ Helper de rutas actualizado: `buildJuntaRoute(route, societyId, flowId)`
- ✅ Navegación actualizada: `junta-navigation.ts` usa ambos IDs
- ✅ Detección de rutas actualizada: `route-detection.utils.ts` extrae ambos IDs
- ✅ Página principal actualizada: `seleccion-agenda/index.vue` usa `route.params.societyId` y `route.params.flowId`

### Backend - Endpoints Disponibles

**Ubicación Backend:**
```
/home/yull23/legal-factory/backend/src/modules/flows-v2/register-assembly/1.agenda-items
```

**Endpoints:**
- `GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items`
- `PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items`

**Estructura del DTO (Backend):**
```typescript
{
  aumentoCapital: {
    aportesDinerarios: boolean,
    aporteNoDinerario: boolean,
    capitalizacionDeCreditos: boolean,
  },
  remocion: {
    remocionGerenteGeneral: boolean,
    remocionApoderados: boolean,
    remocionDirectores: boolean,
  },
  nombramiento: {
    nombramientoGerenteGeneral: boolean,
    nombramientoApoderados: boolean,
    nombramientoDirectores: boolean,
    nombramientoNuevoDirectorio: boolean,
  },
  gestionSocialYResultadosEconomicos: {
    pronunciamientoGestionSocialYResultados: boolean,
    aplicacionResultados: boolean,
    designacionAuditoresExternos: boolean,
  },
}
```

### Frontend - Estado Actual

**✅ Ya Implementado:**
- ✅ Store: `agenda-items.store.ts` (Option API)
- ✅ Repository: `agenda-items.http.repository.ts`
- ✅ Use Cases: `GetAgendaItemsUseCase`, `UpdateAgendaItemsUseCase`
- ✅ Mapper: `AgendaItemsMapper` (Frontend IDs ↔ Backend Structure)
- ✅ DTOs: `AgendaItemsDTO` con estructura completa
- ✅ MSW Handlers: `agenda-items.handlers.ts` (con ambos IDs)
- ✅ Componente: `SeleccionPuntosAgenda.vue` (recibe ambos IDs como props)

**🔄 Pendiente:**
- ⚠️ Cargar datos al montar el componente
- ⚠️ Sincronizar selección con backend en tiempo real (opcional)
- ⚠️ Mostrar estado de carga/error en el componente

---

## 🎯 Plan de Implementación

### Fase 1: Cargar Datos al Montar (30 min)

**Archivo:** `app/components/juntas/SeleccionPuntosAgenda.vue`

#### Cambios Necesarios:

1. **Cargar datos al montar:**
   ```typescript
   onMounted(async () => {
     if (props.societyId && props.flowId) {
       const societyIdNum = typeof props.societyId === 'number' 
         ? props.societyId 
         : parseInt(props.societyId, 10);
       const flowIdNum = typeof props.flowId === 'number' 
         ? props.flowId 
         : parseInt(props.flowId, 10);
       
       if (!Number.isNaN(societyIdNum) && !Number.isNaN(flowIdNum)) {
         await agendaItemsStore.loadAgendaItems(societyIdNum, flowIdNum);
       }
     }
   });
   ```

2. **Sincronizar datos cargados con checkboxes:**
   ```typescript
   watch(() => agendaItemsStore.agendaItems, (newItems) => {
     if (newItems) {
       // Convertir estructura del backend a IDs del frontend
       const selectedIds = AgendaItemsMapper.dtoToFrontendIds(newItems);
       // Actualizar el store de juntas con los IDs seleccionados
       juntasFlowStore.setDynamicSubSteps(selectedIds);
     }
   }, { immediate: true });
   ```

3. **Mostrar estado de carga:**
   ```vue
   <div v-if="isLoading" class="flex items-center gap-2">
     <LoaderCircle class="animate-spin" />
     <span>Cargando puntos de agenda...</span>
   </div>
   ```

4. **Mostrar errores:**
   ```vue
   <div v-if="errorMessage" class="text-red-600">
     {{ errorMessage }}
   </div>
   ```

---

### Fase 2: Guardar al Seleccionar (Opcional - 20 min)

**Opción A: Guardar automáticamente al cambiar** (Recomendado para mejor UX)

```typescript
const handlePuntoChange = async (puntoId: string, checked: boolean) => {
  // Actualizar estado local inmediatamente
  juntasFlowStore.toggleSubStep(puntoId);
  
  // Guardar en backend automáticamente
  if (props.societyId && props.flowId) {
    const societyIdNum = typeof props.societyId === 'number' 
      ? props.societyId 
      : parseInt(props.societyId, 10);
    const flowIdNum = typeof props.flowId === 'number' 
      ? props.flowId 
      : parseInt(props.flowId, 10);
    
    if (!Number.isNaN(societyIdNum) && !Number.isNaN(flowIdNum)) {
      const selectedIds = juntasFlowStore.getDynamicSubSteps;
      const payload = AgendaItemsMapper.frontendIdsToDTO(selectedIds);
      
      try {
        await agendaItemsStore.saveAgendaItems(societyIdNum, flowIdNum, payload);
      } catch (error) {
        // Revertir cambio si falla
        juntasFlowStore.toggleSubStep(puntoId);
        console.error("Error al guardar:", error);
      }
    }
  }
};
```

**Opción B: Guardar solo al hacer clic en "Siguiente"** (Ya implementado en `useJuntasFlowNext`)

---

### Fase 3: MSW - Estado en Memoria (20 min)

**Archivo:** `app/core/hexag/juntas/infrastructure/mocks/data/agenda-items.state.ts`

#### Implementar:

```typescript
// Estado en memoria (similar a sociedades.state.ts)
interface AgendaItemsState {
  [key: string]: AgendaItemsDTO; // key: "societyId:flowId"
}

const state: AgendaItemsState = {};

export async function getAgendaItemsMock(
  societyId: number,
  flowId: number
): Promise<AgendaItemsDTO | null> {
  const key = `${societyId}:${flowId}`;
  return state[key] || null; // null si no existe (404)
}

export async function updateAgendaItemsMock(
  societyId: number,
  flowId: number,
  data: AgendaItemsDTO
): Promise<void> {
  const key = `${societyId}:${flowId}`;
  state[key] = data;
}
```

---

### Fase 4: Validaciones y Mejoras (15 min)

1. **Validar que al menos un punto esté seleccionado** (ya implementado en `useJuntasFlowNext`)
2. **Mostrar mensaje si no hay datos guardados** (primera vez)
3. **Indicador visual de guardado exitoso** (opcional)

---

## 📊 Flujo Completo

### Al Cargar la Página

```
1. Usuario navega a /operaciones/junta-accionistas/30/7/seleccion-agenda
2. Componente SeleccionPuntosAgenda se monta
3. onMounted() detecta props.societyId (30) y props.flowId (7)
4. Llama a agendaItemsStore.loadAgendaItems(30, 7)
5. Repository hace GET /api/v2/society-profile/30/assembly/7/agenda-items
6. Si hay datos: mapper convierte DTO → Frontend IDs
7. Store actualiza juntasFlowStore con IDs seleccionados
8. Componente muestra checkboxes marcados según datos cargados
9. Si no hay datos: muestra checkboxes desmarcados (valores por defecto)
```

### Al Seleccionar un Punto

```
1. Usuario hace clic en checkbox
2. handlePuntoChange() actualiza juntasFlowStore
3. (Opcional) Guarda automáticamente en backend
4. Repository hace PUT /api/v2/society-profile/30/assembly/7/agenda-items
5. Backend guarda los datos
6. Store actualiza estado local
```

### Al Hacer Clic en "Siguiente"

```
1. useJuntasFlowNext valida que haya al menos un punto seleccionado
2. Convierte Frontend IDs → DTO del backend
3. Guarda en backend (si no se guardó automáticamente)
4. Navega al siguiente paso: /operaciones/junta-accionistas/30/7/detalles
```

---

## 🔧 Cambios Específicos en Código

### 1. Actualizar `SeleccionPuntosAgenda.vue`

**Ubicación:** `app/components/juntas/SeleccionPuntosAgenda.vue`

**Cambios:**

```vue
<script setup lang="ts">
// ... imports existentes ...

// Agregar watch para sincronizar datos cargados
watch(
  () => agendaItemsStore.agendaItems,
  (newItems) => {
    if (newItems) {
      const selectedIds = AgendaItemsMapper.dtoToFrontendIds(newItems);
      juntasFlowStore.setDynamicSubSteps(selectedIds);
    }
  },
  { immediate: true }
);

// Cargar datos al montar
onMounted(async () => {
  if (props.societyId && props.flowId) {
    const societyIdNum = typeof props.societyId === 'number' 
      ? props.societyId 
      : parseInt(String(props.societyId), 10);
    const flowIdNum = typeof props.flowId === 'number' 
      ? props.flowId 
      : parseInt(String(props.flowId), 10);
    
    if (!Number.isNaN(societyIdNum) && !Number.isNaN(flowIdNum)) {
      await agendaItemsStore.loadAgendaItems(societyIdNum, flowIdNum);
    }
  }
});
</script>
```

### 2. Verificar Mapper

**Archivo:** `app/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper.ts`

**Verificar que existan:**
- ✅ `frontendIdsToDTO(ids: string[]): AgendaItemsDTO` (ya existe)
- ⚠️ `dtoToFrontendIds(dto: AgendaItemsDTO): string[]` (verificar si existe)

Si no existe `dtoToFrontendIds`, crearlo:

```typescript
static dtoToFrontendIds(dto: AgendaItemsDTO): string[] {
  const ids: string[] = [];
  
  // Aumento de Capital
  if (dto.aumentoCapital.aportesDinerarios) ids.push("aporte-dinerarios");
  if (dto.aumentoCapital.aporteNoDinerario) ids.push("aporte-no-dinerario");
  if (dto.aumentoCapital.capitalizacionDeCreditos) ids.push("capitalizacion-creditos");
  
  // Remoción
  if (dto.remocion.remocionGerenteGeneral) ids.push("remocion-gerente");
  if (dto.remocion.remocionApoderados) ids.push("remocion-apoderados");
  if (dto.remocion.remocionDirectores) ids.push("remocion-directores");
  
  // Nombramiento
  if (dto.nombramiento.nombramientoGerenteGeneral) ids.push("nombramiento-gerente");
  if (dto.nombramiento.nombramientoApoderados) ids.push("nombramiento-apoderados");
  if (dto.nombramiento.nombramientoDirectores) ids.push("nombramiento-directores");
  if (dto.nombramiento.nombramientoNuevoDirectorio) ids.push("nombramiento-nuevo-directorio");
  
  // Gestión Social
  if (dto.gestionSocialYResultadosEconomicos.pronunciamientoGestionSocialYResultados) 
    ids.push("pronunciamiento-gestion");
  if (dto.gestionSocialYResultadosEconomicos.aplicacionResultados) 
    ids.push("aplicacion-resultados");
  if (dto.gestionSocialYResultadosEconomicos.designacionAuditoresExternos) 
    ids.push("delegacion-auditores");
  
  return ids;
}
```

---

## ✅ Checklist de Implementación

### Código
- [ ] Agregar `onMounted` en `SeleccionPuntosAgenda.vue` para cargar datos
- [ ] Agregar `watch` para sincronizar datos cargados con checkboxes
- [ ] Verificar/crear `dtoToFrontendIds` en `AgendaItemsMapper`
- [ ] Agregar indicadores de carga/error en el componente
- [ ] (Opcional) Implementar guardado automático al cambiar

### MSW
- [ ] Crear `agenda-items.state.ts` con estado en memoria
- [ ] Implementar `getAgendaItemsMock` y `updateAgendaItemsMock`
- [ ] Verificar que handlers MSW funcionen correctamente

### Testing
- [ ] Probar carga de datos al montar
- [ ] Probar guardado de datos
- [ ] Probar sincronización con sidebar (sub-steps dinámicos)
- [ ] Probar validación de "al menos un punto seleccionado"

---

## 🎯 Ventajas de la Nueva Estructura de Rutas

Con la nueva estructura `/operaciones/junta-accionistas/:societyId/:flowId/...`:

1. **✅ URLs explícitas**: Siempre sabemos qué sociedad y qué junta estamos editando
2. **✅ Fácil debugging**: Los IDs están en la URL, no dependen del store
3. **✅ Consistente con backend**: La estructura coincide con los endpoints
4. **✅ Navegación directa**: Podemos compartir URLs específicas
5. **✅ Mejor SEO**: URLs más descriptivas (si aplica)

---

## 📝 Notas Importantes

1. **Primera vez**: Si no hay datos guardados, el backend devuelve 404. El repositorio lo maneja como `null` y se usan valores por defecto (todos `false`).

2. **Sincronización**: Los datos cargados del backend deben sincronizarse con `juntasFlowStore` para que el sidebar muestre los sub-steps correctos.

3. **Validación**: El botón "Siguiente" valida que al menos un punto esté seleccionado antes de avanzar.

4. **Guardado**: Se puede guardar automáticamente al cambiar o solo al hacer clic en "Siguiente". La opción automática mejora la UX pero genera más requests.

---

## 🚀 Próximos Pasos

1. Implementar carga de datos al montar
2. Verificar/crear mapper `dtoToFrontendIds`
3. Implementar estado MSW en memoria
4. Probar flujo completo
5. Continuar con "Detalles de la Junta" (meeting-details)

---

**Fecha:** 30 Nov 2025  
**Estado:** Plan listo para implementación

