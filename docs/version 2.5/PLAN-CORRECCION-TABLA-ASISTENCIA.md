# 🔧 PLAN DE CORRECCIÓN: TABLA DE ASISTENCIA

**Fecha**: Diciembre 4, 2025  
**Problemas identificados**: 3

---

## 📋 PROBLEMAS IDENTIFICADOS

### ❌ **PROBLEMA 1: Junta Universal**
- **Estado actual**: Checkboxes están deshabilitados pero NO están marcados automáticamente
- **Comportamiento esperado**: 
  - Al cargar la página, si `tipoJunta === UNIVERSAL`, marcar TODOS como `asistio: true`
  - Deshabilitar checkboxes (ya está implementado)
  - No permitir desmarcar

### ❌ **PROBLEMA 2: Selección cuando NO asistió**
- **Estado actual**: Cuando `asistio: false`, no hay forma de seleccionar quién asistió en su lugar
- **Comportamiento esperado**:
  - Si `asistio: false`:
    - **Persona NATURAL**: Puede seleccionar al accionista directamente O un representante de los presentes
    - **Persona JURIDICA/SUCURSAL/etc**: DEBE seleccionar un representante de los presentes
  - Mostrar selector similar a Presidente/Secretario con lista de presentes

### ❌ **PROBLEMA 3: Validación de Representantes**
- **Estado actual**: No valida que personas jurídicas tengan representante cuando `asistio: true`
- **Comportamiento esperado**:
  - Si `asistio: true` y tipo es `JURIDICA | SUCURSAL | FONDO_INVERSION | FIDEICOMISO | SUCESION_INDIVISA`:
    - DEBE tener `representadoPorId` asignado
    - Mostrar error si intenta guardar sin representante

---

## 🎯 SOLUCIÓN PROPUESTA

### ✅ **SOLUCIÓN 1: Junta Universal**

**Archivo**: `app/core/presentation/juntas/stores/asistencia.store.ts`

```typescript
// En la action loadAsistencias, después de cargar:
if (tipoJunta === TipoJunta.UNIVERSAL) {
  // Marcar todos como presentes
  this.asistencias.forEach(a => {
    if (!a.asistio) {
      // Actualizar en backend
      await this.toggleAsistencia(societyId, flowId, a.id);
    }
  });
}
```

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion/index.vue`

```typescript
// En onMounted, después de cargar asistencias:
if (meetingDetailsStore.meetingDetails?.tipoJunta === TipoJunta.UNIVERSAL) {
  // Marcar todos automáticamente
  for (const asistencia of asistenciaStore.asistencias) {
    if (!asistencia.asistio) {
      await asistenciaStore.toggleAsistencia(societyId.value, flowId.value, asistencia.id);
    }
  }
}
```

---

### ✅ **SOLUCIÓN 2: Selector cuando NO asistió**

**Archivo**: `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/AsistenciaRepresentacionSection.vue`

**Cambios necesarios**:

1. **Agregar computed para lista de presentes**:
```typescript
const presentesOptions = computed(() => {
  return asistenciaStore.asistenciasEnriquecidas
    .filter(a => a.asistio && a.tipoPersona === 'NATURAL')
    .map(a => ({
      id: a.id,
      value: a.id,
      label: a.nombreCompleto,
    }));
});
```

2. **Modificar columna "Representado por"**:
```vue
<TableCell class="h-16">
  <!-- Si asistió -->
  <template v-if="asistencia.asistio">
    <template v-if="asistencia.representadoPorId">
      <RepresentanteInfo ... />
    </template>
    <template v-else-if="requiereRepresentanteObligatorio(asistencia.tipoPersona)">
      <span class="text-red-600">⚠️ Requiere representante</span>
    </template>
    <template v-else>
      <span>—</span>
    </template>
  </template>
  
  <!-- Si NO asistió: Mostrar selector -->
  <template v-else>
    <SelectInputZod
      v-model="asistencia.reemplazoId"
      :options="presentesOptions"
      placeholder="Seleccionar presente o representante"
      :schema="z.string().min(1, 'Requerido')"
    />
  </template>
</TableCell>
```

3. **Agregar función para tipos que requieren representante obligatorio**:
```typescript
function requiereRepresentanteObligatorio(tipo: string): boolean {
  return ['JURIDICA', 'SUCURSAL', 'FONDO_INVERSION', 'FIDEICOMISO', 'SUCESION_INDIVISA'].includes(tipo);
}
```

---

### ✅ **SOLUCIÓN 3: Validación de Representantes**

**Archivo**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion/index.vue`

**En useJuntasFlowNext, agregar validación**:

```typescript
// Validar que personas jurídicas tengan representante
const juridicasSinRepresentante = asistenciaStore.asistenciasEnriquecidas.filter(
  a => a.asistio 
    && requiereRepresentanteObligatorio(a.tipoPersona)
    && !a.representadoPorId
);

if (juridicasSinRepresentante.length > 0) {
  const nombres = juridicasSinRepresentante.map(a => a.nombreCompleto).join(', ');
  throw new Error(
    `Las siguientes personas jurídicas deben tener representante asignado: ${nombres}`
  );
}
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

- [ ] **Paso 1**: Corregir Junta Universal (auto-marcar todos)
- [ ] **Paso 2**: Agregar selector cuando `asistio: false`
- [ ] **Paso 3**: Agregar validación de representantes obligatorios
- [ ] **Paso 4**: Actualizar función `requiereRepresentante` para incluir todos los tipos
- [ ] **Paso 5**: Probar flujo completo

---

## 🔍 TIPOS QUE REQUIEREN REPRESENTANTE OBLIGATORIO

```typescript
const TIPOS_CON_REPRESENTANTE_OBLIGATORIO = [
  'JURIDICA',
  'SUCURSAL', 
  'FONDO_INVERSION',
  'FIDEICOMISO',
  'SUCESION_INDIVISA'
] as const;

// Solo NATURAL no requiere representante obligatorio
```

---

## 📚 REFERENCIAS

- Documentación V2.5: `docs/version 2.5/DOCUMENTACION-TABLA-ASISTENCIA-REPRESENTANTES.md`
- Relación con Presidente/Secretario: `docs/version 2.5/RELACION-ASISTENCIA-PRESIDENTE-SECRETARIO.md`
- Catálogo de componentes: `docs/general/CATALOGO-COMPONENTES-REGISTRO-SOCIEDADES.md`





