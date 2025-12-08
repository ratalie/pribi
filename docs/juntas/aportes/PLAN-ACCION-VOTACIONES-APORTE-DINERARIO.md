# 📋 PLAN DE ACCIÓN: Corrección de Votaciones - Aporte Dinerario

## 🎯 Objetivos

1. **Mover `tipoAprobacion` de `VoteSession` a `VoteItem`** (cambio arquitectónico del backend)
2. **Asegurar modo SIMPLE** siempre para aporte dinerario
3. **Cargar votantes correctamente** desde asistentes (`asistio === true`)
4. **Corregir creación/actualización** de votación según nueva arquitectura

---

## 🔍 Problemas Identificados

### **1. Arquitectura Incorrecta**
- ❌ `tipoAprobacion` está en `VoteSession` (nivel sesión)
- ✅ Debe estar en `VoteItem` (nivel item)

### **2. Votantes No Se Cargan**
- ❌ Backend devuelve votación vacía (`items: []`)
- ❌ No se están cargando los asistentes correctamente
- ❌ No se están filtrando solo los que `asistio === true`

### **3. Modo de Votación**
- ✅ Aporte dinerario siempre usa `SIMPLE`
- ✅ CUMULATIVO solo para remoción/designación de directores

---

## 📝 Cambios Necesarios

### **Fase 1: Actualizar Domain Layer**

1. **`vote-item.entity.ts`**
   - ✅ Agregar `tipoAprobacion?: VoteAgreementType`

2. **`vote-session.entity.ts`**
   - ✅ Remover `tipoAprobacion` (ya no está a nivel sesión)

### **Fase 2: Actualizar Application Layer**

3. **`vote.dto.ts`**
   - ✅ Agregar `tipoAprobacion` en `VoteItemDTO`
   - ✅ Remover `tipoAprobacion` de `VoteSessionResponseDTO`
   - ✅ Agregar `tipoAprobacion` en items de `CreateVoteSessionRequestDTO`
   - ✅ Agregar `tipoAprobacion` en items de `UpdateVoteSessionRequestDTO`

### **Fase 3: Actualizar Infrastructure Layer**

4. **`vote.mapper.ts`**
   - ✅ Mapear `tipoAprobacion` desde/ hacia `VoteItem`
   - ✅ Remover mapeo de `tipoAprobacion` desde/ hacia `VoteSession`

### **Fase 4: Actualizar Presentation Layer**

5. **`useVotacionStore.ts`**
   - ✅ Leer `tipoAprobacion` desde `item.tipoAprobacion` en lugar de `session.tipoAprobacion`
   - ✅ Actualizar `createVotacion` para incluir `tipoAprobacion` en el item
   - ✅ Actualizar `updateTipoAprobacion` para usar `accion: 'update'` con `tipoAprobacion` en el item

6. **`useVotacionController.ts`**
   - ✅ Verificar que se carguen asistentes correctamente
   - ✅ Filtrar solo `asistio === true`
   - ✅ Asegurar que se pasen votantes al crear votación

7. **`useVotacionAportesStore.ts`**
   - ✅ Verificar cálculo de datos (capital antes/después)

---

## 🐛 Debug: Votantes No Se Cargan

### **Paso 1: Verificar Carga de Asistentes**

```typescript
// En useVotacionController.ts
async function loadData() {
  // 1. Cargar asistentes
  await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
  
  // 2. DEBUG: Ver qué se cargó
  console.log("[DEBUG] Asistentes cargados:", asistenciaStore.asistencias);
  console.log("[DEBUG] Asistentes que asistieron:", 
    asistenciaStore.asistencias.filter(a => a.asistio)
  );
}
```

### **Paso 2: Verificar Filtrado de Votantes**

```typescript
// En useVotacionController.ts
const votantes = computed(() => {
  const asistentes = asistenciaStore.asistenciasEnriquecidas;
  const filtrados = asistentes.filter((a) => a.asistio);
  
  console.log("[DEBUG] Votantes filtrados:", filtrados);
  
  return filtrados.map((a) => ({
    id: a.id,
    accionistaId: a.accionista.id,
    accionista: a.accionista,
    nombreCompleto: a.nombreCompleto,
    tipoPersona: a.tipoPersona,
  }));
});
```

### **Paso 3: Verificar Creación de Votación**

```typescript
// En useVotacionStore.ts
async createVotacion(...) {
  // DEBUG: Ver qué votantes se están pasando
  console.log("[DEBUG] Creando votación con votantes:", votantes);
  
  // Asegurar que se incluyan votos iniciales si es SOMETIDO_A_VOTACION
  const votos = tipoAprobacion === 'SOMETIDO_A_VOTACION'
    ? votantes.map(v => ({
        id: generateUUID(),
        personaId: v.accionistaId,
        valor: 'A_FAVOR'
      }))
    : [];
}
```

---

## ✅ Checklist de Implementación

### **Domain Layer**
- [ ] Agregar `tipoAprobacion` a `VoteItem`
- [ ] Remover `tipoAprobacion` de `VoteSession`

### **Application Layer**
- [ ] Actualizar `VoteItemDTO` con `tipoAprobacion`
- [ ] Actualizar `VoteSessionResponseDTO` (remover `tipoAprobacion`)
- [ ] Actualizar `CreateVoteSessionRequestDTO` (agregar `tipoAprobacion` en items)
- [ ] Actualizar `UpdateVoteSessionRequestDTO` (agregar `tipoAprobacion` en items)

### **Infrastructure Layer**
- [ ] Actualizar mapper para mapear `tipoAprobacion` desde/hacia `VoteItem`
- [ ] Remover mapeo de `tipoAprobacion` desde/hacia `VoteSession`

### **Presentation Layer**
- [ ] Actualizar `useVotacionStore` para leer `tipoAprobacion` desde item
- [ ] Actualizar `createVotacion` para incluir `tipoAprobacion` en item
- [ ] Actualizar `updateTipoAprobacion` para usar `accion: 'update'`
- [ ] Verificar carga de asistentes
- [ ] Verificar filtrado de votantes (`asistio === true`)
- [ ] Agregar logs de debug

### **Testing**
- [ ] Probar creación de votación
- [ ] Probar cambio de tipo de aprobación
- [ ] Probar carga de votantes
- [ ] Verificar que se muestren en la UI

---

## 🚀 Orden de Implementación

1. **Domain Layer** (entities) - Base
2. **Application Layer** (DTOs) - Interfaz con backend
3. **Infrastructure Layer** (mappers) - Conversión
4. **Presentation Layer** (stores, controller) - Lógica de negocio
5. **Debug y Testing** - Verificar funcionamiento

---

## 📝 Notas Importantes

- **Modo SIMPLE:** Siempre para aporte dinerario
- **tipoAprobacion:** Ahora está en cada item, no en la sesión
- **Votantes:** Solo los que `asistio === true`
- **personaId:** Debe ser `accionista.id` (ShareholderV2.id)


