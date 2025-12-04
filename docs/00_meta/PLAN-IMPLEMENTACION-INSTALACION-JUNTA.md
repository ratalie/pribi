# 📋 Plan de Implementación - Vista de Instalación de Junta

**Fecha**: Diciembre 4, 2024  
**Vista**: Instalación de la Junta (Asistencia)  
**Objetivo**: Implementar las 3 secciones según el diseño

---

## 🎯 ANÁLISIS DE COMPONENTES REUTILIZABLES

### ✅ **Componentes UI que YA EXISTEN (Shadcn/ui):**

1. **`app/components/ui/table/`** - Sistema completo de tablas
   - `Table.vue`
   - `TableHeader.vue`
   - `TableBody.vue`
   - `TableRow.vue`
   - `TableCell.vue`
   - `TableHead.vue`

2. **`app/components/ui/checkbox/Checkbox.vue`** - Checkbox

3. **`app/components/ui/switch/Switch.vue`** - Toggle switch

4. **`app/components/ui/select/`** - Select dropdown

5. **`app/components/ui/input/`** - Input fields

6. **`app/components/ui/button/Button.vue`** - Botones

7. **`app/components/ui/dialog/`** - Modales

8. **`app/components/ui/card/Card.vue`** - Cards

### ✅ **Componentes de Sociedades REUTILIZABLES:**

1. **`app/core/presentation/registros/sociedades/pasos/accionistas/components/AccionistasList.vue`**
   - ✅ Tabla de accionistas con columnas similares
   - ✅ Tiene botones de acción
   - ⚠️ No tiene checkbox de selección (agregar)

2. **`app/components/composite/forms/PersonaNaturalForm.vue`**
   - ✅ Form completo de persona natural
   - ✅ Reutilizable para representante

3. **`app/core/presentation/registros/sociedades/pasos/directorio/components/PresidenteDirectorioForm.vue`**
   - ✅ Tiene switches para presidente
   - ✅ Lógica similar a lo que necesitas
   - ⚠️ Adaptable para Presidente y Secretario de Junta

### ✅ **Componentes de Juntas QUE YA EXISTEN:**

1. **`app/components/juntas/instalacion/DetallesCelebracionSection.vue`** ✅ COMPLETO
   - ✅ Selector de convocatoria (Primera/Segunda)
   - ✅ Muestra datos de junta
   - ✅ Maneja Universal vs General
   - **NO MODIFICAR** → Ya está bien hecho

2. **`app/components/juntas/instalacion/QuorumSection.vue`** ✅ COMPLETO
   - ✅ Muestra quorum simple y calificado
   - ✅ Lista puntos de agenda seleccionados
   - ✅ Se oculta en junta Universal
   - **NO MODIFICAR** → Ya está bien hecho

3. **`app/components/juntas/instalacion/AsistenciaTable.vue`** ⚠️ INCOMPLETO
   - ✅ Tiene estructura base de tabla
   - ❌ No tiene checkbox de selección
   - ❌ No tiene botón "+ Agregar" representante
   - **COMPLETAR**

4. **`app/components/juntas/instalacion/AsistenciaRepresentacionSection.vue`** ❌ VACÍO
   - Solo tiene título
   - **IMPLEMENTAR COMPLETO**

5. **`app/components/juntas/instalacion/MesaDirectivaSection.vue`** ❌ VACÍO
   - Solo tiene título
   - **IMPLEMENTAR COMPLETO**

---

## 🏗️ PLAN DE IMPLEMENTACIÓN

### **SECCIÓN 1: Detalles de la Celebración** ✅ YA EXISTE

**Componente**: `DetallesCelebracionSection.vue`

**Estado**: ✅ COMPLETO

**Incluye**:
- ✅ Selector de convocatoria (Primera/Segunda) - Solo si es GENERAL
- ✅ Muestra datos de la junta (Dirección, Fecha, Hora, Modo) - Readonly
- ✅ Quorum simple y calificado debajo (QuorumSection.vue)

**Acción**: Ninguna (ya está perfecto)

---

### **SECCIÓN 2: Tabla de Asistencia** 🔄 COMPLETAR

**Componente Base**: `AsistenciaRepresentacionSection.vue` + `AsistenciaTable.vue`

**Qué REUTILIZAR:**
1. ✅ `app/components/ui/table/` - Shadcn Table components
2. ✅ `app/components/ui/checkbox/Checkbox.vue` - Para seleccionar asistentes
3. ✅ `app/components/ui/button/Button.vue` - Botón "+ Agregar"
4. ✅ `app/components/ui/dialog/` - Para modal de representante
5. ✅ `app/components/composite/forms/PersonaNaturalForm.vue` - Form de representante

**Qué CREAR:**
1. 🆕 `AsistenciaRepresentacionSection.vue` - Wrapper completo
2. 🆕 `AsistenciaTableRow.vue` - Fila de la tabla (con checkbox + representante)
3. 🆕 `RepresentanteModal.vue` - Modal para agregar representante
4. 🆕 `RepresentanteInfo.vue` - Card pequeño mostrando info del representante

**Lógica:**
```typescript
// Si es UNIVERSAL
checkbox.disabled = true;  // Siempre checkeado
checkbox.checked = true;

// Si es GENERAL
checkbox.disabled = false; // Seleccionable
checkbox.checked = asistente.asistio; // Del store
```

**Columnas de la Tabla:**
1. Checkbox (seleccionar asistencia)
2. Nombre / Razón Social
3. Tipo de Accionista (badge)
4. Acciones con derecho a voto
5. Porcentaje de Participación
6. Representado por (nombre o "+ Agregar")

**Datos origen:**
```typescript
// Del store de asistencia
const { asistentes, representantes } = useAsistenciaStore();

// Del snapshot (accionistas completos)
const { accionistas } = useSnapshotStore();

// Combinar:
const asistenciasEnriquecidas = accionistas.map(acc => ({
  ...acc,
  asistio: asistentes.includes(acc.id),
  representante: representantes.find(r => r.accionistaId === acc.id)
}));
```

---

### **SECCIÓN 3: Presidente y Secretario** 🆕 CREAR

**Componente**: `MesaDirectivaSection.vue`

**Qué REUTILIZAR:**
1. ✅ `app/components/ui/switch/Switch.vue` - Switches para asistió
2. ✅ `app/components/ui/input/Input.vue` - Input para nombre externo
3. ✅ `app/components/ui/select/` - Select de asistentes
4. ✅ Lógica similar a `PresidenteDirectorioForm.vue`

**Qué CREAR:**
1. 🆕 `MesaDirectivaSection.vue` - Sección completa
2. 🆕 `PresidenteJuntaCard.vue` - Card para presidente
3. 🆕 `SecretarioJuntaCard.vue` - Card para secretario

**Lógica:**
```typescript
// 1. Cargar datos del directorio (si existe)
const { directorio } = useSnapshot();
const presidentePorDefecto = directorio?.presidenteId;
const secretarioPorDefecto = directorio?.secretarioId; // Si hay

// 2. Estado de asistencia
const presidenteAsistio = ref(true); // Por defecto asistió
const secretarioAsistio = ref(true);

// 3. Si NO asistió, selector de reemplazo
if (!presidenteAsistio.value) {
  // Mostrar select de asistentes presentes
  const presidenteReemplazo = computed(() => {
    return asistentes.filter(a => a.asistio);
  });
}

// 4. Si NO tiene directorio
if (!directorio) {
  // Input manual o selector de asistentes
}
```

**Estructura UI:**
```vue
<div class="grid grid-cols-2 gap-4">
  <!-- Card Presidente -->
  <Card>
    <CardHeader>
      <CardTitle>Presidente de la Junta</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Switch: Asistió -->
      <div class="flex justify-between">
        <Label>¿Asistió?</Label>
        <Switch v-model="presidenteAsistio" />
      </div>
      
      <!-- Si asistió: Mostrar nombre -->
      <div v-if="presidenteAsistio">
        <Input :value="presidenteNombre" disabled />
      </div>
      
      <!-- Si NO asistió: Selector de reemplazo -->
      <div v-else>
        <Select v-model="presidenteReemplazo">
          <option v-for="asist in asistentesPresentes" :value="asist.id">
            {{ asist.nombre }}
          </option>
        </Select>
      </div>
    </CardContent>
  </Card>
  
  <!-- Card Secretario (mismo patrón) -->
  <Card>...</Card>
</div>
```

---

## 📦 ARCHIVOS A CREAR (6 archivos)

### Sección 2: Asistencia (4 archivos)

1. **`AsistenciaRepresentacionSection.vue`** - Wrapper completo
   - Usa: `AsistenciaTableRow`, `RepresentanteModal`
   - Store: `useAsistenciaStore`, `useSnapshotStore`

2. **`AsistenciaTableRow.vue`** - Fila individual de tabla
   - Props: accionista, asistio, representante
   - Emits: toggle-asistencia, add-representante

3. **`RepresentanteModal.vue`** - Modal para agregar representante
   - Usa: `PersonaNaturalForm`
   - Emits: save-representante

4. **`RepresentanteInfo.vue`** - Mostrar info de representante
   - Props: representante
   - Emits: edit, remove

### Sección 3: Mesa Directiva (2 archivos)

5. **`MesaDirectivaSection.vue`** - Sección completa
   - Usa: `PresidenteJuntaCard`, `SecretarioJuntaCard`

6. **`PresidenteSecretarioCard.vue`** - Card reutilizable
   - Props: rol ('presidente' | 'secretario'), nombre, asistio
   - Emits: update:asistio, update:reemplazo

---

## 🔄 FLUJO DE DATOS

```
Page: instalacion/index.vue
  ↓
Components:
  - DetallesCelebracionSection.vue ✅ (ya existe)
  - QuorumSection.vue ✅ (ya existe)
  - AsistenciaRepresentacionSection.vue 🆕 (crear)
    ├── AsistenciaTableRow.vue 🆕
    ├── RepresentanteModal.vue 🆕
    └── RepresentanteInfo.vue 🆕
  - MesaDirectivaSection.vue 🆕 (crear)
    └── PresidenteSecretarioCard.vue 🆕
  ↓
Stores:
  - useAsistenciaStore() ← app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/stores/
  - useMeetingDetailsStore() ← app/core/presentation/operaciones/junta-accionistas/pasos/detalles/stores/
  - useSnapshotStore() ← app/core/presentation/juntas/stores/
  ↓
Use Cases:
  - GetAsistenciaUseCase
  - UpdateAsistenciaUseCase
  - GetSnapshotUseCase
  ↓
Repositories:
  - AsistenciaHttpRepository / AsistenciaMswRepository
  ↓
Backend / MSW
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Preparación:
- [x] Analizar componentes reutilizables
- [x] Identificar qué ya existe
- [x] Planear qué crear

### Sección 1: Detalles ✅
- [x] DetallesCelebracionSection.vue (ya existe)
- [x] QuorumSection.vue (ya existe)

### Sección 2: Asistencia:
- [ ] AsistenciaRepresentacionSection.vue (wrapper)
- [ ] AsistenciaTableRow.vue (fila con checkbox)
- [ ] RepresentanteModal.vue (modal)
- [ ] RepresentanteInfo.vue (info representante)

### Sección 3: Mesa Directiva:
- [ ] MesaDirectivaSection.vue (wrapper)
- [ ] PresidenteSecretarioCard.vue (card reutilizable)

### Testing:
- [ ] Probar con MSW
- [ ] Probar con backend (cuando esté listo)

---

## 🎨 REFERENCIAS DE DISEÑO (de las imágenes)

### Tabla de Asistencia:
```
┌───┬────────────────────┬──────────┬──────────┬────────┬──────────────────┐
│ ☐ │ Nombre / Razón S. │   Tipo   │ Acciones │   %    │ Representado por │
├───┼────────────────────┼──────────┼──────────┼────────┼──────────────────┤
│ ☐ │ Ana María Gómez   │ NATURAL  │   100    │ 20.00% │ -                │
│   │                    │          │          │        │ [+ Agregar]      │
├───┼────────────────────┼──────────┼──────────┼────────┼──────────────────┤
│ ☑ │ Inversiones del   │ JURIDICA │   200    │ 40.00% │ Yull Timoteo     │
│   │ Sur S.A.C.         │          │          │        │ Zambrano [ℹ][⋮]  │
├───┼────────────────────┼──────────┼──────────┼────────┼──────────────────┤
│ ☑ │ Sucursal Arequipa │ SUCURSAL │    50    │ 10.00% │ José Matos       │
│   │                    │          │          │        │ Ricas [ℹ][⋮]     │
├───┼────────────────────┼──────────┼──────────┼────────┼──────────────────┤
│ ☐ │ Sucesión Indivisa │ SUCESION │    50    │ 10.00% │ Requiere         │
│   │ de María Torres   │ INDIVISA │          │        │ representante    │
│   │                    │          │          │        │ [+ Agregar]      │
├───┼────────────────────┼──────────┼──────────┼────────┼──────────────────┤
│ ☐ │ Fideicomiso       │ FIDEICOMI│   100    │ 20.00% │ Requiere         │
│   │ "Inversión..."    │ SOS      │          │        │ representante    │
│   │                    │          │          │        │ [+ Agregar]      │
└───┴────────────────────┴──────────┴──────────┴────────┴──────────────────┘
Total de acciones presentes: 500 | 100.00%
```

### Presidente y Secretario:
```
┌─────────────────────────────────┬─────────────────────────────────┐
│ Presidente de la Junta          │ Secretario de la Junta          │
├─────────────────────────────────┼─────────────────────────────────┤
│ Asistió: [SI]                   │ No Asistió: [NO]                │
│                                 │                                 │
│ [Cristian Robert Huamán García] │ [Seleccionar accionista...]     │
│ (desde directorio o input)      │ (dropdown de asistentes)        │
└─────────────────────────────────┴─────────────────────────────────┘
```

---

## 🎯 DECISIONES DE DISEÑO

### 1. **Checkbox en Junta Universal**
```typescript
// Si es UNIVERSAL: todos asisten automáticamente
const checkboxDisabled = computed(() => tipoJunta === TipoJunta.UNIVERSAL);
const checkboxChecked = computed(() => 
  tipoJunta === TipoJunta.UNIVERSAL ? true : asistente.asistio
);
```

### 2. **Representantes**
```typescript
// Tipos que SIEMPRE requieren representante:
const requiereRepresentante = [
  'SUCESION_INDIVISA',
  'FIDEICOMISOS',
  'FONDOS_INVERSION'
];

// Tipos que PUEDEN tener representante (opcional):
const puedeRepresentar = [
  'NATURAL',
  'JURIDICA',
  'SUCURSAL'
];
```

### 3. **Presidente/Secretario de Junta**
```typescript
// Prioridad de datos:
1. Si tiene directorio → Jalar presidenteId del directorio
2. Si asistió → Mostrar su nombre (readonly)
3. Si NO asistió → Select de asistentes presentes
4. Si NO tiene directorio → Input manual
```

---

## ⏱️ ESTIMACIÓN DE TIEMPO

| Tarea | Tiempo |
|-------|--------|
| AsistenciaRepresentacionSection | 1h |
| AsistenciaTableRow | 30min |
| RepresentanteModal | 45min |
| MesaDirectivaSection | 1h |
| PresidenteSecretarioCard | 45min |
| Testing + Ajustes | 1h |
| **TOTAL** | **~5 horas** |

---

## 🚀 ORDEN DE IMPLEMENTACIÓN

1. ✅ Verificar stores (ya están listos)
2. 🔄 Completar `AsistenciaRepresentacionSection.vue`
3. 🔄 Crear `RepresentanteModal.vue`
4. 🔄 Completar `MesaDirectivaSection.vue`
5. 🔄 Integrar todo en `instalacion/index.vue`
6. 🔄 Probar con MSW
7. 🔄 Probar con backend (cuando esté listo)

---

## 📚 Referencias

- **Componentes UI**: `app/components/ui/`
- **Table Reference**: `AsignationTable.vue`, `AccionistasList.vue`
- **Switch Reference**: `PresidenteDirectorioForm.vue`
- **Form Reference**: `PersonaNaturalForm.vue`

---

**Próximo paso**: Implementar cada componente en orden! 🚀

